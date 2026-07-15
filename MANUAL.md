# FRAT — Manual del sitio web

Guía completa para entender, editar y mantener el sitio **FRAT — Creative Experiences Lab**.
Léela antes de tocar nada. Está pensada para que cualquier persona pueda continuar el
trabajo sin perderse.

---

## 0. Qué es este proyecto

Un sitio web **estático** (HTML + CSS + JavaScript puro, sin frameworks ni "build").
No necesita instalar nada para funcionar: son archivos que el navegador abre directamente.

- **HTML** → el contenido y la estructura de cada página.
- **`styles.css`** → todo el diseño (un solo archivo compartido por todas las páginas).
- **`app.js`** → el comportamiento (menú, animaciones, carruseles, normalización de logos, botón "subir").

---

## 1. Cómo ver la web en tu computador

> ⚠️ **IMPORTANTE:** NO abras los `.html` haciendo doble clic (modo `file://`).
> Varias funciones (carruseles de marcas, normalización de logos) usan lectura de
> imágenes por canvas y **el navegador las bloquea en `file://`**. Debes usar un
> **servidor local** (muy fácil, gratis). Con servidor todo funciona igual que en producción.

### Opción A — VS Code + Live Server (la más fácil y recomendada)
1. Instala **Visual Studio Code** (gratis): https://code.visualstudio.com
2. Ábrelo → menú Extensiones → busca **"Live Server"** (de Ritwick Dey) → Instalar.
3. `Archivo → Abrir carpeta…` y elige la carpeta del proyecto.
4. Clic derecho sobre `index.html` → **"Open with Live Server"**.
5. Se abre en el navegador en `http://127.0.0.1:5500`. Al guardar cualquier archivo, se recarga solo.

### Opción B — Servidor incluido (Windows, sin instalar nada)
El proyecto trae un mini-servidor en PowerShell:
- Abre PowerShell en la carpeta del proyecto y ejecuta:
  ```powershell
  powershell -NoProfile -ExecutionPolicy Bypass -File .claude/server.ps1
  ```
- Abre el navegador en `http://localhost:5577`.

---

## 2. Estructura de carpetas

```
IA/
├── index.html                 ← Home (página principal)
├── lab.html                   ← Selector de servicios (Events/Artelier/4U/XP)
├── lab-events.html            ← Página de servicio: Events
├── lab-artelier.html          ← Página de servicio: Artelier
├── lab-4u.html                ← Página de servicio: 4U
├── lab-xp.html                ← Página de servicio: XP
├── work.html                  ← Galería de proyectos (con filtro por categoría)
├── contact.html               ← Contacto
├── proyecto-*.html            ← 6 páginas de detalle de proyecto
│
├── styles.css                 ← TODO el diseño (una sola hoja de estilos)
├── app.js                     ← TODO el JavaScript (interacción y animaciones)
├── design-tokens.json         ← Referencia de colores/tipografía (documentación)
├── components.json            ← Inventario de componentes (documentación)
│
├── fonts/                     ← Fuente Inter (local)
│   └── Inter-Variable.ttf
│
├── assets/
│   ├── logo-white.png         ← Logo FRAT (perrito) blanco
│   ├── logo-black.png         ← Logo FRAT negro
│   ├── imgs/
│   │   ├── IMAGENES.md        ← LISTA MAESTRA de todas las imágenes del sitio
│   │   └── home/              ← Imágenes de la Home (hero, credenciales, this-is-frat…)
│   └── brands/                ← Logos "Friends & Family" (74) en 3 categorías:
│       ├── CONSUMO/           · Recurso NNN.webp
│       ├── CORPORACIONES/     · Recurso NNN.webp
│       └── RETAIL/            · Recurso NNN.webp
│
├── proyectos/                 ← SISTEMA ESCALABLE de proyectos (ver §6)
│   ├── README.md              ← Cómo añadir un proyecto nuevo
│   ├── _PLANTILLA/            ← Plantilla para copiar
│   └── <slug>/
│       ├── images/            ← imágenes de ese proyecto
│       └── project.md         ← datos de ese proyecto
│
└── refs/                      ← Capturas de referencia del diseño original (NO se publican)
```

---

