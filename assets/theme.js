document.addEventListener('DOMContentLoaded', function () {
  var header = document.querySelector('[data-header]');
  if (!header) return;

  var menuToggle = header.querySelector('[data-menu-toggle]');
  var nav = header.querySelector('.site-nav');
  if (menuToggle && nav) {
    menuToggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  var searchToggle = header.querySelector('[data-search-toggle]');
  var searchDrawer = header.querySelector('[data-search-drawer]');
  if (searchToggle && searchDrawer) {
    searchToggle.addEventListener('click', function () {
      searchDrawer.classList.toggle('is-open');
      var input = searchDrawer.querySelector('input[type="search"]');
      if (searchDrawer.classList.contains('is-open') && input) {
        input.focus();
      }
    });
  }

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      nav && nav.classList.remove('is-open');
      searchDrawer && searchDrawer.classList.remove('is-open');
    }
  });
});
