console.log("IT'S ALIVE!");

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

let pages = [
  { url: '', title: 'Home' },
  { url: 'projects/', title: 'Projects' },
  { url: 'resume/', title: 'Resume' },
  { url: 'https://github.com/d2osborn', title: 'GitHub' },
  { url: 'contacts/', title: 'Contacts' }
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
  a.toggleAttribute('target', a.host !== location.host);
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

// const navLinks = $$("nav a");

// let currentLink = navLinks.find(
//   (a) => a.host === location.host && a.pathname === location.pathname
// );

// if (currentLink) {
//     currentLink.classList.add('current');
// }

