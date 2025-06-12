-- backend/init.sql

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS T_todo (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  statut TEXT DEFAULT 'à faire',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
