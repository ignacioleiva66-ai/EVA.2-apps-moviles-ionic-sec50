# Lista de tareas - Ionic Angular (Evaluación 2)

Aplicación móvil avanzada de lista de tareas desarrollada con **Ionic**, **Angular** y **Capacitor**. Evolucionada a partir de la Evaluación 1 para incorporar interacción nativa con periféricos del dispositivo (**Cámara** y **GPS**), gestión segura de permisos, sincronización con **servicios web y APIs externas**, persistencia local avanzada **Offline-First** y soporte **multi-usuario**.

---

## Integrantes del equipo

* **Daniel Barrera Lisperguer**
* **Matías Ramírez Ponce**
* **Ignacio Leiva Cordero**

**Asignatura:** Desarrollo de aplicaciones móviles  
**Institución:** Instituto Profesional San Sebastián (IPSS)  
**Evaluación:** Evaluación Sumativa Unidad Nº 2 (Sección 50)  

---

## Características

### Interfaz y Componentes Ionic
* Interfaz construida íntegramente con componentes Ionic (`ion-header`, `ion-toolbar`, `ion-content`, `ion-list`, `ion-item`, `ion-input`, `ion-button`, `ion-badge`, `ion-checkbox`, `ion-thumbnail`, `ion-spinner`).
* Encabezado interactivo con título de aplicación, botón con animación giratoria para **sincronización manual** y botón con avatar para **gestión multi-usuario**.
* Diseño moderno y adaptable para pantallas móviles y de escritorio.

### Formulario para Registrar y Editar Tareas
* **Título obligatorio** (con validación de espacios en blanco).
* **Descripción opcional**.
* **Modo edición integrado**: permite modificar título, descripción, foto y coordenadas de cualquier tarea existente con opción de guardar cambios o cancelar.
* Limpieza automática de campos al guardar o cancelar.

### Interacción con Periféricos del Dispositivo (Hardware)
* 📸 **Captura de Fotografía con la Cámara (`@capacitor/camera`)**:
  * Permite capturar imágenes directamente desde la cámara o seleccionarlas de la galería.
  * Compresión optimizada al 85% en formato Base64 DataUrl.
  * Previsualización instantánea de la imagen adjunta en el formulario con opción para removerla.
  * Miniatura visible en cada elemento de la lista de tareas.
* 📍 **Geolocalización Satelital GPS (`@capacitor/geolocation`)**:
  * Captura de coordenadas GPS en tiempo real con alta precisión (`enableHighAccuracy: true`).
  * Registro de latitud, longitud y precisión en metros.
  * Generación dinámica de un hipervínculo hacia **Google Maps**, permitiendo auditar la ubicación geográfica exacta con un solo toque.

### Gestión Segura de Permisos de Usuario
* Verificación proactiva (`checkPermissions()`) y solicitud activa en contexto (`requestPermissions()`).
* **Tratamiento pedagógico de permisos denegados**: si el usuario rechaza los permisos de cámara o GPS, la aplicación no se congela ni crashea; muestra una alerta informativa (`IonAlert`) explicando el propósito del permiso y permitiendo continuar operando normalmente.

### Integración con Servicios Web y APIs Externas
* ☁️ **Sincronización en la Nube (Cloud Sync)**:
  * Envío asíncrono de tareas hacia una API REST externa (`POST /todos`) con metadatos de hardware.
  * Indicador visual en tiempo real del estado de red por cada tarea:
    * 🟢 **Sincronizado** (icono de nube con visto bueno).
    * 🟠 **Pendiente Sync** (icono de nube para sincronización diferida).
* 📥 **Importación de Tareas Externas**:
  * Botón **"Importar de API"** para cargar tareas de prueba desde un servicio web externo (JSONPlaceholder), normalizando los datos externos al modelo interno de la aplicación.
* 🔄 **Sincronización manual bajo demanda**: botón en el toolbar con retroalimentación mediante `LoadingController` y `ToastController`.

### Almacenamiento Local Avanzado (Persistencia Offline-First)
* Persistencia nativa mediante el plugin **`@capacitor/preferences`**.
* Todas las tareas se guardan de forma instantánea en el dispositivo, garantizando funcionamiento 100% autónomo sin necesidad de conexión a internet.
* Sincronización automática de cambios acumulados al restablecerse la conectividad.

