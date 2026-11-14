const cards = [...document.querySelectorAll('.game-card')];
const searchInput = document.querySelector('#game-search');
const filterButtons = [...document.querySelectorAll('.catalog-filter')];
const count = document.querySelector('#game-count');
const status = document.querySelector('#catalog-status');
const emptyState = document.querySelector('#catalog-empty');

let activeFilter = 'all';

function updateCatalog() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  let visibleCount = 0;

  for (const card of cards) {
    const categories = card.dataset.category.split(' ');
    const matchesFilter = activeFilter === 'all' || categories.includes(activeFilter);
    const matchesSearch = card.dataset.search.includes(searchTerm);
    const isVisible = matchesFilter && matchesSearch;

    card.hidden = !isVisible;
    if (isVisible) visibleCount += 1;
  }

  count.textContent = visibleCount;
  status.textContent = `Showing ${visibleCount} ${visibleCount === 1 ? 'game' : 'games'}.`;
  emptyState.hidden = visibleCount > 0;
}

for (const button of filterButtons) {
  button.addEventListener('click', () => {
    activeFilter = button.dataset.filter;

    for (const filterButton of filterButtons) {
      const isActive = filterButton === button;
      filterButton.classList.toggle('is-active', isActive);
      filterButton.setAttribute('aria-pressed', String(isActive));
    }

    updateCatalog();
  });
}

searchInput.addEventListener('input', updateCatalog);
