# Unified Code Coverage Frontend

This is the frontend application for the Unified Code Coverage project. It provides a user interface to view and analyze code coverage metrics, quality gates, and related data.

## 🏗️ Project Structure

The project follows a modular structure organized within the `src` directory:

```text
src/
├── api/          # API integration and service functions (e.g., Axios calls)
├── assets/       # Static assets like images, icons, etc.
├── components/   # Reusable UI components used across different pages
├── layouts/      # Layout components (e.g., Header, Sidebar, Main Content area)
├── pages/        # Page-level components corresponding to different routes (e.g., QualityGate)
├── routes/       # Application routing configuration (React Router)
├── types/        # TypeScript interfaces and type definitions
├── App.tsx       # Main application component
├── index.css     # Global CSS and Tailwind CSS directives
└── main.tsx      # Application entry point
```

## 🛠️ Technologies Used

The application is built using modern web development technologies:

*   **Core Framework:** [React 19](https://react.dev/)
*   **Language:** [TypeScript](https://www.typescriptlang.org/) for static typing
*   **Build Tool:** [Vite](https://vitejs.dev/) for fast development and optimized builds
*   **Routing:** [React Router DOM](https://reactrouter.com/)
*   **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) for utility-first styling
*   **Data Visualization:** [Recharts](https://recharts.org/) for rendering charts and graphs
*   **Animations:** [Framer Motion](https://www.framer.com/motion/) for fluid UI animations
*   **Icons:** [Lucide React](https://lucide.dev/)
*   **HTTP Client:** [Axios](https://axios-http.com/) for making API requests
*   **Tables:** [TanStack React Table](https://tanstack.com/table/v8) for advanced data grids

## 🚀 Commands to Run

Make sure you have Node.js and npm installed.

### 1. Install Dependencies
Before running the application for the first time, install the required packages:
```bash
npm install
```

### 2. Development Server
To start the application in development mode with Hot Module Replacement (HMR):
```bash
npm run dev
```
This will typically start the server at `http://localhost:5173/`.

### 3. Build for Production
To compile the TypeScript code and bundle the application for production:
```bash
npm run build
```
The output will be generated in the `dist` directory.

### 4. Preview Production Build
To preview the generated production build locally:
```bash
npm run preview
```

### 5. Linting
To run ESLint and check for code quality and style issues:
```bash
npm run lint
```
