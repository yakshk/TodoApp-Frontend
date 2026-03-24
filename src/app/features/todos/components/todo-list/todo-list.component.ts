import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Todo } from '../../../../core/models/todo.model';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css'],
})
export class TodoListComponent {
  @Input() todos: Todo[] = [];
  @Output() toggleTodoEvent = new EventEmitter<Todo>();
  @Output() delete = new EventEmitter<string>();

  toggleTodo(todo: Todo): void {
    this.toggleTodoEvent.emit({ ...todo, isCompleted: !todo.isCompleted });
  }
}
