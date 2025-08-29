const nav_hamburger = document.querySelector('#nav-menu-icon');
const nav_links_cell = document.querySelector('.nav-links-cell');

nav_hamburger.addEventListener('click', function() {
  this.classList.toggle('open');
  if(nav_links_cell.style.height === '0px' || nav_links_cell.style.height === '') {
    nav_links_cell.style.height = '380px';
    nav_links_cell.style.padding = '24px';
  } else{
    nav_links_cell.style.height = '0px';
    nav_links_cell.style.padding = '0px';
  }
});