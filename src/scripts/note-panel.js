// Note Stack: wiki links open in a stacked-cards panel.
// Desktop — horizontal strips on the left, active note fills right.
// Mobile  — horizontal strip bars above, active note fills bottom sheet.
// No framework dependencies — plain JS module loaded via BaseLayout.

// ─── State ────────────────────────────────────────────────────────────────────

/** @type {{ slug: string; scrollTop: number; title: string; cardEl: HTMLElement }[]} */
const stack = []; // oldest → newest

let isOpen = false;
/** @type {HTMLElement | null} */
let lastFocused = null;

/** @type {Map<string, string>} slug → article innerHTML */
const cache = new Map();

let stackEl, backdropEl;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getCardWidth() {
  // Give more space on wider screens; min 320px, max 600px
  return Math.min(600, Math.max(320, window.innerWidth * 0.45));
}

function slugFromHref(href) {
  try {
    const url = new URL(href, window.location.origin);
    return url.pathname.replace(/^\/|\/$/g, "");
  } catch {
    return href.replace(/^\/|\/$/g, "");
  }
}

function skeletonHTML() {
  return `<div class="panel-skeleton" aria-busy="true" aria-label="Loading…">
    <div class="sk-line sk-title"></div>
    <div class="sk-line sk-short"></div>
    <div class="sk-line"></div>
    <div class="sk-line"></div>
    <div class="sk-line sk-short"></div>
    <div class="sk-line"></div>
  </div>`;
}

// ─── DOM creation ─────────────────────────────────────────────────────────────

function createStackDOM() {
  backdropEl = document.createElement("div");
  backdropEl.id = "note-stack-backdrop";
  backdropEl.setAttribute("aria-hidden", "true");

  stackEl = document.createElement("div");
  stackEl.id = "note-stack";
  stackEl.setAttribute("role", "complementary");
  stackEl.setAttribute("aria-label", "Note preview stack");

  // Mobile drag handle (CSS hides it on desktop)
  const handle = document.createElement("div");
  handle.id = "note-stack-handle";
  handle.setAttribute("aria-hidden", "true");
  stackEl.appendChild(handle);

  document.body.append(backdropEl, stackEl);
  setupSwipe(handle);
}

function createCardEl(slug, title) {
  const card = document.createElement("div");
  card.className = "stack-card";
  card.setAttribute("data-slug", slug);

  // Strip button — visible when the card is compressed
  const stripBtn = document.createElement("button");
  stripBtn.className = "strip-btn";
  stripBtn.setAttribute("aria-label", `Go back to ${title}`);
  stripBtn.textContent = title;

  // Card body — the full note view
  const body = document.createElement("div");
  body.className = "card-body";

  const header = document.createElement("div");
  header.className = "card-header";

  const titleEl = document.createElement("span");
  titleEl.className = "card-title";
  titleEl.textContent = title;

  const actions = document.createElement("div");
  actions.className = "card-header-actions";

  const openLink = document.createElement("a");
  openLink.className = "card-open";
  openLink.href = `/${slug}/`;
  openLink.setAttribute("target", "_blank");
  openLink.setAttribute("rel", "noopener");
  openLink.setAttribute("aria-label", "Open note in full page");
  openLink.textContent = "↗";

  const closeBtn = document.createElement("button");
  closeBtn.className = "card-close-all";
  closeBtn.setAttribute("aria-label", "Close all");
  closeBtn.textContent = "✕";

  actions.append(openLink, closeBtn);
  header.append(titleEl, actions);

  const content = document.createElement("div");
  content.className = "card-content";
  content.setAttribute("tabindex", "-1");

  body.append(header, content);
  card.append(stripBtn, body);
  return card;
}

// ─── Stack open / close ───────────────────────────────────────────────────────

function openStack() {
  if (isOpen) return;
  isOpen = true;
  stackEl.classList.add("is-open");
  backdropEl.classList.add("is-open");
  document.body.style.overflow = "hidden";
}

