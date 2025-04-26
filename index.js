import { fetchJSON, renderProjects, fetchGitHubData } from './global.js';

async function showProjectsAndGithub() {
  const projects = await fetchJSON('./lib/projects.json');
  const latestProjects = projects.slice(0, 3);

  const projectsContainer = document.querySelector('.projects');
  renderProjects(latestProjects, projectsContainer, 'h2');

  const githubData = await fetchGitHubData('d2osborn');
  console.log('GitHub Data:', githubData);

  const profileStats = document.querySelector('#profile-stats');
  if (profileStats) {
    profileStats.innerHTML = `
      <dl>
        <dt>Followers</dt><dd>${githubData.followers}</dd>
        <dt>Following</dt><dd>${githubData.following}</dd>
        <dt>Public Repos</dt><dd>${githubData.public_repos}</dd>
      </dl>
    `;
  }
}

showProjectsAndGithub();