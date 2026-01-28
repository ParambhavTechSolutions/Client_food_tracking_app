# 🥗 Daily Wellness Delivered

<div align="center">

![React](https://img.shields.io/badge/React-18.3.1-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5.4.19-purple?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.17-cyan?logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green)
[![Deployed on Render](https://img.shields.io/badge/Deployed%20on-Render-46E3B7?logo=render)](https://client-food-tracking-app.onrender.com)

**A modern, mobile-first food delivery and meal tracking application**

[Live Demo](https://client-food-tracking-app.onrender.com) • [Features](#-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [Documentation](#-documentation)

</div>

---

## 📖 About

**Daily Wellness Delivered** is a comprehensive food delivery and wellness tracking application designed to help users manage their healthy meal subscriptions, track deliveries in real-time, and maintain their wellness journey. Built with modern web technologies and best practices, this app provides a seamless experience for both users and developers.

## ✨ Features

### 💳 Payment Gateway Integration
- **Google Pay** - UPI-based instant payments
- **PhonePe** - Fast and secure UPI transactions
- **Razorpay** - Cards, UPI, and wallet support
- Mock payment processing with realistic UI/UX
- Transaction ID generation and tracking

### 💰 Wallet Management
- Digital wallet with real-time balance updates
- Transaction history with filtering
- Quick amount selection (₹500, ₹1000, ₹2000, ₹5000)
- Custom amount input
- Low balance warnings and alerts

### 📅 Subscription Management
- Visual calendar showing delivery schedule
- Active subscription tracking
- Progress indicators for remaining days
- Pause and resume functionality
- Plan modification options

### 🚚 Delivery Tracking
- Real-time delivery status updates
- Estimated delivery time
- Multiple delivery statuses (Scheduled, Out for Delivery, Delivered, Paused)
- Delivery person details
- Live tracking integration ready

### 🍽️ Meal Customization
- Browse 5+ healthy meal options
- Nutritional information (calories, tags)
- Meal swapping for upcoming days
- Dietary preference filters
- Favorite meals management

### 📍 Address Management
- Multiple delivery addresses
- Default address selection
- Home, Office, and custom labels
- Easy address editing

### 🔔 Notifications
- Delivery updates
- Subscription alerts
- Payment confirmations
- Low balance warnings

### 📱 Mobile-First Design
- Responsive layout optimized for mobile
- Touch-friendly interface
- Bottom navigation for easy access
- Smooth animations and transitions

## 🛠️ Tech Stack

### Frontend
- **React 18.3.1** - Modern React with hooks
- **TypeScript 5.8.3** - Type-safe development
- **Vite 5.4.19** - Lightning-fast build tool
- **Tailwind CSS 3.4.17** - Utility-first CSS framework

### UI Components
- **shadcn/ui** - 50+ accessible components
- **Radix UI** - Unstyled, accessible primitives
- **Lucide React** - Beautiful icon library

### State Management & Routing
- **React Router v6** - Client-side routing
- **React Query** - Server state management
- **React Hook Form** - Form handling
- **Zod** - Schema validation

### Development Tools
- **ESLint** - Code linting
- **Vitest** - Unit testing
- **TypeScript ESLint** - TypeScript linting
- **PostCSS** - CSS processing

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ParambhavTechSolutions/Client_food_tracking_app.git
   cd Client_food_tracking_app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   Navigate to http://localhost:8080
   ```

### Available Scripts

```bash
# Development
npm run dev          # Start dev server with hot reload

# Build
npm run build        # Production build
npm run build:dev    # Development build

# Testing
npm test             # Run tests
npm run test:watch   # Run tests in watch mode

# Linting
npm run lint         # Run ESLint

# Preview
npm run preview      # Preview production build
```

## 📂 Project Structure

```
Food_tracker_App/
├── public/                    # Static assets
│   ├── favicon.png           # Custom wellness favicon
│   └── placeholder.svg       # Placeholder images
├── src/
│   ├── assets/               # Images and media
│   │   ├── meal-chicken-salad.jpg
│   │   ├── meal-buddha-bowl.jpg
│   │   └── ...
│   ├── components/
│   │   ├── home/            # Home page components
│   │   ├── layout/          # Layout components
│   │   ├── ui/              # shadcn/ui components
│   │   └── PaymentGateway.tsx
│   ├── data/
│   │   └── mockData.ts      # Mock data for development
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility functions
│   ├── pages/               # Route pages
│   │   ├── HomePage.tsx
│   │   ├── WalletPage.tsx
│   │   ├── SubscriptionPage.tsx
│   │   └── ...
│   ├── types/
│   │   └── index.ts         # TypeScript types
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles
├── index.html               # HTML template
├── package.json             # Dependencies
├── tailwind.config.ts       # Tailwind configuration
├── tsconfig.json            # TypeScript config
└── vite.config.ts           # Vite configuration
```

## 🎨 Design System

### Color Palette
- **Primary**: Sage Green (`#10b981`) - Health and wellness
- **Secondary**: Warm Cream - Subtle backgrounds
- **Accent**: Soft Coral - Call-to-action elements
- **Success**: Green - Positive actions
- **Warning**: Amber - Alerts and warnings
- **Info**: Blue - Informational messages

### Typography
- **Font Family**: Plus Jakarta Sans
- **Weights**: 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)

### Components
- Card-based layouts with subtle shadows
- Smooth transitions (200ms ease-out)
- Touch-friendly targets (min 48px)
- Consistent spacing and padding

## 📱 Pages Overview

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Dashboard with wallet, today's meal, and quick actions |
| Subscription | `/subscription` | Manage subscription and view calendar |
| Wallet | `/wallet` | Add money, view transactions, manage balance |
| Account | `/account` | User profile and settings |
| Pause | `/pause` | Pause subscription deliveries |
| Tracking | `/tracking` | Track current delivery status |
| Customize | `/customize` | Browse and swap meals |
| Address | `/address` | Manage delivery addresses |
| Notifications | `/notifications` | View all notifications |
| Login | `/login` | User authentication |

## 🔧 Configuration

### Environment Variables

Currently, the app uses mock data and doesn't require environment variables. For production deployment with real APIs:

```env
# API Configuration
VITE_API_BASE_URL=your_api_url
VITE_RAZORPAY_KEY=your_razorpay_key

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_PUSH_NOTIFICATIONS=true
```

### Tailwind Configuration

The app uses a custom Tailwind configuration with:
- Custom color palette
- Extended spacing
- Custom animations
- Typography plugin
- Form plugin

## 🚀 Deployment

### Deploy to Render

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Render**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Static Site"
   - Connect your GitHub repository
   - Configure build settings:
     - **Build Command**: `npm run build`
     - **Publish Directory**: `dist`

3. **Deploy**
   - Click "Create Static Site"
   - Render will automatically deploy your app

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

### Deploy to Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod
```

## 📚 Documentation

- [Project Overview](./PROJECT_OVERVIEW.md) - Comprehensive project documentation
- [Payment Integration](./PAYMENT_INTEGRATION.md) - Payment gateway implementation details
- [Repository Description](./REPO_DESCRIPTION.md) - GitHub repository information

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test -- --coverage
```

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m "Add amazing feature"
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

## 🐛 Known Issues

- Security vulnerabilities in dependencies (run `npm audit fix`)
- Favicon cache may require hard refresh in some browsers

## 🗺️ Roadmap

### Phase 1 - Backend Integration
- [ ] Connect to real API endpoints
- [ ] Implement authentication (JWT/OAuth)
- [ ] Database integration
- [ ] Real payment gateway integration

### Phase 2 - Enhanced Features
- [ ] Push notifications
- [ ] Meal rating and feedback system
- [ ] Referral program
- [ ] Calorie tracking dashboard
- [ ] Weekly/monthly nutrition reports

### Phase 3 - Advanced Features
- [ ] Social sharing
- [ ] Favorite meals list
- [ ] Dietary restrictions management
- [ ] Recipe details and ingredients
- [ ] Multi-language support

### Phase 4 - Technical Improvements
- [ ] PWA support (offline mode)
- [ ] Image optimization
- [ ] Analytics integration
- [ ] A/B testing
- [ ] Comprehensive E2E tests

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Parambhav Tech Solutions** - [GitHub](https://github.com/ParambhavTechSolutions)

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) - Amazing UI components
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Radix UI](https://www.radix-ui.com/) - Accessible component primitives
- [Lucide Icons](https://lucide.dev/) - Beautiful icon library
- [Vite](https://vitejs.dev/) - Next generation frontend tooling

## 📞 Support

For support, email support@parambhavtech.com or open an issue in the repository.

## 🌟 Show Your Support

If you find this project helpful, please give it a ⭐️ on GitHub!

---

<div align="center">

**Built with ❤️ by ParamBhaav technologies**

[Report Bug](https://github.com/ParambhavTechSolutions/Client_food_tracking_app/issues) • [Request Feature](https://github.com/ParambhavTechSolutions/Client_food_tracking_app/issues)

</div>
