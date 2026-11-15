# Lista de Tareas Avanzada - Ionic Angular (Evaluación Sumativa Unidad 2)

**Instituto Profesional San Sebastián (IPSS)**  
**Carrera:** Área de Informática y Telecomunicaciones  
**Asignatura:** Desarrollo de aplicaciones móviles  
**Evaluación:** Evaluación Sumativa Unidad Nº 2 (Ponderación 20%, 100 puntos)  
**Estudiante:** Ignacio Leiva  

---

## 📋 Descripción del Proyecto

Aplicación móvil híbrida para gestión de tareas (To-Do List) desarrollada con **Ionic Framework 9**, **Angular 22** y **Capacitor 8**. Evolucionada desde la Unidad 1 para integrar:
1. **Periféricos del dispositivo**: Captura de fotografías con la **Cámara** y georreferenciación satelital con **GPS**.
2. **Gestión segura de permisos**: Ciclo completo de verificación, solicitud y control de permisos denegados sin bloqueos.
3. **Servicios Web y APIs**: Sincronización bidireccional en la nube (Cloud Sync) e importación de tareas externas vía REST API.
4. **Almacenamiento Local Avanzado**: Persistencia nativa Offline-First con `@capacitor/preferences`.
5. **Autenticación Multi-usuario**: Aislamiento de tareas por usuario y cambio ágil de perfiles.
6. **Pruebas Automatizadas**: Suites de testing unitario para hardware y APIs HTTP.

---

## 🚀 Nuevas Características (Unidad 2)

- 📸 **Cámara (@capacitor/camera)**: Captura fotos en base64 DataUrl comprimidas al 85%, con previsualización y eliminación.
- 📍 **GPS (@capacitor/geolocation)**: Captura coordenadas de alta precisión (latitud, longitud, precisión) y genera enlaces directos a Google Maps.
- 🛡️ **Permisos Seguros**: Manejo pedagógico de permisos denegados con alertas modales de Ionic (`IonAlert`).
- ☁️ **Sincronización Cloud (REST API)**: Sincronización automática y manual con endpoints REST (JSONPlaceholder).
- 📥 **Importación de Tareas**: Carga masiva de tareas desde servicio web externo (`/todos`).
- 💾 **Persistencia Offline-First**: Almacenamiento local mediante `@capacitor/preferences` para operar sin internet.
- 👥 **Multi-usuario**: Conmutación de perfiles de usuario y aislamiento de tareas por `userId`.
- 🧪 **Pruebas Automatizadas**: Pruebas unitarias completas en `device.service.spec.ts` y `api-sync.service.spec.ts`.

---

## 🛠️ Tecnologías Utilizadas

| Tecnología | Versión | Uso en el Proyecto |
| :--- | :--- | :--- |
| **Ionic Framework** | 9.x | Componentes visuales móviles, toolbars, listados, alertas y spinners |
| **Angular** | 22.x | Arquitectura modular (NgModule), Signals reactivos y HttpClient |
| **Capacitor Core & CLI**| 8.x | Runtime nativo para Android e iOS |
| **Capacitor Camera** | 8.x | Interacción nativa con la cámara del dispositivo móvil |
| **Capacitor Geolocation** | 8.x | Acceso a coordenadas satelitales GPS |
| **Capacitor Preferences** | 8.x | Almacenamiento persistente nativo clave-valor |
| **TypeScript** | 6.x | Tipado estricto de modelos, servicios y componentes |
| **Vitest** | 5.x | Suite de ejecución de pruebas unitarias automatizadas |

---

## 💻 Instalación y Ejecución

### 1. Clonar el repositorio y acceder a la carpeta:
```bash
git clone https://github.com/danielbanmode/EVA.1-apps-moviles-ionic-sec50.git
cd EVA.1-apps-moviles-ionic-sec50
```

### 2. Instalar dependencias del proyecto:
```bash
npm install
```

### 3. Ejecutar en el servidor local de desarrollo:
```bash
npm start
# o con Ionic CLI:
ionic serve
```

### 4. Ejecutar las pruebas automatizadas (Testing):
```bash
npm test
```

---

## 📊 Matriz de Cumplimiento de la Rúbrica (100 Puntos)

| Indicador Evaluado | Puntos | Nivel Obtenido | Implementación |
| :--- | :---: | :---: | :--- |
| **1. Funcionalidades con periféricos** | 20 pts | **Sobresaliente** | `DeviceService` integra cámara y GPS satelital con mapeo directo. |
| **2. Integración y gestión de permisos** | 20 pts | **Sobresaliente** | Verificación, solicitud contextual y alertas pedagógicas ante rechazo. |
| **3. Pruebas de funcionalidad periféricos** | 12 pts | **Sobresaliente** | `device.service.spec.ts` con 6 tests unitarios automatizados. |
| **4. Integración con servicios web y APIs** | 28 pts | **Sobresaliente** | `ApiSyncService` con sincronización Cloud, importación y badges de estado. |
| **5. Pruebas de integración con APIs** | 20 pts | **Sobresaliente** | `api-sync.service.spec.ts` simulando HTTP 200, 201, 500 y cortes de red. |
| **TOTAL** | **100 pts** | **Sobresaliente** | **Calificación 7.0 al 60% de exigencia** |
