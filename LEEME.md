# Kagura

Sitio de streaming de anime. Diseño combinado: **la arquitectura del repo v0
(`MunZh3vi/webcodejlkej`) sobre el sistema de diseño documentado en
`../guia-estilos-sugoitv-v2.html`** (SugoiTV / Anikitty).

Abre `index.html` con doble clic. No necesita servidor ni build.

---

## Estructura

```
kagura/
  index.html        Inicio — hero rotatorio, banda de señal, carruseles,
                    listas rankeadas, géneros, rejilla 2→7
  nuevos.html       Novedades — últimos episodios (16:9 con progreso),
                    estrenos, próximamente, añadidas al catálogo
  tendencias.html   Populares — podio del día, ranking completo, listas
                    con variante de acento
  generos.html      Géneros — destacado, rejilla con hue por índice,
                    resultados ordenables    (?g=Fantasía)
  buscar.html       Búsqueda con filtros de formato / estado / género
  calendario.html   Parrilla semanal de emisión, hoy resaltado
  mi-lista.html     Biblioteca — continuar viendo, pestañas, historial
  perfil.html       Cuenta — estadísticas, actividad, preferencias
  anime.html        Ficha de serie                (?id=frieren)
  watch.html        Reproductor                   (?id=frieren&ep=7)

  assets/
    kagura.css      Sistema: tokens, superficies, chrome, componentes
    pages.css       Componentes propios de cada pantalla
    data.js         Catálogo compartido (títulos + pósters de /images)
    kagura.js       Chrome inyectado + helpers + comportamiento

  images/           Pósters y banners (231 archivos)
  fonts/            geist-sans.woff · NightinTokyo.ttf
```

El repo es **autocontenido**: imágenes y fuentes viven dentro. No hay rutas
que salgan de esta carpeta, así que se puede servir tal cual desde la raíz de
GitHub Pages.

---

## Cómo añadir cosas

**Una serie** → `assets/data.js`, un objeto en `A`:

```js
clave: {t:"Título", p:"bx000-xxx.jpg", b:"000-yyy.jpg", f:"TV",
        y:2026, s:88, eps:12, st:"Emitiendo", st2:"airing",
        g:["Acción"], studio:"Estudio", live:true, d:"Sinopsis."}
```
`p` = póster, `b` = banner (opcional). Ambos relativos a `images/`.

**Un carrusel** en cualquier página → un `<section>` con `data-row`:

```html
<section class="wrap" data-row='{"title":"Mi fila","sub":"Subtítulo",
  "items":["frieren","onepiece"]}'></section>
```

**Una página nueva** → copia el esqueleto de `calendario.html`, cambia
`data-page` en el `<body>` y define `pageInit()`. El header, el pie, la barra
inferior y la búsqueda los pone `kagura.js` solo.

**Un enlace de navegación** → `NAV` / `BOTTOM` / `FOOTER_COLS` en `kagura.js`.

---

## Reglas del sistema (no romper)

- **Tokens HSL sin envolver.** `--background: 0 0% 0%` se consume como
  `hsl(var(--background))` y acepta alpha al vuelo: `hsl(var(--background)/.8)`.
- **El acento es un triplete RGB**, no HSL: `rgb(var(--home-accent)/.3)`.
  Uno solo gobierna glows, barras del reproductor y estados activos.
  Se cambia desde el header y se guarda en `localStorage`.
- **El color por índice no se declara.** `--genre-index × 47°`,
  `--signal-index × 54°`. Si un componente usa `var(--genre-hue)`, tiene que
  definirlo en su propia clase: si queda vacío, CSS tira la declaración
  `background` **entera**, no sólo ese color.
- **Blur sólo en lo que flota** sobre contenido que se mueve (header, barra
  inferior, búsqueda, chrome de watch). Una tarjeta en el flujo usa
  `.site-panel`, sin blur.
- **La sombra firma es `inset 0 1px 0` blanco.** Sin ese canto iluminado todo
  el UI se ve plano.
- **Nada de disco de play en el hover de póster.** Es un antipatrón descartado:
  tapa el título y compite con el zoom. La capa de hover se deja vacía como
  punto de anclaje.
- **El hover de póster son tres capas con duraciones distintas** a propósito:
  tarjeta −4px (.25s), imagen ×1.05 (.38s), anillo .09→.15 (.25s). Si las
  igualas el efecto se vuelve plano.
- **`lvh`, no `vh`,** en la altura del hero: con `vh` rebota al ocultarse la
  barra de direcciones en iOS.
- **Nunca separes del header con píxeles sueltos.** Usa `--nav-total-height`.

---

## Dos trampas que ya costaron caro

1. **`url()` dentro de una custom property** se resuelve contra la hoja que la
   consume (`assets/`), no contra el documento. Las artes de fondo van en un
   elemento real con `style="background-image:url(…)"`, nunca por `--var`.
2. **`grid-template-columns: 1fr`** deja que el contenido estire la columna.
   Usa siempre `minmax(0,1fr)` si dentro hay texto con `white-space:nowrap`
   o carruseles.
