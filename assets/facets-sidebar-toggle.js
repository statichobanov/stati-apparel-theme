// "Filter" button for the vertical filter layout (collection page setting "Show vertical filters with a Filter button").
// Click: show the filter sidebar. Click again: hide it.
//
// The open/closed state is remembered for this browser tab (sessionStorage), so the sidebar stays open when the
// customer moves to another collection (e.g. from Мъжки to Дамски). On page load a small inline script in
// main-collection-product-grid.liquid applies the saved state before the page is painted.
const FACETS_SIDEBAR_STORAGE_KEY = 'facets-sidebar-open';

class FacetsSidebarToggle extends HTMLElement {
  connectedCallback() {
    this.button = this.querySelector('button');
    this.container = document.getElementById(this.dataset.target);
    if (!this.button || !this.container) return;
    this.button.addEventListener('click', () => this.toggle());
  }

  toggle() {
    const open = !this.container.classList.toggle('facets-vertical--collapsed');
    this.button.setAttribute('aria-expanded', open);
    try {
      sessionStorage.setItem(FACETS_SIDEBAR_STORAGE_KEY, open ? '1' : '0');
    } catch (error) {
      // Storage can be blocked (e.g. private mode): the button still works, the state just isn't remembered.
    }
  }
}

if (!customElements.get('facets-sidebar-toggle')) customElements.define('facets-sidebar-toggle', FacetsSidebarToggle);
