import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ApiSyncService } from './api-sync.service';
import { ExternalTodoDto, Task } from '../models/task.model';

describe('ApiSyncService - Pruebas de Servicios Web y APIs (Evaluación 2)', () => {
  let service: ApiSyncService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ApiSyncService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ApiSyncService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('Importación de Tareas Externas', () => {
    it('debe solicitar tareas remotas y mapearlas a la estructura Task', async () => {
      const mockDtos: ExternalTodoDto[] = [
        { userId: 1, id: 1, title: 'delectus aut autem', completed: false },
        { userId: 1, id: 2, title: 'quis ut nam facilis', completed: true },
      ];

      const promise = service.importTasksFromApi('usr-1', 2);

      const req = httpMock.expectOne('https://jsonplaceholder.typicode.com/todos?_limit=2');
      expect(req.request.method).toBe('GET');
      req.flush(mockDtos);

      const tasks = await promise;
      expect(tasks.length).toBe(2);
      expect(tasks[0].title).toBe('Delectus aut autem');
      expect(tasks[0].completed).toBe(false);
      expect(tasks[0].synced).toBe(true);
      expect(tasks[0].userId).toBe('usr-1');
    });

    it('debe capturar errores de red y arrojar mensaje comprensible', async () => {
      const promise = service.importTasksFromApi('usr-1', 2);

      const req = httpMock.expectOne('https://jsonplaceholder.typicode.com/todos?_limit=2');
      req.error(new ProgressEvent('Network error'), { status: 500, statusText: 'Server Error' });

      await expect(promise).rejects.toThrow('No fue posible contactar a la API externa');
    });
  });

  describe('Sincronización en la Nube (Cloud Sync)', () => {
    it('debe enviar la tarea en formato JSON con metadatos y confirmar persistencia remota', async () => {
      const task: Task = {
        id: 'task-test-1',
        title: 'Revisión en faena',
        description: 'Auditoría con cámara y GPS',
        completed: false,
        createdAt: new Date().toISOString(),
        synced: false,
        userId: 'usr-1',
        location: {
          latitude: -33.45,
          longitude: -70.66,
          timestamp: Date.now(),
          mapsUrl: 'https://maps.google.com',
        },
      };

      const syncPromise = service.syncTaskToCloud(task);

      const req = httpMock.expectOne('https://jsonplaceholder.typicode.com/todos');
      expect(req.request.method).toBe('POST');
      expect(req.request.body.title).toBe(task.title);
      expect(req.request.body.meta.hasLocation).toBe(true);

      req.flush({ id: 201 });

      const res = await syncPromise;
      expect(res.success).toBe(true);
      expect(res.cloudId).toBe('201');
    });

    it('debe responder fallido sin romper la aplicación si no hay conexión de red (Offline)', async () => {
      const task: Task = {
        id: 'task-test-2',
        title: 'Tarea sin internet',
        description: 'Creada offline',
        completed: false,
        createdAt: new Date().toISOString(),
        synced: false,
        userId: 'usr-1',
      };

      const syncPromise = service.syncTaskToCloud(task);

      const req = httpMock.expectOne('https://jsonplaceholder.typicode.com/todos');
      req.error(new ProgressEvent('Network error'), { status: 0, statusText: 'Offline' });

      const res = await syncPromise;
      expect(res.success).toBe(false);
    });
  });
});
