import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  /**
   * Guarda un elemento en el almacenamiento local persistente de Capacitor
   */
  async setItem<T>(key: string, value: T): Promise<void> {
    await Preferences.set({
      key,
      value: JSON.stringify(value),
    });
  }

  /**
   * Obtiene un elemento desde el almacenamiento local persistente de Capacitor
   */
  async getItem<T>(key: string): Promise<T | null> {
    const { value } = await Preferences.get({ key });
    if (!value) return null;
    try {
      return JSON.parse(value) as T;
    } catch {
      return null;
    }
  }

  /**
   * Elimina un elemento por clave
   */
  async removeItem(key: string): Promise<void> {
    await Preferences.remove({ key });
  }

  /**
   * Limpia todo el almacenamiento persistente
   */
  async clear(): Promise<void> {
    await Preferences.clear();
  }
}