## 3. Reglas de diseño (IMPORTANTES — no romper la identidad)

- **Paleta monocroma**: solo negro, blanco y grises. **Prohibido dorado/amarillo** u otros colores.
  Para resaltar se usan recursos tipográficos como `< contenido >`, nunca color.
- **Tipografía**: Inter (local, en `fonts/`). Títulos SemiBold, textos Light, tracking relajado.
  El wordmark "Frat" del hero es Inter Bold sólido (blanco 100%).
- **Nunca inventar fotos**: donde no hay imagen se usa un placeholder gris (`.ph`) con su
  etiqueta. Al llegar el archivo real se reemplaza (ver §4 y §5).
- Los valores exactos (colores, tamaños) están documentados en **`design-tokens.json`**.

---

## 4. Cómo cambiar TEXTOS

Abre el `.html` correspondiente y edita el texto entre las etiquetas. Ejemplo en `index.html`:
```html
<p class="lead-strong">en FRAT transformamos ideas en experiencias memorables</p>
```
> Guarda el archivo **siempre en codificación UTF-8** (para que tildes y ñ no se dañen).
> VS Code lo hace por defecto. **No edites con el Bloc de notas en ANSI ni con scripts de PowerShell**
> (dañan los acentos → "mojibake").

---

## 5. Cómo cambiar IMÁGENES

Toda imagen tiene un **nombre fijo** y una **ubicación fija**. La lista completa está en
**`assets/imgs/IMAGENES.md`** (lugar · archivo · descripción · dimensiones sugeridas).

Regla general: los placeholders en el HTML muestran el **nombre de archivo exacto** que va ahí.
Por ejemplo, en una página de proyecto verás:
```html
<div class="ph img" data-label="hero.webp"></div>
```
Eso significa: coloca `hero.webp` en la carpeta `images/` de ese proyecto y reemplaza ese
`<div class="ph">` por:
```html
<img class="img" src="proyectos/<slug>/images/hero.webp" alt="..." />
```

### Home (`assets/imgs/home/`)
| Archivo | Dónde aparece |
|---|---|
| `fondo_home_1.webp` | Fondo del hero a pantalla completa |
| `this-is-frat.webp` | Foto de la sección "This is Frat" |
| `credencial-01…05.webp` | 5 tarjetas de Credenciales |
| `labfrat-default.webp` | Preview LAB FRAT por defecto |
| `labfrat-events / -artelier / -xp / -4u.webp` | Preview al pasar el cursor por cada servicio |

- Formato recomendado: **.webp** (o .jpg). Respeta las **dimensiones/proporción** de `IMAGENES.md`.
- Consejo: guarda la imagen con el **nombre exacto** y **sobrescribe** la anterior. Listo.
- Si al reemplazar una imagen no se actualiza en el navegador, haz **Ctrl + F5** (limpia caché).

---

## 6. Marcas "Friends & Family" (los 3 carruseles de la Home)

Los 74 logos viven en `assets/brands/` divididos en 3 categorías (= 3 carruseles):

| Carrusel (fila) | Carpeta | Contenido |
|---|---|---|
| 1 | `CONSUMO/` | Consumo masivo / bebidas / alimentos (F&B) |
| 2 | `CORPORACIONES/` | Corporativo, institucional, banca, salud, gobierno |
| 3 | `RETAIL/` | Retail, moda, música, cultura, entretenimiento |

### Añadir / quitar una marca
1. Coloca el logo (**PNG o WebP, blanco, fondo transparente**) en la carpeta de su categoría.
2. En `index.html`, dentro de la fila correspondiente, agrega un slot:
   ```html
   <span class="brand-slot"><img src="assets/brands/CONSUMO/mi-logo.webp" alt="" loading="lazy" /></span>
   ```
   (o duplica uno existente y cambia el `src`). El carrusel se reconstruye solo.

### Tamaño de los logos (compensación óptica) — **importante**
No tienes que preocuparte por que cada logo tenga el mismo tamaño de archivo. `app.js`
**recorta el espacio transparente y escala cada logo a una "masa visual" equivalente**
automáticamente. Todo logo nuevo se equilibra solo al cargar.

