# Kagura

Sitio de anime con diseño rosa original. El catálogo, las fichas y los episodios se obtienen de la API privada instalada en el servidor. Una serie se muestra únicamente si la API confirma que tiene episodios. La información del proveedor no aparece en la interfaz.

## Uso local

Abre `index.html` para revisar la página. La conexión de catálogo requiere Internet y la pasarela HTTPS configurada en `assets/animeav1-config.js`.

## Páginas

- `index.html`: inicio y destacados.
- `nuevos.html`: series con episodios recientes.
- `tendencias.html`: exploración y ranking visual.
- `generos.html`: géneros presentes en el catálogo cargado.
- `buscar.html`: búsqueda de títulos con episodios.
- `anime.html?url=...`: ficha y episodios reales.
- `watch.html?url=...&ep=1`: reproducción y selección de servidor.
- `mi-lista.html`: series guardadas en este navegador.
- `calendario.html`: episodios disponibles. No anuncia fechas futuras sin una fuente fiable.
- `perfil.html`, `acceso.html`, `comunidad.html`, `usuario.html`: cuentas y perfiles.

El catálogo se pagina en el servidor. La portada muestra la primera página verificada; búsqueda consulta todo el índice del proveedor y también verifica episodios antes de mostrar resultados. Las fechas de emisión y métricas de vistas no se inventan.

## Cuentas y perfiles

La interfaz de registro y perfiles está preparada para Supabase, pero necesita un proyecto de Supabase propio. Ejecuta `supabase/profiles.sql` en SQL Editor, copia la URL y la clave **publishable** a `assets/supabase-config.js` y configura la URL pública en Authentication. Nunca uses la clave `service_role` en la web. Hasta configurar Supabase, los perfiles de muestra son solo demostración.

## Servidor

La pasarela y el extractor están en `/home/ubuntu/kagura-animeav1` del servidor Ubuntu. Funcionan en contenedores propios, sin puertos de aplicación publicados. Caddy publica solo `https://anime-api.148.113.174.137.sslip.io`. La clave del extractor permanece en el servidor. El bloque de Caddy de Kagura se añadió a los existentes y está respaldado en `/home/ubuntu/kagura-animeav1/Caddyfile.before-kagura`.

El código de despliegue y las pruebas están en `../animeav1-gateway/`. Para probar localmente: `node ../animeav1-gateway/test.js` y `node ../animeav1-gateway/ui-test.js`.
