import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Geolocation, Position } from '@capacitor/geolocation';
import { TaskLocation } from '../models/task.model';

@Injectable({
  providedIn: 'root',
})
export class DeviceService {
  /**
   * Verifica y solicita permisos para la Cámara de manera transparente y segura
   */
  async ensureCameraPermissions(): Promise<boolean> {
    try {
      const check = await Camera.checkPermissions();
      if (check.camera === 'granted' || check.photos === 'granted') {
        return true;
      }
      const request = await Camera.requestPermissions();
      return request.camera === 'granted' || request.photos === 'granted';
    } catch (error) {
      console.warn('Fallback de permisos de cámara en navegador web:', error);
      return true;
    }
  }

  /**
   * Captura una fotografía usando la cámara del dispositivo móvil
   */
  async capturePhoto(source: CameraSource = CameraSource.Prompt): Promise<string | null> {
    const hasPermission = await this.ensureCameraPermissions();
    if (!hasPermission) {
      throw new Error('PERMISO_DENEGADO: El usuario denegó los permisos de acceso a la cámara o galería.');
    }

    try {
      const photo = await Camera.getPhoto({
        quality: 85,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source,
      });

      return photo.dataUrl || null;
    } catch (error: any) {
      if (error?.message?.includes('User cancelled') || error?.message?.includes('closed')) {
        return null;
      }
      throw error;
    }
  }

  /**
   * Verifica y solicita permisos para el GPS / Geolocalización
   */
  async ensureLocationPermissions(): Promise<boolean> {
    try {
      const check = await Geolocation.checkPermissions();
      if (check.location === 'granted') {
        return true;
      }
      const request = await Geolocation.requestPermissions();
      return request.location === 'granted';
    } catch (error) {
      console.warn('Fallback de permisos GPS en navegador web:', error);
      return true;
    }
  }

  /**
   * Obtiene la posición GPS satelital con alta precisión y genera enlace a Google Maps
   */
  async getCurrentPosition(): Promise<TaskLocation> {
    const hasPermission = await this.ensureLocationPermissions();
    if (!hasPermission) {
      throw new Error('PERMISO_DENEGADO: El usuario denegó los permisos de geolocalización satelital (GPS).');
    }

    try {
      const position: Position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5000,
      });

      const { latitude, longitude, accuracy } = position.coords;
      const timestamp = position.timestamp;
      const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

      return {
        latitude,
        longitude,
        accuracy,
        timestamp,
        mapsUrl,
      };
    } catch (error: any) {
      throw new Error(`Error al capturar ubicación GPS: ${error.message || 'Señal satelital no disponible'}`);
    }
  }
}
