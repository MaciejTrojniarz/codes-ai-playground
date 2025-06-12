# Tech Stack

This document outlines the technology stack selected for building and deploying the [App Name] MVP web application.

---

## Frontend

The frontend will be built using modern technologies focused on performance and an excellent developer experience (DX).

* **Framework**: **Astro 5**
    * Will serve as the primary framework for building the application. Its "island architecture" ensures minimal client-side JavaScript, leading to high performance.

* **Interactive Components**: **React 19**
    * Used to create interactive parts of the user interface, such as forms, dynamic lists, and modals, within the Astro architecture.

* **Language**: **TypeScript 5**
    * Will provide static typing for the entire codebase, increasing its reliability, simplifying maintenance, and improving IDE support.

* **Styling**: **Tailwind CSS 4**
    * A utility-first CSS approach will allow for fast and consistent styling of components directly in the code.

* **UI Component Library**: **shadcn/ui**
    * Will be used as a foundation for accessible and configurable React components (e.g., buttons, form fields, dialogs), which are styled with Tailwind CSS.

---

## Backend

The application's backend will be fully based on the **Supabase** platform (Backend-as-a-Service), which will significantly accelerate development.

* **Authentication**: **Supabase Auth**
    * User management, including registration, login via email and password, and the password reset process.

* **Database**: **Supabase Database (PostgreSQL)**
    * Storage for all application data, including coupon details and user statistics. Data security will be ensured by Row-Level Security.

* **File Storage**: **Supabase Storage**
    * Will be used for securely uploading, storing, and serving receipt photo files attached to discount codes.

* **API**: **Auto-generated Supabase API**
    * Communication between the frontend and backend will be handled via the auto-generated REST and WebSocket APIs provided by Supabase and accessed through its official client libraries (SDKs).

---

## CI/CD & Hosting

The continuous integration, delivery, and hosting processes will be implemented using standard and reliable tools.

* **CI/CD**: **GitHub Actions**
    * Will be used to automate the build, test, and deployment pipelines after every change in the GitHub code repository.

* **Containerization**: **Docker**
    * The web application will be containerized using Docker to ensure a consistent and portable runtime environment.

* **Hosting**: **DigitalOcean**
    * The application's Docker image will be hosted on the DigitalOcean platform, which provides a flexible and scalable cloud environment for running application

