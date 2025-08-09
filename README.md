# eCommerceTS

[![Stars](https://img.shields.io/github/stars/KariMuhammad/eCommerceTS?style=social)](https://github.com/KariMuhammad/eCommerceTS)
[![Forks](https://img.shields.io/github/forks/KariMuhammad/eCommerceTS?style=social)](https://github.com/KariMuhammad/eCommerceTS)
[![Primary Language](https://img.shields.io/github/languages/top/KariMuhammad/eCommerceTS)](https://github.com/KariMuhammad/eCommerceTS)
[![License](https://img.shields.io/github/license/KariMuhammad/eCommerceTS)](https://github.com/KariMuhammad/eCommerceTS)

## Description

This project is a scalable backend API for an e-commerce platform, built with Node.js and TypeScript. It provides a comprehensive set of RESTful endpoints to manage users, authentication, products, brands, categories, blogs, wishlists, ratings, coupons, orders, and more. It leverages technologies like JWT for authentication, MongoDB for data storage, and Cloudinary for file uploads. (Under Development...)

## Table of Contents

- [Description](#description)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)
- [Important Links](#important-links)
- [Footer](#footer)

## Features

- 🔐 **Secure Authentication and Authorization:** JWT-based authentication for users and administrators.
- 👤 **User Management:** Comprehensive endpoints for managing users, including registration, login, profile updates, and password management.
- 🛍️ **Product Catalog:** APIs to manage products, categories, and brands with advanced filtering capabilities.
- 🛒 **Shopping Cart and Order Management:** Functionality for managing shopping carts, applying coupons, and processing orders.
- ❤️ **Wishlist and Ratings:** Support for wishlists and product ratings to enhance the user experience.
- 📝 **Blog Management:** APIs for creating, updating, and managing blog posts and categories.
- 🎁 **Coupon System:** Implementation of coupons and discounts with usage limits and expiration dates.
- ☁️ **File Uploads:** Integration with Cloudinary for handling file uploads.
- ✉️ **Email Sending:** Email service for sending password reset links and other notifications.
- ⚙️ **Query Features:** Advanced filtering, sorting, pagination, and search capabilities.
- 🏛️ **Modular Design:** Well-organized code structure for maintainability and scalability.
- 🛡️ **Error Handling:** Centralized error handling for consistent error responses.

## Tech Stack

- **TypeScript**: Primary language for type safety and maintainability.
- **Node.js**: Runtime environment for the backend.
- **Express**: Web framework for building the API.
- **Mongoose**: ODM for MongoDB.
- **JWT**: For authentication and authorization.
- **Cloudinary**: Cloud storage for image uploads.
- **bcrypt**: For password hashing.
- **nodemailer**: For sending emails.
- **express-validator**: For request validation.
- **dotenv**: For managing environment variables.
- **cors**: For handling Cross-Origin Resource Sharing.
- **morgan**: For request logging.
- **cookie-parser**: For parsing cookies.
- **sharp**: For image processing.
- **slugify**: For generating URL-friendly slugs.

## Installation

1.  **Clone the repository:**

   ```bash
   git clone https://github.com/KariMuhammad/eCommerceTS.git
   cd eCommerceTS
   ```

2.  **Install dependencies:**

   ```bash
   npm install
   # or
   yarn install
   ```

3.  **Configure environment variables:**

   Create a `.env` file based on `.env.example` and fill in the necessary values, such as:

   ```
   SERVER_DOMAIN=http://localhost
   SERVER_PORT=5000
   DB_ATLAS_URI=mongodb+srv://<username>:<password>@<cluster>/<dbname>?retryWrites=true&w=majority
   DB_NAME=ecommerce
   SECRET_KEY=your-secret-key
   REFRESH_TOKEN_KEY=your-refresh-token-key
   MAIL_ACCOUNT=your-email@gmail.com
   MAIL_PASSWORD_APP=your-email-app-password
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   CLOUDINARY_RESOURCE_LINK=your-resource-link
   CORS_ORIGIN=http://localhost:3000
   ```

4.  **Set up the database:**

   Ensure MongoDB is running and the connection URI in `.env` is correct. You can use a local MongoDB instance or a cloud-based service like MongoDB Atlas.

5.  **Run the development server:**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

6.  **Build for production:**

   ```bash
   npm run build
   ```

7.  **Start the production server:**

   ```bash
   npm start
   ```

## Usage

### Real-World Use Cases

-   **Building an E-commerce Platform:**
    This project provides a robust backend API for managing products, users, orders, and more, making it suitable for building a complete e-commerce solution.

-   **Developing a Mobile Shopping App:**
    The API can be used to power a mobile shopping app, allowing users to browse products, add items to their cart, and place orders.

-   **Creating a Blog for an Online Store:**
    The blog management feature can be used to create a blog for an online store, allowing you to share news, promotions, and other content with your customers.

### How to Use the Project

1.  **Start the server:**
    Run the development server using `npm run dev2` or the production server using `npm start`.

2.  **Access the API endpoints:**
    Use tools like Postman or Insomnia to send requests to the API endpoints. The base URL will be something like `http://localhost:5000` (depending on your `.env` configuration).

3.  **Authentication:**
    -   Register a new user: `POST /auth/register`
    -   Login a user: `POST /auth/login`

    After successful login, you will receive an access token. Include this token in the `Authorization` header of subsequent requests.

4.  **Product Management:**
    -   Get all products: `GET /products`
    -   Create a new product (Admin only): `POST /products`

5.  **Cart Management:**
    -   Add an item to the cart: `POST /cart/add`
    -   Apply a coupon to the cart: `POST /cart/apply-discount`

6. **Password Reset**
   -   Forgot Password: `POST /auth/forgot-password`
   -    Reset Password: `POST /auth/reset-password`

7. **User Profile**
   - Accessing user profile: `GET /auth/profile`

8. **Coupon Management**
     - Creating a new coupon (Admin only): `POST /coupons`

9. **Product Ratings**
    - Adding a product rating: `POST /products/:productId/ratings`

## Project Structure

```
├── .env.example                 # Example environment variables
├── .vscode                       # VS Code configuration
├── config.ts                     # Configuration settings
├── database                      # Database connection
├── src
│   ├── @types                      # Custom TypeScript definitions
│   ├── common                      # Common utilities and middleware
│   ├── features                    # Feature modules
│   │   ├── auth                    # Authentication feature
│   │   ├── blogs                   # Blog feature
│   │   ├── brands                  # Brand feature
│   │   ├── carts                   # Cart feature
│   │   ├── category                # Category feature
│   │   ├── colors                  # Color feature
│   │   ├── coupons                 # Coupon feature
│   │   ├── products                # Product feature
│   │   ├── reviews                 # Reviews feature
│   │   ├── user                    # User feature
│   │   ├── wishlist                # Wishlist feature
│   │   └── ...                     # Other features
│   ├── app.ts                      # Express application setup
│   └── server.ts                   # Server entry point
├── package.json                  # Project dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
└── README.md                     # Project documentation
```

## API Endpoints

You can find the API documentation on Postman:

[API Documentation](https://documenter.getpostman.com/view/23054100/2sAXqv61r7)

Here's a brief overview of the available endpoints:

### Authentication

| Method | Endpoint               | Description                      |
| :----- | :--------------------- | :------------------------------- |
| POST   | `/auth/register`      | Register a new user              |
| POST   | `/auth/login`         | Log in an existing user          |
| POST   | `/auth/logout`        | Log out the current user         |
| POST   | `/auth/refresh`       | Refresh the access token         |
| POST   | `/auth/forgot-password` | Request a password reset         |
| POST   | `/auth/reset-password`  | Reset the user's password        |
| PATCH  | `/auth/change-password` | Change the user's password       |
| GET    | `/auth/profile`       | Get the user's profile           |

### Users

| Method | Endpoint         | Description              |
| :----- | :--------------- | :----------------------- |
| GET    | `/users`         | Get all users            |
| GET    | `/users/:id`     | Get a specific user      |
| PUT    | `/users/:id`     | Update a user            |
| DELETE | `/users/:id`     | Delete a user            |

### Brands

| Method | Endpoint         | Description            |
| :----- | :--------------- | :--------------------- |
| GET    | `/brands`         | Get all brands         |
| GET    | `/brands/:id`     | Get a specific brand   |
| POST   | `/brands`         | Create a new brand     |
| PATCH  | `/brands/:id`     | Update a brand         |
| DELETE | `/brands/:id`     | Delete a brand         |

### Categories

| Method | Endpoint            | Description               |
| :----- | :------------------ | :------------------------ |
| GET    | `/category`         | Get all categories        |
| GET    | `/category/:id`     | Get a specific category   |
| POST   | `/category`         | Create a new category     |
| PATCH  | `/category/:id`     | Update a category         |
| DELETE | `/category/:id`     | Delete a category         |

### Products

| Method | Endpoint          | Description             |
| :----- | :---------------- | :---------------------- |
| GET    | `/products`         | Get all products        |
| GET    | `/products/:id`     | Get a specific product  |
| POST   | `/products`         | Create a new product    |
| PATCH  | `/products/:id`     | Update a product        |
| DELETE | `/products/:id`     | Delete a product        |
| POST   | `/products/:productId/ratings` | Add a product rating |

### Blogs

| Method | Endpoint        | Description           |
| :----- | :-------------- | :-------------------- |
| GET    | `/blogs`         | Get all blogs         |
| GET    | `/blogs/:id`     | Get a specific blog   |
| POST   | `/blogs`         | Create a new blog     |
| PATCH  | `/blogs/:id`     | Update a blog         |
| DELETE | `/blogs/:id`     | Delete a blog         |
| PATCH  | `/blogs/:id/like`   | Like a blog           |
| PATCH  | `/blogs/:id/unlike` | Unlike a blog         |

### Wishlist

| Method | Endpoint            | Description                       |
| :----- | :------------------ | :-------------------------------- |
| GET    | `/wishlist`         | Get all wishlist items            |
| POST   | `/wishlist/add`     | Add product to wishlist           |
| POST   | `/wishlist/remove`  | Remove product from wishlist      |

### Coupons

| Method | Endpoint         | Description            |
| :----- | :--------------- | :--------------------- |
| GET    | `/coupons`         | Get all coupons        |
| GET    | `/coupons/:id`     | Get a specific coupon  |
| POST   | `/coupons`         | Create a new coupon    |
| PATCH  | `/coupons/:id`     | Update a coupon        |
| DELETE | `/coupons/:id`     | Delete a coupon        |
| POST   | `/coupons/apply`   | Apply a coupon         |

### Cart

| Method | Endpoint          | Description                    |
| :----- | :---------------- | :----------------------------- |
| GET    | `/cart`           | Get the user's cart            |
| POST   | `/cart/add`       | Add item to the cart           |
| POST   | `/cart/remove`    | Remove item from the cart        |
| POST   | `/cart/clear`     | Clear the cart                 |
| PATCH  | `/cart/increase`  | Increase item quantity in cart  |
| PATCH  | `/cart/decrease`  | Decrease item quantity in cart  |
| POST   | `/cart/apply-discount` | Apply a discount to cart      |
| GET  | `/cart/checkout`  | Checkout | 

## Contributing

Contributions are welcome! Please follow these steps:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Make your changes and commit them with descriptive messages.
4.  Push your changes to your fork.
5.  Submit a pull request to the main repository.

## License

This project has no license.

## Important Links

-   API Documentation: [https://documenter.getpostman.com/view/23054100/2sAXqv61r7](https://documenter.getpostman.com/view/23054100/2sAXqv61r7)
-   GitHub Repository: [https://github.com/KariMuhammad/eCommerceTS](https://github.com/KariMuhammad/eCommerceTS)

## Footer

```


```

```html
<div align="center">
  <p>
    <a href="https://github.com/KariMuhammad/eCommerceTS">eCommerceTS</a>
    | Repository URL: <a href="https://github.com/KariMuhammad/eCommerceTS">https://github.com/KariMuhammad/eCommerceTS</a>
  </p>
  <p>
    Author: Karim Muhammad
  </p>
  <p>
    Contact: <a href="mailto:kimoomar005@gmail.com">kimoomar005@gmail.com</a>
  </p>
  <p>
    ⭐️ Consider giving the project a star on GitHub! ⭐️
  </p>
  <p>
    Fork the project | Like the project | Raise issues
  </p>
</div>
```
