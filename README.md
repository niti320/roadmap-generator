# Roadmap Generator 🚀

A **dynamic roadmap generator** built with **Next.js** and **TailwindCSS**. This app allows you to create, organize, and visualize steps and sub-steps in a hierarchical roadmap. Perfect for planning learning paths, projects, or personal goals.

---

## 🔗 Live Demo

*(Add link if hosted online)*

---

## 🛠 Features

- Add, edit, and delete steps and sub-steps in a visual tree structure
- Interactive nodes with customizable titles and descriptions
- Export your roadmap as a clean, printable PDF
- Smooth UI with depth-based color coding for clarity
- Fully client-side, no backend required
- Responsive design for both desktop and mobile

---

## 📸 Screenshots

**Home / Roadmap View**  
![Home Screenshot](./screenshots/home.png)

**Editing a Step**  
![Edit Step Screenshot](./screenshots/edit-step.png)

**Export as PDF**  
![PDF Screenshot](./screenshots/pdf-export.png)

---

## 🧰 Tech Stack

- **Frontend:** Next.js 13, React, TailwindCSS  
- **Icons & UI:** Lucide-react, Radix UI  
- **State Management:** React `useState`, `immer` for immutable updates  
- **Forms & Validation:** React Hook Form + Zod  
- **PDF Export / Print:** Browser `window.print()`  

---

## ⚡ Installation & Setup

```bash
# Clone the repo
git clone https://github.com/niti320/roadmap-generator.git
cd roadmap-generator

# Install dependencies
npm install

# Run the development server
npm run dev
