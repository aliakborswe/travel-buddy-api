# Travel Buddy API

A comprehensive backend API for a travel companion platform that connects travelers, manages travel plans, facilitates bookings, and handles payments.

## 🌟 Features

- **User Management**: Complete user registration, authentication, and profile management
- **Travel Plans**: Create, update, and manage travel plans with detailed itineraries
- **Matching System**: Connect travelers with compatible travel buddies based on preferences
- **Reviews**: Rate and review travel experiences and companions
- **Payment Integration**: Secure payment processing with Stripe
- **Image Upload**: Cloudinary integration for profile pictures and travel photos
- **Authentication**: JWT-based authentication with secure cookie management
- **Authorization**: Role-based access control for different user types

## 🚀 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT)
- **Validation**: Zod
- **File Upload**: Multer + Cloudinary
- **Payment**: Stripe
- **Security**: bcryptjs for password hashing
- **Task Scheduling**: node-cron

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB database
- Cloudinary account
- Stripe account

## 🛠️ Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd travel-buddy-api
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL=your_mongodb_connection_string

# JWT Configuration
JWT_ACCESS_SECRET=your_jwt_access_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
JWT_ACCESS_EXPIRES_IN=1d
JWT_REFRESH_EXPIRES_IN=30d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Stripe Configuration
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# Frontend URL (for CORS)
CLIENT_URL=http://localhost:3000
```

4. Build the project:

```bash
npm run build
```

5. Start the development server:

```bash
npm run dev
```

## 📝 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run lint` - Run ESLint to check code quality

## 🔌 API Endpoints

### Base URL

```
http://localhost:5000/api/v1
```

### Authentication

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user
- `POST /auth/logout` - Logout user
- `POST /auth/refresh-token` - Refresh access token

### Users

- `GET /users` - Get all users (admin)
- `GET /users/:id` - Get user by ID
- `PUT /users/:id` - Update user profile
- `DELETE /users/:id` - Delete user account

### Travel Plans

- `POST /travel-plans` - Create a new travel plan
- `GET /travel-plans` - Get all travel plans
- `GET /travel-plans/:id` - Get travel plan by ID
- `PUT /travel-plans/:id` - Update travel plan
- `DELETE /travel-plans/:id` - Delete travel plan

### Matching

- `POST /matching` - Request to join a travel plan
- `GET /matching` - Get all match requests
- `PUT /matching/:id` - Update match request status

### Reviews

- `POST /reviews` - Create a review
- `GET /reviews` - Get all reviews
- `GET /reviews/:id` - Get review by ID
- `PUT /reviews/:id` - Update review
- `DELETE /reviews/:id` - Delete review

### Payments

- `POST /payments/create-intent` - Create payment intent
- `POST /payments/confirm` - Confirm payment
- `GET /payments` - Get payment history

### Upload

- `POST /upload` - Upload images to Cloudinary

## 📁 Project Structure

```
src/
├── app/
│   ├── config/            # Configuration files (Cloudinary, Multer, Environment)
│   ├── helpers/           # Error handlers and utility helpers
│   ├── middlewares/       # Express middlewares (auth, validation, error handling)
│   ├── modules/           # Feature modules
│   │   ├── auth/          # Authentication logic
│   │   ├── matching/      # Travel buddy matching
│   │   ├── payment/       # Payment processing
│   │   ├── reviews/       # Review management
│   │   ├── travel-plans/  # Travel plan management
│   │   └── user/          # User management
│   ├── routes/            # Route definitions
│   ├── types/             # TypeScript type definitions
│   ├── upload/            # File upload handling
│   └── utils/             # Utility functions
├── app.ts                 # Express app configuration
└── server.ts              # Server entry point
```

## 🔒 Authentication

The API uses JWT-based authentication with access and refresh tokens. Tokens are stored in HTTP-only cookies for security.

### Protected Routes

Most endpoints require authentication. Include the access token in cookies when making requests to protected routes.

## 🌐 CORS Configuration

The API is configured to accept requests from:

- `https://travel-buddy-client-coral.vercel.app` (Production)
- `http://localhost:3000` (Development)

## 🚢 Deployment

This project is configured for deployment on Vercel. The `vercel.json` file contains the necessary configuration.

To deploy:

```bash
vercel --prod
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👤 Author

Travel Buddy API

## 🐛 Bug Reports

If you discover any bugs, please create an issue on GitHub with detailed information about the problem.

## 📧 Contact

For questions or support, please contact the development team.

---

**Happy Traveling! 🌍✈️**
