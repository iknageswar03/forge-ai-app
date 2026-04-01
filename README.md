# Forge: AI Driven Adaptive Workout & Nutrition Planning System

[cite_start]**Forge** is a next-generation fitness and nutrition ecosystem designed to modernize personal training through intelligent automation, real-time data synchronization, and a mobile-first user interface[cite: 1, 2]. [cite_start]Built as a **Serverless Monorepo**, Forge moves beyond static templates to provide a truly adaptive coaching experience[cite: 1].

---

## 🚀 Core Features

* [cite_start]**AI Program Generation**: Leverages `@google/generative-ai` (Gemini) to dynamically formulate tailored workout routines and nutrition plans based on specific user metrics and goals[cite: 1].
* [cite_start]**Real-Time Workout Tracker**: Powered by **Convex**, active sessions feature instant data persistence, ensuring rest timers and checked sets are saved even across device refreshes[cite: 1].
* [cite_start]**Voice AI Coach**: Incorporates **Vapi AI** for hands-free, two-way voice interactions, allowing users to receive guidance and provide feedback during intense training[cite: 1].
* [cite_start]**Master Routine Management**: Features a dedicated "Edit Mode" to manage exercise templates and default weights independently of historical workout logs[cite: 1].
* [cite_start]**Progressive Web App (PWA)**: Optimized for mobile use on the gym floor with high-performance responsive layouts and fast loading times[cite: 1].

---

## 🛠️ Tech Stack

* [cite_start]**Frontend**: Next.js 15 (App Router), React 19, Tailwind CSS v4[cite: 1].
* [cite_start]**Backend & Database**: Convex (Serverless Real-time Database and Functions)[cite: 1].
* [cite_start]**Authentication**: Clerk Next.js[cite: 1].
* [cite_start]**AI Integrations**: Google Generative AI (Gemini), Vapi (Voice AI)[cite: 1].

---

## 📂 Project Structure

* [cite_start]**`src/app/`**: Frontend application routing and logic, including AI generation and the live tracker[cite: 1].
* [cite_start]**`convex/`**: Serverless backend schema and real-time database functions for users, routines, and logs[cite: 1].
* [cite_start]**`src/components/`**: Modular UI library utilizing Shadcn/Radix UI and Tailwind CSS[cite: 1].

---

## ⚙️ Installation & Setup

### Prerequisites
* [cite_start]Node.js (v20+ recommended)[cite: 1].
* [cite_start]Convex & Clerk Accounts[cite: 1].
* [cite_start]Google Gemini & Vapi API Keys[cite: 1].

### Steps
1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd forge
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  [cite_start]**Environment Setup**: Create a `.env.local` file in the root directory with the following keys[cite: 1]:
    ```env
    NEXT_PUBLIC_CONVEX_URL=...
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
    CLERK_SECRET_KEY=...
    GOOGLE_GEN_AI_KEY=...
    VAPI_PUBLIC_KEY=...
    ```
4.  **Start Development**:
    ```bash
    # Terminal 1: Start Convex backend
    npx convex dev

    # Terminal 2: Start Next.js frontend
    npm run dev
    ```

---

## 🛡️ License & Acknowledgement

[cite_start]This project was developed as a **Major Project** for the **Master of Science in Software Systems** program at **PSG College of Arts & Science**, Coimbatore[cite: 1, 2].

[cite_start]**Author**: Nageswar I K (21MSS030)[cite: 1, 2].
