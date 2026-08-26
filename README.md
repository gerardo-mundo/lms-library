# Library Management System (LMS) - Frontend

This is the frontend application for the Library Management System, a comprehensive platform for managing library resources and user interactions.

## Technologies Used

*   **Angular 17+:** Modern, standalone component-based architecture.
*   **PrimeNG:** A rich set of UI components for Angular (DataTables, Dialogs, Forms, etc.).
*   **PrimeFlex:** A CSS utility library for flexible and responsive layouts.

## Features

The system includes dedicated modules for managing various aspects of a library:

*   **Dashboard:** A high-level overview of system statistics and metrics.
*   **Books:** Complete CRUD operations for the book inventory.
*   **Publications:** Management of articles, journals, and other published materials.
*   **Thesis:** Tracking and management of academic theses.
*   **Users:** User administration, profiling, and access control.
*   **Loans:** Tracking borrowed materials, managing due dates, and handling returns.

## Project Architecture

The application is structured following modern Angular best practices, heavily utilizing standalone components and a clear separation of concerns:

*   `src/app/core/`: Contains core business logic, singleton services (like Authentication), domain models, and data access repositories.
*   `src/app/features/`: Contains the main functional areas of the application (Books, Loans, etc.), designed for modularity and lazy loading.
*   `src/app/layout/`: Contains the application shell, including the sidebar navigation and topbar.
*   `src/app/shared/`: Contains reusable, purely presentational components (like stat cards), pipes, and directives.

## Getting Started

### Prerequisites

*   Node.js (LTS version recommended)
*   npm (Node Package Manager)
*   Angular CLI (`npm install -g @angular/cli`)

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/gerardo-mundo/lms-library.git
    cd lms-front
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```

### Development Server

Run the development server using npm or the Angular CLI:

```bash
npm start
# or
ng serve
```

Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

### Build

Run `ng build` to build the project for production. The build artifacts will be stored in the `dist/` directory.
