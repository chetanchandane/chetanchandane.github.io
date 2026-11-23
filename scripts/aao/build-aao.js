#!/usr/bin/env node
/**
 * Post-build AAO step. Runs after `react-scripts build`.
 *
 * CRA ships an empty <div id="root"></div>, so crawlers and agents that do not
 * run JavaScript see nothing. This script makes the built site readable to them:
 *
 *   build/index.html  -> real title/description, canonical, OG/Twitter,
 *                        JSON-LD, and static semantic HTML inside #root
 *                        (React replaces it on mount, humans never notice)
 *   build/llms.txt    -> curated map of the site for LLMs (llmstxt.org format)
 *   build/llms-full.txt -> full public knowledge base in Markdown
 *   build/sitemap.xml
 *   build/agent.json  -> structured facts, read by the WebMCP tools
 *
 * Sources of truth: aao/facts.js (structured) and knowledgeBase.js (prose).
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const BUILD = path.join(ROOT, 'build');
const { SITE_URL, person, projects } = require(path.join(ROOT, 'aao', 'facts.js'));
const { KNOWLEDGE_BASE } = require(path.join(ROOT, 'knowledgeBase.js'));

// Sections of knowledgeBase.js kept out of the public llms-full.txt.
// The Excellus STAR write-up names internal services and flags from an
// employer codebase; fine for the chatbot to summarize, not to publish verbatim.
const PRIVATE_KB_SECTIONS = ['Excellus BCBS: Technical Impact Summary (STAR)'];

const TODAY = new Date().toISOString().slice(0, 10);

const esc = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const TITLE = `${person.name} | AI Engineer, RAG and Agentic Systems`;
const DESCRIPTION =
  `${person.name} is an AI engineer (MS CS, RIT) who builds production RAG pipelines, ` +
  'multi-agent LLM systems, and event-driven backends on AWS and Azure. Projects, experience, and contact.';

// ---------- JSON-LD ----------
function jsonLd() {
  const personNode = {
    '@type': 'Person',
    '@id': `${SITE_URL}/#person`,
    name: person.name,
    jobTitle: person.jobTitle,
    description: person.summary,
    url: SITE_URL,
    image: person.image,
    email: `mailto:${person.email}`,
    address: { '@type': 'PostalAddress', addressLocality: 'Rochester', addressRegion: 'NY', addressCountry: 'US' },
    alumniOf: person.education.map((e) => ({ '@type': 'CollegeOrUniversity', name: e.name })),
    hasCredential: person.certifications.map((c) => ({
      '@type': 'EducationalOccupationalCredential',
      name: c,
      credentialCategory: 'certification',
    })),
    knowsAbout: person.knowsAbout,
    sameAs: person.sameAs,
  };
  return {
    '@context': 'https://schema.org',
    '@graph': [
      personNode,
      {
        '@type': 'ProfilePage',
        '@id': `${SITE_URL}/#profile`,
        url: SITE_URL,
        name: TITLE,
        description: DESCRIPTION,
        dateModified: TODAY,
        mainEntity: { '@id': `${SITE_URL}/#person` },
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: person.name,
        publisher: { '@id': `${SITE_URL}/#person` },
      },
      {
        '@type': 'ItemList',
        '@id': `${SITE_URL}/#projects`,
        name: `Projects by ${person.name}`,
        itemListElement: projects.map((p, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          item: {
            '@type': p.url.includes('github.com') ? 'SoftwareSourceCode' : 'CreativeWork',
            name: p.name,
            url: p.url,
            description: p.description,
            keywords: p.tech.join(', '),
            ...(p.status ? { creativeWorkStatus: p.status } : {}),
            author: { '@id': `${SITE_URL}/#person` },
          },
        })),
      },
    ],
  };
}

// ---------- head tags ----------
function headTags() {
  return [
    `<title>${esc(TITLE)}</title>`,
    `<meta name="description" content="${esc(DESCRIPTION)}" />`,
    `<meta name="author" content="${esc(person.name)}" />`,
    `<link rel="canonical" href="${SITE_URL}/" />`,
    `<link rel="alternate" type="text/plain" title="LLM-readable summary" href="/llms.txt" />`,
    `<meta property="og:type" content="profile" />`,
    `<meta property="og:url" content="${SITE_URL}/" />`,
    `<meta property="og:title" content="${esc(TITLE)}" />`,
    `<meta property="og:description" content="${esc(DESCRIPTION)}" />`,
    `<meta property="og:image" content="${person.image}" />`,
    `<meta property="profile:first_name" content="Chetan" />`,
    `<meta property="profile:last_name" content="Chandane" />`,
    `<meta name="twitter:card" content="summary" />`,
    `<meta name="twitter:site" content="@ChetanCh1080" />`,
    `<meta name="twitter:title" content="${esc(TITLE)}" />`,
    `<meta name="twitter:description" content="${esc(DESCRIPTION)}" />`,
    `<meta name="twitter:image" content="${person.image}" />`,
    `<script type="application/ld+json">${JSON.stringify(jsonLd()).replace(/</g, '\\u003c')}</script>`,
  ].join('\n    ');
}

// ---------- static body (read by non-JS agents, replaced by React) ----------
function staticBody() {
  const link = (href, text) => `<a href="${esc(href)}">${esc(text)}</a>`;
  return `
      <main class="aao-static" aria-label="Portfolio of ${esc(person.name)}">
        <header>
          <h1>${esc(person.name)}</h1>
          <p><strong>${esc(person.headline)}</strong></p>
          <p>${esc(person.summary)}</p>
          <p>Based in ${esc(person.location)}. ${esc(person.openTo)}</p>
          <p>
            ${link(`mailto:${person.email}`, person.email)} ·
            ${link(person.resumeUrl, 'Resume')} ·
            ${person.sameAs.map((u) => link(u, new URL(u).hostname.replace('www.', ''))).join(' · ')}
          </p>
        </header>
        <section aria-labelledby="aao-exp">
          <h2 id="aao-exp">Experience</h2>
          <ul>
            ${person.experience
              .map((e) => `<li><strong>${esc(e.role)}</strong>, ${esc(e.org)} (${esc(e.dates)}). ${esc(e.stack)}.</li>`)
              .join('\n            ')}
          </ul>
        </section>
        <section aria-labelledby="aao-proj">
          <h2 id="aao-proj">Projects</h2>
          <ul>
            ${projects
              .map(
                (p) =>
                  `<li><h3>${link(p.url, p.name)}</h3><p>${esc(p.description)}</p><p>Tech: ${esc(p.tech.join(', '))}</p></li>`
              )
              .join('\n            ')}
          </ul>
        </section>
        <section aria-labelledby="aao-edu">
          <h2 id="aao-edu">Education and certifications</h2>
          <ul>
            ${person.education.map((e) => `<li>${esc(e.degree)}, ${esc(e.name)} (${esc(e.dates)})</li>`).join('\n            ')}
            ${person.certifications.map((c) => `<li>${esc(c)}</li>`).join('\n            ')}
          </ul>
        </section>
        <section aria-labelledby="aao-skills">
          <h2 id="aao-skills">Skills</h2>
          <p>${esc(person.knowsAbout.join(', '))}</p>
        </section>
        <p>Machine-readable summary: ${link('/llms.txt', 'llms.txt')} · ${link('/llms-full.txt', 'llms-full.txt')}</p>
      </main>
    `;
}

// Minimal styling so the pre-hydration flash matches the dark Aurum theme.
const STATIC_CSS = `<style>.aao-static{max-width:760px;margin:0 auto;padding:48px 24px;color:#e9e6df;background:#0b0d10;font:16px/1.6 Inter,system-ui,sans-serif}.aao-static a{color:#e8b15a}.aao-static h1,.aao-static h2,.aao-static h3{font-family:Fraunces,Georgia,serif}.aao-static ul{padding-left:1.1em}</style>`;

// ---------- llms.txt ----------
function llmsTxt() {
  return `# ${person.name}

> ${person.headline} ${person.summary}

- Location: ${person.location}
- Open to: ${person.openTo}
- Contact: ${person.email}
- Resume: ${person.resumeUrl}
- Certifications: ${person.certifications.join('; ')}
- Last updated: ${TODAY}

## Projects

${projects.map((p) => `- [${p.name}](${p.url}): ${p.description}`).join('\n')}

## Experience

${person.experience.map((e) => `- ${e.role}, ${e.org} (${e.dates}): ${e.stack}`).join('\n')}

## Profiles

${person.sameAs.map((u) => `- ${u}`).join('\n')}

## Optional

- [Full knowledge base](${SITE_URL}/llms-full.txt): detailed background, projects, and skills in Markdown
- Ask Chetan: the homepage hosts an AI chat grounded in this knowledge base. Browser agents that support WebMCP can call the \`ask_chetan\`, \`get_profile\`, \`list_projects\`, and \`get_contact\` tools.
`;
}

function publicKnowledgeBase() {
  let kb = KNOWLEDGE_BASE;
  for (const title of PRIVATE_KB_SECTIONS) {
    // Drop from "## <title>" up to the next "## " heading or "---" rule.
    const start = kb.indexOf(`## ${title}`);
    if (start === -1) continue;
    const rest = kb.slice(start + 3);
    const nextIdx = rest.search(/\n(## |---)/);
    const end = nextIdx === -1 ? kb.length : start + 3 + nextIdx;
    kb = kb.slice(0, start) + kb.slice(end);
  }
  return `${kb.replace(/\n{3,}/g, '\n\n').trim()}\n\n---\nSource: ${SITE_URL} (last updated ${TODAY})\n`;
}

function sitemap() {
  const urls = ['/', '/llms.txt', '/llms-full.txt'];
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${SITE_URL}${u}</loc><lastmod>${TODAY}</lastmod></url>`).join('\n')}
</urlset>
`;
}

// ---------- main ----------
function main() {
  const indexPath = path.join(BUILD, 'index.html');
  if (!fs.existsSync(indexPath)) {
    console.error('[aao] build/index.html not found. Run `react-scripts build` first.');
    process.exit(1);
  }
  let html = fs.readFileSync(indexPath, 'utf8');

  // Replace CRA's placeholder title and description.
  html = html.replace(/<title>[\s\S]*?<\/title>/, '');
  html = html.replace(/<meta name="description"[^>]*>/, '');
  html = html.replace('</head>', `${headTags()}\n    ${STATIC_CSS}\n  </head>`);

  // Fill #root with readable content and drop the "enable JavaScript" notice.
  if (!html.includes('<div id="root"></div>')) {
    console.error('[aao] could not find an empty <div id="root"></div> in build/index.html');
    process.exit(1);
  }
  html = html.replace('<div id="root"></div>', `<div id="root">${staticBody()}</div>`);
  html = html.replace(/<noscript>[\s\S]*?<\/noscript>/, '');

  fs.writeFileSync(indexPath, html);
  fs.writeFileSync(path.join(BUILD, 'llms.txt'), llmsTxt());
  fs.writeFileSync(path.join(BUILD, 'llms-full.txt'), publicKnowledgeBase());
  fs.writeFileSync(path.join(BUILD, 'sitemap.xml'), sitemap());
  fs.writeFileSync(
    path.join(BUILD, 'agent.json'),
    JSON.stringify({ site: SITE_URL, updated: TODAY, person, projects }, null, 2)
  );

  console.log('[aao] wrote index.html (static content + JSON-LD), llms.txt, llms-full.txt, sitemap.xml, agent.json');
}

main();
