/*
# AEVORITH Platform — Initial Schema

## Summary
Creates the complete database schema for the AEVORITH AI creative platform.
All tables use Row Level Security so each authenticated user can only access their own data.
A trigger auto-provisions profile, subscription, and settings records on every new sign-up.

## New Tables

### profiles
Stores public user profile data. Linked 1-to-1 with auth.users by id.
Columns: id, email, full_name, username, bio, website, avatar_url, created_at, updated_at

### subscriptions
Tracks the user's active plan and credit balance.
Columns: id, user_id, plan (free/creator/professional/enterprise), credits_used, credits_limit, renews_at, created_at, updated_at

### generations
Records every AI generation (image, video, 3D, animation) a user creates.
Columns: id, user_id, type, title, prompt, model, thumbnail, metadata (jsonb), liked, created_at

### chats
Chat session headers for the AI Chat feature.
Columns: id, user_id, title, created_at, updated_at

### chat_messages
Individual messages inside a chat session.
Columns: id, chat_id, role (user/assistant), content, created_at

### projects
User-defined projects that can group creations.
Columns: id, user_id, name, description, created_at, updated_at

### user_settings
Per-user interface and notification preferences.
Columns: id, user_id, theme, notification preferences (booleans), interface preferences (booleans), created_at, updated_at

### notifications
In-app notification feed for each user.
Columns: id, user_id, type, title, message, read, created_at

## Security
- RLS enabled on ALL tables
- All policies scoped to `authenticated` role
- Ownership enforced via `auth.uid() = user_id` (or `id` for profiles)
- A PostgreSQL function + trigger auto-creates profile/subscription/settings on sign-up

## Important Notes
1. Idempotent — all CREATE statements use IF NOT EXISTS; DROP POLICY IF EXISTS before CREATE POLICY
2. No transaction control statements (BEGIN/COMMIT/ROLLBACK) used outside DO blocks
3. The handle_new_user trigger fires AFTER INSERT on auth.users — safe to use auth.users FK references
4. credits_limit defaults: free=50, creator=1000, professional=5000, enterprise=999999
*/

-- ============================================================
-- PROFILES
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text NOT NULL DEFAULT '',
  username text NOT NULL DEFAULT '',
  bio text NOT NULL DEFAULT '',
  website text NOT NULL DEFAULT '',
  avatar_url text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
CREATE POLICY "profiles_select_own" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_delete_own" ON profiles;
CREATE POLICY "profiles_delete_own" ON profiles FOR DELETE
  TO authenticated USING (auth.uid() = id);

-- ============================================================
-- SUBSCRIPTIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  plan text NOT NULL DEFAULT 'free' CHECK (plan IN ('free','creator','professional','enterprise')),
  credits_used integer NOT NULL DEFAULT 0,
  credits_limit integer NOT NULL DEFAULT 50,
  renews_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS subscriptions_user_id_idx ON subscriptions(user_id);
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "subscriptions_select_own" ON subscriptions;
CREATE POLICY "subscriptions_select_own" ON subscriptions FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "subscriptions_insert_own" ON subscriptions;
CREATE POLICY "subscriptions_insert_own" ON subscriptions FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "subscriptions_update_own" ON subscriptions;
CREATE POLICY "subscriptions_update_own" ON subscriptions FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "subscriptions_delete_own" ON subscriptions;
CREATE POLICY "subscriptions_delete_own" ON subscriptions FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ============================================================
-- GENERATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS generations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL DEFAULT 'image' CHECK (type IN ('image','video','3d','animation')),
  title text NOT NULL DEFAULT '',
  prompt text NOT NULL DEFAULT '',
  model text NOT NULL DEFAULT '',
  thumbnail text NOT NULL DEFAULT '',
  metadata jsonb NOT NULL DEFAULT '{}',
  liked boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS generations_user_id_idx ON generations(user_id);
