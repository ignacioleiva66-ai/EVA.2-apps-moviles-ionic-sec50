# Lista de tareas - Ionic Angular

Aplicación móvil de lista de tareas desarrollada con Ionic, Angular y Capacitor. Permite crear tareas con título y descripción, visualizarlas en una lista y eliminarlas individualmente.

## Características

- Interfaz construida con componentes Ionic.
- Encabezado principal con `ion-header` e `ion-toolbar`.
- Formulario para registrar tareas:
  - Título obligatorio.
  - Descripción opcional.
  - Botón para guardar.
- Lista reactiva de tareas con `ion-list` e `ion-item`.
- Eliminación individual mediante un botón con icono de papelera.
- Limpieza automática de los campos después de guardar.
- Validación que impide guardar una tarea sin título.
- Mensaje informativo cuando todavía no existen tareas.
- Diseño adaptable para pantallas móviles y de escritorio.

## Tecnologías utilizadas

| Tecnología | Uso |
| --- | --- |
| Ionic 9 | Componentes visuales y experiencia móvil |
| Angular 22 | Estructura, componentes, rutas y plantillas |
| TypeScript 6 | Lógica tipada de la aplicación |
| Capacitor 8 | Preparación para ejecutar en Android e iOS |
| Ionicons 8 | Iconos de agregar y eliminar |
| Vite | Servidor de desarrollo y compilación |

## Requisitos previos

Instala las siguientes herramientas:

- Node.js y npm.
- Ionic CLI.

Puedes comprobar las instalaciones con:

```bash
node --version
npm --version
ionic --version
```

## Instalación

1. Abre una terminal en la carpeta del proyecto:

   ```bash
   cd "C:\Users\Danie\OneDrive\Escritorio\CLASES IPSS\SEXTO TRIMESTRE\APP MOVILES\Proyecto ionic"
   ```

2. Instala las dependencias:

   ```bash
   npm install
   ```

## Ejecución local

Inicia el servidor de desarrollo con:

```bash
ionic serve
```

La aplicación estará disponible normalmente en:

```text
http://localhost:8100
```

La ruta de la pantalla principal es:

```text
http://localhost:8100/home
```

También se puede iniciar mediante Angular:

```bash
npm start
```

Para abrir automáticamente el navegador:

```bash
ionic serve --open
```

## Uso de la aplicación

### Agregar una tarea

1. Escribe un título en el campo **Título**.
2. Opcionalmente, escribe una descripción.
3. Presiona **Guardar tarea**.

La tarea aparece inmediatamente al final de la lista. Después de guardarla, los dos campos se limpian automáticamente.

El botón permanece deshabilitado mientras el título esté vacío o contenga únicamente espacios.

### Eliminar una tarea

Presiona el botón con el icono de papelera que aparece a la derecha de la tarea. Solo se elimina el elemento seleccionado.

## Estructura del proyecto

