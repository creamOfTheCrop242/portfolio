# COTC Portfolio

Don Hudson’s personal portfolio, matching the shared COTC Web Studio and media-site theme: dark surfaces, cyan/magenta accents, Orbitron headings, and DM Sans body text.

## Run

Requires Node.js and Python 3. No npm dependencies are needed.

```sh
npm run build
npm run check
npm start
```

Open http://127.0.0.1:8000. Serve `dist/`, not the source directory: the build inserts every project into the HTML so projects and links also work without JavaScript. JavaScript progressively adds category/search controls and mobile-menu conveniences. The native mobile menu works without JavaScript.

## Edit

- `projects.json`: project names, descriptions, categories, technology tags, links, and preview names. Add a record to add a project; counts update at build time.
- `index.html`: page template, biography, navigation, and contact form.
- `portfolio.css`: responsive theme and visual treatments.
- `portfolio.js`: combined category/search filtering, empty state, and menu behavior.
- `assets/projects/`: existing project screenshots in 640px and 960px WebP sizes, copied from Web Studio. Projects without screenshots use typographic covers, not simulated screenshots.
- `dev_resume.pdf`: existing résumé; its content has not been refreshed.

The contact form retains the existing Formspree endpoint and uses native submission. Delivery requires that endpoint to remain active; no test message was sent. Project destinations come from the existing portfolio and Web Studio source and have not been checked for availability. Zeta Computing is presented as a concept rather than making claims about a real technology company.

The old bundled `app.js`, `styles.css`, and `earth.jpg` are retained for reference but are not loaded or included in the deployment. The local Guide Log addition and white link treatment were incorporated into the redesign. No changes are needed in the adjacent Web Studio or media repositories.

## Hosting

`npm run build` produces `dist/`, ready for static hosting. `netlify.toml` sets the build/publish configuration. `.openai/hosting.json` records the separate private Sites project. Hosting that serves from a subdirectory should serve `dist/index.html` at that directory’s root.

Validation covers generated project markup, asset and section links, filtering/search/reset interactions, and mobile menu handlers. Browser visual QA was unavailable in the creation session; check desktop and mobile presentation before a public launch.
