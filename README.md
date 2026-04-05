# Personal Portfolio Website

A responsive, multi-page personal portfolio website built to showcase my software engineering projects, technical skills, and professional experience. 

## Live Demo
[cesarsanchez.dev](https://cesarsanchez.dev/)
## Tech Stack
This project was built from scratch without heavy frameworks to demonstrate core frontend fundamentals:
* **HTML5** for semantic structuring and accessibility.
* **CSS3** for styling, flexbox layouts, responsive media queries, and interactive animations.
* **Vanilla JavaScript** for dynamic component rendering (header injection).
* **FontAwesome** for scalable vector icons.

## Key Features
* **Component-Based Architecture:** Utilizes the JavaScript `fetch()` API to inject a dynamic, reusable `<header>` component across all pages, keeping the codebase DRY (Don't Repeat Yourself).
* **Fully Responsive Design:** Implements CSS media queries to ensure a seamless layout transition between desktop, tablet, and mobile devices (including dynamic flex-direction switching).
* **Multi-Page Routing:** Clean folder structure separating the main landing page from dedicated `About` and `Projects` directories.
* **Interactive UI:** Features custom CSS hover states, drop shadows, and pill-shaped tech-stack badges for a modern user experience.

## 📁 Folder Structure
```text
/
├── index.html          # Main landing page
├── header.html         # Reusable dynamic header component
├── style.css           # Global stylesheet
├── /pages
│   ├── about.html      # Personal background and contact info
│   └── projects.html   # Detailed project showcase with tech tags
└── /images
    ├── developer-pic.png # Profile photo
    └── favicon.png       # Browser tab icon
