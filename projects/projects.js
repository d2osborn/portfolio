import { fetchJSON, renderProjects } from '../global.js';

async function showProjects() {
  const projects = await fetchJSON('../lib/projects.json');

  console.log(projects);

  const projectsTitle = document.querySelector('.projects-title');
  const count = projects.length;
  projectsTitle.textContent = count === 1 ? '1 Project' : `${count} Projects`;

  const container = document.querySelector('.projects');
  renderProjects(projects, container, 'h2');
}

showProjects();