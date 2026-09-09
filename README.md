# Dhanush Gubala — Portfolio

Personal front-end developer portfolio. Dark glassmorphism theme with a 7-way color theme switcher, liquid transition animation, scroll-reveal animations, project modals, and full responsiveness from folded phones to large desktops.

## Structure
```
index.html      → page markup
style.css       → all styling, themes, animations, responsive rules
script.js       → all interactions (see below)
assets/         → resume PDF + profile photo
```

## Features
- 7 switchable color themes + liquid ripple transition (top-right nav button)
- Typing role animation in the hero
- Scroll progress bar + back-to-top button
- Project cards open a detail modal on click
- Contact form + copy-email button + QR code linking to the live site
- Scroll-reveal animations, active nav highlighting, mobile menu, cursor spotlight

## Two things to set up after deploying

**1. Contact form** — `index.html` has a form pointing at:
```html
<form ... action="https://formspree.io/f/YOUR_FORM_ID">
```
Sign up free at [formspree.io](https://formspree.io), create a form, and replace `YOUR_FORM_ID` with your real endpoint so messages land in your inbox. Until you do, the form falls back to opening the visitor's email app instead — it still works, just less seamless.

**2. SEO/social links** — `index.html` has a few `your-username.github.io/your-repo-name` placeholders in the `<head>` (canonical URL, Open Graph, Twitter tags). Once your site is live, swap these for your real GitHub Pages URL so link previews on WhatsApp/LinkedIn look right.

## Run locally
Just open `index.html` in a browser — no build step needed.

## Push to GitHub
```bash
cd portfolio
git init
git add .
git commit -m "Initial portfolio"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

## Host for free with GitHub Pages
1. In your repo on GitHub, go to **Settings → Pages**.
2. Under "Build and deployment", set **Source** to `Deploy from a branch`.
3. Pick the `main` branch and `/ (root)` folder, then **Save**.
4. Your site goes live at `https://<your-username>.github.io/<repo-name>/`.

## Customize
- Colors/themes/animations: `style.css` (`:root` and `html[data-theme=...]` variables at the top)
- Content/sections: `index.html`
- Behavior: `script.js`
