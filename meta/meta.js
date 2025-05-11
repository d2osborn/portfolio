import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

let xScale, yScale, commits, brush;

async function loadData() {
  const data = await d3.csv('loc.csv', (row) => ({
    ...row,
    line: +row.line,
    depth: +row.depth,
    length: +row.length,
    date: new Date(row.date + 'T00:00' + row.timezone),
    datetime: new Date(row.datetime),
  }));

  displaySummary(data);

  commits = processCommits(data);
  console.log(commits);

  return data;
}

function displaySummary(data) {
  const statsDiv = document.querySelector("#stats");
  const numFiles = new Set(data.map(d => d.file)).size;
  const totalLines = data.length;
  const totalLength = d3.sum(data, d => d.length);
  const uniqueAuthors = new Set(data.map(d => d.author)).size;
}

function processCommits(data) {
  return d3
    .groups(data, d => d.commit)
    .map(([commit, lines]) => {
      const first = lines[0];
      const { author, date, time, timezone, datetime } = first;

      const ret = {
        id: commit,
        url: 'https://github.com/vis-society/lab-7/commit/' + commit,
        author,
        date,
        time,
        timezone,
        datetime,
        hourFrac: datetime.getHours() + datetime.getMinutes() / 60,
        totalLines: lines.length,
      };

      Object.defineProperty(ret, 'lines', {
        value: lines,
        writable: true,
        configurable: true,
        enumerable: false
      });

      return ret;
    });
}

function renderCommitInfo(data, commits) {
  const dl = d3.select('#stats').append('dl').attr('class', 'stats');

  dl.append('dt').html('Commits');
  dl.append('dd').text(commits.length);

  dl.append('dt').text('Files');
  dl.append('dd').text(d3.groups(data, d => d.file).length);

  dl.append('dt').html('Total <abbr title="Lines of Code">LOC</abbr>');
  dl.append('dd').text(data.length);

  dl.append('dt').text('Max Depth');
  dl.append('dd').text(d3.max(data, d => d.depth));

  dl.append('dt').text('Longest Line');
  dl.append('dd').text(d3.max(data, d => d.length));

  const fileLines = d3.rollups(data, v => v.length, d => d.file);
  dl.append('dt').text('Max Lines');
  dl.append('dd').text(d3.max(fileLines, d => d[1]));
}

function updateTooltipPosition(event) {
  const tooltip = document.getElementById('commit-tooltip');
  const offsetX = 30;
  const offsetY = -80; // shift above the cursor

  tooltip.style.left = `${event.clientX + offsetX}px`;
  tooltip.style.top = `${event.clientY + offsetY}px`;
}

function renderScatterPlot(data, commits) {
    const width = 1000;
    const height = 600;
    const margin = { top: 10, right: 10, bottom: 30, left: 40 };

    const usableArea = {
    top: margin.top,
    right: width - margin.right,
    bottom: height - margin.bottom,
    left: margin.left,
    width: width - margin.left - margin.right,
    height: height - margin.top - margin.bottom,
    };

    const svg = d3
    .select('#chart')
    .append('svg')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .style('overflow', 'visible');

    xScale = d3
    .scaleTime()
    .domain(d3.extent(commits, d => d.datetime))
    .range([usableArea.left, usableArea.right])
    .nice();

    yScale = d3
    .scaleLinear()
    .domain([0, 24])
    .range([usableArea.top, usableArea.bottom]);

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale)
    .tickValues(d3.range(0, 25, 2)) 
    .tickFormat(d => String(d % 24).padStart(2, '0') + ':00');

    svg.append('g')
    .attr('transform', `translate(0, ${usableArea.bottom})`)
    .call(xAxis);

    svg.append('g')
    .attr('transform', `translate(${usableArea.left}, 0)`)
    .call(yAxis);

    const colorScale = d3.scaleLinear()
    .domain([0, 6, 18, 24])
    .range([
        '#264b96',  // deep blue (night)
        '#84b6f4',  // light blue (early morning)
        '#fdae61',  // warm orange (day)
        '#264b96'   // deep blue (night again)
    ]);

    const [minLines, maxLines] = d3.extent(commits, d => d.totalLines);
    const rScale = d3.scaleSqrt().domain([minLines, maxLines]).range([2, 30]);

    const sortedCommits = d3.sort(commits, d => -d.totalLines);

    brush = d3.brush().on('start brush end', brushed);
    svg.append('g')
    .attr('class', 'brush')
    .call(brush);
    
    svg.selectAll('.dots, .overlay ~ *').raise();

    const dots = svg.append('g').attr('class', 'dots');

    dots.selectAll('circle')
    .data(sortedCommits)
    .join('circle')
    .attr('cx', d => xScale(d.datetime))
    .attr('cy', d => yScale(d.hourFrac))
    .attr('r', d => rScale(d.totalLines))
    .attr('fill', d => colorScale(d.hourFrac))
    .style('fill-opacity', 0.7)
    .on('mouseenter', (event, commit) => {
        d3.select(event.currentTarget).style('fill-opacity', 1);
        renderTooltipContent(commit);
        updateTooltipVisibility(true);
        updateTooltipPosition(event);
    })
    .on('mousemove', (event) => {
        updateTooltipPosition(event); 
    })
    .on('mouseleave', (event) => {
        d3.select(event.currentTarget).style('fill-opacity', 0.7);
        updateTooltipVisibility(false);
    });

}

