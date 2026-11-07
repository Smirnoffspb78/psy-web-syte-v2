
const fs = require('node:fs');
const path = require('node:path');

const siteUrl = process.env.SITE_URL
    || (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : 'https://postnikovalyudmila.tuqo.app');

const url = new URL(siteUrl);

if (url.protocol !== 'https:') {
    throw new Error('SITE_URL must use HTTPS');
}

const canonicalUrl = url.origin + '/';

// 1. Копируем исходники сайта
fs.rmSync('dist', { recursive: true, force: true });
fs.cpSync('public', 'dist', { recursive: true });

// 2. Обновляем canonical в index.html
const indexPath = path.join('dist', 'index.html');

let html = fs.readFileSync(indexPath, 'utf8');

const canonicalTag =
    `<link rel="canonical" href="${canonicalUrl}">`;

if (/<link\b[^>]*rel=["']canonical["'][^>]*>/i.test(html)) {
    html = html.replace(
        /<link\b[^>]*rel=["']canonical["'][^>]*>/gi,
        canonicalTag
    );
} else {
    html = html.replace(
        /<\/head>/i,
        `    ${canonicalTag}\n</head>`
    );
}

fs.writeFileSync(indexPath, html, 'utf8');

// 3. Генерируем robots.txt
const robots = `User-agent: *
Allow: /
Sitemap: ${canonicalUrl}sitemap.xml
`;

fs.writeFileSync(
    path.join('dist', 'robots.txt'),
    robots,
    'utf8'
);

// 4. Генерируем sitemap.xml
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>${canonicalUrl}</loc>
    </url>
</urlset>
`;

fs.writeFileSync(
    path.join('dist', 'sitemap.xml'),
    sitemap,
    'utf8'
);

console.log(`Build completed for ${canonicalUrl}`);
