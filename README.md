# Kagura

Sitio de anime estático, sin build. Las cuentas usan Supabase cuando se configura.

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
| `perfil.html` | Perfil propio y editor |
| `acceso.html` | Registro e inicio de sesión |
| `comunidad.html` | Directorio de perfiles públicos |
| `usuario.html?id=…` | Perfil público de una persona |
| `anime.html` | Ficha de serie (`?id=frieren`) |
| `watch.html` | Reproductor (`?id=frieren&ep=7`) |

## Activar cuentas y perfiles

La interfaz está lista, pero necesitas crear tu propio proyecto de Supabase para que el registro sea real. Hasta entonces, `comunidad.html` enseña perfiles de muestra identificados como tales; no se guardan usuarios ni contraseñas en el navegador.

1. Crea un proyecto en Supabase. En **SQL Editor**, ejecuta [`supabase/profiles.sql`](supabase/profiles.sql) una sola vez. Hazlo antes de permitir registros: el trigger crea el perfil al registrarse.
2. En **Project Settings → API**, copia la URL y la clave **publishable** (o `anon`) a [`assets/supabase-config.js`](assets/supabase-config.js). Nunca uses la clave `service_role` en la web.
3. En **Authentication → URL Configuration**, configura la URL pública de esta web como Site URL y añade `https://tu-dominio/.../perfil.html` a Redirect URLs para la confirmación por correo.
4. Publica la carpeta `kagura/` mediante HTTPS. El doble clic en HTML sirve para revisar el diseño, pero la confirmación de correo y las sesiones reales deben probarse en el dominio publicado.

Los perfiles comparten nombre, usuario, biografía, color y género favorito. El correo queda en Supabase Auth y no se muestra en perfiles públicos. Las políticas RLS de `profiles.sql` permiten leer perfiles y editar únicamente el propio. Supabase aloja Auth y la base de datos, así que esta función no requiere tu servidor actual.

La documentación del sistema de diseño, cómo añadir series y las reglas que no
se deben romper están en **[LEEME.md](LEEME.md)**.
