<<<<<<< HEAD
# EcoFinds Backend API

A Node.js/Express backend for EcoFinds second-hand marketplace.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables in `.env`:
```
DATABASE_URL=postgres://eco:eco@localhost:5432/ecofinds
JWT_SECRET=your_jwt_secret_here
PORT=5000
```

3. Start the server:
```bash
npm start
# or for development
npm run dev
```

## API Endpoints

### Products
- `GET /api/products` - Get all products (with search & filtering)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (auth required)
- `PUT /api/products/:id` - Update product (auth required)
- `DELETE /api/products/:id` - Delete product (auth required)

### Cart
- `GET /api/cart` - Get user's cart (auth required)
- `POST /api/cart` - Add item to cart (auth required)
- `PUT /api/cart/:id` - Update cart item (auth required)
- `DELETE /api/cart/:id` - Remove item from cart (auth required)
- `DELETE /api/cart` - Clear cart (auth required)

### Orders
- `POST /api/orders` - Create order from cart (auth required)
- `GET /api/orders` - Get user's orders (auth required)
- `GET /api/orders/:id` - Get single order (auth required)

## Authentication

Include JWT token in Authorization header:
```
Authorization: Bearer <token>
```

## Query Parameters

### Products
- `search` - Search in name/description
- `category` - Filter by category
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
=======
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
>>>>>>> c494577c7fb7495b44db3522c8b0197256d0d41d
