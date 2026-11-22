/* BVH3 // RETRATO 3D
 * Lazy-load and release the independent viewer. The existing CyberpunkPortfolio
 * owns navigation, hashes, menus, Depool secrets and all other page state.
 */
(() => {
  'use strict';

  const setupPortrait = () => {
    const section = document.getElementById('retrato-3d');
    const start = document.getElementById('portrait-start');
    const stop = document.getElementById('portrait-stop');
    const placeholder = document.getElementById('portrait-placeholder');
    const host = document.getElementById('portrait-frame-host');
    if (!section || !start || !stop || !placeholder || !host) return;

    let viewer = null;

    const release3D = () => {
      if (!viewer) return;
      // Removing the iframe releases its WebGL context, animation loop and
      // imported local-file blob from this independent viewer document.
      viewer.remove();
      viewer = null;
      host.replaceChildren();
      placeholder.hidden = false;
      placeholder.style.display = '';
      stop.hidden = true;
      start.disabled = false;
      start.textContent = 'INICIAR RETRATO 3D ↗';
    };

    const mount3D = () => {
      if (viewer || !section.classList.contains('active')) return;
      if (!('WebGLRenderingContext' in window)) {
        placeholder.querySelector('p').textContent =
          'Tu navegador no ofrece WebGL. Utiliza Chrome o Edge actualizado para ver el retrato 3D.';
        return;
      }
      const iframe = document.createElement('iframe');
      iframe.title = 'BVH3 Retrato 3D de Miku, escenario interactivo';
      iframe.src = 'retrato-3d.html';
      iframe.loading = 'eager';
      iframe.setAttribute('allow', 'fullscreen');
      iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
      viewer = iframe;
      host.appendChild(iframe);
      placeholder.hidden = true;
      placeholder.style.display = 'none';
      stop.hidden = false;
      start.disabled = true;
      start.textContent = 'VISOR ACTIVO';
    };

    start.addEventListener('click', mount3D);
    stop.addEventListener('click', release3D);

    // Navigation may hide this section via classes without a page reload.
    // Avoid leaving an expensive WebGL renderer running in the background.
    const observer = new MutationObserver(() => {
      if (!section.classList.contains('active')) release3D();
    });
    observer.observe(section, {attributes: true,attributeFilter:['class']});

    window.addEventListener('pagehide', release3D);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupPortrait, {once:true});
  } else {
    setupPortrait();
  }
})();