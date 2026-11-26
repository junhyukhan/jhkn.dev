import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { getNoteSummary, getNoteTitle } from '../utils/note';

// Writing only: quotes/ and leetcode/ stay out of the feed. Summaries, not full text.
export async function GET(context) {
  const notes = (await getCollection('notes', (note) => note.id.startsWith('general/')))
    .sort((a, b) => b.data.created.valueOf() - a.data.created.valueOf());
  return rss({
    title: 'JHKN.DEV',
    description: 'Where I document what I learn and build.',
    site: context.site,
    items: notes.map((note) => ({
      title: getNoteTitle(note),
      link: `/notes/${note.slug}/`,
      pubDate: note.data.created,
      description: getNoteSummary(note.body ?? ''),
      categories: note.data.tags,
    })),
    customData: '<language>en-us</language>',
  });
}