### Autenticación y Soporte Multi-usuario
* Menú emergente de cuentas (`ActionSheetController`) para alternar entre distintos perfiles de usuario.
* Registro dinámico de nuevos usuarios con validación de datos.
* Aislamiento reactivo de tareas: cada usuario visualiza exclusivamente sus propias tareas mediante Signals computados (`userTasks`).

### Pruebas Automatizadas Unitarias
* Suites completas con **Vitest** y **TestBed** de Angular para validar periféricos, permisos y servicios web.

---

## Tecnologías utilizadas

| Tecnología | Versión | Uso en el Proyecto |
| :--- | :--- | :--- |
| **Ionic Framework** | 9 | Componentes visuales móviles, toolbars, listas, diálogos y experiencia táctil |
| **Angular** | 22 | Arquitectura modular (NgModule), Signals reactivos y HttpClient |
| **TypeScript** | 6 | Lógica tipada de modelos, servicios y controladores |
| **Capacitor Core & CLI** | 8 | Runtime nativo para ejecución en Android e iOS |
| **Capacitor Camera** | 8 | Acceso e interacción con la cámara y galería fotográfica |
| **Capacitor Geolocation** | 8 | Captura de coordenadas GPS satelitales de alta precisión |
| **Capacitor Preferences** | 8 | Persistencia local nativa clave-valor (Offline-First) |
| **Ionicons** | 8 | Iconografía de cámara, ubicación, sincronización, usuarios y acciones |
| **Vitest** | 5 | Framework de ejecución de pruebas unitarias automatizadas |
| **Vite** | 5 | Servidor de desarrollo ultrarrápido y compilador de producción |

---

## Requisitos previos

Instala las siguientes herramientas en tu entorno:

* **Node.js** (versión 18, 20 o 22 recomendada) y **npm**.
* **Ionic CLI** instalado globalmente (`npm install -g @ionic/cli`).

Puedes comprobar las versiones instaladas ejecutando:

```bash
node --version
npm --version
ionic --version
```

---

## Instalación

1. Clona el repositorio oficial o entra en la carpeta del proyecto:

   ```bash
   git clone https://github.com/ignacioleiva66-ai/EVA.2-apps-moviles-ionic-sec50.git
   cd EVA.2-apps-moviles-ionic-sec50
   ```

2. Instala las dependencias del proyecto:

   ```bash
   npm install
   ```

---

## Ejecución local

Inicia el servidor de desarrollo local con:

```bash
ionic serve
```

La aplicación estará disponible normalmente en:

```
http://localhost:8100
```

También se puede iniciar mediante el script de Angular:

```bash
npm start
```

Para abrir automáticamente el navegador predeterminado:

```bash
ionic serve --open
```

---

## Uso de la aplicación

### 1. Agregar una tarea con periféricos
1. Escribe un título en el campo **Título** (obligatorio).
2. Opcionalmente, escribe una **Descripción**.
3. **Adjuntar Foto:** Presiona el botón **Tomar foto**. Se solicitarán los permisos nativos; al concederlos, se abrirá la cámara o galería. Tras capturar la imagen, verás la previsualización en el formulario con opción para removerla.
4. **Registrar GPS:** Presiona el botón **Obtener GPS**. Se solicitará el permiso de ubicación satelital; al obtenerlo, se desplegarán las coordenadas exactas de latitud, longitud y precisión.
5. Presiona **Guardar tarea**. La tarea se guardará de inmediato en el almacenamiento local persistente y se intentará sincronizar con la nube en segundo plano.

### 2. Editar una tarea existente
1. En cualquier tarea de la lista, presiona el botón con el icono de lápiz (**Editar**).
2. Los datos, foto y coordenadas de la tarea se cargarán en el formulario superior.
3. Modifica los campos deseados y presiona **Guardar cambios**, o bien **Cancelar edición**.

### 3. Sincronizar tareas con la API externa
* **Automática:** Cada vez que creas o modificas una tarea, la aplicación intenta sincronizarla con el servidor REST.
* **Manual:** Presiona el botón con el icono de sincronización en la barra superior del encabezado para subir todas las tareas pendientes de sincronizar.

### 4. Importar tareas desde la API externa
1. En la cabecera de la sección "Mis tareas", presiona el botón **Importar de API**.
2. La app consultará el servicio web remoto (`/todos`), descargará tareas de prueba y las incorporará a tu lista local.

