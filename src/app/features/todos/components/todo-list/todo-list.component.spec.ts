import { vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { TodoListComponent } from './todo-list.component';
import { Todo } from '../../../../core/models/todo.model';

const mockTodos: Todo[] = [
  { id: '1', title: 'Test Todo 1', isCompleted: false },
  { id: '2', title: 'Test Todo 2', isCompleted: true },
];

describe('TodoListComponent', () => {
  let component: TodoListComponent;
  let fixture: ComponentFixture<TodoListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoListComponent, CommonModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TodoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Inputs', () => {
    it('should default to an empty todos array', () => {
      expect(component.todos).toEqual([]);
    });
  });

  describe('toggleTodo()', () => {
    it('should emit toggleTodoEvent with isCompleted flipped to true', () => {
      const spy = vi.spyOn(component.toggleTodoEvent, 'emit');
      const todo = mockTodos[0]; // isCompleted: false

      component.toggleTodo(todo);

      expect(spy).toHaveBeenCalledWith({ ...todo, isCompleted: true });
    });

    it('should emit toggleTodoEvent with isCompleted flipped to false', () => {
      const spy = vi.spyOn(component.toggleTodoEvent, 'emit');
      const todo = mockTodos[1]; // isCompleted: true

      component.toggleTodo(todo);

      expect(spy).toHaveBeenCalledWith({ ...todo, isCompleted: false });
    });

    it('should not mutate the original todo', () => {
      vi.spyOn(component.toggleTodoEvent, 'emit');
      const todo = { ...mockTodos[0] };
      component.toggleTodo(todo);
      expect(todo.isCompleted).toBe(false);
    });
  });

  describe('delete output', () => {
    it('should emit the todo id when delete is called', () => {
      const spy = vi.spyOn(component.delete, 'emit');
      component.delete.emit('1');
      expect(spy).toHaveBeenCalledWith('1');
    });
  });
});