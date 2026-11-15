import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { HomePageModule } from './home.module';
import { HomePage } from './home.page';
import { TaskService } from '../services/task.service';
import { DeviceService } from '../services/device.service';
import { AuthService } from '../services/auth.service';

describe('HomePage (Evaluación 2)', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomePageModule, RouterModule.forRoot([])],
      providers: [
        TaskService,
        DeviceService,
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe instanciar el componente correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debe inicializar con la lista de tareas del usuario y formulario vacío', () => {
    expect(component.newTaskTitle).toBe('');
    expect(component.photoUri).toBeNull();
    expect(component.currentLocation).toBeNull();
    expect(component.isEditing).toBe(false);
  });
});
