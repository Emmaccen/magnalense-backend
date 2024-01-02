# Mangalense E-commerce Backend

Welcome to the backend of Mangalense, an e-commerce application specializing in glasses of various prescriptions. This Node.js, Express, MongoDB, and TypeScript-based backend provides essential functionalities for user authentication, product management, cart handling, and admin actions.

## Postman Documentation

Explore the detailed API documentation on Postman: [Mangalense Backend Documentation](https://documenter.getpostman.com/view/15748545/2s9YsFCtBn)

Feel free to use the provided Postman documentation for testing and interacting with the Mangalense backend. If you have any questions or issues, please refer to the [Postman documentation](https://documenter.getpostman.com/view/15748545/2s9YsFCtBn) or contact the project maintainers.

# Features and Endpoints

## User Authentication

### Register User
- **Endpoint:** `POST /user/register`
- **Description:** Users can create accounts with their email address, password, and full name.

### Login User
- **Endpoint:** `POST /user/login`
- **Description:** Users can log in to their accounts with their email address and password.

### Logout User
- **Endpoint:** `GET /user/logout`
- **Description:** Users can log out of their accounts. (Requires User Authentication)

## Product Management

### Get All Products
- **Endpoint:** `GET /product/`
- **Description:** Retrieve a list of all available products.

### Create Product
- **Endpoint:** `POST /product/`
- **Description:** Admins can add new products to the catalog. (Requires Admin Authentication)

### Update Product
- **Endpoint:** `PUT /product/:id`
- **Description:** Admins can update product information. (Requires Admin Authentication)

### Delete Product
- **Endpoint:** `DELETE /product/:id`
- **Description:** Admins can remove a product from the catalog. (Requires Admin Authentication)

### Get Single Product
- **Endpoint:** `GET /product/:id`
- **Description:** Users can view details of a specific product. (Requires User Authentication)

### Product Reviews

#### Add Review
- **Endpoint:** `POST /product/review/:productId`
- **Description:** Users can add reviews for a product. (Requires User Authentication)

#### Update Review
- **Endpoint:** `PATCH /product/review/:productId/update-review/:reviewId`
- **Description:** Users can update their product reviews. (Requires User Authentication)

#### Delete Review
- **Endpoint:** `DELETE /product/review/:productId/delete-review/:reviewId`
- **Description:** Users can delete their product reviews. (Requires User Authentication)

## Cart Management

### View User Cart
- **Endpoint:** `GET /cart/`
- **Description:** Users can view their shopping cart. (Requires User Authentication)

### Add to Cart
- **Endpoint:** `POST /cart/:productId`
- **Description:** Users can add products to their shopping cart. (Requires User Authentication)

### Remove Cart Item
- **Endpoint:** `DELETE /cart/:productId`
- **Description:** Users can remove items from their shopping cart. (Requires User Authentication)

### Adjust Cart Quantity

#### Increase Quantity
- **Endpoint:** `PATCH /cart/increase/:productId`
- **Description:** Users can increase the quantity of items in their cart. (Requires User Authentication)

#### Decrease Quantity
- **Endpoint:** `PATCH /cart/decrease/:productId`
- **Description:** Users can decrease the quantity of items in their cart. (Requires User Authentication)

## Admin Actions

### Admin Authentication

#### Register Admin
- **Endpoint:** `POST /admin/register`
- **Description:** Registers a new admin.

#### Login Admin
- **Endpoint:** `POST /admin/login`
- **Description:** Logs in an existing admin.

#### Logout Admin
- **Endpoint:** `GET /admin/logout`
- **Description:** Logs out the authenticated admin. (Requires Admin Authentication)

### User Management

#### View All Users
- **Endpoint:** `GET /admin/view-users`
- **Description:** Admins can view a list of all users. (Requires Admin Authentication)

#### View Single User
- **Endpoint:** `GET /admin/view-single-user/:userId`
- **Description:** Admins can view details of a specific user. (Requires Admin Authentication)

#### Suspend/Unsuspend User
- **Endpoint:** `PATCH /admin/suspend-user/:userId`
- **Description:** Admins can suspend or unsuspend a user account. (Requires Admin Authentication)

## Getting Started

Follow these steps to set up and run the Mangalense backend on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/) installed
- [MongoDB](https://www.mongodb.com/) installed and running

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/mangalense-backend.git
   ```

2. Navigate to the project directory:

   ```bash
   cd mangalense-backend
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Set up environment variables:

   - Create a `.env` file in the root directory.
   - Define the following variables:

     ```env
##### Database configuration
DB_URL=your-connection-string

#### JWT secret key
JWT_SECRET=your-secret-key

### Others
NODE_ENV=development
PORT=4000
 
```

     Replace `your_secret_key` with a secure key for JWT authentication.

5. Run the server:

   ```bash
   npm start
   ```

The backend should be running at `http://localhost:4000`.
 ## Contributing

Contributions to this project are welcome! Feel free to submit issues and pull requests.
Also a list of possible upgrades/features are:
- Email confirmation for register feature
- Forgot password and reset password functionality
- Unit Tests
- Image handling for the products controller.

### Inquiries
For any inquiries or questions, feel free to contact [Tosiron Jegede](mailto:tosironj@gmail.com) or [Ezeokoli Goodness](mailto:goodnessezeokoli3@gmail.com). 
## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

 