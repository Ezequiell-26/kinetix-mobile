# Migración Completa a Supabase ✅

## Resumen
El proyecto ha sido migrado exitosamente de Firebase a Supabase. Todas las funcionalidades de autenticación y base de datos ahora utilizan Supabase.

## Cambios Realizados

### 1. Archivos Eliminados
- `apps/mobile/src/lib/firebase.ts` - Configuración de Firebase
- `apps/mobile/src/lib/firebase-auth.ts` - Servicio de autenticación de Firebase
- `apps/mobile/src/app/auth/login/page.tsx` - Página de login redundante
- `apps/mobile/src/app/auth/register/page.tsx` - Página de registro redundante

### 2. Archivos Modificados
- `apps/mobile/src/store/index.ts` - Migrado de Firestore a Supabase
- `apps/mobile/src/app/auth/page.tsx` - Migrado a Supabase Auth
- `.env.local` - Creado con variables de Supabase
- `.env.example` - Creado como plantilla

### 3. Configuración Requerida

#### Variables de Entorno (.env.local)
```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key-aqui
```

#### Pasos para Configurar Supabase

1. **Crear Proyecto en Supabase**
   - Ve a https://supabase.com
   - Crea un nuevo proyecto llamado "kinetix-coaching"
   - Guarda las credenciales

2. **Configurar Autenticación**
   - En el dashboard: Authentication > Providers
   - Habilita Email (confirma emails o deshabilita confirmación para desarrollo)
   - Habilita Google OAuth:
     - Necesitas crear credenciales en Google Cloud Console
     - Agrega Client ID y Client Secret
     - URL de redireccionamiento: `https://tu-proyecto.supabase.co/auth/v1/callback`

3. **Crear Tablas en la Base de Datos**
   
   Ejecuta este SQL en el SQL Editor de Supabase:

   ```sql
   -- Habilitar UUID
   create extension if not exists "uuid-ossp";

   -- Tabla de usuarios
   create table users (
     id uuid primary key default uuid_generate_v4(),
     email text unique not null,
     full_name text,
     avatar_url text,
     role text check (role in ('client', 'trainer', 'admin')) default 'client',
     created_at timestamptz default now(),
     updated_at timestamptz default now(),
     onboarding_completed boolean default false,
     preferences jsonb
   );

   -- Tabla de entrenamientos
   create table workouts (
     id uuid primary key default uuid_generate_v4(),
     user_id uuid references users(id) on delete cascade not null,
     name text not null,
     description text,
     exercises jsonb not null,
     duration_minutes integer,
     difficulty text check (difficulty in ('beginner', 'intermediate', 'advanced')),
     created_at timestamptz default now(),
     updated_at timestamptz default now()
   );

   -- Tabla de registros nutricionales
   create table nutrition_logs (
     id uuid primary key default uuid_generate_v4(),
     user_id uuid references users(id) on delete cascade not null,
     date date not null,
     meals jsonb not null,
     total_calories integer not null,
     total_protein integer not null,
     total_carbs integer not null,
     total_fat integer not null,
     notes text,
     created_at timestamptz default now()
   );

   -- Tabla de fotos de progreso
   create table progress_photos (
     id uuid primary key default uuid_generate_v4(),
     user_id uuid references users(id) on delete cascade not null,
     photo_url text not null,
     thumbnail_url text,
     taken_at timestamptz not null,
     notes text,
     body_weight numeric,
     created_at timestamptz default now()
   );

   -- Tabla de conversaciones
   create table conversations (
     id uuid primary key default uuid_generate_v4(),
     client_id uuid references users(id) on delete cascade not null,
     trainer_id uuid references users(id) on delete cascade not null,
     created_at timestamptz default now(),
     updated_at timestamptz default now()
   );

   -- Tabla de mensajes
   create table messages (
     id uuid primary key default uuid_generate_v4(),
     conversation_id uuid references conversations(id) on delete cascade not null,
     sender_id uuid references users(id) on delete cascade not null,
     content text not null,
     is_read boolean default false,
     created_at timestamptz default now()
   );

   -- Índices para mejorar rendimiento
   create index workouts_user_id_idx on workouts(user_id);
   create index nutrition_logs_user_id_idx on nutrition_logs(user_id);
   create index nutrition_logs_date_idx on nutrition_logs(date);
   create index progress_photos_user_id_idx on progress_photos(user_id);
   create index messages_conversation_id_idx on messages(conversation_id);
   create index messages_created_at_idx on messages(created_at);

   -- Trigger para actualizar updated_at
   create or replace function update_updated_at_column()
   returns trigger as $$
   begin
     new.updated_at = now();
     return new;
   end;
   $$ language plpgsql;

   create trigger update_users_updated_at before update on users
     for each row execute procedure update_updated_at_column();

   create trigger update_workouts_updated_at before update on workouts
     for each row execute procedure update_updated_at_column();

   create trigger update_conversations_updated_at before update on conversations
     for each row execute procedure update_updated_at_column();
   ```

