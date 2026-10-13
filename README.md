# AI Club

A responsive React, TypeScript, and Tailwind website for a school AI Club.

## Run locally

```sh
npm install
npm run dev
```

Create a production build with `npm run build`, or preview it with `npm run preview`.

## Update the content

Club topics, activities, ratings, and project entries are defined near the top of `src/App.tsx`. Add projects to the `projects` list with a title, description, image ID, status, and technology tags. Add an `href` when a project is ready to link; entries without one remain marked as coming soon.

The signup dialog and Ask the AI Club conversation are front-end demos. They do not send or store personal information and are ready to connect to club-approved services later.