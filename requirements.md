# Library Catalog Requirements

## Purpose

Provide a lightweight, browser-based catalog for keeping track of a personal
or small library collection. This starter application runs without a server or
third-party dependencies.

## Functional requirements

- Add a book with a required title and author and an optional ISBN.
- List books with their title, author, ISBN, and availability.
- Search the catalog by title, author, or ISBN without regard to letter case.
- Mark a book as checked out and return it to available status.
- Remove a book from the catalog.
- Preserve catalog data between visits using the browser's local storage.
- Show an empty state when the catalog has no books or a search has no matches.

## Technical requirements

- Use semantic HTML, responsive CSS, and browser-native JavaScript.
- Do not require a package manager, build step, server, or external runtime
  dependency.
- Build dynamic catalog content using DOM APIs and render book values as text.
- Report storage read/write failures to the user rather than indicating that
  unsaved changes succeeded.
- Support current versions of modern browsers with JavaScript and local storage
  enabled.

## Running locally

Open `index.html` in a modern browser. Catalog data is stored in that browser
and on that device; it is not shared between browsers or users.
