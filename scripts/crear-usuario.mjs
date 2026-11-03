#!/usr/bin/env node
/**
 * Crea (o actualiza) un usuario del panel de Conroma en Supabase Auth.
 *
 * Uso:
 *   node scripts/crear-usuario.mjs rosa@conromaasesores.com admin
 *   node scripts/crear-usuario.mjs marc@conromaasesores.com comercial "Marc Pujol"
 *
 * Lee SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY de .dev.vars o .env (que NO se commitean).
 * La contraseña se genera aquí y se imprime UNA sola vez: cámbiala al primer acceso.
 */
import { readFileSync, existsSync } from 'node:fs';
import { randomBytes } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';

// --- 1. Cargar credenciales desde un archivo local, nunca desde el código ---
function cargarEnv() {
  for (const archivo of ['.dev.vars', '.env', '.env.local']) {
    if (!existsSync(archivo)) continue;
    for (const linea of readFileSync(archivo, 'utf8').split('\n')) {
      const limpia = linea.trim();
      if (!limpia || limpia.startsWith('#')) continue;
      const i = limpia.indexOf('=');
      if (i < 1) continue;
      const clave = limpia.slice(0, i).trim();
      const valor = limpia.slice(i + 1).trim().replace(/^["']|["']$/g, '');
      if (!process.env[clave]) process.env[clave] = valor;
    }
  }
}
cargarEnv();

const url = process.env.SUPABASE_URL ?? process.env.PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error(`
No encuentro las credenciales. Crea un archivo .dev.vars en la raiz del repo con:

  SUPABASE_URL=https://TU-PROYECTO.supabase.co
  SUPABASE_SERVICE_ROLE_KEY=la-clave-service_role

Las dos estan en Supabase > Project Settings > API.
Ese archivo esta en .gitignore: no se sube a GitHub.
`);
  process.exit(1);
}

// --- 2. Argumentos ---
const [email, rol = 'comercial', nombre] = process.argv.slice(2);

if (!email || !email.includes('@')) {
  console.error('Uso: node scripts/crear-usuario.mjs <email> <admin|comercial> ["Nombre Apellido"]');
  process.exit(1);
}
if (!['admin', 'comercial'].includes(rol)) {
  console.error(`Rol no valido: "${rol}". Solo admin o comercial.`);
  process.exit(1);
}

// --- 3. Crear o actualizar ---
const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });
const password = randomBytes(12).toString('base64url'); // 16 caracteres aleatorios

const datos = {
  email,
  password,
  email_confirm: true, // sin correo de verificacion: es personal interno
  app_metadata: { role: rol },        // el rol vive aqui: el usuario NO puede cambiarselo
  user_metadata: { full_name: nombre ?? email.split('@')[0] },
};

const { data, error } = await supabase.auth.admin.createUser(datos);

if (error && /already (been )?registered|already exists/i.test(error.message)) {
  // Ya existia: le actualizamos el rol y la contrasena en vez de fallar.
  const { data: lista, error: errorLista } = await supabase.auth.admin.listUsers({ perPage: 1000 });
  if (errorLista) { console.error('Error listando usuarios:', errorLista.message); process.exit(1); }
  const existente = lista.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
  if (!existente) { console.error('El usuario existe pero no lo encuentro. Revisalo en el panel.'); process.exit(1); }
  const { error: errorUpdate } = await supabase.auth.admin.updateUserById(existente.id, {
    password,
    app_metadata: { role: rol },
    user_metadata: { full_name: nombre ?? existente.user_metadata?.full_name },
  });
  if (errorUpdate) { console.error('Error actualizando:', errorUpdate.message); process.exit(1); }
  console.log(`\nActualizado: ${email}\n  rol: ${rol}\n  contrasena nueva: ${password}\n`);
  console.log('Guardala en tu gestor de contrasenas y cambiala al entrar. No la reenvies por WhatsApp.\n');
  process.exit(0);
}

if (error) { console.error('Error creando el usuario:', error.message); process.exit(1); }

console.log(`
Usuario creado
  email:      ${data.user.email}
  rol:        ${rol}
  contrasena: ${password}

Entra en /es/admin/ con esos datos y cambia la contrasena.
Guardala en tu gestor de contrasenas. No la reenvies por WhatsApp ni por correo.
`);
