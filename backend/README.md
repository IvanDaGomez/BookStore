# Book Store API Documentation

## 1. Project Overview

The Book Store API is a comprehensive backend service for a digital book marketplace application. It provides a complete set of features for managing books, users, transactions, messaging, and more. This API powers the "LibrosSinTitulo" book store platform.

### Key Technologies

- **Language**: TypeScript/JavaScript (Node.js)
- **Framework**: Express.js
- **Database Options**: 
  - Local storage (using db-local)
  - PostgreSQL (using pg driver)
- **Authentication**: JWT (JSON Web Tokens)
- **File Handling**: Multer for uploads, Sharp for image optimization
- **Payments**: MercadoPago integration
- **Email**: Nodemailer with Gmail API integration
- **AI Integration**: TensorFlow.js for predictions, OpenAI for content generation

### Architecture

The application follows a modular architecture with clear separation of concerns:

- **Routes**: Define API endpoints and handle request routing
- **Controllers**: Implement business logic and process requests
- **Models**: Handle data access and persistence
- **Middlewares**: Provide cross-cutting functionality like authentication
- **Assets**: House utility functions and helpers

The application supports both local database storage and PostgreSQL, with appropriate abstraction layers to switch between them.

## 2. Core Features

### User Management
- User registration, authentication, and profile management
- JWT-based authentication
- User preferences and history tracking

### Book Management
- CRUD operations for books
- Book search and filtering
- Book recommendations and "For You" page
- Book review system

### Messaging and Conversations
- Direct messaging between users
- Conversation threading and management

### Notification System
- Custom notification types
- Notification delivery and tracking

### Transaction Handling
- Integration with MercadoPago for payment processing
- Order tracking and management
- Failed transaction handling

### Collection Management
- Group books into collections
- Collection CRUD operations

### Email System
- Email notifications and alerts
- HTML email templates
- Integration with Gmail API

### File Upload System
- Support for book cover and content images
- Image optimization for performance
- Secure file storage

### AI Integration
- TensorFlow.js for book information prediction
- OpenAI integration for content generation
- Book matching and recommendation algorithms

## 3. API Endpoints Structure

### Users (`/api/users`)

The Users API handles all user-related functionality, including user management, authentication, collections, and payment processing.

#### User Management
- `GET /api/users` - Retrieve all users (safe version with limited data)
- `POST /api/users` - Create a new user
- `GET /api/users/:userId` - Get a specific user by ID
- `PATCH /api/users/:userId` - Update a user (supports image upload)
- `DELETE /api/users/:userId` - Delete a user
- `GET /api/users/query` - Search users using query parameters
- `GET /api/users/:userId/photoAndName` - Get only photo and name for a user
- `GET /api/users/c/:userId` - Get email by user ID

#### Authentication
- `POST /api/users/login` - User login with email/password
- `POST /api/users/google-login` - Login/register with Google
- `POST /api/users/facebook-login` - Login/register with Facebook
- `POST /api/users/logout` - User logout
- `POST /api/users/userSession` - Get current user data from session

#### Password Management
- `POST /api/users/changePasswordEmail` - Send password reset email
- `POST /api/users/changePassword` - Change user password

#### User Validation
- `POST /api/users/sendValidationEmail` - Send email validation link
- `GET /api/users/validateUser/:token` - Validate user email with token

#### Collection Management
- `POST /api/users/newCollection` - Create a new collection
- `POST /api/users/addToCollection` - Add a book to a collection
- `POST /api/users/getBooksByCollection` - Get books in a collection

#### User Relationships
- `POST /api/users/follow` - Follow/unfollow another user

#### Payment Processing
- `POST /api/users/process_payment` - Process a payment
- `POST /api/users/getPreferenceId` - Get MercadoPago preference ID
- `GET /api/users/balance/:userId` - Get user balance
- `POST /api/users/mercadoPagoWebHooks` - Handle MercadoPago webhook notifications

### Books (`/api/books`)

The Books API provides comprehensive functionality for managing books, including creation, retrieval, updating, and deletion operations, as well as specialized endpoints for searching, filtering, and AI-powered features.

#### Book Management
- `GET /api/books` - Retrieve all books
- `POST /api/books` - Create a new book (supports multipart/form-data with up to 5 images)
- `GET /api/books/:bookId` - Get a specific book by ID
- `PUT /api/books/:bookId` - Update a specific book (supports multipart/form-data with up to 5 images)
- `DELETE /api/books/:bookId` - Delete a specific book

#### Book Review System
- `GET /api/books/review` - Get all books pending review
- `POST /api/books/review` - Submit a book for review (supports multipart/form-data with up to 5 images)
- `PUT /api/books/review/:bookId` - Update a book under review
- `DELETE /api/books/review/:bookId` - Delete a book from the review system

