// Note Panel: intercepts .internal wiki link clicks and shows content in a
// sliding panel (right drawer on desktop, bottom sheet on mobile).
// No framework dependencies — plain JS module loaded via BaseLayout.

// ─── State ───────────────────────────────────────────────────────────────────

/** @type {{ slug: string; scrollTop: number }[]} */
const history = [];
let cursor = -1;
let isOpen = false;
let isFetching = false;
/** @type {HTMLElement | null} */
let lastFocused = null;

/** @type {Map<string, string>} slug → article innerHTML */
const cache = new Map();

// ─── DOM refs (set in init) ───────────────────────────────────────────────────

let backdrop, panel, header, backBtn, fwdBtn, openLink, closeBtn, content;

// ─── DOM Creation ─────────────────────────────────────────────────────────────

function createPanelDOM() {
  backdrop = document.createElement("div");
  backdrop.id = "note-panel-backdrop";
  backdrop.setAttribute("aria-hidden", "true");

  panel = document.createElement("aside");
  panel.id = "note-panel";
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-modal", "true");
  panel.setAttribute("aria-label", "Note preview");
  panel.setAttribute("aria-hidden", "true");

  header = document.createElement("div");
  header.id = "note-panel-header";

  const nav = document.createElement("div");
  nav.id = "note-panel-nav";

  backBtn = document.createElement("button");
  backBtn.id = "panel-back";
  backBtn.setAttribute("aria-label", "Go back");
  backBtn.disabled = true;
  backBtn.textContent = "←";

  fwdBtn = document.createElement("button");
  fwdBtn.id = "panel-forward";
  fwdBtn.setAttribute("aria-label", "Go forward");
  fwdBtn.disabled = true;
  fwdBtn.textContent = "→";

  nav.append(backBtn, fwdBtn);

  const actions = document.createElement("div");
  actions.id = "note-panel-actions";

  openLink = document.createElement("a");
  openLink.id = "panel-open-link";
  openLink.setAttribute("target", "_blank");
  openLink.setAttribute("rel", "noopener");
  openLink.setAttribute("aria-label", "Open note in full page");
  openLink.textContent = "↗";

  closeBtn = document.createElement("button");
  closeBtn.id = "panel-close";
  closeBtn.setAttribute("aria-label", "Close panel");
  closeBtn.textContent = "✕";

  actions.append(openLink, closeBtn);
  header.append(nav, actions);

  // Drag handle for mobile swipe-to-dismiss
  const handle = document.createElement("div");
  handle.id = "note-panel-handle";
  handle.setAttribute("aria-hidden", "true");

  content = document.createElement("div");
  content.id = "note-panel-content";
  content.setAttribute("tabindex", "-1");

  panel.append(handle, header, content);
  document.body.append(backdrop, panel);
}

// ─── Panel open / close ───────────────────────────────────────────────────────

function openPanel(slug) {
  // If the panel is already open navigating to a new note from within it,
  // truncate any forward history before pushing.
  if (cursor < history.length - 1) {
    history.splice(cursor + 1);
  }

  // Save scroll position of current entry before navigating away.
  if (cursor >= 0 && history[cursor]) {
    history[cursor].scrollTop = content.scrollTop;
  }

  history.push({ slug, scrollTop: 0 });
  cursor = history.length - 1;

  if (!isOpen) {
    isOpen = true;
    panel.setAttribute("aria-hidden", "false");
    panel.classList.add("is-open");
    backdrop.classList.add("is-open");
    document.body.style.overflow = "hidden";
    panel.style.willChange = "transform";
    panel.addEventListener(
      "transitionend",
      () => {
        panel.style.willChange = "";
        if (!isOpen) content.scrollTop = 0;
      },
      { once: true }
    );
  }

  loadNote(slug, 0);
}

function closePanel() {
  if (!isOpen) return;
  isOpen = false;
  panel.setAttribute("aria-hidden", "true");
  panel.classList.remove("is-open");
  backdrop.classList.remove("is-open");
  document.body.style.overflow = "";

  // Restore focus to the element that triggered the panel.
  if (lastFocused && document.contains(lastFocused)) {
    lastFocused.focus();
  }
  lastFocused = null;
}

// ─── Note loading ─────────────────────────────────────────────────────────────

