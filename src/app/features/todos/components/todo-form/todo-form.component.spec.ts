import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TodoFormComponent } from './todo-form.component';
import { By } from '@angular/platform-browser';

describe('TodoFormComponent', () => {
  let fixture: ComponentFixture<TodoFormComponent>;
  let component: TodoFormComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TodoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Component Initialisation', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('submit()', () => {
    it('should not emit when title is empty', () => {
      let emitted = false;

      component.submitTodo.subscribe(() => {
        emitted = true;
      });

      component.title = '';
      component.submit();

      expect(emitted).toBeFalsy();
    });

    it('should not emit when title is only whitespace', () => {
      let emitted = false;

      component.submitTodo.subscribe(() => {
        emitted = true;
      });

      component.title = '   ';
      component.submit();

      expect(emitted).toBeFalsy();
    });

    it('should emit trimmed title when valid', () => {
      let emittedValue: { title: string } | undefined;

      component.submitTodo.subscribe((value) => {
        emittedValue = value;
      });

      component.title = '   Buy milk   ';
      component.submit();

      expect(emittedValue).toEqual({ title: 'Buy milk' });
    });

    it('should reset title after successful submit', () => {
      component.title = 'Task';
      component.submit();

      expect(component.title).toBe('');
    });
  });

  describe('Template Interaction', () => {
    it('should update component.title when typing in input', () => {
      const input = fixture.debugElement.query(By.css('input')).nativeElement;

      input.value = 'Hello';
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(component.title).toBe('Hello');
    });

    it('should not emit when clicking submit button with empty title', () => {
      let emitted = false;

      component.submitTodo.subscribe(() => {
        emitted = true;
      });

      component.title = '';
      fixture.detectChanges();

      const button = fixture.debugElement.query(By.css('button'));
      button.triggerEventHandler('click');

      expect(emitted).toBeFalsy();
    });
  });
});
