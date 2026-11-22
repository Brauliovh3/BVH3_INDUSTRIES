# BVH3 INDUSTRIES 3.0 · Future Core

Capa visual opcional para el portafolio existente. **No reemplaza el motor de navegación, el desbloqueo de la Zona Prohibida, el CMD de Depool, las descargas ni los formularios.**

## Archivos

- `future-core.css`: nuevo sistema de diseño, estilos por sección y layouts responsive.
- `future-core.js`: botones del hero y accesibilidad del menú móvil, reutilizando los eventos del menú original.
- `index.html`: enlaza los archivos, incorpora dos botones en Inicio y actualiza metadatos del dominio oficial.
- `script.js`: único ajuste al sistema previo, omitir las partículas decorativas en pantallas de hasta 700 px o con ahorro de datos.

## Pruebas manuales obligatorias antes de fusionar

1. **PC 1920×1080 / 1366×768:** navegación completa, ausencia de scroll horizontal, tipografía y tarjetas.
2. **Tablet 820×1180 / 768×1024:** abrir/cerrar menú, cerrar tocando fuera, pasar a otra sección.
3. **Android 360×800 / 390×844 / 412×915:** botones principales, tarjetas en una columna, campos táctiles, orientación vertical y horizontal.
4. **Navegación:** Inicio → Proyectos → Ver detalles → Volver, Aplicaciones, Habilidades, Perfil, Recuerdos y Contacto. Comprobar volver/adelante y enlaces directos.
5. **Recuerdos:** abrir imagen y video, cerrar el visor y verificar que se detenga la reproducción.
6. **Aplicaciones/Proyectos:** verificar enlaces de descargas y botones actuales; la renovación no debe cambiar destinos.
7. **Contacto:** probar las dos opciones de envío y validar los campos obligatorios, sin enviar datos de prueba reales a terceros.
8. **Depool:** probar holograma, tarjetas y zona CMD existente. El desbloqueo de la Zona Prohibida debe conservarse tal cual y seguir oculto por defecto.
9. **Zona Prohibida:** probar acceso y modales con la configuración original, sin publicar contraseñas en la incidencia o PR.
10. **Accesibilidad:** Tab, Enter, Escape, foco visible, `prefers-reduced-motion`; menú accesible con teclado.
11. **Rendimiento:** en Chrome DevTools (CPU lenta / red móvil), contrastar LCP, INP y CLS con la rama main. Revisar uso de batería en Android real.

## Diseño y seguridad

- Los estilos nuevos están acotados a `body.bvh3-future-core`; no se han borrado las reglas antiguas.
- Los componentes creados por `script.js` mantienen sus identificadores y los manejadores de eventos existentes.
- No se incorporan dependencias ni servicios nuevos para Vercel.
- Las partículas del fondo se omiten en móviles pequeños para ahorrar CPU/GPU, sin tocar los Canvas interactivos de Depool.

## Revertir

Antes de fusionar basta con cerrar el PR. Después de fusionar, revertir el commit del PR en GitHub. Para desactivar solo el aspecto visual, quitar `class="bvh3-future-core"` del body y el enlace a `future-core.css`; los archivos antiguos siguen presentes.

**Nota:** Los controles estáticos sobre la fuente no sustituyen una prueba real de navegador y dispositivo. Desplegar primero en la URL Preview de Vercel asociada al PR, si la integración está habilitada.
