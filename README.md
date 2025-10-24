# SpendThrone.com

A comprehensive financial management application with a real-time leaderboard, built with modern web technologies.

## Project Overview

SpendThrone.com is a full-stack financial management platform that allows users to track their spending, compete with friends, and climb the leaderboard by achieving financial goals. The application features a neon-rich design with real-time updates and gamification elements.

## Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Styling**: TailwindCSS
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **State Management**: React Context API
- **Real-time Communication**: Socket.IO Client

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **TypeScript**: For type safety
- **Real-time Communication**: Socket.IO
- **Environment Variables**: dotenv

### Development Tools
- **Package Manager**: npm
- **Build Tool**: Vite
- **Linting**: ESLint
- **Type Checking**: TypeScript Compiler

## Project Structure

```
SpendThrone.com/
├── client/                 # React frontend application
│   ├── public/            # Static assets
│   ├── src/               # React source code
│   ├── package.json       # Frontend dependencies
│   └── vite.config.ts     # Vite configuration
├── server/                # Node.js backend application
│   ├── src/              # Backend source code
│   └── package.json      # Backend dependencies
├── shared/               # Shared types and utilities
├── package.json          # Root package.json with workspace configuration
├── tsconfig.json         # TypeScript configuration
├── .gitignore            # Git ignore rules
└── README.md             # This file
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/SpendThrone.com.git
   cd SpendThrone.com
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   # Create a .env file in the server directory
   cd server
   cp .env.example .env
   # Edit .env with your configuration
   ```

### Running the Application

1. Start the development servers:
   ```bash
   # From the root directory
   npm run dev
   ```
   
   This will start both the frontend and backend servers:
   - Frontend: http://localhost:5173
   - Backend: http://localhost:3000

2. For production:
   ```bash
   npm run build
   npm start
   ```

## Features

### User Management
- User registration and authentication
- Profile management with avatar upload
- Social connections with friends

### Financial Tracking
- Expense tracking with categories
- Income and budget management
- Financial goal setting and tracking

### Leaderboard & Gamification
- Real-time leaderboard based on savings
- Achievement system with badges
- Competition with friends

### Real-time Updates
- Live leaderboard updates
- Real-time notifications
- Instant financial data sync

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### User Profile
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `POST /api/user/avatar` - Upload avatar

### Financial Data
- `GET /api/transactions` - Get user transactions
- `POST /api/transactions` - Add a new transaction
- `GET /api/budgets` - Get user budgets
- `POST /api/budgets` - Create a new budget

### Leaderboard
- `GET /api/leaderboard` - Get leaderboard data
- `GET /api/leaderboard/friends` - Get friends leaderboard

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please contact support@spendthrone.com or open an issue on GitHub.

## Roadmap

- [ ] Mobile app development
- [ ] Advanced analytics dashboard
- [ ] Investment tracking
- [ ] Group savings challenges
- [ ] Integration with banks and financial institutions