function closeStack() {
  if (!isOpen) return;
  stackEl.classList.remove("is-open");
  backdropEl.classList.remove("is-open");
  document.body.style.overflow = "";

  let done = false;
  const cleanup = () => {
    if (done) return;
    done = true;
    stack.forEach((e) => e.cardEl.remove());
    stack.length = 0;
    isOpen = false;
    if (lastFocused && document.contains(lastFocused)) {
      lastFocused.focus();
    }
    lastFocused = null;
  };
  stackEl.addEventListener("transitionend", cleanup, { once: true });
  setTimeout(cleanup, 350); // fallback if transitionend doesn't fire
}

// ─── Card activation / deactivation ──────────────────────────────────────────

function activateCard(index) {
  const { cardEl } = stack[index];
  cardEl.classList.remove("is-strip");
  cardEl.classList.add("is-active");
  // Only set inline width on desktop (mobile uses flex in CSS)
  if (window.innerWidth >= 640) {
    cardEl.querySelector(".card-body").style.width = getCardWidth() + "px";
  }
}

function deactivateCard(index) {
  const entry = stack[index];
  const contentEl = entry.cardEl.querySelector(".card-content");
  if (contentEl) entry.scrollTop = contentEl.scrollTop;
  entry.cardEl.classList.remove("is-active");
  entry.cardEl.classList.add("is-strip");
  if (window.innerWidth >= 640) {
    // Clear inline width so CSS (.card-body { width: 0 }) takes over
    entry.cardEl.querySelector(".card-body").style.width = "";
  }
}

// ─── Note loading ─────────────────────────────────────────────────────────────

async function loadNoteIntoCard(cardEl, slug, scrollTop = 0) {
  const contentEl = cardEl.querySelector(".card-content");
  const titleEl = cardEl.querySelector(".card-title");
  const stripBtn = cardEl.querySelector(".strip-btn");
  const openLink = cardEl.querySelector(".card-open");
  if (openLink) openLink.href = `/${slug}/`;

  // Fast path from cache
  if (cache.has(slug)) {
    contentEl.innerHTML = cache.get(slug);
    contentEl.scrollTop = scrollTop;
    contentEl.focus({ preventScroll: true });
    // Title may have been resolved on a previous load — sync it
    const entry = stack.find((e) => e.cardEl === cardEl);
    if (entry && entry.title && entry.title !== slug) {
      if (titleEl) titleEl.textContent = entry.title;
      if (stripBtn) {
        stripBtn.textContent = entry.title;
        stripBtn.setAttribute("aria-label", `Go back to ${entry.title}`);
      }
    }
    return;
  }

  contentEl.innerHTML = skeletonHTML();

  try {
    const res = await fetch(`/${slug}/`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, "text/html");
    const article = doc.querySelector("article.prose");
    if (!article) throw new Error("article.prose not found");

    // Extract title from h1 in the fetched page
    const h1 = article.querySelector("h1");
    const title = h1 ? h1.textContent.trim() : slug.split("/").pop() || slug;

    // Update the stack entry and all labels
    const entry = stack.find((e) => e.cardEl === cardEl);
    if (entry) entry.title = title;
    if (titleEl) titleEl.textContent = title;
    if (stripBtn) {
      stripBtn.textContent = title;
      stripBtn.setAttribute("aria-label", `Go back to ${title}`);
    }

    const innerHTML = article.innerHTML;
    cache.set(slug, innerHTML);

    // Only inject if card is still in the stack (user may have closed it)
    if (stack.some((e) => e.cardEl === cardEl)) {
      contentEl.innerHTML = innerHTML;
      contentEl.scrollTop = scrollTop;
      contentEl.focus({ preventScroll: true });
    }
  } catch {
    contentEl.innerHTML =
      `<p style="padding:1rem;color:#6b7280">Failed to load note. ` +
      `<a href="/${slug}/" style="color:#2563eb">Open directly →</a></p>`;
  }
}

// ─── Push / pop ───────────────────────────────────────────────────────────────

