Link API: https://documenter.getpostman.com/view/23054100/2sAXqv61r7

### Overview
This project is a robust, scalable backend API for an ecommerce platform, built with Node.js and TypeScript. It provides a comprehensive set of RESTful endpoints to manage users, authentication, products, brands, categories, blogs, wishlists, ratings, coupons, orders, carts, and more.

**Key features include**:
- Secure authentication and authorization (JWT-based)
- User management with roles and permissions
- Product catalog with categories, brands, and advanced filtering
- Shopping cart and order management
- Wishlist and product ratings functionality
- Blog and blog category management
- Coupon and discount system
- File uploads (with planned support for cloud storage)
- Modular, maintainable code structure with validation layers and error handling

The API is designed for easy integration with frontend clients (web, mobile, etc.) and follows best practices for scalability.


> I created simple *prompt tool* (`slave.ts`) to create for me features with (controller, routes, repository, services, models, types) if needed.


### API Endpoints Samples

## Authentication Functionalities

| Method | Endpoint                        | Description                   | Status |
| ------ | ------------------------------- | ----------------------------- | ------ |
| POST   | /auth/register                  | Register a new user           | ✅     |
| POST   | /auth/login                     | Login a user                  | ✅     |
| POST   | /auth/logout                    | Logout a user                 | ✅     |
| POST   | /auth/forgot-password           | Send a password reset email   | ✅     |
| POST   | /auth/reset-password            | Reset a user's password       | ✅     |
| POST   | /auth/change-password           | Change a user's password      | ✅     |
| POST   | /auth/refresh                   | Refresh a user's token        | ✅     |

#### TODOS

## Users Functionalities

| Method | Endpoint           | Description    | Status |
| ------ | ------------------ | -------------- | ------ |
| GET    | /users             | Get all users  | ✅     |
| GET    | /users/:id         | Get a user     | ✅     |
| PUT    | /users/:id         | Update a user  | ✅     |
| DELETE | /users/:id         | Delete a user  | ✅     |
| POST   | /users/:id/block   | Block a user   | ✅     |
| POST   | /users/:id/unblock | Unblock a user | ✅     |

#### TODOS (General)

- Create a function for Mongoid is valid [✅]
- Review Auth Cycle (Specifically the refresh token) [❌]
- Query Features (Fields, Filter, Sort, Pagination, Limiting, Search) [✅]

## Brands Functionalities

| Method | Endpoint    | Description    | Status |
| ------ | ----------- | -------------- | ------ |
| GET    | /brands     | Get all brands | ✅     |
| GET    | /brands/:id | Get a brand    | ✅     |
| POST   | /brands     | Create a brand | ✅     |
| PATCH  | /brands/:id | Update a brand | ✅     |
| DELETE | /brands/:id | Delete a brand | ✅     |

#### TODOS

## Categories Functionalities

| Method | Endpoint        | Description        | Status |
| ------ | --------------- | ------------------ | ------ |
| GET    | /categories     | Get all categories | ✅     |
| GET    | /categories/:id | Get a category     | ✅     |
| POST   | /categories     | Create a category  | ✅     |
| PATCH  | /categories/:id | Update a category  | ✅     |
| DELETE | /categories/:id | Delete a category  | ✅     |

#### TODOS

## Products Functionalities

| Method | Endpoint      | Description      | Status |
| ------ | ------------- | ---------------- | ------ |
| GET    | /products     | Get all products | ✅     |
| GET    | /products/:id | Get a product    | ✅     |
| POST   | /products     | Create a product | ✅     |
| PATCH  | /products/:id | Update a product | ✅     |
| DELETE | /products/:id | Delete a product | ✅     |

#### TODOS

- Add Ratings and Reviews [✅]
- Validation Layer [✅]

## Blogs Functionalities

| Method | Endpoint          | Description   | Status |
| ------ | ----------------- | ------------- | ------ |
| GET    | /blogs            | Get all blogs | ✅     |
| GET    | /blogs/:id        | Get a blog    | ✅     |
| POST   | /blogs            | Create a blog | ✅     |
| PATCH  | /blogs/:id        | Update a blog | ✅     |
| DELETE | /blogs/:id        | Delete a blog | ✅     |
| PATCH  | /blogs/:id/like   | Like a blog   | ✅     |
| PATCH  | /blogs/:id/unlike | Unlike a blog | ✅     |

#### TODOS

- Add Validations Layer before Controller [✅]
- Add Check for User if owner who update or delete [❌]

## Wishlist Functionalities

| Method | Endpoint         | Description                    | Status |
| ------ | ---------------- | ------------------------------ | ------ |
| GET    | /wishlists       | Get all wishlists              | ✅     |
| GET    | /wishlists/:id   | Get a wishlist                 | ✅     |
| POST   | /wishlist/add    | add product in wishlist        | ✅     |
| POST   | /wishlist/remove | remove product from wishlist   | ✅     |
| POST   | /wishlist/clear  | clear wishlist                 | ❌     |
| POST   | /wishlist/toggle | add/remove product in wishlist | ✅     |

#### TODOS

- Validation Layer [❌]

## Ratings Functionalities

| Method | Endpoint                         | Description                         | Status |
| ------ | -------------------------------- | ----------------------------------- | ------ |
| GET    | /products/:productId/ratings     | Get all ratings of specific product | ✅     |
| POST   | /products/:productId/ratings     | Add a rating to a product           | ✅     |
| PATCH  | /products/:productId/ratings/:id | Update a rating of a product        | ✅     |
| DELETE | /products/:productId/ratings/:id | Delete a rating of a product        | ✅     |

#### TODOS

- Validation Layer [❌]

## Coupons Functionalities

| Method | Endpoint         | Description     | Status |
| ------ | ---------------- | --------------- | ------ |
| GET    | /coupons         | Get all coupons | ✅     |
| GET    | /coupons/:id     | Get a coupon    | ✅     |
| POST   | /coupons         | Create a coupon | ✅     |
| PATCH  | /coupons/:id     | Update a coupon | ✅     |
| DELETE | /coupons/:id     | Delete a coupon | ✅     |
| POST   | /coupons/:id/use | Use a coupon    | ✅     |

| Header Key    | Header Value   | Description  | Status |
| ------------- | -------------- | ------------ | ------ |
| Authorization | Bearer {token} | User's token | ✅     |

**Only Admins and Vendors if exist**

#### TODOS

- Validation Layer [❌]
- Add CouponUsage Schema (as many-to-many) [❌]

## Uploads Functionalities (as a separate endpoint)

| Method | Endpoint | Description | Status |
| ------ | -------- | ----------- | ------ |
| POST   | /uploads | Upload file | ❌     |

#### TODOS

- Add Upload to Cloudinary [❌]
- Add Validation Layer [❌]
