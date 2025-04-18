console.log("IT'S ALIVE!");

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

let pages = [
    { url: '', title: 'Home' },
    { url: 'contacts/', title: 'Contacts' },
    { url: 'projects/', title: 'Projects' },
    { url: 'resume/', title: 'Resume' },
    { url: 'https://github.com/d2osborn', title: 'GitHub' } // example external link
  ];
  
  // Adjust base path depending on local vs GitHub Pages
  const BASE_PATH = (location.hostname === "localhost" || location.hostname === "127.0.0.1")
    ? "/"
    : "/portfolio/";  // Replace with your GitHub Pages repo name if different
  
  // Create <nav> and add it to top of body
  let nav = document.createElement('nav');
  document.body.prepend(nav);
  
  // Create and append each <a> link
  for (let p of pages) {
    let rawUrl = p.url;
    let title = p.title;
  
    // Build full URL for internal pages
    let url = !rawUrl.startsWith('http') ? BASE_PATH + rawUrl : rawUrl;
  
    let a = document.createElement('a');
    a.href = url;
    a.textContent = title;
  
    // Add class "current" if this is the current page
    a.classList.toggle(
      'current',
      a.host === location.host && a.pathname === location.pathname
    );
  
    // Open external links in a new tab
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

