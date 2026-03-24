import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TodoService } from '../../../../core/services/todo.service';
import { Todo } from '../../../../core/models/todo.model';
import { TodoFormComponent } from '../../components/todo-form/todo-form.component';
import { TodoListComponent } from '../../components/todo-list/todo-list.component';

@Component({
  selector: 'app-todo-page',
  standalone: true,
  imports: [CommonModule, FormsModule, TodoFormComponent, TodoListComponent],
  templateUrl: './todo-page.component.html',
  styleUrls: ['./todo-page.component.css'],
})
export class TodoPageComponent implements OnInit {
  todos = signal<Todo[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  private readonly todoService = inject(TodoService);

  ngOnInit(): void {
    this.loadTodos();
  }

  loadTodos(): void {
    this.loading.set(true);
    this.error.set(null);

    this.todoService.getAll().subscribe({
      next: (todos) => {
        this.todos.set(todos);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load Todos.');
        this.loading.set(false);
      },
    });
  }

  addTodo(todo: { title: string }): void {
    this.todoService.create(todo).subscribe({
      next: () => this.loadTodos(),
      error: () => this.error.set('Failed to create Todo.'),
    });
  }

  toggleCompleteTodo(todo: Todo): void {
    this.todoService.toggleComplete(todo.id).subscribe({
      next: () => this.loadTodos(),
      error: () => this.error.set('Failed to update Todo.'),
    });
  }

  deleteTodo(id: string): void {
    this.todoService.delete(id).subscribe({
      next: () => this.loadTodos(),
      error: () => this.error.set('Failed to delete Todo.'),
    });
  }
}
