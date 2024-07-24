# E-Commerce API

## Description

This project is developed as part of the Per Scholas Software Engineering Training program. It is a Node.js application built with Express and MongoDB (Mongoose). The application serves as an e-commerce API with functionality to manage users, products, and orders. The E-Commerce API is designed to handle typical e-commerce operations, including user management, product management, and order processing. This project includes various routes to perform CRUD operations on the application's collections. The database is populated with sample data for demonstration purposes.

## Features

- **User Management**: Create, read, update, and delete users.
- **Product Management**: Create, read, update, delete, and sort products.
- **Order Management**: Create, read, update, delete orders, and fetch orders by user ID and product ID.
- **Data Population**: Scripts to populate the database with sample data.

## Setup

### Prerequisites

- Node.js
- npm
- MongoDB

### Installation

1. Clone the repository:

   ```sh
   git clone <repository_url>
   cd <repository_name>
   ```

2. Install dependencies:

   ```sh
    npm install
   ```

3. Environment Variables:

   Create a `.env` file in the root directory and add the following environment variables:

   ```env
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/<database_name>?retryWrites=true&w=majority
   PORT=5000
   ```

4. Populate the database:

   Run the following command to populate the database with sample data:

   ```sh
   npm run populateData
   ```

5. Start the server:

   ```sh
   npm start
   ```

   The server will start on the port specified in the `.env` file.

## API Endpoints

### Users

- **GET /api/users**: Get all users.
- **GET /api/users/:id**: Get a user by ID.
- **POST /api/users**: Create a new user.
- **PUT /api/users/:id**: Update a user by ID.
- **DELETE /api/users/:id**: Delete a user by ID.

### Products

- **GET /api/products**: Get all products.
  Optional Query Parameters:

  - `sortField`: Sort products by name, price, description, category, or userRating.
  - `sortOrder`: Sort order (asc or desc).
  - `limit`: Limit the number of products returned.
  - `skip`: Skip a number of products.

- **GET /api/products/:id**: Get a product by ID.
- **POST /api/products**: Create a new product.
- **PUT /api/products/:id**: Update a product by ID.
- **DELETE /api/products/:id**: Delete a product by ID.

### Orders

- **GET /api/orders**: Get all orders.
  Optional Query Parameters:

  - `sortField`: Sort orders by date (createdAt), totalAmount, or status.
  - `sortOrder`: Sort order (asc or desc).
  - `limit`: Limit the number of orders returned by the query.
  - `skip`: Skip a number of orders.

- **GET /api/orders/:id**: Get an order by ID.
- **POST /api/orders**: Create a new order.
- **PUT /api/orders/:id**: Update an order by ID.
- **DELETE /api/orders/:id**: Delete an order by ID.

### Orders by User ID

- **GET /api/orders/user/:userId**: Get orders by user ID.

### Orders by Product ID

- **GET /api/orders/product/:productId**: Get orders by product ID.

## Technologies

- Node.js
- Express
- MongoDB
- Mongoose
- TypeScript

## License

This project is licensed under the MIT License.
