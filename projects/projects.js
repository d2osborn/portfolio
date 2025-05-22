import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

let selectedIndex = -1;
let allProjects = [];
let query = '';

function filterProjects() {
  return allProjects.filter(project => {
    const values = Object.values(project).join('\n').toLowerCase();
    return values.includes(query.toLowerCase());
  });
}

function renderPieChart(projectsGiven) {
  const rolledData = d3.rollups(projectsGiven, v => v.length, d => d.year);
  const data = rolledData.map(([year, count]) => ({
    label: year,
    value: count
  }));

  const color = d3.scaleOrdinal(d3.schemeTableau10).domain(data.map(d => d.label));
  const arcGenerator = d3.arc().innerRadius(15).outerRadius(50); // donut chart for cleaner center
  const sliceGenerator = d3.pie().value(d => d.value);
  const arcData = sliceGenerator(data);

  const svg = d3.select('#projects-pie-plot')
    .attr('width', 200)
    .attr('height', 200)
    .attr('viewBox', '-60 -60 120 120')
    .attr('preserveAspectRatio', 'xMidYMid meet');

  svg.selectAll('*').remove();

  svg.selectAll('path')
    .data(arcData)
    .join('path')
    .attr('d', arcGenerator)
    .attr('fill', d => color(d.data.label))
    .attr('stroke', 'none')
    .attr('class', d => d.index === selectedIndex ? 'selected' : null)
    .on('click', function(event, d) {
      const index = d.index;
      selectedIndex = selectedIndex === index ? -1 : index;
      updateUI();
    });

  const legend = d3.select('.legend');
  legend.selectAll('*').remove();

  legend.selectAll('li')
    .data(data)
    .join('li')
    .attr('class', (_, i) => i === selectedIndex ? 'legend-item selected' : 'legend-item')
    .attr('style', d => `--color: ${color(d.label)}`)
    .html(d => `<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`)
    .data(data)
    .join('li')
    .each(function(_, i) {
      d3.select(this).on('click', () => {
        selectedIndex = selectedIndex === i ? -1 : i;
        updateUI();
      });
    });
}

function updateUI() {
  const searchFiltered = filterProjects(); // always apply search filter

  let visibleProjects = [...searchFiltered];
  if (selectedIndex !== -1) {
    const rolled = d3.rollups(searchFiltered, v => v.length, d => d.year);
    const data = rolled.map(([year, count]) => ({ label: year, value: count }));
    const selectedYear = data[selectedIndex]?.label;

    if (selectedYear) {
      visibleProjects = searchFiltered.filter(p => p.year === selectedYear);
    }
  }

  const projectsTitle = document.querySelector('.projects-title');
  projectsTitle.textContent = `${visibleProjects.length} Project${visibleProjects.length !== 1 ? 's' : ''}`;

  renderProjects(visibleProjects, document.querySelector('.projects'), 'h2');

  // Always render pie with only search-filtered data
  renderPieChart(searchFiltered);
}

async function showProjects() {
  allProjects = await fetchJSON('../lib/projects.json');
  updateUI();
}

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.querySelector('.searchBar');
  searchInput.addEventListener('input', event => {
    query = event.target.value;
    updateUI(); // ✅ keep both search + year filters active
  });

  showProjects();
});