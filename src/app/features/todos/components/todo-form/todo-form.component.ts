import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-todo-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './todo-form.component.html',
  styleUrls: ['./todo-form.component.css'],
})
export class TodoFormComponent {
  @Output() submitTodo = new EventEmitter<{ title: string }>();

  title = '';

  submit(): void {
    const trimmed = this.title.trim();

    if (!trimmed) return;

    this.submitTodo.emit({
      title: trimmed,
    });

    this.title = '';
  }
}