Si algún logo específico se ve un poco pequeño o grande, se ajusta en `app.js`, en el objeto
**`BOOSTS`** (busca "COMPENSACIÓN ÓPTICA"). Cada línea es:
```js
'CATEGORIA-NUMERO': 1.30,   // multiplicador de ÁREA (1.0 = normal; >1 = un poco más grande)
```
Ejemplo: `'CONSUMO-161': 1.18` hace a Pepsi un 18% más de área. Sube/baja ese número con sutileza (1.15–1.4).

---

## 7. Sistema de PROYECTOS (Work) — escalable

Cada proyecto es una **carpeta autónoma** dentro de `proyectos/`. Para crear uno nuevo,
lee **`proyectos/README.md`** (tiene el detalle). En resumen:

```
proyectos/
└── nombre-del-proyecto/
    ├── images/        ← hero.webp, card.webp, gal-01.webp…, (trofeo.webp si aplica)
    └── project.md     ← todos los datos (título, marca, categoría, meta, textos, galería)
```

- `project.md` contiene el título, la marca, la categoría (para el filtro de Work), los datos
  C/T/L/A, los párrafos "About", y la lista de imágenes de la galería **con sus dimensiones sugeridas**.
- Con esa carpeta se genera la página `proyecto-<slug>.html` y su tarjeta en `work.html`
  (mismo diseño que los demás). Copia `_PLANTILLA/` para empezar.

---

## 8. Errores comunes a EVITAR

1. **Abrir con doble clic (`file://`)** → los carruseles/logos fallan. Usa servidor (§1).
2. **Editar en codificación que no sea UTF-8** → se dañan tildes y ñ.
3. **Cambiar nombres de archivos de imagen** sin actualizar el HTML → imagen rota.
4. **Meter color** (dorado/amarillo/etc.) → rompe la identidad monocroma.
5. **Logos de marca en color u oscuros** → no se ven sobre el fondo negro (deben ser blancos/transparentes).
6. **No hacer Ctrl + F5** tras reemplazar una imagen → ves la versión vieja en caché.
7. **Borrar `fonts/` o `assets/logo-white.png`** → se rompe la tipografía o el logo.

---

## 9. Cómo compartir la carpeta para trabajar en equipo (gratis)

### Opción rápida (para enviar una copia)
Comprime la carpeta en un **ZIP** y súbela a **Google Drive** o **WeTransfer** (gratis).
La otra persona la descarga, la abre en VS Code y usa Live Server (§1). Pesa ~37 MB.

### Opción recomendada para COLABORAR (control de versiones, gratis)
Usa **GitHub** — permite que varias personas trabajen sin pisarse y guarda el historial:
1. Crea una cuenta en https://github.com (gratis).
2. Instala **GitHub Desktop** (https://desktop.github.com) — no requiere usar la terminal.
3. En GitHub Desktop: `File → Add local repository…` → elige esta carpeta →
   "create a repository" → **Publish** (puede ser privado).
4. Invita a la otra persona en la web de GitHub: repo → *Settings → Collaborators*.
5. Cada quien "Fetch/Pull" antes de trabajar y "Commit + Push" al terminar.

> Sugerencia: crea un archivo `.gitignore` con `refs/` si no quieres subir las capturas
> de referencia (no son necesarias para que el sitio funcione).

---

## 10. Publicar el sitio en internet (gratis, opcional)

Al ser estático, se publica gratis arrastrando la carpeta a:
- **Netlify Drop** → https://app.netlify.com/drop (arrastra la carpeta, listo, URL al instante).
- **GitHub Pages** (si ya usas GitHub) → repo → *Settings → Pages*.
- **Cloudflare Pages** / **Vercel** (conectando el repo de GitHub).

---

## 11. Archivos de referencia dentro del proyecto

- `assets/imgs/IMAGENES.md` → lista maestra de imágenes.
- `proyectos/README.md` → cómo añadir proyectos.
- `design-tokens.json` → colores y tipografía exactos.
- `components.json` → inventario de componentes y de qué captura se replicaron.
- `refs/` → capturas del diseño original (solo referencia; no se publican).

Ante la duda: **no borres nada, no metas color, edita en UTF-8 y prueba siempre con servidor.**
