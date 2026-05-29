# Nexo - Arquitectura Funcional

## Introducción

Este documento describe la arquitectura funcional de Nexo y la relación entre sus principales módulos.

La arquitectura fue diseñada para permitir una gestión escalable del conocimiento organizacional mediante grupos, proyectos, roles, permisos y contenido operativo.

---

# Estructura General

La plataforma se organiza mediante una jerarquía de acceso y contenido.

```text
Usuario
 ├── Rol
 ├── Permisos
 └── Proyectos Asignados

Grupo
 └── Proyecto
      ├── Reglas
      ├── Excepciones
      ├── Aprendizaje Visual
      ├── Biblioteca
      ├── Fotos Guía
      ├── Errores Frecuentes
      └── Actualizaciones
```

---

# Módulos Principales

## Dashboard

Es el punto de entrada principal.

Permite visualizar:

* Grupos disponibles.
* Proyectos asignados.
* Accesos rápidos.
* Estado general del contenido.

Los proyectos se organizan visualmente mediante grupos definidos por la organización.

Ejemplos:

* Países.
* Clientes.
* Sucursales.
* Departamentos.

---

## Gestión de Proyectos

Cada proyecto funciona como una unidad independiente de conocimiento operativo.

Un proyecto contiene toda la información necesaria para ejecutar una operación específica.

### Componentes

* Reglas.
* Excepciones.
* Aprendizaje Visual.
* Biblioteca.
* Fotos Guía.
* Errores Frecuentes.
* Actualizaciones.

---

## Reglas

Contiene procedimientos obligatorios y lineamientos operativos.

Objetivo:

Estandarizar la ejecución de actividades.

---

## Excepciones

Contiene situaciones especiales que requieren tratamientos distintos a las reglas generales.

Objetivo:

Reducir incertidumbre ante casos particulares.

---

## Aprendizaje Visual

Contiene comparativas, ejemplos ilustrados y material gráfico explicativo.

Objetivo:

Facilitar la comprensión mediante recursos visuales.

---

## Biblioteca

Contiene recursos documentales complementarios.

Ejemplos:

* Manuales.
* Procedimientos.
* Formularios.
* Documentación técnica.

---

## Fotos Guía

Contiene referencias visuales de ejecución correcta.

Objetivo:

Reducir errores de interpretación.

---

## Errores Frecuentes

Contiene errores identificados durante la operación.

Objetivo:

Prevenir reincidencias.

---

## Actualizaciones

Contiene cambios recientes relacionados con el proyecto.

Objetivo:

Mantener informados a los usuarios.

---

# Capacitación

La capacitación es independiente de los proyectos.

Está orientada a la formación de los usuarios según su función dentro de la organización.

## Estructura

Rol
→ Ruta de capacitación
→ Pasos
→ Contenido

Ejemplo:

Encuestador

* Introducción
* Uso de herramientas
* Procedimiento operativo
* Captura de información
* Buenas prácticas

Supervisor

* Gestión de equipos
* Seguimiento operativo
* Validaciones

---

# Gestión de Usuarios

Cada usuario posee:

* Nombre.
* Correo electrónico.
* Rol principal.
* Permisos adicionales.
* Proyectos asignados.

Los usuarios visualizan únicamente la información autorizada.

---

# Roles

Los roles representan conjuntos de responsabilidades.

Ejemplos:

* Administrador.
* Supervisor.
* Analista de Calidad.
* Encuestador.

Cada rol posee permisos predeterminados.

---

# Permisos

Los permisos controlan acciones específicas dentro del sistema.

Ejemplos:

* Ver dashboard.
* Ver proyectos.
* Ver secciones.
* Ver capacitación.
* Agregar contenido.
* Editar contenido.
* Eliminar contenido.
* Gestionar usuarios.
* Gestionar roles y permisos.
* Ver notificaciones.

---

# Permisos Personalizados

Nexo permite asignar permisos adicionales a usuarios individuales.

Esto evita la necesidad de crear nuevos roles para situaciones específicas.

---

# Asignación de Proyectos

Los proyectos pueden asignarse individualmente a cada usuario.

Beneficios:

* Seguridad.
* Menor sobrecarga de información.
* Segmentación operativa.

---

# Sistema de Notificaciones

Las notificaciones registran cambios relevantes dentro de la plataforma.

Tipos de eventos:

* Creación.
* Modificación.
* Eliminación.
* Actualización.

Su objetivo es mejorar la comunicación organizacional.

---

# Flujo General

```text
Administrador
    ↓
Configura Roles
    ↓
Configura Permisos
    ↓
Crea Grupos
    ↓
Crea Proyectos
    ↓
Carga Contenido
    ↓
Asigna Usuarios
    ↓
Usuarios Consumen Información
```