4. **Configurar Row Level Security (RLS)**
   
   ```sql
   -- Habilitar RLS en todas las tablas
   alter table users enable row level security;
   alter table workouts enable row level security;
   alter table nutrition_logs enable row level security;
   alter table progress_photos enable row level security;
   alter table conversations enable row level security;
   alter table messages enable row level security;

   -- Políticas para users
   create policy "Usuarios pueden ver su propio perfil"
     on users for select
     using (auth.uid()::text = id::text);

   create policy "Usuarios pueden actualizar su propio perfil"
     on users for update
     using (auth.uid()::text = id::text);

   -- Políticas para workouts
   create policy "Usuarios pueden ver sus propios workouts"
     on workouts for select
     using (auth.uid()::text = user_id::text);

   create policy "Usuarios pueden crear sus propios workouts"
     on workouts for insert
     with check (auth.uid()::text = user_id::text);

   create policy "Usuarios pueden actualizar sus propios workouts"
     on workouts for update
     using (auth.uid()::text = user_id::text);

   create policy "Usuarios pueden eliminar sus propios workouts"
     on workouts for delete
     using (auth.uid()::text = user_id::text);

   -- Políticas para nutrition_logs
   create policy "Usuarios pueden ver sus propios logs"
     on nutrition_logs for select
     using (auth.uid()::text = user_id::text);

   create policy "Usuarios pueden crear sus propios logs"
     on nutrition_logs for insert
     with check (auth.uid()::text = user_id::text);

   create policy "Usuarios pueden actualizar sus propios logs"
     on nutrition_logs for update
     using (auth.uid()::text = user_id::text);

   create policy "Usuarios pueden eliminar sus propios logs"
     on nutrition_logs for delete
     using (auth.uid()::text = user_id::text);

   -- Políticas para progress_photos
   create policy "Usuarios pueden ver sus propias fotos"
     on progress_photos for select
     using (auth.uid()::text = user_id::text);

   create policy "Usuarios pueden subir sus propias fotos"
     on progress_photos for insert
     with check (auth.uid()::text = user_id::text);

   -- Políticas para conversations
   create policy "Usuarios pueden ver conversaciones donde participan"
     on conversations for select
     using (auth.uid()::text = client_id::text or auth.uid()::text = trainer_id::text);

   create policy "Usuarios pueden crear conversaciones"
     on conversations for insert
     with check (auth.uid()::text = client_id::text or auth.uid()::text = trainer_id::text);

   -- Políticas para messages
   create policy "Usuarios pueden ver mensajes en sus conversaciones"
     on messages for select
     using (
       exists (
         select 1 from conversations
         where conversations.id = messages.conversation_id
         and (conversations.client_id::text = auth.uid()::text or conversations.trainer_id::text = auth.uid()::text)
       )
     );

   create policy "Usuarios pueden enviar mensajes en sus conversaciones"
     on messages for insert
     with check (
       auth.uid()::text = sender_id::text
       and exists (
         select 1 from conversations
         where conversations.id = messages.conversation_id
         and (conversations.client_id::text = auth.uid()::text or conversations.trainer_id::text = auth.uid()::text)
       )
     );
   ```

5. **Configurar Storage (para fotos de progreso)**
   
   ```sql
   -- Crear bucket para fotos de progreso
   insert into storage.buckets (id, name, public) 
   values ('progress-photos', 'progress-photos', false);

   -- Políticas de storage
   create policy "Usuarios pueden subir sus propias fotos"
     on storage.objects for insert
     with check (bucket_id = 'progress-photos' and auth.uid()::text = (storage.foldername(name))[1]);

   create policy "Usuarios pueden ver sus propias fotos"
     on storage.objects for select
     using (bucket_id = 'progress-photos' and auth.uid()::text = (storage.foldername(name))[1]);

   create policy "Usuarios pueden eliminar sus propias fotos"
     on storage.objects for delete
     using (bucket_id = 'progress-photos' and auth.uid()::text = (storage.foldername(name))[1]);
   ```

## Verificación

Para verificar que todo funciona correctamente:

1. Copia `.env.example` a `.env.local` y completa con tus credenciales de Supabase
2. Ejecuta `npm install` para asegurar que las dependencias estén instaladas
3. Ejecuta `npm run dev` en `apps/mobile`
4. Navega a `/auth` y prueba:
   - Registro con email/password (@gmail.com)
   - Login con email/password
   - Login con Google OAuth

## Notas Importantes

- ✅ Solo se permiten correos @gmail.com (validación mantenida)
- ✅ PKCE flow habilitado para mayor seguridad
- ✅ Auto-refresh de tokens activado
- ✅ Persistencia de sesión habilitada
- ✅ Row Level Security configurado para proteger datos

## Soporte

Si encuentras problemas:
1. Verifica que las variables de entorno estén correctamente configuradas
2. Asegúrate de que las tablas estén creadas en Supabase
3. Revisa que RLS esté habilitado y configurado correctamente
4. Para Google OAuth, verifica que los dominios estén autorizados en Supabase