```text
Proyecto ionic/
├── src/
│   ├── app/
│   │   ├── home/
│   │   │   ├── home.page.ts
│   │   │   ├── home.page.html
│   │   │   ├── home.page.scss
│   │   │   ├── home.module.ts
│   │   │   └── home-routing.module.ts
│   │   ├── app.component.html
│   │   ├── app.module.ts
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

## Archivos principales

### `src/app/home/home.page.ts`

Contiene la lógica de la pantalla principal:

- Define la interfaz `Task`.
- Mantiene las tareas en el `signal` reactivo `tasks`.
- Guarda temporalmente los valores de `newTaskTitle` y `newTaskDescription`.
- Implementa `addTask()` para validar y agregar tareas.
- Implementa `removeTask()` para eliminar una tarea por índice.

La lista se actualiza mediante:

```typescript
readonly tasks = signal<Task[]>([]);
```

El uso de `signal` permite que Angular actualice automáticamente la vista cuando se agrega o elimina una tarea.

### `src/app/home/home.page.html`

Define la interfaz de usuario:

- `ion-header` y `ion-toolbar` para el encabezado.
- `ion-content` como contenedor del contenido.
- `ion-input` para título y descripción.
- `ion-button` para guardar y eliminar.
- `ion-list` e `ion-item` para mostrar las tareas.
- Bloques `@if` y `@for` de Angular para renderizado condicional e iteración.

Los campos usan `[(ngModel)]` para enlazar el formulario con las propiedades del componente.

### `src/app/home/home.page.scss`

Contiene los estilos específicos de la pantalla:

- Centrado y ancho máximo del contenido.
- Espaciado del formulario.
- Estilos para títulos y descripciones.
- Bordes redondeados de la lista.
- Mensaje para el estado vacío.

### `src/app/home/home.module.ts`

Configura el módulo lazy de la página e importa:

- `CommonModule`.
- `FormsModule`, necesario para `[(ngModel)]`.
- `IonicModule`, necesario para los componentes Ionic.
- `HomePageRoutingModule`.

### `src/app/app-routing.module.ts`

Configura la navegación principal:

- `/home` carga la página de tareas.
- `/` redirige automáticamente a `/home`.

## Flujo de datos

1. El usuario escribe en los campos del formulario.
2. `ngModel` actualiza `newTaskTitle` y `newTaskDescription`.
3. Al presionar **Guardar tarea**, se ejecuta `addTask()`.
4. El título se limpia con `trim()` y se valida.
5. Se agrega un nuevo objeto `Task` al `signal`.
6. Angular actualiza la lista automáticamente.
7. Los campos del formulario se restablecen a cadenas vacías.
8. Al eliminar, `removeTask()` crea una nueva lista sin el índice seleccionado.

## Persistencia de datos

Actualmente las tareas se almacenan únicamente en memoria. Esto significa que:

- Las tareas permanecen mientras la aplicación está abierta.
- Al recargar el navegador o cerrar la aplicación, la lista vuelve a estar vacía.
- No se utiliza todavía `localStorage`, SQLite ni una API externa.

Para una siguiente versión se puede agregar persistencia con `localStorage`, SQLite mediante Capacitor o un backend.

## Comandos disponibles

| Comando | Descripción |
| --- | --- |
| `npm install` | Instala las dependencias |
| `ionic serve` | Inicia el servidor Ionic |
| `npm start` | Inicia Angular en modo desarrollo |
| `npm run build` | Genera una compilación de producción |
| `npm run watch` | Compila continuamente al detectar cambios |
| `npm test` | Ejecuta las pruebas configuradas |
| `npm run lint` | Ejecuta la revisión de estilo, si está disponible |

## Compilación

Para crear la versión compilada:

```bash
npm run build
```

Los archivos generados se guardan en la carpeta `www/`, configurada como directorio web de Capacitor.

## Ejecución en plataformas nativas

El proyecto incluye Capacitor. Después de compilar, se puede agregar una plataforma nativa:

```bash
ionic capacitor add android
```

Para sincronizar los archivos web con la plataforma:

```bash
npx cap sync
```

Para abrir el proyecto Android:

```bash
npx cap open android
```

La ejecución nativa requiere tener instalado Android Studio y un SDK de Android correctamente configurado.

## Solución de problemas

### El navegador no muestra la aplicación

Comprueba que el servidor esté activo:

```bash
ionic serve
```

Después visita:

```text
http://localhost:8100/home
```

Si existe una caché de desarrollo desactualizada, detén el servidor, elimina únicamente la carpeta `.angular/cache` y vuelve a iniciar Ionic:

```bash
ionic serve
```

También puedes hacer una recarga fuerte del navegador con `Ctrl + F5`.

### El puerto 8100 está ocupado

Inicia Ionic usando otro puerto:

```bash
ionic serve --port 8200
```

En ese caso, la aplicación estará en `http://localhost:8200`.

### El botón Guardar está deshabilitado

El título es obligatorio. Escribe al menos un carácter que no sea un espacio en blanco.

## Estado actual y posibles mejoras

La versión actual cumple las operaciones básicas de una lista de tareas. Algunas mejoras posibles son:

- Persistir las tareas entre sesiones.
- Marcar tareas como completadas.
- Editar tareas existentes.
- Incorporar filtros y búsqueda.
- Mostrar confirmación antes de eliminar.
- Añadir fecha de vencimiento y prioridad.
- Crear pruebas unitarias para `addTask()` y `removeTask()`.
- Extraer la gestión de tareas a un servicio independiente.

## Licencia

Este proyecto es de uso académico y educativo.

INTEGRANDES DEL EQUIPO: 
- DANIEL BARRERA LISPERGUER
- MATIAS RAMIREZ PONCE
- IGNACIO LEIVA CORDERO
