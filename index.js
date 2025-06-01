import { fetchJSON, renderProjects, fetchGitHubData } from './global.js';

async function showProjectsAndGithub() {
  const projects = await fetchJSON('./lib/projects.json');
  const projectsContainer = document.querySelector('.projects');
  renderProjects(projects, projectsContainer); 

  const githubData = await fetchGitHubData('d2osborn');
  console.log('GitHub Data:', githubData);

  const profileStats = document.querySelector('#profile-stats');
  if (githubData && profileStats) {
    profileStats.innerHTML = `
      <dl>
        <dt>Followers</dt><dd>${githubData.followers}</dd>
        <dt>Following</dt><dd>${githubData.following}</dd>
        <dt>Public Repos</dt><dd>${githubData.public_repos}</dd>
      </dl>
    `;
  }
}

const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll("nav a");

window.addEventListener("scroll", () => {
  const fromTop = window.scrollY + 150;

  sections.forEach((section) => {
    const id = section.getAttribute("id");
    const link = document.querySelector(`nav a[href="#${id}"]`);
    if (
      section.offsetTop <= fromTop &&
      section.offsetTop + section.offsetHeight > fromTop
    ) {
      navLinks.forEach((l) => l.classList.remove("active"));
      if (link) link.classList.add("active");
    }
  });
});

showProjectsAndGithub();
