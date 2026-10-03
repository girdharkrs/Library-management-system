"use strict";

const STORAGE_KEY = "library-catalog-books";

const bookForm = document.querySelector("#book-form");
const titleInput = document.querySelector("#book-title");
const authorInput = document.querySelector("#book-author");
const isbnInput = document.querySelector("#book-isbn");
const searchInput = document.querySelector("#book-search");
const bookList = document.querySelector("#book-list");
const bookCount = document.querySelector("#book-count");
const emptyState = document.querySelector("#empty-state");
const formMessage = document.querySelector("#form-message");

let books = loadBooks();

function loadBooks() {
  try {
    const savedBooks = localStorage.getItem(STORAGE_KEY);
    if (savedBooks === null) return [];

    const parsedBooks = JSON.parse(savedBooks);
    if (
      !Array.isArray(parsedBooks) ||
      !parsedBooks.every(
        (book) =>
          book &&
          typeof book.id === "string" &&
          typeof book.title === "string" &&
          typeof book.author === "string" &&
          typeof book.isbn === "string" &&
          typeof book.checkedOut === "boolean",
      )
    ) {
      throw new Error("Saved catalog data has an invalid format.");
    }

    return parsedBooks;
  } catch (error) {
    console.error("Unable to load the saved catalog.", error);
    formMessage.textContent = "The saved catalog could not be loaded. Check browser storage and refresh.";
    return [];
  }
}

function saveBooks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
    formMessage.textContent = "";
    return true;
  } catch (error) {
    console.error("Unable to save the catalog.", error);
    formMessage.textContent = "Changes could not be saved. Check browser storage and try again.";
    return false;
  }
}

function createCell(text, className) {
  const cell = document.createElement("td");
  cell.textContent = text || "—";
  if (className) cell.className = className;
  return cell;
}

function createActionButton(label, className, action, bookId, accessibleLabel) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = className;
  button.textContent = label;
  button.dataset.action = action;
  button.dataset.bookId = bookId;
  button.setAttribute("aria-label", accessibleLabel);
  return button;
}

function renderBooks() {
  const query = searchInput.value.trim().toLocaleLowerCase();
  const filteredBooks = books.filter((book) =>
    `${book.title} ${book.author} ${book.isbn}`.toLocaleLowerCase().includes(query),
  );

  bookList.replaceChildren();
  bookCount.textContent = `(${books.length})`;
  emptyState.hidden = filteredBooks.length > 0;

  for (const book of filteredBooks) {
    const row = document.createElement("tr");
    row.append(
      createCell(book.title),
      createCell(book.author),
      createCell(book.isbn),
    );

    const statusCell = document.createElement("td");
    const status = document.createElement("span");
    status.className = `status${book.checkedOut ? " status-checked-out" : ""}`;
    status.textContent = book.checkedOut ? "Checked out" : "Available";
    statusCell.append(status);
    row.append(statusCell);

    const actionsCell = document.createElement("td");
    const actions = document.createElement("div");
    actions.className = "row-actions";
    actions.append(
      createActionButton(
        book.checkedOut ? "Return" : "Check out",
        "text-button",
        "toggle",
        book.id,
        `${book.checkedOut ? "Return" : "Check out"} ${book.title}`,
      ),
      createActionButton(
        "Remove",
        "text-button text-button-danger",
        "remove",
        book.id,
        `Remove ${book.title}`,
      ),
    );
    actionsCell.append(actions);
    row.append(actionsCell);
    bookList.append(row);
  }
}

bookForm.addEventListener("submit", (event) => {
  event.preventDefault();
  formMessage.textContent = "";

  const title = titleInput.value.trim();
  const author = authorInput.value.trim();
  const isbn = isbnInput.value.trim();

  if (!title || !author) {
    formMessage.textContent = "Enter both a book title and an author.";
    return;
  }

  const book = {
    id: crypto.randomUUID(),
    title,
    author,
    isbn,
    checkedOut: false,
  };
  books.push(book);

  if (!saveBooks()) {
    books.pop();
    return;
  }

  bookForm.reset();
  renderBooks();
  titleInput.focus();
});

bookList.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const bookIndex = books.findIndex((book) => book.id === button.dataset.bookId);
  if (bookIndex < 0) return;

  const book = books[bookIndex];
  if (button.dataset.action === "toggle") {
    book.checkedOut = !book.checkedOut;
  } else if (button.dataset.action === "remove") {
    books.splice(bookIndex, 1);
  } else {
    return;
  }

  if (!saveBooks()) {
    if (button.dataset.action === "toggle") {
      book.checkedOut = !book.checkedOut;
    } else {
      books.splice(bookIndex, 0, book);
    }
  }
  renderBooks();
});

searchInput.addEventListener("input", renderBooks);

renderBooks();