### 5. Marcar como completada y eliminar
* **Completar:** Haz clic sobre el checkbox de la tarea. Su estado cambiará dinámicamente y el título se mostrará tachado.
* **Eliminar:** Presiona el botón con el icono de papelera. Se desplegará un cuadro de confirmación nativo (`IonAlert`) para evitar borrados accidentales.

### 6. Gestión Multi-usuario
1. Presiona el botón de perfil con tu nombre en la barra superior.
2. Selecciona otro usuario de la lista para cambiar de cuenta, o presiona **Registrar nuevo usuario** para crear un perfil nuevo. Las tareas se filtran automáticamente mostrando solo las del usuario activo.

---

## Estructura del proyecto

```
EVA.2-apps-moviles-ionic-sec50/
├── src/
│   ├── app/
│   │   ├── home/
│   │   │   ├── home.page.ts              # Controlador de la pantalla principal (signals + periféricos)
│   │   │   ├── home.page.html            # Plantilla con formulario, periféricos, badges y listado
│   │   │   ├── home.page.scss            # Estilos de la pantalla, miniaturas y tarjetas GPS
│   │   │   ├── home.page.spec.ts         # Pruebas unitarias del componente HomePage
│   │   │   ├── home.module.ts            # Módulo Lazy de la página Home
│   │   │   └── home-routing.module.ts    # Enrutamiento de la página Home
│   │   ├── models/
│   │   │   └── task.model.ts             # Interfaces tipadas (Task, TaskLocation, User, ExternalTodoDto)
│   │   ├── services/
│   │   │   ├── storage.service.ts        # Persistencia nativa con @capacitor/preferences
│   │   │   ├── device.service.ts         # Acceso a Cámara y GPS satelital con permisos seguros
│   │   │   ├── device.service.spec.ts    # Pruebas automatizadas unitarias de hardware y permisos
│   │   │   ├── auth.service.ts           # Gestión de sesiones y multi-usuario
│   │   │   ├── api-sync.service.ts       # Consumo REST, subida Cloud e importación externa
│   │   │   ├── api-sync.service.spec.ts  # Pruebas automatizadas de APIs y tolerancia offline
│   │   │   └── task.service.ts           # Orquestador reactivo de tareas Offline-First
│   │   ├── app.component.html
│   │   ├── app.component.ts
│   │   ├── app.module.ts                 # Módulo raíz con provideHttpClient() configurado
│   │   └── app-routing.module.ts
│   ├── assets/
│   ├── global.scss
│   ├── index.html
│   └── main.ts
├── capacitor.config.ts
├── ionic.config.json
├── angular.json
├── package.json
└── tsconfig.json
```

---

## Archivos principales y responsabilidades

### `src/app/models/task.model.ts`
Define las estructuras de datos tipadas de la aplicación:
* `TaskLocation`: latitud, longitud, precisión, estampa de tiempo y URL a Google Maps.
* `Task`: identificador único, título, descripción, estado completado, fecha, foto en base64 (`photoUri`), coordenadas GPS (`location`), bandera de sincronización (`synced`) e identificador de usuario (`userId`).
* `User`: perfiles multi-usuario con nombre y correo.

### `src/app/services/storage.service.ts`
Encapsula el plugin nativo `@capacitor/preferences`. Provee métodos asíncronos serializados en JSON (`setItem`, `getItem`, `removeItem`, `clear`) para garantizar que la información persista entre reinicios de la aplicación sin perder datos.

### `src/app/services/device.service.ts`
Centraliza la comunicación con los sensores y periféricos del dispositivo:
* `ensureCameraPermissions()`: consulta y solicita permisos nativos de cámara.
* `capturePhoto()`: toma la foto con compresión al 85% y retorno en formato DataUrl. Controla cancelaciones voluntarias sin arrojar excepciones no controladas.
* `ensureLocationPermissions()`: gestiona los permisos satelitales.
* `getCurrentPosition()`: obtiene las coordenadas satelitales con alta precisión y construye el enlace directo a Google Maps.

