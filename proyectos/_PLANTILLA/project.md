---
# PLANTILLA — copia esta carpeta, renómbrala con el slug y rellena los campos.
# Borra los comentarios que no necesites. Ver /proyectos/README.md para el detalle.

slug: nombre-del-proyecto          # carpeta + proyecto-<slug>.html (sin acentos ni espacios)
title: "Nombre del **Proyecto**"   # ** ** marca la(s) palabra(s) en bold/blanco
brand: NombreMarca                 # texto del wordmark, o coloca images/brand-logo.png
category: events                   # events | artelier | 4u | xp  (filtro de Work)
meta:
  C: Cliente
  T: Tipo                          # Festival / Concierto / Activación / Branding / Experiencia
  L: Lugar                         # Medellín / Colombia / Med:Clo:Bog
  A: 2025
hero: hero.webp                    # H 2:1 · 2400×1200 (full-bleed)
work_card:
  image: card.webp                 # H 3:2 · 1200×800 (tarjeta en work.html)
  label: "Marca · 2025"
# awards:                          # OPCIONAL — descomenta si el proyecto tiene premio
#   image: trofeo.webp             # H ~7:6 · 900×780
#   title: Awards
#   description: "Texto del premio."
#   badge: "Ganadores Effie Oro"
gallery:                           # medidas por slot (ver tabla en /proyectos/README.md):
  - { image: gal-01.webp, slot: g-e }   # V 5:6 · 900×1080
  - { image: gal-02.webp, slot: g-f }   # V 5:6 · 900×1080
  - { image: gal-03.webp, slot: g-g }   # V 5:6 · 900×1080
  - { image: gal-04.webp, slot: g-full } # H 2:1 · 2000×1000 (ancha)
# Otros slots disponibles: g-a (V 2:3 · 900×1350) · g-b/g-c (H 4:3 · 1000×750) · g-d (H 2:1 · 2000×1000)
---

## About the project

Primer párrafo: contexto, objetivo y rol de FRAT en el proyecto.

Segundo párrafo: resultado, impacto y diferenciación.
