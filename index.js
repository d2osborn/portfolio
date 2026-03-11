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

// --- Navigation Highlight Observer ---
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll("nav a");

const observerOptions = {
  root: null,
  rootMargin: "-40% 0px -60% 0px", 
  threshold: 0
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      // 1. Remove active class from all links
      navLinks.forEach((link) => link.classList.remove("active"));
      
      // 2. Find the ID of the section currently in view
      const currentId = entry.target.getAttribute("id");
      
      // 3. Find the matching link and add the active class
      const activeLink = document.querySelector(`nav a[href="#${currentId}"]`);
      if (activeLink) {
        activeLink.classList.add("active");
      }
    }
  });
}, observerOptions);

// Tell the observer to watch every section on the page
sections.forEach((section) => {
  observer.observe(section);
});

// --- Initialize Data Fetching ---
showProjectsAndGithub();