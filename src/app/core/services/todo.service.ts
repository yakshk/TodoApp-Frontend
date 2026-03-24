import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Todo } from '../models/todo.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TodoService {
  private readonly http = inject(HttpClient);

  private readonly baseUrl = `${environment.apiUrl}`;

  getAll(): Observable<Todo[]> {
    return this.http.get<Todo[]>(`${this.baseUrl}/getAll`);
  }

  create(todo: Partial<Todo>): Observable<Todo> {
    return this.http.post<Todo>(`${this.baseUrl}/create`, todo);
  }

  toggleComplete(id: string): Observable<Todo> {
    return this.http.patch<Todo>(`${this.baseUrl}/toggleComplete/${id}`, {});
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${id}`);
  }
}
