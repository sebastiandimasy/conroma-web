# Dar de alta a la gente que entra al panel

El panel de Conroma (`/es/admin/`) no tiene registro público: **los usuarios se crean a mano**.
Cada persona tiene un rol que decide lo que ve:

| Rol | Quién | Qué ve |
|---|---|---|
| `admin` | Rosa (dirección) | Todo: todos los leads, todos los asesores, métricas del equipo |
| `comercial` | Marc y el resto del equipo | Solo sus leads, sus pisos y su agenda |

El rol se guarda en **`app_metadata`**, no en `user_metadata`. Es importante: `user_metadata`
lo puede editar el propio usuario desde el navegador, así que un comercial podría ascenderse a
admin. `app_metadata` solo se puede tocar con la clave `service_role`, desde el servidor.

---

## Opción A — con el script (recomendado)

### Una sola vez: preparar las credenciales

1. Entra en [supabase.com](https://supabase.com) → tu proyecto de Conroma.
2. Ve a **Project Settings** (la rueda dentada, abajo a la izquierda) → **API**.
3. Copia dos cosas:
   - **Project URL** → algo como `https://abcdefgh.supabase.co`
   - **service_role** (en «Project API keys», tienes que pulsar *Reveal*) → una cadena muy larga
4. En la raíz del repo crea un archivo llamado **`.dev.vars`** con esto dentro:

```
SUPABASE_URL=https://abcdefgh.supabase.co
SUPABASE_SERVICE_ROLE_KEY=pega-aqui-la-clave-service_role
```

> Ese archivo está en `.gitignore`: **no se sube a GitHub**. Esa clave salta todas las reglas de
> seguridad de la base de datos, así que no la pegues en un chat, ni en un correo, ni en un issue.

### Cada vez que quieras crear a alguien

```bash
node scripts/crear-usuario.mjs rosa@conromaasesores.com admin "Rosa Camps"
node scripts/crear-usuario.mjs marc@conromaasesores.com comercial "Marc Pujol"
```

El script imprime una contraseña aleatoria **una sola vez**. Pásasela a la persona en mano o por
un gestor de contraseñas, y que la cambie al entrar. Si el email ya existía, el script no falla:
le actualiza el rol y le pone contraseña nueva.

---

## Opción B — a mano desde el panel de Supabase

Si prefieres no tocar la terminal:

1. Supabase → **Authentication** → **Users** → botón **Add user** → *Create new user*.
2. Pon email y contraseña, y **marca «Auto Confirm User»** (si no, le pide verificar el correo).
3. Eso crea el usuario **sin rol**, así que todavía no puede entrar bien. Falta el paso 4.
4. Ve a **SQL Editor** → **New query**, pega esto cambiando el email y el rol, y pulsa *Run*:

```sql
update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb
where email = 'rosa@conromaasesores.com';
```

Para un comercial, cambia `"role":"admin"` por `"role":"comercial"`.

### Comprobar que ha quedado bien

```sql
select email, raw_app_meta_data->>'role' as rol, email_confirmed_at
from auth.users
order by created_at desc;
```

Tiene que salir el rol relleno y `email_confirmed_at` con una fecha. Si el rol sale vacío, la
persona entrará pero no verá nada: repite el paso 4.

---

## Si alguien no puede entrar

| Síntoma | Causa casi siempre | Arreglo |
|---|---|---|
| «Invalid login credentials» | contraseña mal | vuelve a lanzar el script con el mismo email |
| Entra pero el panel sale vacío | le falta el `role` | el paso 4 de la opción B |
| «Email not confirmed» | se creó sin *Auto Confirm* | consulta de abajo |

```sql
update auth.users set email_confirmed_at = now() where email = 'quien@conromaasesores.com';
```

---

## Dar de baja a alguien

Supabase → Authentication → Users → los tres puntos a la derecha de la fila → **Delete user**.
Sus leads y sus pisos **no se borran**: quedan sin asignar y los puede reasignar un admin.
