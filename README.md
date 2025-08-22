# RevoU Project Web

<div align="center">
  <h3>🚀 Modern Full-Stack Web Application</h3>
  <p>A cutting-edge web application built with Next.js 15, TypeScript, and modern development tools</p>
  
  ![Next.js](https://img.shields.io/badge/Next.js-15.5.0-black?style=for-the-badge&logo=next.js)
  ![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-blue?style=for-the-badge&logo=typescript)
  ![TailwindCSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?style=for-the-badge&logo=tailwindcss)
  ![Drizzle](https://img.shields.io/badge/Drizzle_ORM-0.44.4-green?style=for-the-badge)
</div>

## 📋 Table of Contents

- [🌟 Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [🏗️ Project Structure](#️-project-structure)
- [⚡ Quick Start](#-quick-start)
- [🔧 Installation](#-installation)
- [💾 Database Setup](#-database-setup)
- [🎯 Development](#-development)
- [📚 Scripts](#-scripts)
- [🚀 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)
- [📝 License](#-license)

## 🌟 Features

- ⚡ **Next.js 15** with App Router and React 19
- 🎨 **TailwindCSS 4** for modern, responsive styling
- 🔒 **TypeScript** for type-safe development
- 🗄️ **Drizzle ORM** with Neon Database integration
- 🚀 **Turbopack** for lightning-fast development builds
- 📱 **Responsive Design** optimized for all devices
- 🔍 **ESLint** for code quality and consistency
- 🎯 **Component-based Architecture** for scalability
- 🌐 **Modern CSS** with CSS Variables and Dark Mode support

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15.5.0
- **Language**: TypeScript 5.9.2
- **Styling**: TailwindCSS 4.0
- **UI**: React 19.1.0

### Backend & Database
- **ORM**: Drizzle ORM 0.44.4
- **Database**: Neon PostgreSQL
- **Driver**: @neondatabase/serverless

### Development Tools
- **Build Tool**: Turbopack
- **Linter**: ESLint 9
- **Package Manager**: npm/yarn/pnpm/bun
- **Database Tools**: Drizzle Kit

## 🏗️ Project Structure

```
revou-project-web/
├── 📁 src/
│   ├── 📁 app/              # Next.js App Router pages
│   ├── 📁 components/       # Reusable UI components
│   └── 📁 db/              # Database schema and configuration
├── 📁 public/              # Static assets
├── 📁 supabase/            # Supabase configuration
├── 📄 drizzle.config.ts    # Drizzle ORM configuration
├── 📄 next.config.ts       # Next.js configuration
├── 📄 tailwind.config.js   # TailwindCSS configuration
├── 📄 tsconfig.json        # TypeScript configuration
└── 📄 package.json         # Project dependencies
```

## ⚡ Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd revou-project-web

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your database credentials

# Run database migrations
npm run db:push

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your application running! 🎉

## 🔧 Installation

### Prerequisites

- **Node.js** 18.0 or later
- **npm**, **yarn**, **pnpm**, or **bun**
- **PostgreSQL** database (Neon recommended)

### Step-by-step Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd revou-project-web
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure your environment variables:
   ```env
   DATABASE_URL="your-neon-database-url"
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

## 💾 Database Setup

### Using Neon Database

1. **Create a Neon account** at [neon.tech](https://neon.tech)
2. **Create a new project** and database
3. **Copy the connection string** to your `.env.local`

### Database Operations

```bash
# Generate migration files
npm run db:generate

# Apply migrations to database
npm run db:migrate

# Push schema changes directly (development)
npm run db:push

# Open Drizzle Studio (database GUI)
npm run db:studio
```

## 🎯 Development

### Development Server

```bash
# Start development server with Turbopack
npm run dev

# Alternative package managers
yarn dev
pnpm dev
bun dev
```

### Code Quality

```bash
# Run ESLint
npm run lint

# Build for production
npm run build

# Start production server
npm run start
```

### Hot Reload

The development server includes hot reload functionality. Edit any file in `src/app/` and see changes instantly!

## 📚 Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Build application for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint code analysis |
| `npm run db:generate` | Generate database migration files |
| `npm run db:migrate` | Apply database migrations |
| `npm run db:push` | Push schema changes to database |
| `npm run db:studio` | Open Drizzle Studio database GUI |

## 🚀 Deployment

### Vercel (Recommended)

The easiest way to deploy your Next.js app:

1. **Push to GitHub**
2. **Import to Vercel** at [vercel.com](https://vercel.com/new)
3. **Configure environment variables**
4. **Deploy automatically**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)

### Other Platforms

- **Netlify**: Connect your GitHub repository
- **Railway**: One-click deployment with database
- **Docker**: Use the included Dockerfile

### Environment Variables for Production

```env
DATABASE_URL="your-production-database-url"
NEXT_PUBLIC_APP_URL="https://your-domain.com"
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Use ESLint configuration
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation as needed

## 📚 Learn More

### Next.js Resources
- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API
- [Learn Next.js](https://nextjs.org/learn) - Interactive Next.js tutorial
- [Next.js GitHub](https://github.com/vercel/next.js) - Next.js repository

### Database & ORM
- [Drizzle ORM Documentation](https://orm.drizzle.team/) - Modern ORM for TypeScript
- [Neon Documentation](https://neon.tech/docs) - Serverless PostgreSQL

### Styling
- [TailwindCSS Documentation](https://tailwindcss.com/docs) - Utility-first CSS framework

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <p>Made with ❤️ by the RevoU Team</p>
  <p>⭐ Star this repository if you found it helpful!</p>
</div>
