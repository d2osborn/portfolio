console.log("IT'S ALIVE!");

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

let pages = [
  { url: '', title: 'Home' },
  { url: 'contacts/', title: 'Contacts' },
  { url: 'projects/', title: 'Projects' },
  { url: 'resume/', title: 'Resume' },
  { url: 'https://github.com/d2osborn', title: 'GitHub' }
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

// const navLinks = $$("nav a");

// let currentLink = navLinks.find(
//   (a) => a.host === location.host && a.pathname === location.pathname
// );

// if (currentLink) {
//     currentLink.classList.add('current');
// }

