import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'todos',
    pathMatch: 'full',
  },
  {
    path: 'todos',
    loadComponent: () =>
      import('./features/todos/pages/todo-page/todo-page.component').then(
        (m) => m.TodoPageComponent,
      ),
  },
];
