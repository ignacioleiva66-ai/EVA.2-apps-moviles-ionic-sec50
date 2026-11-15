import { Component } from '@angular/core';
import {
  ToastController,
  AlertController,
  LoadingController,
  ActionSheetController,
} from '@ionic/angular';
import { Task, TaskLocation, User } from '../models/task.model';
import { TaskService } from '../services/task.service';
import { DeviceService } from '../services/device.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  // Signals reactivos desde servicios
  readonly tasks = this.taskService.userTasks;
  readonly currentUser = this.authService.currentUser;

  // Variables de formulario
  newTaskTitle = '';
  newTaskDescription = '';
  photoUri: string | null = null;
  currentLocation: TaskLocation | null = null;

  // Modo edición
  isEditing = false;
  editingTaskId: string | null = null;

  // Estados de carga
  isCapturingPhoto = false;
  isGettingLocation = false;
  isSyncing = false;

  constructor(
    private taskService: TaskService,
    private deviceService: DeviceService,
    private authService: AuthService,
    private toastController: ToastController,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private actionSheetController: ActionSheetController
  ) {}

  // ==========================================
  // PERIFÉRICOS: CÁMARA Y GEOLOCALIZACIÓN GPS
  // ==========================================

  /**
   * Captura una fotografía utilizando la cámara nativa del dispositivo
   */
  async handleTakePhoto(): Promise<void> {
    this.isCapturingPhoto = true;
    try {
      const dataUrl = await this.deviceService.capturePhoto();
      if (dataUrl) {
        this.photoUri = dataUrl;
        await this.showToast('Foto capturada y adjuntada correctamente', 'success');
      }
    } catch (error: any) {
      if (error?.message?.includes('PERMISO_DENEGADO')) {
        await this.showPermissionAlert(
          'Permiso de Cámara Denegado',
          'La app necesita permiso para acceder a la cámara y adjuntar fotos a tus tareas. Por favor actívalo en los ajustes de tu dispositivo.'
        );
      } else {
        await this.showToast('Error al acceder a la cámara: ' + (error.message || 'Desconocido'), 'danger');
      }
    } finally {
      this.isCapturingPhoto = false;
    }
  }

  removePhoto(): void {
    this.photoUri = null;
  }

  /**
   * Obtiene la posición geográfica satelital mediante GPS
   */
  async handleGetLocation(): Promise<void> {
    this.isGettingLocation = true;
    try {
      const location = await this.deviceService.getCurrentPosition();
      this.currentLocation = location;
      await this.showToast(
        `GPS capturado: Lat ${location.latitude.toFixed(4)}, Lng ${location.longitude.toFixed(4)}`,
        'success'
      );
    } catch (error: any) {
      if (error?.message?.includes('PERMISO_DENEGADO')) {
        await this.showPermissionAlert(
          'Permiso de Ubicación Denegado',
          'Para georreferenciar las tareas se requiere acceso al sensor GPS del dispositivo. Por favor otorga el permiso correspondiente.'
        );
      } else {
        await this.showToast('Error al capturar GPS: ' + (error.message || 'Señal no disponible'), 'warning');
      }
    } finally {
      this.isGettingLocation = false;
    }
  }

  removeLocation(): void {
    this.currentLocation = null;
  }

  openMaps(url: string): void {
    window.open(url, '_blank');
  }

  // ==========================================
  // CRUD DE TAREAS (CREAR, EDITAR, TOGGLE, BORRAR)
  // ==========================================

  async saveTask(): Promise<void> {
    const title = this.newTaskTitle.trim();
    if (!title) {
      await this.showToast('Por favor ingrese un título para la tarea', 'warning');
      return;
    }

    if (this.isEditing && this.editingTaskId) {
      const updated = await this.taskService.updateTask(this.editingTaskId, {
        title,
        description: this.newTaskDescription.trim(),
        photoUri: this.photoUri || undefined,
        location: this.currentLocation || undefined,
      });
      if (updated) {
        await this.showToast('Tarea actualizada correctamente', 'success');
      }
    } else {
      await this.taskService.addTask({
        title,
        description: this.newTaskDescription.trim(),
        photoUri: this.photoUri || undefined,
        location: this.currentLocation || undefined,
      });
      await this.showToast('Tarea guardada localmente con éxito', 'success');
    }

    this.resetForm();
  }

  startEdit(task: Task): void {
    this.isEditing = true;
    this.editingTaskId = task.id;
    this.newTaskTitle = task.title;
    this.newTaskDescription = task.description;
    this.photoUri = task.photoUri || null;
    this.currentLocation = task.location || null;
  }

  cancelEdit(): void {
    this.resetForm();
  }

  async toggleTaskStatus(task: Task): Promise<void> {
    await this.taskService.toggleTask(task.id);
    const estado = !task.completed ? 'completada' : 'pendiente';
    await this.showToast(`Tarea marcada como ${estado}`, 'medium');
  }

  async confirmDelete(task: Task): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: `¿Estás seguro de que deseas eliminar la tarea "${task.title}"?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: async () => {
            await this.taskService.deleteTask(task.id);
            if (this.isEditing && this.editingTaskId === task.id) {
              this.resetForm();
            }
            await this.showToast('Tarea eliminada con éxito', 'danger');
          },
        },
      ],
    });
    await alert.present();
  }

  private resetForm(): void {
    this.newTaskTitle = '';
    this.newTaskDescription = '';
    this.photoUri = null;
    this.currentLocation = null;
    this.isEditing = false;
    this.editingTaskId = null;
  }

  // ==========================================
  // SERVICIOS WEB Y SINCRONIZACIÓN
  // ==========================================

  async handleSync(): Promise<void> {
    this.isSyncing = true;
    const loader = await this.loadingController.create({
      message: 'Sincronizando tareas con API externa...',
      spinner: 'circles',
    });
    await loader.present();

    try {
      const result = await this.taskService.syncAllPending();
      await loader.dismiss();
      if (result.syncedCount > 0) {
        await this.showToast(
          `Sincronización completada: ${result.syncedCount} tarea(s) sincronizadas con la nube`,
          'success'
        );
      } else {
        await this.showToast('Todas las tareas ya se encuentran sincronizadas', 'medium');
      }
    } catch (error: any) {
      await loader.dismiss();
      await this.showToast('Error de red al sincronizar: ' + error.message, 'danger');
    } finally {
      this.isSyncing = false;
    }
  }

  async handleImport(): Promise<void> {
    const loader = await this.loadingController.create({
      message: 'Consultando e importando tareas desde API externa...',
      spinner: 'crescent',
    });
    await loader.present();

    try {
      const count = await this.taskService.importExternalTasks();
      await loader.dismiss();
      await this.showToast(`Se importaron ${count} tareas desde la API externa`, 'success');
    } catch (error: any) {
      await loader.dismiss();
      await this.showToast('Error al importar tareas: ' + error.message, 'danger');
    }
  }

  // ==========================================
  // AUTENTICACIÓN MULTI-USUARIO
  // ==========================================

  async openUserMenu(): Promise<void> {
    const users = this.authService.usersList();
    const current = this.authService.currentUser();

    const buttons: any[] = users.map((user) => ({
      text: `${user.name} (${user.email})${user.id === current.id ? ' - ACTIVO' : ''}`,
      icon: 'person-circle-outline',
      handler: async () => {
        await this.authService.switchUser(user);
        await this.showToast(`Sesión activa: ${user.name}`, 'medium');
      },
    }));

    buttons.push({
      text: 'Registrar nuevo usuario...',
      icon: 'add-outline',
      handler: () => {
        this.promptNewUser();
      },
    });

    buttons.push({
      text: 'Cancelar',
      role: 'cancel',
      icon: 'close-outline',
    });

    const actionSheet = await this.actionSheetController.create({
      header: 'Gestión de Cuentas / Multi-usuario',
      subHeader: `Usuario actual: ${current.name}`,
      buttons,
    });

    await actionSheet.present();
  }

  async promptNewUser(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Nuevo Usuario',
      message: 'Ingrese los datos para registrar un nuevo usuario:',
      inputs: [
        { name: 'name', type: 'text', placeholder: 'Nombre completo' },
        { name: 'email', type: 'email', placeholder: 'correo@ejemplo.com' },
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Registrar',
          handler: async (data) => {
            if (data.name && data.email) {
              const newUser = await this.authService.registerUser(data.name, data.email);
              await this.showToast(`Usuario ${newUser.name} registrado con éxito`, 'success');
            } else {
              await this.showToast('Debe ingresar un nombre y correo válidos', 'warning');
            }
          },
        },
      ],
    });

    await alert.present();
  }

  // ==========================================
  // HELPERS DE INTERFAZ
  // ==========================================

  private async showToast(message: string, color: 'success' | 'warning' | 'danger' | 'medium'): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 2500,
      position: 'bottom',
      color,
    });
    await toast.present();
  }

  private async showPermissionAlert(header: string, message: string): Promise<void> {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['Entendido'],
    });
    await alert.present();
  }
}
