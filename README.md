# Subscription Tracker

A modern subscription management application that helps users track and manage their recurring payments, receive timely renewal reminders via email, and get insights into their subscription spending.



## 📋 Features

- **User Authentication** - Secure signup/login with JWT
- **Subscription Management** - Create, view, update, and delete subscriptions
- **Automated Reminders** - Email notifications before subscription renewals (7, 5, 2, and 1 days before)
- **Cancellation Tracking** - Mark subscriptions as active or cancelled
- **Security** - Rate limiting and bot protection with Arcjet

## 🛠️ Technologies

### Backend
- **Node.js & Express** - API framework
- **PostgreSQL** - Database
- **JWT** - Authentication
- **Nodemailer** - Email notifications
- **Upstash Workflow** - Scheduled reminder system
- **Arcjet** - Security and rate limiting

## 📦 Project Structure

```
subscripion-tracker/
├── app.js                  # Application entry point
├── config/                 # Configuration files
│   ├── arcjet.js           # Security configuration
│   ├── env.js              # Environment variables
│   ├── nodemailer.js       # Email configuration
│   └── upstash.js          # Workflow configuration
├── controllers/            # Request handlers
│   ├── auth.controller.js
│   ├── subscription.controller.js
│   ├── user.controller.js
│   └── workflow.controller.js
├── database/               # Database setup
│   ├── init.js             # Database initialization
│   └── postgresdb.js       # PostgreSQL connection
├── middleware/             # Express middleware
│   ├── arcjet.middleware.js
│   ├── auth.middleware.js
│   └── error.middleware.js
├── models/                 # Database models
│   ├── subscription.model.js
│   └── user.model.js
├── routes/                 # API routes
│   ├── auth.routes.js
│   ├── subscription.routes.js
│   ├── user.routes.js
│   └── workflow.routes.js
└── utils/                  # Utility functions
    ├── email-template.js
    └── send-email.js
```

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- PostgreSQL
- Upstash account
- Gmail account (for sending emails)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/subdub.git
   cd subdub
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables by creating a `.env.development.local` file:
   ```
   PORT=5500
   NODE_ENV=development
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=subdub
   DB_USER=postgres
   DB_PASSWORD=your_password
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRATION=7d
   ARCJET_KEY=your_arcjet_key
   QSTASH_URL=your_qstash_url
   QSTASH_TOKEN=your_qstash_token
   SERVER_URL=http://localhost:5500
   EMAIL_PASSWORD=your_gmail_app_password
   ```

4. Initialize the database
   ```bash
   node database/init.js
   ```

5. Start the server
   ```bash
   npm run dev
   ```

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint          | Description        | Auth Required |
|--------|-------------------|--------------------|--------------|
| POST   | `/v1/auth/sign-up` | Register new user  | No           |
| POST   | `/v1/auth/sign-in` | Login user         | No           |
| POST   | `/v1/auth/sign-out` | Logout user        | Yes          |

### Subscription Endpoints

| Method | Endpoint                        | Description                 | Auth Required |
|--------|---------------------------------|-----------------------------|--------------|
| GET    | `/v1/subscriptions`             | Get all user subscriptions  | Yes          |
| GET    | `/v1/subscriptions/:id`         | Get subscription by ID      | Yes          |
| POST   | `/v1/subscriptions`             | Create new subscription     | Yes          |
| PUT    | `/v1/subscriptions/:id`         | Update subscription         | Yes          |
| DELETE | `/v1/subscriptions/:id`         | Delete subscription         | Yes          |
| PUT    | `/v1/subscriptions/:id/cancel`  | Cancel subscription         | Yes          |

### User Endpoints

| Method | Endpoint           | Description           | Auth Required |
|--------|--------------------|-----------------------|--------------|
| GET    | `/v1/users`        | Get all users         | No           |
| GET    | `/v1/users/:id`    | Get user by ID        | Yes          |

### Workflow Endpoints

| Method | Endpoint                           | Description                | Auth Required |
|--------|-----------------------------------|----------------------------|--------------|
| POST   | `/v1/workflows/subscription/reminder` | Process subscription reminder | No*          |

\* *Internal endpoint triggered by Upstash Workflow*

## 🔄 Workflow System

SubDub uses Upstash Workflow to manage subscription reminders:

1. When a subscription is created, a workflow is triggered
2. The workflow schedules reminder emails at 7, 5, 2, and 1 days before the subscription renewal date
3. At each reminder date, an email is sent with details about the upcoming renewal

## 📧 Email Notifications

The system sends beautifully formatted HTML emails with:

- Subscription name and plan
- Renewal date
- Price information
- Payment method
- Days remaining until renewal

## 🔒 Security Features

- JWT authentication for API endpoints
- Password hashing with bcrypt
- Rate limiting with Arcjet
- Bot protection

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
