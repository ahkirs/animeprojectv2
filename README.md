# Kagura

Sitio de streaming de anime — estático, sin build ni dependencias.

**En vivo:** https://ahkirs.github.io/animeprojectv2/

## Correr en local

Doble clic en `index.html`. No hace falta servidor.

Si prefieres servirlo (recomendado para probar rutas tal cual salen en Pages):

```bash
python -m http.server 8000
# http://localhost:8000
```

## Páginas

| Archivo | Pantalla |
|---|---|
| `index.html` | Inicio — hero rotatorio, carruseles, rankings |
| `nuevos.html` | Novedades — últimos episodios, estrenos, próximamente |
| `tendencias.html` | Populares — podio del día y ranking completo |
| `generos.html` | Géneros (`?g=Fantasía`) |
| `buscar.html` | Búsqueda con filtros |
| `calendario.html` | Parrilla semanal de emisión |
| `mi-lista.html` | Biblioteca y historial |
| `perfil.html` | Cuenta, estadísticas y preferencias |
| `anime.html` | Ficha de serie (`?id=frieren`) |
| `watch.html` | Reproductor (`?id=frieren&ep=7`) |

La documentación del sistema de diseño, cómo añadir series y las reglas que no
se deben romper están en **[LEEME.md](LEEME.md)**.
