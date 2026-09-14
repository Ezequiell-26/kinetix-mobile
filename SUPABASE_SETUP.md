# Configuración de Supabase para EZEQUIEL COACHING

## 1. Crear Proyecto en Supabase

1. Ve a https://supabase.com y crea una cuenta
2. Crea un nuevo proyecto llamado "kinetix-coaching"
3. Guarda las credenciales que te darán

## 2. Configurar Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto con:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key-aqui
```

## 3. Configurar Autenticación

En el dashboard de Supabase:

1. Ve a **Authentication** > **Providers**
2. Habilita **Email** (asegúrate de confirmar emails o deshabilitar confirmación para desarrollo)
3. Habilita **Google**:
   - Necesitas crear credenciales en Google Cloud Console
   - Agrega Client ID y Client Secret
   - Agrega URL de redireccionamiento autorizado: `https://tu-proyecto.supabase.co/auth/v1/callback`

## 4. Crear Tablas en la Base de Datos

Ejecuta este SQL en el **SQL Editor** de Supabase:

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

-- Índices para mejorar performance
create index idx_workouts_user_id on workouts(user_id);
create index idx_nutrition_logs_user_id on nutrition_logs(user_id);
create index idx_nutrition_logs_date on nutrition_logs(user_id, date);
create index idx_progress_photos_user_id on progress_photos(user_id);
create index idx_messages_conversation_id on messages(conversation_id);
create index idx_conversations_client_trainer on conversations(client_id, trainer_id);

-- Trigger para actualizar updated_at
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_users_updated_at before update on users
  for each row execute function update_updated_at_column();

create trigger update_workouts_updated_at before update on workouts
  for each row execute function update_updated_at_column();

create trigger update_conversations_updated_at before update on conversations
  for each row execute function update_updated_at_column();
```

## 5. Configurar Storage (para fotos)

1. Ve a **Storage** en el dashboard
2. Crea un bucket llamado `progress-photos`
3. Configura las políticas:

```sql
-- Política para permitir uploads solo a usuarios autenticados
create policy "Usuarios pueden subir sus propias fotos"
on storage.objects for insert
to authenticated
with check (bucket_id = 'progress-photos' and auth.uid()::text = (storage.foldername(name))[1]);

-- Política para permitir lectura pública
create policy "Fotos son públicas"
on storage.objects for select
to public
using (bucket_id = 'progress-photos');

-- Política para permitir delete solo al dueño
create policy "Usuarios pueden borrar sus propias fotos"
on storage.objects for delete
to authenticated
using (bucket_id = 'progress-photos' and auth.uid()::text = (storage.foldername(name))[1]);
```

## 6. Configurar Políticas de Seguridad (RLS)

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
using (auth.uid() = id);

create policy "Usuarios pueden actualizar su propio perfil"
on users for update
using (auth.uid() = id);

create policy "Trainers pueden ver sus clientes"
on users for select
using (
  exists (
    select 1 from conversations
    where conversations.trainer_id = auth.uid()
    and conversations.client_id = users.id
  )
);

-- Políticas para workouts
create policy "Usuarios pueden ver sus propios workouts"
on workouts for select
using (user_id = auth.uid());

create policy "Usuarios pueden crear sus propios workouts"
on workouts for insert
with check (user_id = auth.uid());

create policy "Usuarios pueden actualizar sus propios workouts"
on workouts for update
using (user_id = auth.uid());

create policy "Usuarios pueden borrar sus propios workouts"
on workouts for delete
using (user_id = auth.uid());

-- Políticas para nutrition_logs
create policy "Usuarios pueden ver sus propios logs"
on nutrition_logs for select
using (user_id = auth.uid());

create policy "Usuarios pueden crear sus propios logs"
on nutrition_logs for insert
with check (user_id = auth.uid());

create policy "Usuarios pueden actualizar sus propios logs"
on nutrition_logs for update
using (user_id = auth.uid());

-- Políticas para progress_photos
create policy "Usuarios pueden ver sus propias fotos"
on progress_photos for select
using (user_id = auth.uid());

create policy "Usuarios pueden subir sus propias fotos"
on progress_photos for insert
with check (user_id = auth.uid());

create policy "Usuarios pueden borrar sus propias fotos"
on progress_photos for delete
using (user_id = auth.uid());

-- Políticas para conversations
create policy "Participantes pueden ver conversaciones"
on conversations for select
using (client_id = auth.uid() or trainer_id = auth.uid());

create policy "Crear conversación"
on conversations for insert
with check (client_id = auth.uid() or trainer_id = auth.uid());

-- Políticas para messages
create policy "Participantes pueden ver mensajes"
on messages for select
using (
  exists (
    select 1 from conversations
    where conversations.id = messages.conversation_id
    and (conversations.client_id = auth.uid() or conversations.trainer_id = auth.uid())
  )
);

create policy "Participantes pueden enviar mensajes"
on messages for insert
with check (
  sender_id = auth.uid() and
  exists (
    select 1 from conversations
    where conversations.id = messages.conversation_id
    and (conversations.client_id = auth.uid() or conversations.trainer_id = auth.uid())
  )
);
```

## 7. Verificar Instalación

Ejecuta en tu terminal:

```bash
npm run dev
```

Y verifica que no haya errores de conexión a Supabase.

## 8. Notas Importantes

- ✅ Solo se permiten correos @gmail.com (validado en el código)
- ✅ Google Auth debe estar configurado en Supabase y Google Cloud Console
- ✅ Las fotos se guardan en el bucket `progress-photos`
- ✅ Los mensajes son en tiempo real gracias a Supabase Realtime
- ✅ Todas las tablas tienen Row Level Security activado

## 9. Troubleshooting

**Error: "Invalid API key"**
- Verifica que las variables de entorno estén correctas
- Asegúrate de usar la ANON KEY, no la SERVICE ROLE KEY en el frontend

**Error: "Email provider not enabled"**
- Ve a Authentication > Providers en Supabase y habilita Email

**Error: "Google provider not configured"**
- Configura las credenciales de Google en Supabase
- Agrega la URL de callback en Google Cloud Console

**Las fotos no se suben**
- Verifica que el bucket `progress-photos` exista
- Revisa las políticas de storage
