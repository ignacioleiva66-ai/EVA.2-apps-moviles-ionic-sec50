import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ExternalTodoDto, Task } from '../models/task.model';

@Injectable({
  providedIn: 'root',
})
export class ApiSyncService {
  private readonly EXTERNAL_API_URL = 'https://jsonplaceholder.typicode.com/todos';

  constructor(private http: HttpClient) {}

  /**
   * Importa tareas desde una API externa (JSONPlaceholder / Mock API)
   */
  async importTasksFromApi(userId: string, limit: number = 4): Promise<Task[]> {
    try {
      const response = await firstValueFrom(
        this.http.get<ExternalTodoDto[]>(`${this.EXTERNAL_API_URL}?_limit=${limit}`).pipe(
          catchError((err) => {
            console.error('Error al contactar API externa:', err);
            throw new Error('No fue posible contactar a la API externa. Verifique su conexión.');
          })
        )
      );

      return response.map((dto) => ({
        id: `ext-${dto.id}-${Date.now()}`,
        title: dto.title.charAt(0).toUpperCase() + dto.title.slice(1),
        description: `Tarea importada desde servicio web externo (ID: ${dto.id})`,
        completed: dto.completed,
        createdAt: new Date().toISOString(),
        synced: true,
        userId: userId,
      }));
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Sincroniza una tarea individual con el servidor remoto (POST)
   */
  async syncTaskToCloud(task: Task): Promise<{ success: boolean; cloudId?: string; message: string }> {
    try {
      const payload = {
        title: task.title,
        body: task.description,
        completed: task.completed,
        userId: 1,
        meta: {
          hasPhoto: !!task.photoUri,
          hasLocation: !!task.location,
          localId: task.id,
        },
      };

      const result = await firstValueFrom(
        this.http.post<any>(this.EXTERNAL_API_URL, payload).pipe(
          catchError((err) => {
            console.warn('Llamada HTTP fallida al sincronizar:', err);
            return of(null);
          })
        )
      );

      if (result) {
        return {
          success: true,
          cloudId: result.id ? String(result.id) : 'cloud-' + Date.now(),
          message: 'Sincronizado con éxito con la nube',
        };
      } else {
        return {
          success: false,
          message: 'Sin respuesta del servidor o dispositivo desconectado',
        };
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Error de red inesperado',
      };
    }
  }

  /**
   * Sincronización en lote de todas las tareas pendientes
   */
  async syncAllPendingTasks(tasks: Task[]): Promise<{ syncedCount: number; failedCount: number }> {
    let syncedCount = 0;
    let failedCount = 0;

    for (const task of tasks) {
      const res = await this.syncTaskToCloud(task);
      if (res.success) {
        syncedCount++;
      } else {
        failedCount++;
      }
    }

    return { syncedCount, failedCount };
  }
}