function renderTooltipContent(commit) {
  const tooltip = document.getElementById('commit-tooltip');

  if (!commit || Object.keys(commit).length === 0) {
    tooltip.style.display = 'none';
    return;
  }

  tooltip.style.display = 'block';
  document.getElementById('commit-link').href = commit.url;
  document.getElementById('commit-link').textContent = commit.id;
  document.getElementById('commit-date').textContent = commit.datetime?.toLocaleDateString('en', { dateStyle: 'full' });
  document.getElementById('commit-time').textContent = commit.datetime?.toLocaleTimeString('en', { timeStyle: 'short' });
  document.getElementById('commit-author').textContent = commit.author ?? '';
  document.getElementById('commit-lines').textContent = commit.totalLines;
}

function updateTooltipVisibility(isVisible) {
  const tooltip = document.getElementById('commit-tooltip');
  tooltip.hidden = !isVisible;
}

function isCommitSelected(selection, commit) {
  if (!selection) return false;
  const [[x0, y0], [x1, y1]] = selection;
  const x = xScale(commit.datetime);
  const y = yScale(commit.hourFrac);
  return x >= x0 && x <= x1 && y >= y0 && y <= y1;
}

function brushed(event) {
  const selection = event.selection;

  if (!selection) {
    d3.selectAll('circle').classed('selected', false);
    renderSelectionCount(null);
    renderLanguageBreakdown(null);
    return;
  }

  d3.selectAll('circle').classed('selected', d =>
    isCommitSelected(selection, d)
  );

  renderSelectionCount(selection);
  renderLanguageBreakdown(selection);
}

function renderSelectionCount(selection) {
  const selectedCommits = selection
    ? commits.filter((d) => isCommitSelected(selection, d))
    : [];

  document.getElementById('selection-count').textContent =
    `${selectedCommits.length || 'No'} commits selected`;

  return selectedCommits;
}

function renderLanguageBreakdown(selection) {
  const selectedCommits = selection
    ? commits.filter(d => isCommitSelected(selection, d))
    : [];

  const container = document.getElementById('language-breakdown');
  container.innerHTML = '';

  if (selectedCommits.length === 0) return;

  const lines = selectedCommits.flatMap(d => d.lines);
  const breakdown = d3.rollup(lines, v => v.length, d => d.type);

  const total = lines.length;

  for (const [lang, count] of breakdown) {
    const proportion = count / total;
    const percent = d3.format('.1~%')(proportion);

    const entry = document.createElement('div');
    entry.className = 'lang-entry';

    entry.innerHTML = `
      <div class="lang-type">${lang}</div>
      <div class="lang-value">${count} lines</div>
      <div class="lang-percent">(${percent})</div>
    `;

    container.appendChild(entry);
  }
}

(async function () {
  const data = await loadData();
  const commits = processCommits(data);

  renderCommitInfo(data, commits);
  renderScatterPlot(data, commits);
  window.addEventListener('click', (event) => {
  const chartEl = document.getElementById('chart');

  if (!chartEl.contains(event.target)) {
    const brushGroup = d3.select('#chart svg').select('.brush');

    brushGroup.call(brush.move, null);

    d3.selectAll('circle').classed('selected', false);
    renderSelectionCount(null);
    renderLanguageBreakdown(null);
  }
});
})
();