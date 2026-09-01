# admin/ — herramientas locales

Uso interno, se corre a mano con Node. Nada de esto llega a la app pública.

1. `cp admin/.env.example admin/.env` y completá `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY` (ignorado por git; la key salta RLS, no la compartas).
2. `node admin/duplicados.mjs` — solo lectura: agrupa duplicados por ROL, dirección+comuna o video_url, marca cuál conservaría (la más reciente con precio > 0) y lista la basura (precio 0 + owner `QA%`).
3. `node admin/duplicados.mjs --delete` — borra esas filas pidiendo escribir `BORRAR <n>`, y elimina del Storage los videos que no use ninguna otra fila (`--solo-duplicados` / `--solo-basura` acotan el borrado).
