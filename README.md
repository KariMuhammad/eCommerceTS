# eCommerceTS API

A modular e-commerce REST API built with Express, TypeScript, and MongoDB. The project models the core domains of an online store and separates each domain into routes, validation, controllers, services, repositories, models, and types.

[API documentation](https://documenter.getpostman.com/view/23054100/2sAXqv61r7) · [Repository](https://github.com/KariMuhammad/eCommerceTS)

> The API is under active development. The default GitHub branch is `goal`.

## Features

- Access and refresh-token authentication with password recovery
- Role-aware authorization for customers, vendors, and administrators
- Product, category, brand, color, and image management
- Filtering, search, sorting, field selection, and pagination through a shared query layer
- Shopping carts, quantity updates, coupons, discounts, and checkout calculation
- Orders and refund domain scaffolding
- Product reviews and ratings
- Wishlists
- Blog posts and blog categories
- Contact messages
- Cloudinary-backed image processing and uploads
- Centralized API errors, validation, logging, and CORS configuration

## Architecture

Feature code lives under `src/features/`:

```text
src/
├── common/                  # Errors, query helpers, router, storage, email
├── features/
│   ├── auth/
│   ├── products/
│   ├── category/
│   ├── brands/
│   ├── colors/
│   ├── carts/
│   ├── coupons/
│   ├── orders/
│   ├── reviews/
│   ├── wishlist/
│   ├── blogs/
│   ├── blog-category/
│   ├── contact/
│   └── user/
├── app.ts                   # Express application and middleware
└── server.ts                # HTTP server entry point
```

Most domains use the following flow:

```text
HTTP route -> validation/middleware -> controller -> service -> repository -> Mongoose model
```

Shared abstractions in `src/common/` provide resource routing, reusable persistence operations, query features, file storage, and consistent errors.

## Tech Stack

- Node.js and Express 4
- TypeScript
- MongoDB and Mongoose
- JSON Web Tokens and bcrypt
- Express Validator
- Multer, Sharp, and Cloudinary
- Nodemailer
- Morgan, CORS, and cookie-parser

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- MongoDB locally or a MongoDB Atlas database
- Cloudinary credentials for image uploads
- An SMTP/app-password account for email flows

### Installation

```bash
git clone https://github.com/KariMuhammad/eCommerceTS.git
cd eCommerceTS
npm install
cp .env.example .env
```

Configure these values in `.env`:

| Variable | Purpose |
| --- | --- |
| `NODE_ENV` | Runtime mode, for example `development` |
| `SERVER_DOMAIN` | Server origin, for example `http://localhost` |
| `SERVER_PORT` | HTTP port, for example `5000` |
| `DB_ATLAS_URI` | MongoDB connection URI |
| `DB_NAME` | Database name |
| `SECRET_KEY` | Access-token signing secret |
| `REFRESH_TOKEN_KEY` | Refresh-token signing secret |
| `MAIL_ACCOUNT` | Sender email address |
| `MAIL_PASSWORD_APP` | Sender app password |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `CLOUDINARY_RESOURCE_LINK` | Cloudinary delivery base URL |
| `CORS_ORIGIN` | Allowed frontend origin |

Use long, unique values for token secrets and never commit the completed `.env` file.

Start the development server:

```bash
npm run dev2
```

The API listens at `SERVER_DOMAIN:SERVER_PORT`.

## API Overview

The current application mounts feature routes at the server root.

| Domain | Base path | Access |
| --- | --- | --- |
| Authentication | `/auth` | Public and authenticated actions |
| Users | `/users` | Administrator |
| Products | `/products` | Public reads; vendor/admin writes |
| Categories | `/category` | Public reads; admin writes |
| Brands | `/brands` | Public reads; admin writes |
| Colors | `/colors` | Resource operations |
| Reviews | `/products/:productId/reviews` | Product-scoped |
| Wishlist | `/wishlist` | Authenticated |
| Cart | `/cart` | Authenticated |
| Coupons | `/coupons` | Admin management and cart usage |
| Orders | `/orders` | Authenticated |
| Blogs | `/blogs` | Public reads and protected writes |
| Blog categories | `/blog-category` | Resource operations |
| Contact | `/contact` | Contact-message operations |

Representative authentication routes:

```text
POST  /auth/register
POST  /auth/login
POST  /auth/refresh
POST  /auth/logout
POST  /auth/forgot-password
POST  /auth/reset-password
PATCH /auth/change-password
GET   /auth/profile
```

Representative cart routes:

```text
GET   /cart
POST  /cart/add
POST  /cart/remove
POST  /cart/clear
PATCH /cart/increase
PATCH /cart/decrease
POST  /cart/apply-discount
GET   /cart/checkout
```

See the [Postman documentation](https://documenter.getpostman.com/view/23054100/2sAXqv61r7) for request bodies and response examples. When the Postman collection and source code differ, the route files under `src/features/*/route/` are the source of truth.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Run through Nodemon using `nodemon.json` |
| `npm run dev2` | Run with `ts-node-dev` and automatic restart |
| `npm run build` | Compile the TypeScript sources to `dist/` |
| `npm start` | Run the compiled server entry point |

## Project Status

The main catalog, authentication, cart, coupon, wishlist, blog, user, and review modules are present. Orders, refunds, automated tests, and the production build path remain areas for continued development.

## License

The package metadata declares the ISC license. No standalone license file is currently included in the repository.
