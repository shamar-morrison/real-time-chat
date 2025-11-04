# Real-Time Chat with Next.js and Supabase

This is a real-time chat application built with Next.js and Supabase.

## Table of Contents

- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Scripts](#scripts)
- [Features](#features)
- [Database Schema](#database-schema)
- [Contributing](#contributing)
- [Authors](#authors)
- [Acknowledgements](#acknowledgements)
- [Deployment](#deployment)
- [License](#license)

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/)
- **Backend:** [Supabase](https://supabase.io/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/), [Radix UI](https://www.radix-ui.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Form Management:** [React Hook Form](https://react-hook-form.com/)
- **Schema Validation:** [Zod](https://zod.dev/)
- **Linting:** [ESLint](https://eslint.org/)
- **Formatting:** [Prettier](https://prettier.io/)

## Prerequisites

- [Node.js](https://nodejs.org/en/) (v20 or later)
- [npm](https://www.npmjs.com/)
- [Supabase Account](https://supabase.com/dashboard)

## Getting Started

### Installation

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd real-time-chat
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up environment variables:**

    Create a `.env.local` file in the root of the project and add the following variables:

    ```
    NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY=your-supabase-anon-key
    ```

    You can get these values from your Supabase project's API settings.

### Running the Development Server

To start the development server, run:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Creates a production build.
- `npm run start`: Starts the production server.
- `npm run lint`: Lints the codebase.

## Features

- Real-time chat rooms
- User authentication with Supabase Auth
- Create and join rooms
- Send and receive messages in real-time
- Animated UI with Framer Motion

## Database Schema

The database schema is defined in the Supabase project. The types for the schema are located in `lib/supabase/types/database.ts`.