CREATE INDEX IF NOT EXISTS generations_created_at_idx ON generations(created_at DESC);
ALTER TABLE generations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "generations_select_own" ON generations;
CREATE POLICY "generations_select_own" ON generations FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "generations_insert_own" ON generations;
CREATE POLICY "generations_insert_own" ON generations FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "generations_update_own" ON generations;
CREATE POLICY "generations_update_own" ON generations FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "generations_delete_own" ON generations;
CREATE POLICY "generations_delete_own" ON generations FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ============================================================
-- CHATS
-- ============================================================
CREATE TABLE IF NOT EXISTS chats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT 'New Chat',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS chats_user_id_idx ON chats(user_id);
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "chats_select_own" ON chats;
CREATE POLICY "chats_select_own" ON chats FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "chats_insert_own" ON chats;
CREATE POLICY "chats_insert_own" ON chats FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "chats_update_own" ON chats;
CREATE POLICY "chats_update_own" ON chats FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "chats_delete_own" ON chats;
CREATE POLICY "chats_delete_own" ON chats FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ============================================================
-- CHAT MESSAGES
-- ============================================================
CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id uuid NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'user' CHECK (role IN ('user','assistant')),
  content text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS chat_messages_chat_id_idx ON chat_messages(chat_id);
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "chat_messages_select_via_chat" ON chat_messages;
CREATE POLICY "chat_messages_select_via_chat" ON chat_messages FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM chats WHERE chats.id = chat_messages.chat_id AND chats.user_id = auth.uid()));

DROP POLICY IF EXISTS "chat_messages_insert_via_chat" ON chat_messages;
CREATE POLICY "chat_messages_insert_via_chat" ON chat_messages FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM chats WHERE chats.id = chat_messages.chat_id AND chats.user_id = auth.uid()));

DROP POLICY IF EXISTS "chat_messages_delete_via_chat" ON chat_messages;
CREATE POLICY "chat_messages_delete_via_chat" ON chat_messages FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM chats WHERE chats.id = chat_messages.chat_id AND chats.user_id = auth.uid()));

-- ============================================================
-- PROJECTS
-- ============================================================
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS projects_user_id_idx ON projects(user_id);
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "projects_select_own" ON projects;
CREATE POLICY "projects_select_own" ON projects FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "projects_insert_own" ON projects;
CREATE POLICY "projects_insert_own" ON projects FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "projects_update_own" ON projects;
CREATE POLICY "projects_update_own" ON projects FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "projects_delete_own" ON projects;
CREATE POLICY "projects_delete_own" ON projects FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ============================================================
-- USER SETTINGS
-- ============================================================
CREATE TABLE IF NOT EXISTS user_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  theme text NOT NULL DEFAULT 'dark',
  notif_email_generations boolean NOT NULL DEFAULT true,
  notif_email_credits boolean NOT NULL DEFAULT true,
  notif_email_features boolean NOT NULL DEFAULT false,
  notif_email_digest boolean NOT NULL DEFAULT false,
  notif_email_marketing boolean NOT NULL DEFAULT false,
  notif_inapp_updates boolean NOT NULL DEFAULT true,
  notif_inapp_community boolean NOT NULL DEFAULT true,
  notif_inapp_system boolean NOT NULL DEFAULT true,
  interface_animations boolean NOT NULL DEFAULT true,
  interface_compact_sidebar boolean NOT NULL DEFAULT false,
  interface_tooltips boolean NOT NULL DEFAULT true,
  interface_autosave boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS user_settings_user_id_idx ON user_settings(user_id);
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "user_settings_select_own" ON user_settings;
CREATE POLICY "user_settings_select_own" ON user_settings FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_settings_insert_own" ON user_settings;
CREATE POLICY "user_settings_insert_own" ON user_settings FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_settings_update_own" ON user_settings;
CREATE POLICY "user_settings_update_own" ON user_settings FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_settings_delete_own" ON user_settings;
CREATE POLICY "user_settings_delete_own" ON user_settings FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL DEFAULT 'info' CHECK (type IN ('success','info','update')),
  title text NOT NULL DEFAULT '',
  message text NOT NULL DEFAULT '',
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS notifications_user_id_idx ON notifications(user_id);
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "notifications_select_own" ON notifications;
CREATE POLICY "notifications_select_own" ON notifications FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "notifications_insert_own" ON notifications;
CREATE POLICY "notifications_insert_own" ON notifications FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "notifications_update_own" ON notifications;
CREATE POLICY "notifications_update_own" ON notifications FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "notifications_delete_own" ON notifications;
CREATE POLICY "notifications_delete_own" ON notifications FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ============================================================
-- AUTO-PROVISION USER DATA ON SIGN-UP
-- Creates profile, subscription, and settings rows for every new user
-- ============================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, username)
    VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
      COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1))
    )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO subscriptions (user_id, plan, credits_used, credits_limit, renews_at)
    VALUES (
      NEW.id,
      'free',
      0,
      50,
      (now() + interval '1 month')
    )
  ON CONFLICT (user_id) DO NOTHING;

  INSERT INTO user_settings (user_id)
    VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  INSERT INTO notifications (user_id, type, title, message)
    VALUES (
      NEW.id,
      'update',
      'Welcome to AEVORITH!',
      'Your account is ready. You have 50 free credits to start creating.'
    );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
