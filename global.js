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
// Project rendering
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

  // Clear container
  containerElement.innerHTML = '';

  // Filter out unwanted projects
  const visibleProjects = projects.filter(p => !(p.title?.startsWith('Project ') || p.title?.startsWith('Hidden ') || p.title?.startsWith('Spotify') || p.title?.startsWith('(in')));

  // Map over the visible projects and generate the HTML
  const html = visibleProjects.map(project => {
    // SVG Icons
    const githubSVG = `<svg viewBox="0 0 24 24" class="inline-icon"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>`;
    const paperSVG = `<svg viewBox="0 0 24 24" class="inline-icon"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 7V3.5L18.5 9H13z"/></svg>`;
    const slidesSVG = `<svg viewBox="0 0 24 24" class="inline-icon"><path d="M22,18H2V4H22V18M2,2A2,2 0 0,0 0,4V18A2,2 0 0,0 2,20H10V22H8V24H16V22H14V20H22A2,2 0 0,0 24,18V4A2,2 0 0,0 22,2H2M13,7L16,11H14V15H12V11H10L13,7Z"/></svg>`;

    return `
      <div class="project-item">
        <div class="project-content">
          <h3 class="project-title">
            ${project.title ?? 'Untitled Project'} 
          </h3>
          
          <p class="project-description">${project.description ?? ''}</p>
          
          <div class="project-links">
            ${project.github ? `
              <a href="${project.github}" target="_blank" rel="noopener noreferrer" style="display: flex; align-items: center; gap: 0.4rem; text-decoration: none; font-size: 0.95rem; font-weight: 500; color: var(--accent);">
                ${githubSVG}
                Code
              </a>
            ` : ''}

            ${project.url ? `
              <a href="${project.url}" target="_blank" rel="noopener noreferrer" style="display: flex; align-items: center; gap: 0.4rem; text-decoration: none; font-size: 0.95rem; font-weight: 500; color: var(--accent);">
                Live Project ↗
              </a>
            ` : ''}
            
            ${project.paper ? `
              <a href="${project.paper}" target="_blank" rel="noopener noreferrer" style="display: flex; align-items: center; gap: 0.4rem; text-decoration: none; font-size: 0.95rem; font-weight: 500; color: var(--accent);">
                ${paperSVG}
                Read Paper
              </a>
            ` : ''}

            ${project.slides ? `
              <a href="${project.slides}" target="_blank" rel="noopener noreferrer" style="display: flex; align-items: center; gap: 0.4rem; text-decoration: none; font-size: 0.95rem; font-weight: 500; color: var(--accent);">
                ${slidesSVG}
                View Slides
              </a>
            ` : ''}
            
            ${project.year ? `
              <span class="project-year" style="margin-left: auto; font-size: 0.9rem; font-style: italic; color: var(--text-muted);">
                ${project.year}
              </span>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Inject the generated HTML into the DOM
  containerElement.innerHTML = html;
}