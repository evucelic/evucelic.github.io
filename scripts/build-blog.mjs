import { readFile, writeFile, mkdir, readdir, copyFile, cp, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import { marked } from 'marked';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');
const CONTENT_DIR = path.join(ROOT_DIR, 'content', 'blog');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const STATIC_FILES = ['index.html', 'style.css', 'terminal.js'];

export function sortPostsByDateDesc(posts) {
  return [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));
}

export function formatDate(dateInput) {
  const date = new Date(dateInput);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' });
}

export function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

export async function readPosts(contentDir = CONTENT_DIR) {
  let entries;
  try {
    entries = await readdir(contentDir, { withFileTypes: true });
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }

  const posts = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const slug = entry.name;
    const postDir = path.join(contentDir, slug);

    let source;
    try {
      source = await readFile(path.join(postDir, 'index.md'), 'utf-8');
    } catch (err) {
      if (err.code === 'ENOENT') {
        console.warn(`Skipping "${slug}": no index.md found.`);
        continue;
      }
      throw err;
    }

    const { data, content } = matter(source);

    if (!data.title || !data.date) {
      throw new Error(`Post "${slug}" is missing required frontmatter (title, date).`);
    }

    const assetNames = (await readdir(postDir)).filter((name) => name !== 'index.md');

    posts.push({
      slug,
      title: data.title,
      date: data.date,
      tags: data.tags ?? [],
      html: marked.parse(content),
      dir: postDir,
      assetNames,
    });
  }

  return sortPostsByDateDesc(posts);
}

function renderTagsHtml(tags) {
  if (!tags.length) return '';
  return `<div class="flex flex-wrap gap-2 mt-2">${tags
    .map(
      (tag) =>
        `<span class="mono text-[11px] uppercase tracking-wide text-zinc-500 border border-zinc-300 rounded-sm px-2 py-0.5">${escapeHtml(tag)}</span>`
    )
    .join('')}</div>`;
}

function renderLayout({ title, bodyHtml }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title} · Eugen Vucelić</title>
  <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">

  <style>
    body { font-family: 'Inter', sans-serif; }
    .mono { font-family: 'JetBrains Mono', monospace; }
    .prose :is(h2, h3) { font-weight: 500; color: #18181b; margin-top: 2em; margin-bottom: 0.5em; }
    .prose p { margin-top: 1em; margin-bottom: 1em; line-height: 1.75; color: #27272a; }
    .prose a { color: #059669; text-decoration: underline; text-underline-offset: 2px; }
    .prose code { font-family: 'JetBrains Mono', monospace; font-size: 0.875em; background: #f4f4f5; padding: 0.15em 0.4em; border-radius: 2px; }
    .prose pre { font-family: 'JetBrains Mono', monospace; font-size: 0.875em; background: #18181b; color: #e4e4e7; padding: 1em; overflow-x: auto; border-radius: 4px; }
    .prose pre code { background: none; padding: 0; }
    .prose ul, .prose ol { margin: 1em 0; padding-left: 1.5em; }
    .prose li { margin: 0.4em 0; }
    .prose img { max-width: 100%; height: auto; border-radius: 2px; }
    .prose blockquote { border-left: 2px solid #d4d4d8; padding-left: 1em; color: #52525b; font-style: italic; }
  </style>
</head>
<body class="bg-zinc-50 text-zinc-900 antialiased p-4 md:p-8 md:py-12">

  <main class="max-w-3xl mx-auto border border-zinc-300 bg-white shadow-sm">
    <header class="border-b border-zinc-300 p-6 md:p-8 flex items-center justify-between gap-6">
      <a href="/" class="mono text-xs uppercase tracking-wider text-zinc-500 hover:text-emerald-600 transition-colors">&larr; portfolio</a>
      <span class="mono text-xs uppercase tracking-wider text-zinc-400">[BLOG]</span>
    </header>

    <div class="p-6 md:p-12">
      ${bodyHtml}
    </div>
  </main>

</body>
</html>`;
}

export function renderBlogIndexHtml(posts) {
  const listHtml = posts.length
    ? posts
        .map(
          (post) => `
      <div class="border-t border-zinc-200 py-6 first:border-t-0 first:pt-0">
        <div class="mono text-xs text-zinc-400 tracking-wider mb-1">${formatDate(post.date)}</div>
        <a href="/blog/${post.slug}/" class="text-lg font-medium text-zinc-900 hover:text-emerald-600 transition-colors">${escapeHtml(post.title)}</a>
        ${renderTagsHtml(post.tags)}
      </div>`
        )
        .join('')
    : `<p class="text-zinc-500 italic">No posts yet.</p>`;

  return renderLayout({
    title: 'Blog',
    bodyHtml: `
      <div class="mono text-xs text-zinc-400 tracking-wider mb-8">[BLOG]</div>
      ${listHtml}
    `,
  });
}

export function renderPostHtml(post) {
  return renderLayout({
    title: escapeHtml(post.title),
    bodyHtml: `
      <a href="/blog/" class="mono text-xs uppercase tracking-wider text-zinc-400 hover:text-emerald-600 transition-colors">&larr; Blog</a>
      <h1 class="text-2xl md:text-3xl font-medium tracking-tight mt-4">${escapeHtml(post.title)}</h1>
      <div class="mono text-xs text-zinc-400 tracking-wider mt-3">${formatDate(post.date)}</div>
      ${renderTagsHtml(post.tags)}
      <div class="prose mt-8">${post.html}</div>
    `,
  });
}

async function copyStaticFiles() {
  for (const file of STATIC_FILES) {
    await copyFile(path.join(ROOT_DIR, file), path.join(DIST_DIR, file));
  }
}

async function copyPostAssets(post) {
  const outDir = path.join(DIST_DIR, 'blog', post.slug);
  for (const name of post.assetNames) {
    await cp(path.join(post.dir, name), path.join(outDir, name), { recursive: true });
  }
}

export async function build() {
  await rm(DIST_DIR, { recursive: true, force: true });
  await mkdir(DIST_DIR, { recursive: true });
  await copyStaticFiles();

  const posts = await readPosts();

  await mkdir(path.join(DIST_DIR, 'blog'), { recursive: true });
  await writeFile(path.join(DIST_DIR, 'blog', 'index.html'), renderBlogIndexHtml(posts));

  for (const post of posts) {
    const postDir = path.join(DIST_DIR, 'blog', post.slug);
    await mkdir(postDir, { recursive: true });
    await writeFile(path.join(postDir, 'index.html'), renderPostHtml(post));
    await copyPostAssets(post);
  }

  return posts;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  build()
    .then((posts) => {
      console.log(`Built ${posts.length} post(s) into dist/.`);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
