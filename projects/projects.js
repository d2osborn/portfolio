import { fetchJSON } from '../global.js';

// --------------------------
// Dark / Light theme toggle
// --------------------------
const toggle = document.getElementById('theme-toggle');
if (toggle) {
  toggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    sessionStorage.setItem(
      'theme',
      document.body.classList.contains('dark') ? 'dark' : 'light'
    );
  });
}

// --------------------------
// Project rendering — Card format for sub-page
// --------------------------
function renderProjectCards(projects, containerElement) {
  if (!Array.isArray(projects) || !(containerElement instanceof HTMLElement)) return;

  containerElement.innerHTML = '';

  const visibleProjects = projects.filter(p =>
    !(p.title?.startsWith('Project ') ||
      p.title?.startsWith('Hidden ') ||
      p.title?.startsWith('(in') ||
      p.title?.startsWith('Spotify'))
  );

  const html = visibleProjects.map(project => {
    // Generate tags if they exist
    const tagsHtml = project.tags && Array.isArray(project.tags) 
      ? `<div class="card-tags">${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div>`
      : '';

    // Build inline links
    const links = [];
    if (project.paper && !project.paper.includes('link-to-your-pdf.com')) {
      const paperUrl = project.paper.startsWith('http') ? project.paper : '../' + project.paper;
      links.push(`<a href="${paperUrl}" target="_blank" rel="noopener noreferrer">Paper Link</a>`);
    }
    if (project.slides) {
      links.push(`<a href="${project.slides.startsWith('http') ? project.slides : '../' + project.slides}" target="_blank" rel="noopener noreferrer">Slides Link</a>`);
    }
    if (project.github) {
      links.push(`<a href="${project.github}" target="_blank" rel="noopener noreferrer">Code Link</a>`);
    }
    if (project.url) {
      links.push(`<a href="${project.url}" target="_blank" rel="noopener noreferrer">Live Link</a>`);
    }
    
    const linksHtml = links.length 
      ? `<div class="card-links">${links.join('<span class="sep">•</span>')}</div>` 
      : '';

    return `
      <div class="project-card">
        <div class="card-header">
          <h3 class="card-title">${project.title ?? 'Untitled Project'}</h3>
          ${project.year ? `<span class="card-date">${project.year}</span>` : ''}
        </div>
        ${tagsHtml}
        ${project.description ? `<p class="card-desc">${project.description}</p>` : ''}
        ${linksHtml}
      </div>
    `;
  }).join('');

  containerElement.innerHTML = html;
}

// --------------------------
// Load & render projects
// --------------------------
async function loadProjects() {
  const projects = await fetchJSON('../lib/projects.json');
  const container = document.querySelector('.projects-grid');
  if (projects && container) {
    renderProjectCards(projects, container);
  }
}

loadProjects();