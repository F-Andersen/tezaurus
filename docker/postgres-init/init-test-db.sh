#!/bin/bash
set -e

# Створюємо окрему базу для e2e-тестів (idempotent).
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
  SELECT 'CREATE DATABASE tezaurus_tour_test OWNER ' || current_user
  WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'tezaurus_tour_test')\gexec
EOSQL
