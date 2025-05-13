import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

let selectedIndex = -1;
let allProjects = [];
let query = '';
let tagData = [];

function filterProjects() {
  return allProjects.filter(project => {
    const values = Object.values(project).join('\n').toLowerCase();
    return values.includes(query.toLowerCase());
  });
}

function renderPieChart(projectsGiven) {
  const tagCounts = new Map();

  projectsGiven.forEach(p => {
    (p.tags || []).forEach(tag => {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    });
  });

  // Sort tagData so pie order matches legend
  tagData = Array.from(tagCounts.entries())
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value); // optional: sort by frequency

  const color = d3.scaleOrdinal()
    .domain(tagData.map(d => d.label)) // explicitly match tagData order
    .range(d3.schemeTableau10.concat(d3.schemeSet3)); // extended color palette

  const arcGenerator = d3.arc().innerRadius(15).outerRadius(50);
  const sliceGenerator = d3.pie().value(d => d.value).sort(null);
  const arcData = sliceGenerator(tagData);

  const svg = d3.select('#projects-pie-plot')
    .attr('width', 200)
    .attr('height', 200)
    .attr('viewBox', '-60 -60 120 120')
    .attr('preserveAspectRatio', 'xMidYMid meet');

  svg.selectAll('*').remove();

  const paths = svg.selectAll('path')
    .data(arcData)
    .join('path')
    .attr('d', arcGenerator)
    .attr('fill', d => color(d.data.label))
    .attr('stroke', 'none')
    .attr('class', d => d.index === selectedIndex ? 'selected' : null)
    .on('click', function(event, d) {
      selectedIndex = selectedIndex === d.index ? -1 : d.index;
      updateUI();
    })
    .on('mouseover', function(event, d) {
      d3.select(this).classed('hovered', true);
      d3.selectAll('.legend-item').filter((_, i) => i === d.index).classed('hovered', true);
    })
    .on('mouseout', function(event, d) {
      d3.select(this).classed('hovered', false);
      d3.selectAll('.legend-item').filter((_, i) => i === d.index).classed('hovered', false);
    });

  const legend = d3.select('.legend');
  legend.selectAll('*').remove();

  legend.selectAll('li')
    .data(tagData)
    .join('li')
    .attr('class', function(_, i) {
      const base = 'legend-item';
      const selected = i === selectedIndex ? 'selected' : '';
      return `${base} ${selected}`.trim();
    })
    .attr('style', d => `--color: ${color(d.label)}`)
    .html(d => `${d.label} <em>(${d.value})</em>`)
    .each(function(d, i) {
      d3.select(this)
        .on('click', function() {
          selectedIndex = selectedIndex === i ? -1 : i;
          updateUI();
        })
        .on('mouseover', function() {
          d3.select(this).classed('hovered', true);
          d3.select(svg.selectAll('path').nodes()[i]).classed('hovered', true);
        })
        .on('mouseout', function() {
          d3.select(this).classed('hovered', false);
          d3.select(svg.selectAll('path').nodes()[i]).classed('hovered', false);
        });
    });
}

function updateUI() {
  const searchFiltered = filterProjects(); 

  let visibleProjects = [...searchFiltered];
  
  if (selectedIndex !== -1 && tagData[selectedIndex]) {
    const selectedTag = tagData[selectedIndex].label;
    visibleProjects = searchFiltered.filter(p => (p.tags || []).includes(selectedTag));
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

