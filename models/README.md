# Avatar VRM original

**Archivo esperado:** `models/8665009645295209918.vrm`

El visor `/retrato-3d.html` busca automáticamente esa ruta. Si no existe, muestra el escenario y permite cargar el archivo `.vrm` desde el dispositivo del visitante, sin transmitirlo al servidor.

El archivo original compartido en esta conversación ocupa aproximadamente **16,9 MiB**. No está adjuntado a este repositorio porque la integración de GitHub utilizada para estas modificaciones solo permite crear archivos de texto; la carga de binarios se realiza por otro medio.

## Publicación opcional del modelo

Sube el archivo original, sin modificar, al directorio `models/` con el nombre exacto `8665009645295209918.vrm`. GitHub lo publicará en el siguiente despliegue de Vercel y el visor lo cargará automáticamente.

Importante: antes de publicarlo como recurso de una web empresarial, verifica que el uso que pretendes hacer esté permitido por el autor.

## Crédito y licencia del archivo proporcionado

- **Título:** Hatsune Miku!
- **Autor del archivo VRM:** RemiX3
- **Fuente:** https://hub.vroid.com/characters/3414801470945035921/models/4457759225556181866
- **Condiciones declaradas en el VRM:** atribución obligatoria; redistribución permitida; modificaciones prohibidas; uso comercial personal o corporativo no permitido.

Se conserva el modelo original sin alteraciones. La página demuestra un visor técnico, no una cesión de derechos sobre el personaje o su modelo.

## Rendimiento

Para PC y Android se ha aislado el visor dentro de un iframe que solo se crea al pulsar **Iniciar Retrato 3D**. Al salir de la sección se elimina el iframe, lo que detiene el render 3D. En Android se reduce la resolución de render, las sombras y el número de partículas.

Dependencias del visor original (cargadas solo cuando se abre): Three.js r160, three-vrm, Tailwind CDN, Lucide.

## Pruebas antes de publicar

1. Abrir `/#retrato-3d` directamente y desde el navbar, tanto en PC como en Android.
2. Pulsar **Iniciar Retrato 3D**: comprobar que aparece el escenario y no hay errores de JavaScript.
3. Si el archivo VRM está alojado, comprobar que aparece el avatar Miku exacto. Si no, probar el botón **Cargar mi VRM** usando el archivo local.
4. Probar poses, expresiones, controles de cámara, iluminación y modo inmersivo.
5. Salir a otras secciones, comprobar que el iframe desaparece y que Depool, la Zona Prohibida, los formularios y las descargas siguen funcionando.
6. Verificar rendimiento y controles táctiles con un dispositivo Android real.

**Rollback:** revertir los cambios de `index.html` y borrar `retrato-3d-section.js`, `retrato-3d.css` y `retrato-3d.html`; los scripts y estilos previos no han sido alterados.