async function loadNote(slug, scrollTop = 0) {
  updateNavButtons();
  openLink.href = `/${slug}/`;

  if (cache.has(slug)) {
    content.innerHTML = cache.get(slug);
    content.scrollTop = scrollTop;
    content.focus({ preventScroll: true });
    return;
  }

  if (isFetching) return;
  isFetching = true;
  content.innerHTML = skeletonHTML();

  try {
    const res = await fetch(`/${slug}/`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, "text/html");
    const article = doc.querySelector("article.prose");
    if (!article) throw new Error("article not found");
    const innerHTML = article.innerHTML;
    cache.set(slug, innerHTML);

    // Only apply if this slug is still the current one.
    if (history[cursor]?.slug === slug) {
      content.innerHTML = innerHTML;
      content.scrollTop = scrollTop;
      content.focus({ preventScroll: true });
    }
  } catch {
    content.innerHTML =
      `<p style="padding:1rem;color:#6b7280">Failed to load note. ` +
      `<a href="/${slug}/" style="color:#2563eb">Open directly →</a></p>`;
  } finally {
    isFetching = false;
  }
}

// ─── History navigation ───────────────────────────────────────────────────────

function navigateBack() {
  if (cursor <= 0) return;
  history[cursor].scrollTop = content.scrollTop;
  cursor--;
  const { slug, scrollTop } = history[cursor];
  openLink.href = `/${slug}/`;
  loadNote(slug, scrollTop);
}

function navigateForward() {
  if (cursor >= history.length - 1) return;
  history[cursor].scrollTop = content.scrollTop;
  cursor++;
  const { slug, scrollTop } = history[cursor];
  openLink.href = `/${slug}/`;
  loadNote(slug, scrollTop);
}

function updateNavButtons() {
  backBtn.disabled = cursor <= 0;
  fwdBtn.disabled = cursor >= history.length - 1;
}

// ─── Focus trap ───────────────────────────────────────────────────────────────

function trapFocus(e) {
  if (!isOpen || e.key !== "Tab") return;
  const focusable = Array.from(
    panel.querySelectorAll(
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

// ─── Mobile swipe-to-dismiss ──────────────────────────────────────────────────

function setupSwipe() {
  let startY = 0;
  let startTime = 0;
  let dragging = false;

  header.addEventListener("touchstart", (e) => {
    startY = e.touches[0].clientY;
    startTime = Date.now();
    dragging = true;
    panel.style.transition = "none";
  });

  header.addEventListener("touchmove", (e) => {
    if (!dragging) return;
    const delta = Math.max(0, e.touches[0].clientY - startY);
    // On mobile the panel translates Y, on desktop X — check orientation.
    const isMobile = window.innerWidth < 640;
    if (isMobile) {
      panel.style.transform = `translateY(${delta}px)`;
    }
  });

  header.addEventListener("touchend", (e) => {
    if (!dragging) return;
    dragging = false;
    panel.style.transition = "";
    const delta = Math.max(0, e.changedTouches[0].clientY - startY);
    const velocity = delta / Math.max(1, Date.now() - startTime);
    const isMobile = window.innerWidth < 640;
    if (isMobile && (delta > 80 || velocity > 0.4)) {
      closePanel();
    } else {
      // Snap back.
      panel.style.transform = "";
    }
  });
}

// ─── Skeleton loading state ───────────────────────────────────────────────────

function skeletonHTML() {
  return `
    <div class="panel-skeleton" aria-busy="true" aria-label="Loading note…">
      <div class="sk-line sk-title"></div>
      <div class="sk-line sk-short"></div>
      <div class="sk-line"></div>
      <div class="sk-line"></div>
      <div class="sk-line sk-short"></div>
      <div class="sk-line"></div>
      <div class="sk-line"></div>
    </div>`;
}

// ─── Slug extraction from href ────────────────────────────────────────────────

function slugFromHref(href) {
  // href is an absolute URL string like "http://localhost:4321/notes/some-slug/"
  // or a relative path like "/notes/some-slug/"
  try {
    const url = new URL(href, window.location.origin);
    // Strip leading slash and trailing slash.
    return url.pathname.replace(/^\/|\/$/g, "");
  } catch {
    return href.replace(/^\/|\/$/g, "");
  }
}

// ─── Init ─────────────────────────────────────────────────────────────────────

function init() {
  createPanelDOM();
  setupSwipe();

  // Intercept all .internal link clicks via delegation.
  document.addEventListener("click", (e) => {
    const link = e.target.closest("a.internal");
    if (!link) return;
    e.preventDefault();
    lastFocused = link;
    const slug = slugFromHref(link.href);
    openPanel(slug);
  });

  closeBtn.addEventListener("click", closePanel);
  backdrop.addEventListener("click", closePanel);
  backBtn.addEventListener("click", navigateBack);
  fwdBtn.addEventListener("click", navigateForward);

  document.addEventListener("keydown", (e) => {
    if (!isOpen) return;
    if (e.key === "Escape") {
      closePanel();
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