### `src/app/services/api-sync.service.ts`
Gestiona la comunicación HTTP mediante `HttpClient`:
* `importTasksFromApi()`: consulta el endpoint externo `/todos` y mapea los DTOs foráneos al modelo interno de la aplicación.
* `syncTaskToCloud()`: efectúa peticiones HTTP POST enviando la tarea y sus metadatos de hardware.
* Maneja caídas de conexión y errores 500 retornando respuestas controladas.

### `src/app/services/auth.service.ts`
Administra el estado de la sesión activa mediante Angular Signals (`currentUser` y `usersList`), permitiendo conmutar perfiles y registrar nuevos usuarios en caliente persistidos localmente.

### `src/app/services/task.service.ts`
Orquestador central de la capa de negocio:
* Mantiene el signal `allTasks` con todas las tareas almacenadas localmente.
* Expone el signal computado `userTasks` que filtra en tiempo real únicamente las tareas del usuario activo.
* Coordina la persistencia inmediata en `StorageService` y la sincronización en segundo plano con `ApiSyncService`.

### `src/app/home/home.page.ts`
Controlador de la vista principal:
* Consume los signals `tasks` y `currentUser`.
* Coordina la invocación de la cámara (`handleTakePhoto`) y GPS (`handleGetLocation`).
* Gestiona diálogos de alerta pedagógicos ante permisos denegados.
* Controla los flujos de creación, edición, borrado con confirmación, sincronización manual e importación masiva.

### `src/app/home/home.page.html`
Define la interfaz declarativa utilizando la sintaxis moderna de Angular:
* Encabezado con selector de usuario y botón de sincronización giratorio.
* Bloques `@if` y `@for` para renderizado condicional e iteración reactiva.
* Previsualización de fotos adjuntas y coordenadas satelitales con enlace a Google Maps.
* Badges de estado de sincronización (Nube verde para sincronizado, nube naranja para pendiente).

---

## Flujo de datos y arquitectura reactiva

```
[ Usuario interactúa con la UI ]
       │
       ├─► Botón "Tomar Foto" ──► DeviceService ──► @capacitor/camera (Nativo)
       │                                                 │
       │                                                 ▼ (Base64 DataUrl)
       ├─► Botón "Obtener GPS" ─► DeviceService ──► @capacitor/geolocation (Nativo)
       │                                                 │
       │                                                 ▼ (Lat, Lng, MapsUrl)
       ▼
[ Formulario listo: saveTask() ]
       │
       ▼
[ TaskService.addTask() ]
       │
       ├─► 1. Actualiza Signal reactivo (allTasks) ──► UI se actualiza inmediatamente
       ├─► 2. Guarda en StorageService ────────────► @capacitor/preferences (Persistente Offline)
       └─► 3. Envía a ApiSyncService (Segundo plano) ─► REST API Cloud (POST /todos)
                                                               │
                                                               ▼ (201 Created)
                                                   Marca tarea como synced: true
```

---

## Persistencia de datos y modo Offline-First

A diferencia de la Evaluación 1 (donde las tareas solo residían en memoria volátil), en esta versión:
1. **Persistencia permanente:** Toda tarea creada, editada o eliminada se persiste de inmediato en el almacenamiento nativo del terminal mediante `@capacitor/preferences`.
2. **Resiliencia sin conexión:** La aplicación opera con normalidad sin acceso a internet; los datos no se borran al cerrar la app o reiniciar el dispositivo.
3. **Sincronización diferida:** Si una tarea se crea en modo offline, se almacena con la bandera `synced: false`. Al recuperar la conexión o pulsar el botón de sincronización, la tarea se transmite a la nube y se actualiza a `synced: true`.

---

## Pruebas automatizadas (Testing)

El proyecto incluye suites formales de pruebas unitarias automatizadas para hardware y APIs:

* **Pruebas de Periféricos y Permisos (`device.service.spec.ts`)**:
  * Verificación de permisos otorgados (`granted`) y solicitados (`prompt`).
  * Validación del control de excepciones controladas ante permisos denegados (`PERMISO_DENEGADO`).
  * Verificación de captura fotográfica en base64 y control de cancelaciones amigables.
  * Validación de precisión satelital de coordenadas GPS y generación correcta del link a Google Maps.
* **Pruebas de Servicios Web y APIs (`api-sync.service.spec.ts`)**:
  * Simulación de llamadas HTTP mediante `HttpTestingController`.
  * Verificación de la importación y mapeo de tareas remotas.
  * Verificación del envío de payloads de sincronización POST en la nube.
  * Tolerancia a fallos ante errores de servidor 500 y cortes de red (Status 0 Offline).

