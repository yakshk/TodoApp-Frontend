import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { TodoService } from './todo.service';
import { Todo } from '../models/todo.model';
import { environment } from '../../../environments/environment';

describe('TodoService', () => {
  let service: TodoService;
  let httpTesting: HttpTestingController;

  const baseUrl = environment.apiUrl;

  const mockTodo: Todo = {
    id: '1',
    title: 'Test Todo',
    isCompleted: false,
  };

  const mockTodos: Todo[] = [
    { id: '1', title: 'First Todo', isCompleted: false },
    { id: '2', title: 'Second Todo', isCompleted: true },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TodoService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(TodoService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  describe('Service Initialisation', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });
  });

  describe('getAll()', () => {
    it('should return todos', () => {
      service.getAll().subscribe((todos) => {
        expect(todos).toEqual(mockTodos);
        expect(todos.length).toBe(2);
      });

      const req = httpTesting.expectOne(`${baseUrl}/getAll`);
      expect(req.request.method).toBe('GET');
      req.flush(mockTodos);
    });

    it('should make a GET request to the correct URL', () => {
      service.getAll().subscribe();

      const req = httpTesting.expectOne(`${baseUrl}/getAll`);
      expect(req.request.method).toBe('GET');
      expect(req.request.url).toBe(`${baseUrl}/getAll`);
      req.flush([]);
    });

    it('should return an empty array when no todos exist', () => {
      service.getAll().subscribe((todos) => {
        expect(todos).toEqual([]);
        expect(todos.length).toBe(0);
      });

      const req = httpTesting.expectOne(`${baseUrl}/getAll`);
      req.flush([]);
    });

    it('should propagate HTTP errors', () => {
      service.getAll().subscribe({
        next: () => { throw new Error('Expected an error, but got a successful response'); },
        error: (error) => {
          expect(error.status).toBe(500);
        },
      });

      const req = httpTesting.expectOne(`${baseUrl}/getAll`);
      req.flush('Internal Server Error', {
        status: 500,
        statusText: 'Internal Server Error',
      });
    });
  });

  describe('create()', () => {
    it('should create a todo and return the created todo', () => {
      const newTodo: Partial<Todo> = { title: 'New Todo', isCompleted: false };

      service.create(newTodo).subscribe((todo) => {
        expect(todo).toEqual(mockTodo);
      });

      const req = httpTesting.expectOne(`${baseUrl}/create`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newTodo);
      req.flush(mockTodo);
    });

    it('should make a POST request to the correct URL', () => {
      const newTodo: Partial<Todo> = { title: 'New Todo' };

      service.create(newTodo).subscribe();

      const req = httpTesting.expectOne(`${baseUrl}/create`);
      expect(req.request.method).toBe('POST');
      expect(req.request.url).toBe(`${baseUrl}/create`);
      req.flush(mockTodo);
    });

    it('should send the partial todo as the request body', () => {
      const partialTodo: Partial<Todo> = { title: 'Partial Todo' };

      service.create(partialTodo).subscribe();

      const req = httpTesting.expectOne(`${baseUrl}/create`);
      expect(req.request.body).toEqual(partialTodo);
      expect(req.request.body.title).toBe('Partial Todo');
      req.flush({ ...partialTodo, id: '3', isCompleted: false });
    });

    it('should propagate HTTP errors on creation failure', () => {
      service.create({ title: 'Fail Todo' }).subscribe({
        next: () => { throw new Error('Expected an error, but got a successful response'); },
        error: (error) => {
          expect(error.status).toBe(400);
        },
      });

      const req = httpTesting.expectOne(`${baseUrl}/create`);
      req.flush('Bad Request', { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('toggleComplete()', () => {
    it('should toggle a todo and return the updated todo', () => {
      const toggledTodo: Todo = { ...mockTodo, isCompleted: true };

      service.toggleComplete('1').subscribe((todo) => {
        expect(todo).toEqual(toggledTodo);
        expect(todo.isCompleted).toBe(true);
      });

      const req = httpTesting.expectOne(`${baseUrl}/toggleComplete/1`);
      expect(req.request.method).toBe('PATCH');
      req.flush(toggledTodo);
    });

    it('should make a PATCH request to the correct URL with the given id', () => {
      service.toggleComplete('42').subscribe();

      const req = httpTesting.expectOne(`${baseUrl}/toggleComplete/42`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.url).toBe(`${baseUrl}/toggleComplete/42`);
      req.flush({ ...mockTodo, id: '42' });
    });

    it('should send an empty object as the request body', () => {
      service.toggleComplete('1').subscribe();

      const req = httpTesting.expectOne(`${baseUrl}/toggleComplete/1`);
      expect(req.request.body).toEqual({});
      req.flush(mockTodo);
    });

    it('should propagate HTTP errors when todo is not found', () => {
      service.toggleComplete('999').subscribe({
        next: () => { throw new Error('Expected an error, but got a successful response'); },
        error: (error) => {
          expect(error.status).toBe(404);
        },
      });

      const req = httpTesting.expectOne(`${baseUrl}/toggleComplete/999`);
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('delete()', () => {
    it('should make a DELETE request to the correct URL with the given id', () => {
      service.delete('42').subscribe();

      const req = httpTesting.expectOne(`${baseUrl}/delete/42`);
      expect(req.request.method).toBe('DELETE');
      expect(req.request.url).toBe(`${baseUrl}/delete/42`);
      req.flush(null);
    });

    it('should propagate HTTP errors when todo is not found', () => {
      service.delete('999').subscribe({
        next: () => { throw new Error('Expected an error, but got a successful response'); },
        error: (error) => {
          expect(error.status).toBe(404);
        },
      });

      const req = httpTesting.expectOne(`${baseUrl}/delete/999`);
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });

    it('should propagate HTTP errors on server failure', () => {
      service.delete('1').subscribe({
        next: () => { throw new Error('Expected an error, but got a successful response'); },
        error: (error) => {
          expect(error.status).toBe(500);
        },
      });

      const req = httpTesting.expectOne(`${baseUrl}/delete/1`);
      req.flush('Server Error', {
        status: 500,
        statusText: 'Internal Server Error',
      });
    });
  });
});