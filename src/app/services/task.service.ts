import { Injectable, computed, signal } from '@angular/core';
import { Task, TaskLocation } from '../models/task.model';
import { StorageService } from './storage.service';
import { AuthService } from './auth.service';
import { ApiSyncService } from './api-sync.service';

const TASKS_STORAGE_KEY = 'offline_tasks_store_eva2';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  // Signal con todas las tareas guardadas en el dispositivo
  readonly allTasks = signal<Task[]>([]);

  // Signal computado reactivo: filtra automáticamente las tareas del usuario activo
  readonly userTasks = computed(() => {
    const current = this.authService.currentUser();
    return this.allTasks().filter((t) => t.userId === current.id);
  });

  constructor(
    private storageService: StorageService,
    private authService: AuthService,
    private apiSyncService: ApiSyncService
  ) {
    this.loadInitialTasks();
  }

  /**
   * Carga inicial desde el almacenamiento local persistente
   */
  private async loadInitialTasks(): Promise<void> {
    const stored = await this.storageService.getItem<Task[]>(TASKS_STORAGE_KEY);
    if (stored && Array.isArray(stored) && stored.length > 0) {
      this.allTasks.set(stored);
    } else {
      const seedTasks: Task[] = [
        {
          id: 'task-seed-1',
          title: 'Configurar plugins nativos de Capacitor',
          description: 'Cámara, Geolocalización GPS y Preferences integrados en la Unidad 2.',
          completed: true,
          createdAt: new Date().toISOString(),
          synced: true,
          userId: 'usr-1',
        },
        {
          id: 'task-seed-2',
          title: 'Inspección en terreno con evidencia fotográfica y GPS',
          description: 'Capturar foto de evidencia y georreferenciar la tarea.',
          completed: false,
          createdAt: new Date().toISOString(),
          synced: false,
          userId: 'usr-1',
        },
      ];
      this.allTasks.set(seedTasks);
      await this.persist(seedTasks);
    }
  }

  private async persist(tasks: Task[]): Promise<void> {
    await this.storageService.setItem(TASKS_STORAGE_KEY, tasks);
  }

  /**
   * Crea una nueva tarea con foto y geolocalización GPS
   */
  async addTask(data: {
    title: string;
    description: string;
    photoUri?: string;
    location?: TaskLocation;
  }): Promise<Task> {
    const currentUser = this.authService.getCurrentUser();
    const newTask: Task = {
      id: 'task-' + Date.now(),
      title: data.title.trim(),
      description: data.description.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
      photoUri: data.photoUri,
      location: data.location,
      synced: false,
      userId: currentUser.id,
    };

    const updated = [newTask, ...this.allTasks()];
    this.allTasks.set(updated);
    await this.persist(updated);

    // Sincronización en segundo plano con la nube
    this.apiSyncService.syncTaskToCloud(newTask).then(async (res) => {
      if (res.success) {
        await this.markTaskAsSynced(newTask.id);
      }
    });

    return newTask;
  }

  /**
   * Actualiza una tarea existente
   */
  async updateTask(id: string, updates: Partial<Task>): Promise<boolean> {
    const current = this.allTasks();
    const index = current.findIndex((t) => t.id === id);
    if (index === -1) return false;

    const updatedList = [...current];
    updatedList[index] = {
      ...updatedList[index],
      ...updates,
      synced: false, // Requiere re-sincronización
    };

    this.allTasks.set(updatedList);
    await this.persist(updatedList);
    return true;
  }

  /**
   * Cambia el estado de completada
   */
  async toggleTask(id: string): Promise<boolean> {
    const task = this.allTasks().find((t) => t.id === id);
    if (!task) return false;
    return await this.updateTask(id, { completed: !task.completed });
  }

  /**
   * Elimina una tarea
   */
  async deleteTask(id: string): Promise<boolean> {
    const filtered = this.allTasks().filter((t) => t.id !== id);
    if (filtered.length !== this.allTasks().length) {
      this.allTasks.set(filtered);
      await this.persist(filtered);
      return true;
    }
    return false;
  }

  /**
   * Marca una tarea como sincronizada
   */
  async markTaskAsSynced(id: string): Promise<void> {
    const current = this.allTasks();
    const index = current.findIndex((t) => t.id === id);
    if (index !== -1) {
      const updatedList = [...current];
      updatedList[index] = { ...updatedList[index], synced: true };
      this.allTasks.set(updatedList);
      await this.persist(updatedList);
    }
  }

  /**
   * Sincroniza todas las tareas pendientes del usuario activo
   */
  async syncAllPending(): Promise<{ syncedCount: number; failedCount: number }> {
    const currentUser = this.authService.getCurrentUser();
    const pending = this.allTasks().filter((t) => t.userId === currentUser.id && !t.synced);

    const result = await this.apiSyncService.syncAllPendingTasks(pending);
    if (result.syncedCount > 0) {
      const allUpdated = this.allTasks().map((t) => {
        if (t.userId === currentUser.id) {
          return { ...t, synced: true };
        }
        return t;
      });
      this.allTasks.set(allUpdated);
      await this.persist(allUpdated);
    }

    return result;
  }

  /**
   * Importa tareas desde el servicio web externo
   */
  async importExternalTasks(): Promise<number> {
    const currentUser = this.authService.getCurrentUser();
    const imported = await this.apiSyncService.importTasksFromApi(currentUser.id, 4);

    const updated = [...imported, ...this.allTasks()];
    this.allTasks.set(updated);
    await this.persist(updated);

    return imported.length;
  }
}
