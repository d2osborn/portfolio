console.log("IT'S ALIVE!");

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

let pages = [
  { url: '', title: 'Home' },
  { url: 'projects/', title: 'Projects' },
  { url: 'resume/', title: 'Resume' },
  { url: 'contacts/', title: 'Contacts' },
  { url: 'https://github.com/d2osborn', title: 'GitHub' },
  { url: 'https://www.linkedin.com/in/diego-osborn/', title: 'LinkedIn' },
  { url: 'meta/', title: 'Meta' }
];

const BASE_PATH = (location.hostname === "localhost" || location.hostname === "127.0.0.1")
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

  containerElement.innerHTML = '';

  const visibleProjects = projects.filter(p => !(p.title?.startsWith('Project ') || p.title?.startsWith('Hidden ') || p.title?.startsWith('Bayes')));

  for (let project of visibleProjects) {
    const card = document.createElement('div');
    card.className = 'project-card';

    const isGitHub = project.link?.startsWith('https://github.com');
    const iconSrc = isGitHub
      ? 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/github.svg'
      : 'images/world-wide-web-svgrepo-com.svg';

    card.innerHTML = `
      ${project.link ? `
        <a href="${project.link}" target="_blank" rel="noopener noreferrer">
          <img src="${iconSrc}" alt="${isGitHub ? 'GitHub' : 'Website'}" class="project-github">
        </a>` : ''
      }

      <div class="project-title">${project.title ?? 'Untitled Project'}</div>
      <div class="project-description">${project.description ?? ''}</div>

      <div class="project-meta">
        ${project.tags?.length ? `
          <div class="project-tags">
            Skills: ${project.tags.join(' | ')}
          </div>` : ''
        }
        ${project.year ? `
          <div class="project-year">
            c. ${project.year}
          </div>` : ''
        }
      </div>
    `;

    containerElement.appendChild(card);
  }
}
