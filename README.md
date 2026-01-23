
# Mir Baba Tour and Travels - Website

This is the official website for **Mir Baba Tour and Travels**, a Kashmir-based travel agency. The project is built with **Next.js 15**, **Tailwind CSS**, and **Supabase**.

## Features

- **Responsive Design:** Mobile-first approach using Tailwind CSS.
- **Dynamic Tour Packages:** Filterable list and detailed package pages.
- **Booking System:** Inquiry form integrated with Supabase.
- **Admin Panel:** Secure dashboard to manage packages, inquiries, and chatbot FAQs.
- **AI Chatbot:** Built-in support assistant for common queries.
- **SEO Optimized:** Meta tags, fast loading speeds.

## Prerequisites

- Node.js 18+ installed.
- A Supabase account.

## Setup Instructions

1. **Clone/Navigate to the project:**
   ```bash
   cd mir-baba-web
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Set up Supabase:**
   - Create a new project on [Supabase](https://supabase.com/).
   - Go to **Project Settings > API** and copy the `URL` and `anon` key.
   - Create a `.env.local` file in the root directory (if not exists) and add:
     ```env
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
     ```

4. **Database Setup:**
   - Go to the **SQL Editor** in your Supabase dashboard.
   - Copy the content of `supabase_schema.sql` (located in the project root).
   - Run the SQL script to create the tables (packages, inquiries, testimonials, etc.) and security policies.

5. **Create Admin User:**
   - Go to **Authentication** in Supabase and create a new user (email/password).
   - In the **Table Editor**, go to the `profiles` table.
   - Find the row corresponding to your new user and change the `role` from `user` to `admin`.
   - Now you can log in to `/admin` with these credentials.

6. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the site.

## Deployment

This project is ready to be deployed on **Vercel** or **Netlify**.
- Push the code to GitHub.
- Import the repository in Vercel.
- Add the Environment Variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) in the deployment settings.

## Folder Structure

- `src/app`: App Router pages.
- `src/components`: Reusable UI components.
- `src/lib`: Supabase client configuration.
- `public`: Static assets.

## Contact

For support, contact **info@mirbabatourandtravels.com**.
