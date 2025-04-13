# Welcome to College Track Manager

## Project info

**URL**: https://github.com/HagarElmasry/college-track-manager

## First Time Setup

### Prerequisites
- Node.js (v18 or higher) - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- Git

### Installation Steps

1. **Clone the repository**
```sh
git clone https://github.com/HagarElmasry/college-track-manager.git
cd college-track-manager
```

2. **Install dependencies**
```sh
npm install
```

3. **Set up environment variables**
```sh
# Copy the example environment file
cp .env.example .env.development

# Edit the file with your local settings
# VITE_API_BASE_URL=http://localhost:5050
```

4. **Start the development server**
```sh
npm run dev
```

The app should now be running at [http://localhost:8080](http://localhost:8080)

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## How can I edit this code?

### Option 1: Local Development (Recommended)

Use your preferred IDE with these steps:

1. Follow the "First Time Setup" instructions above
2. Make your changes
3. Test locally using `npm run dev`
4. Commit and push your changes


### Option 2: GitHub Codespaces

1. Navigate to the repository
2. Click "Code" > "Codespaces"
3. Click "New codespace"
4. Follow the "First Time Setup" instructions once the codespace loads

## Technologies Used

This project is built with modern web technologies:

- **Framework**: React 18
- **Build Tool**: Vite
- **Language**: TypeScript
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Package Manager**: npm
- **State Management**: React Query
- **Routing**: React Router DOM

## Project Structure

college-track-manager/
├── public/ # Static assets
├── src/
│ ├── assets/ # Project assets
│ ├── components/ # React components
│ ├── lib/ # Utility functions
│ ├── pages/ # Page components
│ └── services/ # API services
└── package.json


## How can I deploy this project?
TBD