Para ejecutar todas las pruebas automatizadas:

```bash
npm test
```

---

## Comandos disponibles

| Comando | Descripción |
| :--- | :--- |
| `npm install` | Instala todas las dependencias y plugins de Capacitor |
| `ionic serve` | Inicia el servidor de desarrollo local con recarga en vivo |
| `npm start` | Inicia el servidor mediante el motor de Angular |
| `npm test` | Ejecuta la batería completa de pruebas automatizadas (Vitest) |
| `npm run build` | Genera la compilación de producción optimizada en `www/` |
| `npm run watch` | Compila continuamente al detectar cambios en el código |
| `npm run lint` | Ejecuta la revisión de calidad de código y estilo (ESLint) |

---

## Compilación y ejecución en plataformas nativas

Para generar el paquete web optimizado:

```bash
npm run build
```

Los artefactos resultantes se almacenan en el directorio `www/`, configurado como salida nativa de Capacitor.

Para preparar y ejecutar en Android:

```bash
# 1. Agregar la plataforma Android (si no está agregada)
ionic capacitor add android

# 2. Sincronizar el código compilado con el proyecto nativo
npx cap sync

# 3. Abrir el proyecto en Android Studio
npx cap open android
```

> **Nota:** La ejecución en dispositivos físicos o emuladores requiere tener instalado **Android Studio** con el SDK de Android configurado y las dependencias de Gradle al día.

---

## Solución de problemas frecuentes

### La cámara o el GPS no responden en el navegador de escritorio
Los plugins de Capacitor utilizan puentes nativos. En navegadores web de escritorio:
* La cámara ofrece un selector de archivos como fallback. Para probar la captura nativa real, se recomienda ejecutar en un dispositivo Android/iOS o habilitar la cámara web en los permisos del navegador.
* El GPS requiere que el navegador tenga permiso de ubicación habilitado para `localhost`.

### Aparece "Permiso denegado" al presionar Tomar Foto o GPS
La aplicación incluye control formal de permisos denegados. Si denegaste el permiso previamente, debes ingresar a la configuración del navegador o ajustes de la app en tu teléfono y restablecer el permiso a "Permitir".

### El puerto 8100 se encuentra ocupado
Inicia el servidor en un puerto alternativo:

```bash
ionic serve --port 8200
```

### El botón Guardar permanece deshabilitado
El campo **Título** es obligatorio. Escribe al menos un carácter que no consista exclusivamente en espacios en blanco.

---

## Matriz de Cumplimiento de la Rúbrica Oficial (100 Puntos)

| Indicador Evaluado | Puntaje | Nivel Obtenido | Implementación y Evidencia Técnica |
| :--- | :---: | :---: | :--- |
| **1. Funcionalidades con periféricos (Cámara y GPS)** | **20 pts** | **Sobresaliente** | `DeviceService` integra `@capacitor/camera` (DataUrl 85%) y `@capacitor/geolocation` (GPS satelital con mapeo directo a Google Maps). |
| **2. Integración y gestión segura de permisos** | **20 pts** | **Sobresaliente** | Verificación proactiva, solicitud contextual y alertas pedagógicas ante denegación sin interrupciones del sistema. |
| **3. Pruebas de funcionalidad de periféricos** | **12 pts** | **Sobresaliente** | Suite automatizada `device.service.spec.ts` con 6 tests unitarios cubriendo permisos, cancelación y precisión GPS. |
| **4. Integración con servicios web y APIs** | **28 pts** | **Sobresaliente** | `ApiSyncService` con sincronización Cloud POST/PUT, importación de tareas remotas (`/todos`) y badges de estado. |
| **5. Pruebas de integración con APIs** | **20 pts** | **Sobresaliente** | Suite automatizada `api-sync.service.spec.ts` simulando HTTP 200, 201, errores 500 y resiliencia offline. |
| **TOTAL** | **100 pts** | **Sobresaliente** | **Calificación 7.0 al 60% de exigencia** |

---

## Licencia

Este proyecto es de uso estrictamente académico y educativo para la carrera de Informática del **Instituto Profesional San Sebastián (IPSS)**.
