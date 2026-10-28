const tools = document.querySelector('.collection-tools');
const cards = [...document.querySelectorAll('.project-card')];
const filterButtons = [...document.querySelectorAll('[data-filter]')];
const search = document.querySelector('#project-search');
let activeFilter = 'all';
function filterProjects() {
  const query = search.value.trim().toLowerCase();
  let visible = 0;
  for (const card of cards) {
    card.hidden = !(activeFilter === 'all' || card.dataset.category === activeFilter) || !card.dataset.search.includes(query);
    if (!card.hidden) visible++;
  }
  document.querySelector('#results-count').textContent = `${visible} of ${cards.length} projects${query ? ` matching “${search.value.trim()}”` : ''}`;
  document.querySelector('.empty-state').hidden = visible > 0;
  filterButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === activeFilter)));
}
filterButtons.forEach(button => button.addEventListener('click', () => { activeFilter = button.dataset.filter; filterProjects(); }));
search.addEventListener('input', filterProjects);
document.querySelector('#reset-filters').addEventListener('click', () => { activeFilter = 'all'; search.value = ''; filterProjects(); search.focus(); });
tools.hidden = false;
const menu = document.querySelector('.mobile-menu');
menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => { menu.open = false; }));
document.addEventListener('keydown', event => { if (event.key === 'Escape' && menu.open) { menu.open = false; menu.querySelector('summary').focus(); } });
document.addEventListener('click', event => { if (!menu.contains(event.target)) menu.open = false; });
document.querySelector('#year').textContent = new Date().getFullYear();