function pushNote(slug) {
  // Compress the currently active card into a strip
  if (stack.length > 0) {
    deactivateCard(stack.length - 1);
  }

  const title = slug.split("/").pop() || slug;
  const cardEl = createCardEl(slug, title);
  cardEl.classList.add("is-active");

  if (window.innerWidth >= 640) {
    cardEl.querySelector(".card-body").style.width = getCardWidth() + "px";
  }

  stackEl.appendChild(cardEl);
  stack.push({ slug, scrollTop: 0, title, cardEl });

  loadNoteIntoCard(cardEl, slug, 0);
  if (!isOpen) openStack();
}

function popToIndex(index) {
  if (index < 0 || index >= stack.length - 1) return;

  // Save scroll of current active before removing it
  const activeEntry = stack[stack.length - 1];
  const activeContent = activeEntry.cardEl.querySelector(".card-content");
  if (activeContent) activeEntry.scrollTop = activeContent.scrollTop;

  // Animate out and remove all cards after index
  const toRemove = stack.splice(index + 1);
  toRemove.forEach(({ cardEl }) => {
    let done = false;
    const cleanup = () => {
      if (done) return;
      done = true;
      cardEl.remove();
    };
    cardEl.classList.add("is-removing");
    setTimeout(cleanup, 260); // slightly past transition duration
  });

  // Expand the target card to active
  activateCard(index);

  const target = stack[index];
  const targetContent = target.cardEl.querySelector(".card-content");
  if (targetContent) {
    requestAnimationFrame(() => {
      targetContent.scrollTop = target.scrollTop;
      targetContent.focus({ preventScroll: true });
    });
  }
}

// ─── Mobile swipe-to-dismiss ──────────────────────────────────────────────────

function setupSwipe(handle) {
  let startY = 0, startTime = 0, dragging = false;

  handle.addEventListener("touchstart", (e) => {
    if (window.innerWidth >= 640) return;
    startY = e.touches[0].clientY;
    startTime = Date.now();
    dragging = true;
    stackEl.style.transition = "none";
  });

  handle.addEventListener("touchmove", (e) => {
    if (!dragging) return;
    const delta = Math.max(0, e.touches[0].clientY - startY);
    stackEl.style.transform = `translateY(${delta}px)`;
  });

  handle.addEventListener("touchend", (e) => {
    if (!dragging) return;
    dragging = false;
    stackEl.style.transition = "";
    stackEl.style.transform = "";
    const delta = Math.max(0, e.changedTouches[0].clientY - startY);
    const velocity = delta / Math.max(1, Date.now() - startTime);
    if (delta > 80 || velocity > 0.4) {
      closeStack();
    }
  });
}

// ─── Focus trap ───────────────────────────────────────────────────────────────

function trapFocus(e) {
  if (!isOpen || e.key !== "Tab") return;
  const focusable = Array.from(
    stackEl.querySelectorAll(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
  );
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}

// ─── Init ─────────────────────────────────────────────────────────────────────

function init() {
  createStackDOM();

  document.addEventListener("click", (e) => {
    // Wiki link → push new note onto stack
    const internalLink = e.target.closest("a.internal");
    if (internalLink) {
      e.preventDefault();
      lastFocused = internalLink;
      pushNote(slugFromHref(internalLink.href));
      return;
    }

    // Strip button → pop stack back to that note
    const stripBtn = e.target.closest(".strip-btn");
    if (stripBtn) {
      const cardEl = stripBtn.closest(".stack-card");
      const index = stack.findIndex((entry) => entry.cardEl === cardEl);
      if (index >= 0 && index < stack.length - 1) {
        popToIndex(index);
      }
      return;
    }

    // Close button → close the entire stack
    if (e.target.closest(".card-close-all")) {
      closeStack();
      return;
    }
  });

  backdropEl.addEventListener("click", closeStack);

  document.addEventListener("keydown", (e) => {
    if (!isOpen) return;
    if (e.key === "Escape") {
      closeStack();
    } else {
      trapFocus(e);
    }
  });
}

// Astro module scripts are deferred — DOMContentLoaded may have already fired.
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
