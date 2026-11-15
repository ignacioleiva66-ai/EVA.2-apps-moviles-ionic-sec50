export interface TaskLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp: number;
  mapsUrl: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string | Date;
  photoUri?: string;            // Evidencia fotográfica capturada con Cámara (base64 DataUrl)
  location?: TaskLocation;       // Ubicación GPS georreferenciada (Capacitor Geolocation)
  synced: boolean;              // Estado de sincronización con servicio web / API
  userId: string;               // Identificador del usuario (autenticación multi-usuario)
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface ExternalTodoDto {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}
