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
  { url: 'https://www.linkedin.com/in/diego-osborn/', title: 'LinkedIn'}
];

const BASE_PATH = (location.hostname === "localhost" || location.hostname === "127.0.0.1")
  ? "/"
  : "/portfolio/";

let nav = document.createElement('nav');
document.body.prepend(nav);

for (let p of pages) {
  let rawUrl = p.url;
  let title = p.title;
  let url = !rawUrl.startsWith('http') ? BASE_PATH + rawUrl : rawUrl;

  console.log(`Creating link for: ${title} → ${url}`);

  let a = document.createElement('a');
  a.href = url;
  a.textContent = title;
  a.classList.toggle('current', a.host === location.host && a.pathname === location.pathname);
  if (a.host !== location.host) {
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
  }
  nav.append(a);
}

document.body.insertAdjacentHTML(
  'beforeend',
  `
  <label class="color-scheme">
    Theme:
    <select id="theme-select">
      <option value="light dark">Automatic</option>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>
  </label>
  `
);

const select = document.querySelector('#theme-select');

function setColorScheme(colorScheme) {
  document.documentElement.style.setProperty('color-scheme', colorScheme);
  select.value = colorScheme;
  console.log('Color scheme set to:', colorScheme);
}

if ('colorScheme' in localStorage) {
  setColorScheme(localStorage.colorScheme);
} else {
  setColorScheme('light dark');
}

select.addEventListener('input', function (event) {
  const newScheme = event.target.value;
  setColorScheme(newScheme);
  localStorage.colorScheme = newScheme;
});

export async function fetchJSON(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching or parsing JSON data:', error);
  }
}

export function renderProjects(projects, containerElement, headingLevel = 'h2') {
  if (!Array.isArray(projects)) {
    console.error('renderProjects error: projects should be an array');
    return;
  }
  if (!(containerElement instanceof HTMLElement)) {
    console.error('renderProjects error: containerElement is not a valid DOM element');
    return;
  }
  if (!/^h[1-6]$/.test(headingLevel)) { 
    console.warn(`Invalid heading level "${headingLevel}" — defaulting to <h2>`);
    headingLevel = 'h2';
  }

  containerElement.innerHTML = '';

  if (projects.length === 0) {
    containerElement.innerHTML = '<p>No projects available.</p>';
    return;
  }

  for (let project of projects) {
    const article = document.createElement('article');
    article.innerHTML = `
      <${headingLevel}>${project.title ?? 'Untitled Project'}</${headingLevel}>
      <img src="${project.image ? BASE_PATH + project.image : ''}" alt="${project.title ?? 'Project image'}">
      <div>
        <p>${project.description ?? 'No description available.'}</p>
        <div class="project-tags">
          ${(project.tags ?? []).map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
        <p style="font-family: Baskerville, serif; font-style: italic; font-variant-numeric: oldstyle-nums; margin-top: 0.25em;">
          c. ${project.year ?? '—'}
        </p>
      </div>
    `;
    containerElement.appendChild(article);
  }
}

export async function fetchGitHubData(username) {
  return fetchJSON(`https://api.github.com/users/${username}`);
}


