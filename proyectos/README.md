# Proyectos — sistema escalable de páginas

Cada proyecto de la sección **Work** es una **carpeta autónoma** que contiene todo lo
necesario para generar su página. Para añadir un proyecto nuevo basta con entregar:

```text
proyectos/
└── nombre-del-proyecto/
    ├── images/        ← todos los recursos visuales del proyecto
    └── project.md     ← todos los datos para rellenar la plantilla
```

Con esa carpeta yo puedo, sin configuración extra:
1. Leer `project.md`.
2. Detectar las imágenes de `images/`.
3. Rellenar la plantilla de página (idéntica al resto de proyectos).
4. Generar `proyecto-<slug>.html` en la raíz del sitio.
5. Añadir la tarjeta en `work.html` con su filtro de categoría.

---

## Reglas

- **slug**: minúsculas, sin acentos ni espacios, separado por guiones
  (ej. `corona-sunsets`). Es el nombre de la carpeta y del archivo
  `proyecto-<slug>.html`.
- **images/**: rutas referenciadas en `project.md` son relativas a `images/`.
  Formato recomendado `.webp` (logos de marca `.png` transparente).
- **project.md**: front-matter YAML (datos) + cuerpo Markdown (textos).

### Dimensiones sugeridas de imágenes
| Recurso | Proporción | Mínimo sugerido |
|---|---|---|
| `hero` (full-bleed) | H 2:1 | 2400×1200 |
| galería vertical | V 5:6 | 900×1080 |
| galería vertical alta | V 2:3 | 900×1350 |
| galería horizontal ancha | H 2:1 | 2000×1000 |
| card de Work | H 3:2 | 1200×800 |
| trofeo / award | H ~7:6 | 900×780 |
| logo de marca | H libre | 600×200 (PNG transp.) |

---

## Esquema de `project.md`

```yaml
---
slug: nombre-del-proyecto          # carpeta + proyecto-<slug>.html
title: "Nombre del **Proyecto**"   # ** ** = palabra(s) en bold/blanco
brand: NombreMarca                 # wordmark (texto) o brand-logo.png en images/
category: events                   # events | artelier | 4u | xp  (filtro de Work)
meta:
  C: Cliente
  T: Tipo                          # Festival, Concierto, Activación, Branding…
  L: Lugar                         # Medellín, Colombia, Med:Clo:Bog…
  A: 2025                          # Año
hero: hero.webp                    # imagen principal (en images/)
work_card:
  image: card.webp                 # imagen de la tarjeta en work.html
  label: "Marca · 2025"            # texto secundario de la tarjeta
awards:                            # OPCIONAL — borrar el bloque si no aplica
  image: trofeo.webp
  title: Awards
  description: "Texto del premio."
  badge: "Ganadores Effie Oro"
gallery:                           # orden = orden de aparición
  - { image: gal-01.webp, slot: g-a }   # slots: ver más abajo
  - { image: gal-02.webp, slot: g-b }
---

## About the project

Primer párrafo del proyecto.

Segundo párrafo del proyecto.
```

### Slots de galería (masonry de 12 columnas)
| slot | Posición | Forma |
|---|---|---|
| `g-a` | col 1–4, ocupa 2 filas | vertical alta |
| `g-b` | col 5–8 | horizontal |
| `g-c` | col 9–11 | horizontal |
| `g-d` | col 5–11 | ancha |
| `g-e` | col 1–3 | vertical |
| `g-f` | col 4–6 | vertical |
| `g-g` | col 7–9 | vertical |
| `g-full` | ancho completo | banda ancha |

**Layout estándar (4 imágenes):** `g-e`, `g-f`, `g-g`, `g-full`.
**Layout amplio (7 imágenes, ej. Corona):** `g-a` … `g-g`.

> Si `images/` contiene `brand-logo.png`, se usa como wordmark de marca en lugar
> del texto de `brand`. Si no hay `awards`, esa sección se omite en la página.
