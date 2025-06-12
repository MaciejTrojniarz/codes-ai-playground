# Discount Codes Manager

A web application that helps users manage discount codes received from store receipts. The application allows users to store, organize, and track their discount codes in the cloud, ensuring they never miss out on potential savings.

## Project Description

Discount Codes Manager is a web-based MVP application that enables users to:
- Store and manage discount codes from store receipts
- Upload receipt photos
- Track code expiration dates
- Monitor usage statistics
- Access codes from any device with internet access

The application requires user registration and login, with all data stored and synchronized in the cloud using Supabase.

## Tech Stack

- **Frontend Framework**: Astro.js with React integration
- **Styling**: Tailwind CSS
- **Backend & Authentication**: Supabase
- **Form Handling**: React Hook Form with Zod validation
- **UI Components**: Radix UI
- **Type Safety**: TypeScript
- **Node Version**: 22.16.0 (specified in .nvmrc)

## Getting Started Locally

1. Ensure you have Node.js version 22.16.0 installed (use nvm to manage Node versions)
2. Clone the repository
3. Create a `.env` file in the root directory with the following variables:
   ```
   PUBLIC_SUPABASE_URL=your-project-url
   PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
   You can get these values from your Supabase project settings.
4. Install dependencies:
   ```bash
   npm install
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

## Available Scripts

- `npm run dev` - Start the development server
- `npm run start` - Alias for dev command
- `npm run build` - Build the project for production
- `npm run preview` - Preview the production build locally
- `npm run astro` - Run Astro CLI commands

## Project Scope

### Core Features
- User authentication (registration, login, password reset)
- Discount code management (add, edit, delete)
- Receipt photo upload and storage
- Code expiration tracking
- Usage statistics
- Archive management

### Out of Scope (MVP)
- Offline functionality
- OCR for receipt text recognition
- Advanced sorting and filtering
- Custom tags and categories
- Social features
- Notifications
- Analytics
- Social media login
- Advanced file management

## Project Status

This project is currently in MVP (Minimum Viable Product) development stage. The focus is on delivering core functionality for managing discount codes with a clean, user-friendly interface.

## License

[License information to be added]