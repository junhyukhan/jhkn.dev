import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { getNoteTitle } from "../utils/note";
import { buildBacklinksWithContextMap } from "../utils/backlinks";

export const GET: APIRoute = async () => {
	const allNotes = await getCollection("notes");
	const backlinksMap = buildBacklinksWithContextMap(allNotes);
	const backlinkCountById = new Map<string, number>(
		allNotes.map((note) => [note.id, backlinksMap.get(note.id)?.length ?? 0])
	);

	const entries = allNotes.map((note) => ({
		slug: note.slug,
		title: getNoteTitle(note),
		date: note.data.created.toISOString().slice(0, 10),
		tags: note.data.tags ?? [],
		backlinks: backlinkCountById.get(note.id) ?? 0,
	}));

	return new Response(JSON.stringify(entries), {
		headers: {
			"Content-Type": "application/json",
			"Cache-Control": "public, max-age=3600",
		},
	});
};
