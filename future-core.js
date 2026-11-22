/*
 * BVH3 Future Core / progressive enhancement.
 * This script does not replace CyberpunkPortfolio or modify its state machine.
 */
(() => {
  'use strict';

  function initFutureCore() {
    if (!document.body.classList.contains('bvh3-future-core')) return;

    const navMenu = document.querySelector('#mainNav .nav-menu');
    const navToggle = document.getElementById('navToggle');
    const mobileQuery = window.matchMedia('(max-width: 980px)');

    // Hero calls into the *existing* navigation button and therefore uses
    // the original navigation handlers, section lifecycle and hash updates.
    document.querySelectorAll('[data-bvh3-target]').forEach((action) => {
      action.addEventListener('click', () => {
        const section = action.getAttribute('data-bvh3-target');
        if (!/^(projects|apps)$/.test(section || '')) return;
        document.querySelector('#mainNav .nav-btn[data-section="' + section + '"]')?.click();
      });
    });

    if (!navMenu || !navToggle) return;

    // The original hamburger is a div. Provide keyboard and screen-reader
    // semantics without changing its classes or click listener.
    navToggle.setAttribute('role', 'button');
    navToggle.setAttribute('tabindex', '0');
    navToggle.setAttribute('aria-label', 'Abrir menú de navegación');
    navToggle.setAttribute('aria-controls', 'mainNavMenu');
    navMenu.id = 'mainNavMenu';

    const syncMenuState = () => {
      const open = mobileQuery.matches && navMenu.classList.contains('active');
      navToggle.setAttribute('aria-expanded', String(open));
      navToggle.setAttribute('aria-label', open ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
    };

    navToggle.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        navToggle.click(); // Original menu handler remains the source of truth.
      }
    });

    // The legacy outside-click handler covers <=768px. Complete the 769–980px
    // tablet range introduced by the new responsive menu.
    document.addEventListener('click', (event) => {
      if (window.innerWidth <= 768 || !mobileQuery.matches) return;
      if (!navMenu.classList.contains('active')) return;
      if (navMenu.contains(event.target) || navToggle.contains(event.target)) return;
      navMenu.classList.remove('active');
      navToggle.classList.remove('active');
      document.body.style.overflow = '';
      syncMenuState();
    });

    window.addEventListener('resize', () => {
      if (!mobileQuery.matches && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        document.body.style.overflow = '';
      }
      syncMenuState();
    }, { passive: true });

    // Observe only the class state of the menu. No animation polling.
    const menuObserver = new MutationObserver(syncMenuState);
    menuObserver.observe(navMenu, { attributes: true, attributeFilter: ['class'] });
    syncMenuState();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFutureCore, { once: true });
  } else {
    initFutureCore();
  }
})();
