/* BVH3 INDUSTRIES // MIKU STAGE
 * La sección es el visor: cargar al entrar, liberar GPU al salir.
 * El portafolio, Depool y la navegación base permanecen intactos.
 */
(() => {
  'use strict';

  const setupPortrait = () => {
    const section = document.getElementById('retrato-3d');
    const restart = document.getElementById('portrait-start');
    const stop = document.getElementById('portrait-stop');
    const placeholder = document.getElementById('portrait-placeholder');
    const host = document.getElementById('portrait-frame-host');
    if (!section || !restart || !stop || !placeholder || !host) return;

    let viewer = null;

    const release3D = () => {
      if (viewer) {
        // El iframe es dueño de su WebGL y su RAF: desmontarlo detiene ambos.
        viewer.remove();
        viewer = null;
      }
      host.replaceChildren();
      placeholder.hidden = false;
      placeholder.style.display = '';
      stop.hidden = true;
      restart.disabled = false;
      restart.textContent = 'INICIAR VISOR ↗';
    };

    const mount3D = () => {
      if (viewer || !section.classList.contains('active')) return;
      const status = placeholder.querySelector('strong');
      const description = placeholder.querySelector('p');
      if (!('WebGLRenderingContext' in window)) {
        if (status) status.textContent = 'WEBGL NO DISPONIBLE';
        if (description) description.textContent =
          'Actualiza Chrome, Edge o Firefox y activa la aceleración gráfica para abrir el escenario 3D.';
        placeholder.hidden = false;
        return;
      }
      if (status) status.textContent = 'INICIANDO ESCENARIO 3D';
      if (description) description.textContent = 'Preparando la pasarela y el avatar de Miku...';

      const iframe = document.createElement('iframe');
      iframe.title = 'Escenario BVH3 Miku: avatar VRM en pasarela 3D';
      iframe.src = 'retrato-3d.html';
      iframe.loading = 'eager';
      iframe.setAttribute('allow', 'fullscreen');
      iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
      iframe.addEventListener('load', () => {
        if (viewer === iframe) {
          placeholder.hidden = true;
          placeholder.style.display = 'none';
        }
      }, { once: true });
      viewer = iframe;
      host.appendChild(iframe);
      stop.hidden = false;
      restart.textContent = 'REINICIAR VISOR ↻';
    };

    restart.addEventListener('click', () => {
      if (viewer) release3D();
      mount3D();
    });
    stop.addEventListener('click', () => {
      release3D();
      const status = placeholder.querySelector('strong');
      const description = placeholder.querySelector('p');
      if (status) status.textContent = 'VISOR EN PAUSA';
      if (description) description.textContent = 'Pulsa INICIAR VISOR para abrir de nuevo el escenario.';
    });

    // Respetar los cambios de sección del portfolio existente.
    // El cambio de clase es el origen de verdad, también para URLs directas.
    const syncVisibility = () => {
      if (section.classList.contains('active')) mount3D();
      else release3D();
    };
    const observer = new MutationObserver(syncVisibility);
    observer.observe(section, { attributes: true, attributeFilter: ['class'] });
    syncVisibility();
    window.addEventListener('pagehide', release3D);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupPortrait, { once: true });
  } else setupPortrait();
})();
