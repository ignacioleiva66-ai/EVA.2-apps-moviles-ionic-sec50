import { TestBed } from '@angular/core/testing';
import { DeviceService } from './device.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';

describe('DeviceService - Pruebas de Periféricos y Permisos (Evaluación 2)', () => {
  let service: DeviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DeviceService],
    });
    service = TestBed.inject(DeviceService);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Cámara y Gestión de Permisos', () => {
    it('debe validar permisos otorgados correctamente', async () => {
      vi.spyOn(Camera, 'checkPermissions').mockResolvedValue({
        camera: 'granted',
        photos: 'granted',
      });

      const hasPermission = await service.ensureCameraPermissions();
      expect(hasPermission).toBe(true);
      expect(Camera.checkPermissions).toHaveBeenCalled();
    });

    it('debe solicitar permisos si el estado inicial es prompt', async () => {
      vi.spyOn(Camera, 'checkPermissions').mockResolvedValue({
        camera: 'prompt',
        photos: 'prompt',
      });
      vi.spyOn(Camera, 'requestPermissions').mockResolvedValue({
        camera: 'granted',
        photos: 'granted',
      });

      const hasPermission = await service.ensureCameraPermissions();
      expect(hasPermission).toBe(true);
      expect(Camera.requestPermissions).toHaveBeenCalled();
    });

    it('debe lanzar error de permiso denegado si el usuario rechaza la cámara', async () => {
      vi.spyOn(Camera, 'checkPermissions').mockResolvedValue({
        camera: 'denied',
        photos: 'denied',
      });
      vi.spyOn(Camera, 'requestPermissions').mockResolvedValue({
        camera: 'denied',
        photos: 'denied',
      });

      await expect(service.capturePhoto()).rejects.toThrow('PERMISO_DENEGADO');
    });

    it('debe capturar imagen en formato DataUrl con calidad al 85%', async () => {
      vi.spyOn(service, 'ensureCameraPermissions').mockResolvedValue(true);
      const mockPhoto = {
        dataUrl: 'data:image/jpeg;base64,/9j/4AAQSkZJRg...',
        format: 'jpeg',
      };
      vi.spyOn(Camera, 'getPhoto').mockResolvedValue(mockPhoto as any);

      const result = await service.capturePhoto(CameraSource.Camera);
      expect(result).toBe(mockPhoto.dataUrl);
      expect(Camera.getPhoto).toHaveBeenCalledWith(
        expect.objectContaining({
          resultType: CameraResultType.DataUrl,
          quality: 85,
        })
      );
    });

    it('debe retornar null sin romper la app si el usuario cancela la foto', async () => {
      vi.spyOn(service, 'ensureCameraPermissions').mockResolvedValue(true);
      vi.spyOn(Camera, 'getPhoto').mockRejectedValue(new Error('User cancelled photos app'));

      const result = await service.capturePhoto();
      expect(result).toBeNull();
    });
  });

  describe('Geolocalización GPS y Permisos', () => {
    it('debe validar permisos de ubicación', async () => {
      vi.spyOn(Geolocation, 'checkPermissions').mockResolvedValue({
        location: 'granted',
        coarseLocation: 'granted',
      });

      const hasPermission = await service.ensureLocationPermissions();
      expect(hasPermission).toBe(true);
    });

    it('debe arrojar excepción controlada si el GPS es denegado', async () => {
      vi.spyOn(Geolocation, 'checkPermissions').mockResolvedValue({
        location: 'denied',
        coarseLocation: 'denied',
      });
      vi.spyOn(Geolocation, 'requestPermissions').mockResolvedValue({
        location: 'denied',
        coarseLocation: 'denied',
      });

      await expect(service.getCurrentPosition()).rejects.toThrow('PERMISO_DENEGADO');
    });

    it('debe obtener coordenadas de alta precisión y generar URL a Google Maps', async () => {
      vi.spyOn(service, 'ensureLocationPermissions').mockResolvedValue(true);
      const mockPos = {
        coords: {
          latitude: -33.4489,
          longitude: -70.6693,
          accuracy: 4,
          altitude: null,
          altitudeAccuracy: null,
          heading: null,
          speed: null,
        },
        timestamp: Date.now(),
      };
      vi.spyOn(Geolocation, 'getCurrentPosition').mockResolvedValue(mockPos as any);

      const loc = await service.getCurrentPosition();
      expect(loc.latitude).toBe(-33.4489);
      expect(loc.longitude).toBe(-70.6693);
      expect(loc.accuracy).toBe(4);
      expect(loc.mapsUrl).toBe('https://www.google.com/maps?q=-33.4489,-70.6693');
    });
  });
});
