import { vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { TodoPageComponent } from './todo-page.component';
import { TodoService } from '../../../../core/services/todo.service';
import { Todo } from '../../../../core/models/todo.model';
import { TodoFormComponent } from '../../components/todo-form/todo-form.component';
import { TodoListComponent } from '../../components/todo-list/todo-list.component';

const mockTodos: Todo[] = [
  { id: '1', title: 'Test Todo 1', isCompleted: false },
  { id: '2', title: 'Test Todo 2', isCompleted: true },
];

const mockTodoService = {
  getAll: vi.fn(),
  create: vi.fn(),
  toggleComplete: vi.fn(),
  delete: vi.fn(),
};

describe('TodoPageComponent', () => {
  let component: TodoPageComponent;
  let fixture: ComponentFixture<TodoPageComponent>;

  beforeEach(async () => {
    mockTodoService.getAll.mockReturnValue(of(mockTodos));

    await TestBed.configureTestingModule({
      imports: [TodoPageComponent, CommonModule, FormsModule, TodoFormComponent, TodoListComponent],
      providers: [{ provide: TodoService, useValue: mockTodoService }],
    }).compileComponents();

    fixture = TestBed.createComponent(TodoPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => vi.clearAllMocks());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call loadTodos on init', () => {
      expect(mockTodoService.getAll).toHaveBeenCalledTimes(1);
    });

    it('should populate todos signal on success', () => {
      expect(component.todos()).toEqual(mockTodos);
    });

    it('should set loading to false after load', () => {
      expect(component.loading()).toBe(false);
    });
  });

  describe('loadTodos()', () => {
    it('should set error signal on failure', () => {
      mockTodoService.getAll.mockReturnValue(throwError(() => new Error()));
      component.loadTodos();
      expect(component.error()).toBe('Failed to load Todos.');
    });

    it('should set loading to false on failure', () => {
      mockTodoService.getAll.mockReturnValue(throwError(() => new Error()));
      component.loadTodos();
      expect(component.loading()).toBe(false);
    });

    it('should clear error before loading', () => {
      component.error.set('Previous error');
      mockTodoService.getAll.mockReturnValue(of(mockTodos));
      component.loadTodos();
      expect(component.error()).toBeNull();
    });
  });

  describe('addTodo()', () => {
    it('should call todoService.create with the given title', () => {
      mockTodoService.create.mockReturnValue(of({}));
      component.addTodo({ title: 'New Todo' });
      expect(mockTodoService.create).toHaveBeenCalledWith({ title: 'New Todo' });
    });

    it('should reload todos on success', () => {
      mockTodoService.create.mockReturnValue(of({}));
      component.addTodo({ title: 'New Todo' });
      expect(mockTodoService.getAll).toHaveBeenCalledTimes(2);
    });

    it('should set error signal on failure', () => {
      mockTodoService.create.mockReturnValue(throwError(() => new Error()));
      component.addTodo({ title: 'New Todo' });
      expect(component.error()).toBe('Failed to create Todo.');
    });
  });

  describe('toggleCompleteTodo()', () => {
    it('should call todoService.toggleComplete with the todo id', () => {
      mockTodoService.toggleComplete.mockReturnValue(of({}));
      component.toggleCompleteTodo(mockTodos[0]);
      expect(mockTodoService.toggleComplete).toHaveBeenCalledWith('1');
    });

    it('should reload todos on success', () => {
      mockTodoService.toggleComplete.mockReturnValue(of({}));
      component.toggleCompleteTodo(mockTodos[0]);
      expect(mockTodoService.getAll).toHaveBeenCalledTimes(2);
    });

    it('should set error signal on failure', () => {
      mockTodoService.toggleComplete.mockReturnValue(throwError(() => new Error()));
      component.toggleCompleteTodo(mockTodos[0]);
      expect(component.error()).toBe('Failed to update Todo.');
    });
  });

  describe('deleteTodo()', () => {
    it('should call todoService.delete with the given id', () => {
      mockTodoService.delete.mockReturnValue(of({}));
      component.deleteTodo('1');
      expect(mockTodoService.delete).toHaveBeenCalledWith('1');
    });

    it('should reload todos on success', () => {
      mockTodoService.delete.mockReturnValue(of({}));
      component.deleteTodo('1');
      expect(mockTodoService.getAll).toHaveBeenCalledTimes(2);
    });

    it('should set error signal on failure', () => {
      mockTodoService.delete.mockReturnValue(throwError(() => new Error()));
      component.deleteTodo('1');
      expect(component.error()).toBe('Failed to delete Todo.');
    });
  });
});