import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import {
  sortPostsByDateDesc,
  formatDate,
  escapeHtml,
  renderBlogIndexHtml,
  renderPostHtml,
  readPosts,
} from './build-blog.mjs';

test('sortPostsByDateDesc orders newest first', () => {
  const posts = [
    { slug: 'a', date: '2026-01-01' },
    { slug: 'b', date: '2026-06-15' },
    { slug: 'c', date: '2025-12-31' },
  ];

  const sorted = sortPostsByDateDesc(posts).map((p) => p.slug);

  assert.deepEqual(sorted, ['b', 'a', 'c']);
});

test('sortPostsByDateDesc does not mutate the input array', () => {
  const posts = [{ slug: 'a', date: '2026-01-01' }, { slug: 'b', date: '2026-06-15' }];
  const original = [...posts];

  sortPostsByDateDesc(posts);

  assert.deepEqual(posts, original);
});

test('formatDate renders a short human-readable date', () => {
  assert.equal(formatDate('2026-08-23'), 'Aug 23, 2026');
});

test('renderBlogIndexHtml lists posts with title, date and tags', () => {
  const html = renderBlogIndexHtml([
    { slug: 'hello', title: 'Hello', date: '2026-08-23', tags: ['meta'] },
  ]);

  assert.match(html, /Hello/);
  assert.match(html, /Aug 23, 2026/);
  assert.match(html, /meta/);
  assert.match(html, /href="\/blog\/hello\/"/);
});

test('renderBlogIndexHtml handles an empty post list', () => {
  const html = renderBlogIndexHtml([]);

  assert.match(html, /No posts yet/);
});

test('renderPostHtml renders the post body and metadata', () => {
  const html = renderPostHtml({
    slug: 'hello',
    title: 'Hello',
    date: '2026-08-23',
    tags: [],
    html: '<p>Body</p>',
  });

  assert.match(html, /Hello/);
  assert.match(html, /<p>Body<\/p>/);
});

test('escapeHtml escapes special characters', () => {
  assert.equal(escapeHtml('<script>&"</script>'), '&lt;script&gt;&amp;&quot;&lt;/script&gt;');
});

test('renderPostHtml escapes the post title so it cannot break the page markup', () => {
  const html = renderPostHtml({
    slug: 'hello',
    title: '<img src=x onerror=alert(1)>',
    date: '2026-08-23',
    tags: [],
    html: '<p>Body</p>',
  });

  assert.doesNotMatch(html, /<img src=x onerror=alert\(1\)>/);
  assert.match(html, /&lt;img src=x onerror=alert\(1\)&gt;/);
});

test('readPosts skips a directory that has no index.md instead of crashing', async () => {
  const dir = await mkdtemp(path.join(tmpdir(), 'blog-content-'));
  try {
    await mkdir(path.join(dir, 'valid-post'));
    await writeFile(
      path.join(dir, 'valid-post', 'index.md'),
      '---\ntitle: Valid\ndate: 2026-01-01\n---\nBody'
    );
    await mkdir(path.join(dir, 'stray-folder'));

    const posts = await readPosts(dir);

    assert.deepEqual(posts.map((p) => p.slug), ['valid-post']);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
