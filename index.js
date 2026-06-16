import { fetchJSON, renderProjects } from './global.js';

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
// Load & render projects
// --------------------------
async function loadProjects() {
  const projects = await fetchJSON('./lib/projects.json');
  const container = document.querySelector('.projects');
  if (projects && container) {
    renderProjects(projects, container);
  }
}

loadProjects();