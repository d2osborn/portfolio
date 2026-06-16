console.log("IT'S ALIVE!");

export function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

export let pages = [
  { url: '', title: 'Home' },
  { url: 'projects/', title: 'Projects' },
  { url: 'resume/', title: 'Resume' },
  { url: 'contacts/', title: 'Contacts' },
  { url: 'https://github.com/d2osborn', title: 'GitHub' },
  { url: 'https://www.linkedin.com/in/diego-osborn/', title: 'LinkedIn' },
  { url: 'meta/', title: 'Meta' }
];

export const BASE_PATH = (location.hostname === "localhost" || location.hostname === "127.0.0.1")
  ? "/"
  : "/portfolio/";

// --------------------------
// Fetch helpers
// --------------------------

export async function fetchJSON(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching JSON:', error);
  }
}

export async function fetchGitHubData(username) {
  return fetchJSON(`https://api.github.com/users/${username}`);
}

// --------------------------
// Project rendering — compact list format
// --------------------------

export function renderProjects(projects, containerElement) {
  if (!Array.isArray(projects)) {
    console.error('renderProjects error: projects should be an array');
    return;
  }
  if (!(containerElement instanceof HTMLElement)) {
    console.error('renderProjects error: invalid container element');
    return;
  }

  containerElement.innerHTML = '';

  // Filter out placeholder/hidden projects
  const visibleProjects = projects.filter(p =>
    !(p.title?.startsWith('Project ') ||
      p.title?.startsWith('Hidden ') ||
      p.title?.startsWith('(in') ||
      p.title?.startsWith('Spotify'))
  );

  const html = visibleProjects.map(project => {
    // Build inline links
    const links = [];

    if (project.paper && !project.paper.includes('link-to-your-pdf.com')) {
      links.push(`<a href="${project.paper}" target="_blank" rel="noopener noreferrer">Paper</a>`);
    }
    if (project.slides) {
      links.push(`<a href="${project.slides}" target="_blank" rel="noopener noreferrer">Slides</a>`);
    }
    if (project.github) {
      links.push(`<a href="${project.github}" target="_blank" rel="noopener noreferrer">Code</a>`);
    }
    if (project.url) {
      links.push(`<a href="${project.url}" target="_blank" rel="noopener noreferrer">Live</a>`);
    }

    return `
      <div class="project-entry">
        <div class="project-head">
          <span class="title">${project.title ?? 'Untitled Project'}</span>
          ${project.year ? `<span class="date">${project.year}</span>` : ''}
        </div>
        ${project.description ? `<p class="desc">${project.description}</p>` : ''}
        ${links.length ? `<div class="plinks">${links.join('<span class="sep">•</span>')}</div>` : ''}
      </div>
    `;
  }).join('');

  containerElement.innerHTML = html;
}