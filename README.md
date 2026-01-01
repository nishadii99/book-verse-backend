# 📚 BookVerse Backend

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)

**A powerful and scalable backend API for the BookVerse online bookstore platform**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [API Documentation](#-api-documentation) • [Project Structure](#-project-structure)

</div>

---

## ✨ Features

### 🔐 Authentication & Authorization
- **Secure User Authentication** with JWT tokens
- **Role-based Access Control** (Admin/User roles)
- **Password Encryption** using bcrypt
- Protected routes with middleware authentication

### 📖 Book Management
- Complete CRUD operations for books
- Book catalog with detailed information
- Image upload support via Cloudinary
- Search and filter capabilities

### 🛒 Shopping Experience
- **Shopping Cart** functionality
- Add, update, and remove items from cart
- Real-time cart management

### 📦 Order Processing
- Order creation and management
- Order history tracking
- Payment integration support
- Order status updates

### 🤖 AI-Powered Features
- **Smart Book Recommendations** using Google Generative AI
- Personalized suggestions based on user preferences
- AI-driven content analysis

### 📊 Additional Features
- User browsing history tracking
- Payment processing integration
- CORS enabled for cross-origin requests
- RESTful API architecture

---

## 🛠️ Tech Stack

| Category | Technologies |
|----------|-------------|
| **Runtime** | Node.js, TypeScript |
| **Framework** | Express.js |
| **Database** | MongoDB with Mongoose ODM |
| **Authentication** | JWT (jsonwebtoken), bcryptjs |
| **AI/ML** | Google Generative AI |
| **File Upload** | Multer, Cloudinary |
| **Development** | ts-node-dev, TypeScript Compiler |
| **HTTP Client** | Axios |
| **Security** | CORS, JWT middleware |

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (local or Atlas)
- **Cloudinary Account** (for image uploads)
- **Google AI API Key** (for AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/nishadii99/book-verse-backend.git
   cd book-verse-be
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   
   Create a `.env` file in the root directory with the following variables:
   ```env
   # Server Configuration
   PORT=5000
   
   # Database
   MONGO_URI=your_mongodb_connection_string
   
   # JWT Authentication
   JWT_SECRET=your_jwt_secret_key
   
   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   
   # AI Services
   GOOGLE_AI_API_KEY=your_google_ai_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   npm start
   ```

The server will start running at `http://localhost:5000`

---

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api/v1
```

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/auth/register` | Register a new user | ❌ |
| `POST` | `/auth/login` | Login user | ❌ |
| `GET` | `/auth/profile` | Get user profile | ✅ |
| `PUT` | `/auth/profile` | Update user profile | ✅ |

### Book Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/book` | Get all books | ❌ |
| `GET` | `/book/:id` | Get book by ID | ❌ |
| `POST` | `/book` | Create new book | ✅ (Admin) |
| `PUT` | `/book/:id` | Update book | ✅ (Admin) |
| `DELETE` | `/book/:id` | Delete book | ✅ (Admin) |

### Cart Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/cart` | Get user cart | ✅ |
| `POST` | `/cart` | Add item to cart | ✅ |
| `PUT` | `/cart/:id` | Update cart item | ✅ |
| `DELETE` | `/cart/:id` | Remove from cart | ✅ |

### Order Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/orders` | Get user orders | ✅ |
| `GET` | `/orders/:id` | Get order by ID | ✅ |
| `POST` | `/orders` | Create new order | ✅ |
| `PUT` | `/orders/:id` | Update order status | ✅ (Admin) |

### AI Recommendation Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/recommend` | Get AI book recommendations | ✅ |

---

## 📁 Project Structure

```
book-verse-be/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Request handlers
│   │   ├── auth.controller.ts
│   │   ├── book.controller.ts
│   │   ├── cart.controller.ts
│   │   ├── order.controller.ts
│   │   └── ai.controller.ts
│   ├── middleware/      # Custom middleware
│   │   ├── auth.ts      # JWT authentication
│   │   ├── role.ts      # Role-based access control
│   │   └── upload.ts    # File upload handling
│   ├── models/          # Mongoose schemas
│   │   ├── user.model.ts
│   │   ├── book.model.ts
│   │   ├── cart.model.ts
│   │   ├── order.model.ts
│   │   ├── payment.model.ts
│   │   └── history.model.ts
│   ├── routes/          # API routes
│   │   ├── auth.ts
│   │   ├── book.ts
│   │   ├── cart.ts
│   │   ├── order.ts
│   │   └── ai.router.ts
│   ├── utils/           # Utility functions
│   └── index.ts         # Application entry point
├── .env                 # Environment variables
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt encryption for user passwords
- **Role-Based Access**: Middleware for admin/user permissions
- **CORS Protection**: Configured cross-origin resource sharing
- **Environment Variables**: Sensitive data stored securely

---

## 🧪 Development

### Available Scripts

```bash
# Start development server with hot reload
npm run dev

# Build TypeScript to JavaScript
npm run build

# Start production server
npm start
```

### Development Tools

- **ts-node-dev**: Fast TypeScript execution with auto-restart
- **TypeScript**: Static type checking
- **ESLint**: Code linting (if configured)
- **Prettier**: Code formatting (if configured)

---


## 🙏 Acknowledgments

- Express.js for the robust web framework
- MongoDB for the flexible database solution
- Google Generative AI for AI-powered features
- Cloudinary for image management
- All contributors and supporters

---