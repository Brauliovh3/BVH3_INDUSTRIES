# BVH3 · Retrato 3D · Carpeta de modelos

Esta carpeta está preparada para la **carga automática** del avatar VRM en `/retrato-3d.html`.

## Coloca aquí el archivo original

Ruta exacta dentro de GitHub:

```
BVH3_INDUSTRIES/
├── retrato-3d.html
└── models/
    ├── README.md
    └── 8665009645295209918.vrm   ← Colocar aquí
```

**Pasos:**
1. Abre la carpeta `models` en GitHub.
2. Selecciona **Add file → Upload files**.
3. Sube el archivo **8665009645295209918.vrm** original, sin renombrarlo ni modificarlo.
4. Confirma los cambios en `main` (puedes usar el mensaje `UPDATE`).
5. Cuando termine el despliegue de Vercel, abre `https://www.bvh3-industries.com/#retrato-3d`. El escenario se abrirá **automáticamente al entrar en la sección**, sin botones extra ni un panel introductorio.

El visor solicitará `/models/8665009645295209918.vrm` y, si está disponible, Miku se cargará por sí sola, aparecerá caminando por la nueva **pasarela sólida** y se detendrá en pose Idle. También puedes seleccionar el escenario holográfico anterior.

Si el archivo no se encuentra, el visor conserva la importación manual y los personajes de muestra, sin bloquear la web.

**Importante:** este commit no contiene el binario .vrm; se deja la ruta, el código y la carpeta listos para que lo subas.

## Expresiones adaptadas

El archivo VRM original tiene estos nombres de expresiones VRM 0.x: Neutral, Angry, Fun, Joy, Sorrow y Surprised. El visor busca esos nombres y sus equivalentes comunes (happy, relaxed, sad) en el mapa real cargado y desactiva los botones de expresiones ausentes. La boca y el parpadeo utilizan los nombres disponibles en ese mapa.

## Licencia y crédito

- Título del modelo: **Hatsune Miku!**
- Autor: **RemiX3**
- Fuente: https://hub.vroid.com/characters/3414801470945035921/models/4457759225556181866
- Condiciones de licencia incluidas en el VRM original: crédito obligatorio, uso no comercial, prohibida la modificación, redistribución permitida.

**Comprueba que el uso que pretendes hacer en la web de BVH3 sea no comercial y cumpla todos los términos antes de publicar el modelo**, especialmente por tratarse de una marca/proyecto empresarial. El código de esta mejora no incluye ni modifica el archivo.

## Rendimiento y compatibilidad

- La página principal solo inicia el visor al pulsar el botón. Cuando cambias de sección, destruye su iframe para detener WebGL.
- Android utiliza menos partículas, menos sombras y menor resolución de render.
- En escenario sólido no se actualizan partículas del escenario holográfico oculto.
- Se conservan el backend (si lo hubiera), Depool, Zona Prohibida, descargas y formularios sin modificaciones.

**Pruebas recomendadas:** carga automática al desplegar el VRM, escena 3D en Chrome/Edge PC y Android, entrada caminando, botones de expresión/poses, reinicio al cambiar de personaje, selección de escenario y liberación de GPU al salir.

## Ajuste de interfaz y suelo (noviembre 2026)

- Se eliminó el panel introductorio grande de «Miku en otra dimensión»; ahora aparece directamente el escenario 3D ocupando la sección.
- Un encabezado pequeño BVH3 conserva el acceso a **Reiniciar visor** y **Pantalla completa**.
- La pasarela es geometría fija independiente del avatar. Los pies se anclan al plano superior del suelo incluso durante la caminata; la cámara no comienza girando sola en este escenario.
- El modelo se inicializa en pose neutral con brazos abajo antes de entrar caminando; se evita heredar una pose anterior de gravedad cero.
- Se añade una sombra de contacto discreta que acompaña al avatar sobre la superficie sin mover el piso.
- Al salir de 3D Retrato se libera el iframe y se detiene su contexto WebGL.
- La licencia del avatar sigue siendo independiente de las modificaciones al visor.
