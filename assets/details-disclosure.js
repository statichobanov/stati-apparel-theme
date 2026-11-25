class DetailsDisclosure extends HTMLElement {
  constructor() {
    super();
    this.mainDetailsToggle = this.querySelector('details');
    this.content = this.mainDetailsToggle.querySelector('summary').nextElementSibling;

    this.mainDetailsToggle.addEventListener('focusout', this.onFocusOut.bind(this));
    this.mainDetailsToggle.addEventListener('toggle', this.onToggle.bind(this));
  }

  onFocusOut() {
    setTimeout(() => {
      if (!this.contains(document.activeElement)) this.close();
    });
  }

  onToggle() {
    if (!this.animations) this.animations = this.content.getAnimations();

    if (this.mainDetailsToggle.hasAttribute('open')) {
      this.animations.forEach((animation) => animation.play());
    } else {
      this.animations.forEach((animation) => animation.cancel());
    }
  }

  close() {
    this.mainDetailsToggle.removeAttribute('open');
    this.mainDetailsToggle.querySelector('summary').setAttribute('aria-expanded', false);
  }
}

customElements.define('details-disclosure', DetailsDisclosure);

class HeaderMenu extends DetailsDisclosure {
  constructor() {
    super();
    this.header = document.querySelector('.header-wrapper');
    if (this.hasAttribute('data-open-on-hover')) this.initHover();
  }

  // Header setting "Open dropdown menus on hover". Only for a real mouse:
  // touch screens and keyboards keep the default click / Enter to open.
  initHover() {
    const mouse = window.matchMedia('(hover: hover) and (pointer: fine)');
    const summary = this.mainDetailsToggle.querySelector('summary');

    this.addEventListener('mouseenter', () => {
      if (!mouse.matches) return;
      clearTimeout(this.closeTimer);
      document.querySelectorAll('header-menu[data-open-on-hover]').forEach((menu) => {
        if (menu !== this) menu.close();
      });
      this.open();
      this.measureHoverBridge(summary);
    });

    this.addEventListener('mouseleave', () => {
      if (!mouse.matches) return;
      // Short delay, so the list doesn't vanish if the pointer slips outside it for a moment.
      this.closeTimer = setTimeout(() => this.close(), 200);
    });

    summary.addEventListener('click', (event) => {
      // event.detail is 0 when the "click" comes from the keyboard (Enter/Space): keep the toggle.
      if (!mouse.matches || event.detail === 0) return;
      event.preventDefault(); // the list is already open from hover; a click must not close it
      if (summary.dataset.url) window.location.href = summary.dataset.url;
    });
  }

  // The mega menu panel starts at the bottom of the header, not right under the menu item.
  // Measure that gap; CSS (component-mega-menu.css) puts an invisible "bridge" of this height
  // under the item, so the pointer stays inside the menu while moving down to the panel.
  // offsetTop is used for the panel because it ignores the panel's slide-in transform.
  measureHoverBridge(summary) {
    const parent = this.content.offsetParent;
    if (!parent) return;
    const summaryBottom = summary.getBoundingClientRect().bottom - parent.getBoundingClientRect().top;
    this.style.setProperty('--hover-bridge', `${Math.max(this.content.offsetTop - summaryBottom, 0)}px`);
  }

  open() {
    this.mainDetailsToggle.setAttribute('open', '');
    this.mainDetailsToggle.querySelector('summary').setAttribute('aria-expanded', true);
  }

  onToggle() {
    if (!this.header) return;
    this.header.preventHide = this.mainDetailsToggle.open;

    if (document.documentElement.style.getPropertyValue('--header-bottom-position-desktop') !== '') return;
    document.documentElement.style.setProperty(
      '--header-bottom-position-desktop',
      `${Math.floor(this.header.getBoundingClientRect().bottom)}px`
    );
  }
}

customElements.define('header-menu', HeaderMenu);