#### Search and Filtering
- `GET /api/books/query` - Search books using query parameters
- `GET /api/books/query/filters` - Search books with advanced filtering options
- `GET /api/books/search/:bookTitle` - Search books by title
- `GET /api/books/getFavoritesByUser/:userId` - Get books favorited by a specific user

#### AI and Recommendations
- `GET /api/books/fyp` - Get personalized "For You Page" book recommendations
- `POST /api/books/predictInfo` - Use AI to predict book information from an image (supports single image upload)
- `POST /api/books/generateDescription` - Generate book descriptions using AI

### Messages (`/api/messages`)
- Send and receive messages
- Message threading and organization

### Conversations (`/api/conversations`)
- Conversation management
- Conversation participants and context

### Notifications (`/api/notifications`)
- Notification creation and delivery
- Notification preferences

### Collections (`/api/collections`)
- Collection creation and management
- Adding/removing books from collections

### Emails (`/api/emails`)
- Email template management
- Email sending and tracking

### Transactions (`/api/transactions`)
- Payment processing and tracking
- Order management

## 4. Technical Details

### Server Configuration
The server is built with Express.js and includes the following key configuration:

- CORS handling with whitelist of approved origins
- Cookie parsing and management
- JSON request body parsing
- JWT authentication middleware
- Request tracking for analytics
- Static file serving for uploads and optimized files
- Comprehensive error handling

### Database Models
The application supports two database options:

1. **Local Storage** (using db-local)
   - File-based data storage for development
   - JSON-based data structures

2. **PostgreSQL**
   - Relational database for production
   - Structured tables with relationships

Models are abstracted to work with either database option, with specific implementations for each.

### Authentication and Authorization
- JWT-based authentication with token generation and verification
- Cookie-based token storage
- Middleware for protecting routes

### File Handling
- File uploads managed with Multer
- Image optimization using Sharp
- Separate directories for:
  - `/uploads`: Original uploaded files
  - `/optimized`: Processed and optimized files

### Error Handling
- Centralized error handling middleware
- Environment-aware error responses (detailed in development, sanitized in production)
- Error logging for debugging

### Environment Configuration
Environment variables manage configuration for:
- Database connection details
- API keys for external services
- JWT secrets
- Server port and host settings

## 5. External Integrations

### MercadoPago
- Payment processing for book purchases
- Payment response handling
- Transaction tracking

### Gmail API
- Integration with Gmail for sending emails
- OAuth authentication for secure email sending

### TensorFlow.js
- AI-powered predictions for book information
- Automated content categorization

### OpenAI
- Content generation for book descriptions
- AI-assisted responses

## 6. Development Setup

### Prerequisites
- Node.js (v14 or higher recommended)
- npm or yarn
- PostgreSQL (for production deployment)
- TypeScript knowledge

### Installation
1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Configure environment variables (see Environment Configuration section)
4. Start the development server:
   ```
   npm run dev
   ```

### Available Scripts
- `npm run dev`: Start the development server with ts-node-dev in watch mode with automatic transpilation
- `npm run dev:local`: Start the server with local database configuration
- `npm run dev:postgre`: Start the server with PostgreSQL database configuration
- `npm run updateDataBase`: Run database update/migration script

### Project Dependencies

#### Core Libraries
- `express`: Web framework for Node.js
- `typescript`: JavaScript with syntax for types
- `dotenv`: Environment variable management
- `cors`: Cross-Origin Resource Sharing middleware
- `cookie-parser`: Cookie parsing middleware

#### Database
- `db-local`: Local file-based database for development
- `pg`: PostgreSQL client for production database

#### Authentication and Security
- `bcrypt`: Password hashing library
- `jsonwebtoken`: JWT implementation for authentication
- `zod`: TypeScript-first schema validation

#### File Handling
- `multer`: Middleware for handling multipart/form-data
- `sharp`: Image processing library for resizing and optimization

#### External Services
- `mercadopago`: MercadoPago payment processing integration
- `nodemailer`: Email sending library
- `googleapis`: Google APIs client library for Gmail integration
- `openai`: OpenAI API client for AI content generation
- `@tensorflow/tfjs`: TensorFlow.js for machine learning capabilities

#### Data Processing
- `papaparse`: CSV parsing library

#### Testing and Development
- `playwright`: Browser automation for testing
- `ts-node-dev`: TypeScript execution and development server

### Module Aliases
The project uses module aliases for cleaner imports:
```json
"_moduleAliases": {
  "@assets": "src/assets"
}
```

This allows importing asset files using the `@assets` prefix, for example:
```typescript
import { config } from '@assets/config';
```

### TypeScript Configuration
The project is configured with TypeScript and includes type definitions for all major dependencies:
- `@types/express`
- `@types/node`
- `@types/bcrypt`
- `@types/jsonwebtoken`
- And many others

