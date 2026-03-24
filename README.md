# Yaksh's Todo App Frontend

The entire component tree is covered by a **Vitest** test suite, chosen for its speed.

### [Backend](https://github.com/yakshk/TodoApp-Backend)

`https://github.com/yakshk/TodoApp-Backend`

The frontend was separated to avoid creating a monolithic repository, which can quickly become difficult to scale, maintain, and evolve in an enterprise environment.

## Architecture

The project follows a feature-based structure with a clean separation between core infrastructure and UI:

```
src/app
├── core/
│   ├── models/                # Shared TypeScript interfaces (Todo)
│   └── services/              # TodoService - all API communication lives here
└── features/
    └── todo/
        ├── components/
        │   ├── todo-form/     # Controlled input form for creating todos
        │   └── todo-list/     # Renders todo items, emits toggle/delete events
        └── pages/
            └── todo-page/
```

---

## Technology Stack

Framework: Angular 21

Language: TypeScript

---

## Running the Frontend

```bash
npm install

npm start
```

### Running Tests

```bash
ng test
```
