# EcoFinds Database Setup

## Overview
This project uses PostgreSQL as the database, running inside a Docker container.

## Starting the Database
Run the following command in the project root to start PostgreSQL:

docker compose up -d

## Running Migrations
To create the database schema, run:

type ./server/src/db/migrations/001_init.sql | docker exec -i <container_name> psql -U eco -d ecofinds

Replace <container_name> with your Docker container name (use docker ps to find it).

## Seeding Initial Data
To insert default categories, run:

type ./server/src/db/migrations/002_seed_categories.sql | docker exec -i <container_name> psql -U eco -d ecofinds

## Database Connection URL
Use this connection string to connect your backend:

postgres://eco:eco@localhost:5432/ecofinds

## Notes
- Make sure Docker is installed and running.
- Replace <container_name> with your actual Docker container name.