TypeScript provides type safety and better developer experience through code completion and error checking.

### Linting and Code Style
The project uses Standard.js for linting and code style:
```json
"eslintConfig": {
  "extends": "standard"
}
```

Standard.js enforces consistent code formatting without requiring configuration.

### Environment Configuration

The application uses environment variables for configuration. **IMPORTANT: Never commit your actual .env file to version control as it contains sensitive credentials.**

1. Create a `.env` file in the project root with the following variables:

```
# Server configuration
PORT=3030
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:3030
BACKEND_DOMAIN=https://your-domain.ngrok-free.app

# Brand configuration
BRAND_NAME=YourBrandName
LOGO_URL=http://localhost:3030/uploads/logo.png

# Database configuration (PostgreSQL)
POSTGRESQL_HOST=localhost
POSTGRESQL_PORT=5432
POSTGRESQL_DATABASE=your_database_name
POSTGRESQL_USERNAME=your_username
POSTGRESQL_PASSWORD=your_password

# JWT configuration
JWT_SECRET=your_very_long_and_secure_random_string

# Email configuration
EMAIL=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_CLIENT_ID=your_gmail_client_id.apps.googleusercontent.com
EMAIL_CLIENT_SECRET=your_gmail_client_secret
EMAIL_REFRESH_TOKEN=your_gmail_refresh_token

# MercadoPago configuration
MERCADOPAGO_ACCESS_TOKEN=your_mercadopago_access_token
MERCADOPAGO_COLLECTOR_ID=your_collector_id
MERCADOPAGO_WEBHOOKS_SECRET=your_webhooks_secret

# OpenAI configuration
OPENAI_API_KEY=your_openai_api_key
```

2. Create an `.env.example` file with the same structure but without actual credentials to serve as a template for other developers:

```
# Server configuration
PORT=3030
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:3030
BACKEND_DOMAIN=https://your-domain.ngrok-free.app

# Brand configuration
BRAND_NAME=YourBrandName
LOGO_URL=http://localhost:3030/uploads/logo.png

# Database configuration (PostgreSQL)
POSTGRESQL_HOST=localhost
POSTGRESQL_PORT=5432
POSTGRESQL_DATABASE=your_database_name
POSTGRESQL_USERNAME=your_username
POSTGRESQL_PASSWORD=your_password

# JWT configuration
JWT_SECRET=your_very_long_and_secure_random_string

# Email configuration
EMAIL=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_CLIENT_ID=your_gmail_client_id.apps.googleusercontent.com
EMAIL_CLIENT_SECRET=your_gmail_client_secret
EMAIL_REFRESH_TOKEN=your_gmail_refresh_token

# MercadoPago configuration
MERCADOPAGO_ACCESS_TOKEN=your_mercadopago_access_token
MERCADOPAGO_COLLECTOR_ID=your_collector_id
MERCADOPAGO_WEBHOOKS_SECRET=your_webhooks_secret

# OpenAI configuration
OPENAI_API_KEY=your_openai_api_key
```

### Security Notes for Environment Variables

1. **JWT Secret**: Generate a strong random string (at least 32 characters) for your JWT_SECRET.
2. **API Keys**: Restrict API keys with proper scopes and permissions.
3. **Database Credentials**: Use a dedicated database user with limited permissions.
4. **Gmail API**: Set up OAuth properly and store refresh tokens securely.
5. **Environment Separation**: Use different credentials for development, testing, and production environments.
6. **Rotation Policy**: Implement a regular schedule for rotating sensitive credentials.
7. **Access Control**: Limit who has access to production environment variables.


## 7. Additional Guidance and Best Practices

### Troubleshooting
- Check environment variables are correctly set
- Ensure database connections are established
- Verify external API keys are valid and not expired
- Monitor logs for error messages

### Extending the API
- Follow the existing modular structure
- Add new routes in appropriate route files
- Implement controllers with clear responsibility separation
- Update models for new data requirements
- Document new endpoints

### Security Best Practices
- Keep JWT secrets secure and rotate periodically
- Sanitize and validate all user inputs
- Implement rate limiting for API endpoints
- Follow OWASP guidelines for Express.js applications
- Use environment variables for all sensitive configuration

## 8. Conclusion

This Book Store API provides a robust foundation for building a complete book marketplace application. The modular architecture makes it easy to extend and maintain, while the dual database support allows for flexible deployment options.

For any issues or feature requests, please create an issue in the repository or contact the development team.

### Resources
- [Express.js Documentation](https://expressjs.com/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [MercadoPago API Documentation](https://www.mercadopago.com.ar/developers/en/reference)
- [OpenAI API Documentation](https://platform.openai.com/docs/api-reference)

