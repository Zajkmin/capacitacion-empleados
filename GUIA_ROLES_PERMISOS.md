# 🛡️ Sistema de Roles y Permisos - Guía de Uso

## Implementación Completada

He agregado un sistema completo de roles y permisos a tu aplicación. Aquí está lo que se ha implementado:

### 📋 Roles Disponibles

#### 1. **Administrador** (admin)
- ✅ Acceso completo a todas las funciones
- ✅ Puede agregar secciones en proyectos
- ✅ Puede editar secciones
- ✅ Puede eliminar secciones
- ✅ Acceso al panel de administración
- ✅ Puede gestionar usuarios y roles

#### 2. **Supervisor de Campo** (supervisor)
- ✅ Ver proyectos y secciones
- ✅ Ver capacitación
- ✅ Ver actualizaciones
- ❌ No puede agregar/editar/eliminar contenido

#### 3. **Operario** (operario)
- ✅ Ver proyectos y secciones
- ✅ Ver capacitación
- ❌ No puede ver actualizaciones
- ❌ No puede editar contenido

#### 4. **Especialista** (especialista)
- ✅ Ver proyectos y secciones
- ✅ Puede agregar secciones
- ✅ Puede editar secciones
- ✅ Ver actualizaciones
- ❌ No puede eliminar secciones

## 🧪 Cómo Probar

### 1. **Prueba el Login con diferentes roles:**
```
Abre la aplicación y verás el formulario de login.
En el campo "Rol de acceso" selecciona:
- Administrador
- Supervisor de Campo
- Operario
- Especialista
```

### 2. **Con rol de Administrador:**
- En la barra lateral, verás un nuevo menú: **"Administración"**
- Haz clic para acceder al panel de admin
- Aquí puedes:
  - Ver todos los usuarios registrados
  - Cambiar roles de usuarios
  - Ver qué permisos tiene cada rol

### 3. **En los Proyectos:**

**Si eres Administrador o Especialista:**
- Al entrar en un proyecto, verás un botón **"Nueva"** en la esquina superior derecha
- Puedes hacer clic en los 3 puntos al pasar el mouse sobre una sección para:
  - ✏️ Editar sección
  - 🗑️ Eliminar sección

**Si eres Supervisor u Operario:**
- Solo verás las secciones
- No podrás agregar, editar o eliminar

### 4. **Modal de Edición de Secciones:**
- Llenar título y descripción
- Seleccionar tipo de sección
- Agregar contenido completo
- Los cambios se guardan automáticamente

## 📁 Archivos Creados/Modificados

### Nuevos Archivos:
```
lib/
  └── roles-permissions.ts          # Sistema de roles y permisos
  
components/
  ├── admin-panel.tsx               # Panel de administración
  └── section-edit-modal.tsx        # Modal para editar secciones
```

### Archivos Modificados:
```
app/
  └── page.tsx                       # Login con selección de rol
  
components/
  ├── login-page.tsx                # Agregar selector de rol
  ├── dashboard-layout.tsx          # Agregar vista de admin
  ├── sidebar.tsx                   # Mostrar opción admin solo para admins
  └── project-view.tsx              # Botones de edición según permisos
```

## 🔐 Lógica de Permisos

El sistema funciona de la siguiente manera:

```typescript
// Archivo: lib/roles-permissions.ts

// Tipos de permisos
type Permission = 
  | "view_dashboard"
  | "view_projects"
  | "view_sections"
  | "add_section"
  | "edit_section"
  | "delete_section"
  | "manage_users"
  | "view_training"
  | "view_updates"
  | "manage_roles"

// Cada rol tiene permisos específicos
rolePermissions: {
  admin: [todos los permisos],
  supervisor: [view_dashboard, view_projects, view_sections, view_training, view_updates],
  operario: [view_dashboard, view_projects, view_sections, view_training],
  especialista: [view_dashboard, view_projects, view_sections, add_section, edit_section, view_training, view_updates]
}

// Uso en componentes
const canEdit = hasPermission(userRole, "edit_section")
if (canEdit) {
  // Mostrar botón de editar
}
```

## 🎯 Casos de Uso

### Escenario 1: Administrador gestiona contenido
1. Administrador ingresa como "Administrador"
2. Va a un proyecto
3. Hace clic en "Nueva" para agregar una sección
4. Rellena el formulario y la sección se crea
5. Puede editar o eliminar secciones cuando quiera

### Escenario 2: Supervisor revisa contenido
1. Supervisor ingresa como "Supervisor de Campo"
2. Va a un proyecto
3. Solo puede ver las secciones (sin botones de edición)
4. No ve la opción "Administración" en el menú

### Escenario 3: Especialista crea contenido
1. Especialista ingresa como "Especialista"
2. Va a un proyecto
3. Puede agregar y editar secciones
4. Pero NO puede eliminar secciones

## 🔄 Flujo de Autenticación

```
Login → Seleccionar Rol → Dashboard
                              ↓
                    Roles y permisos asignados
                              ↓
                    Mostrar/ocultar funciones
```

## 📊 Matriz de Permisos

| Permiso | Admin | Supervisor | Operario | Especialista |
|---------|-------|-----------|----------|-------------|
| Ver Dashboard | ✅ | ✅ | ✅ | ✅ |
| Ver Proyectos | ✅ | ✅ | ✅ | ✅ |
| Ver Secciones | ✅ | ✅ | ✅ | ✅ |
| Agregar Sección | ✅ | ❌ | ❌ | ✅ |
| Editar Sección | ✅ | ❌ | ❌ | ✅ |
| Eliminar Sección | ✅ | ❌ | ❌ | ❌ |
| Ver Capacitación | ✅ | ✅ | ✅ | ✅ |
| Ver Actualizaciones | ✅ | ✅ | ❌ | ✅ |
| Panel Admin | ✅ | ❌ | ❌ | ❌ |

## 🚀 Próximos Pasos (Opcional)

Para mejorar más el sistema, puedes:

1. **Persistencia**: Guardar roles en base de datos
2. **Autenticación Real**: Integrar con un backend
3. **Auditoría**: Registrar cambios realizados por admins
4. **Múltiples Proyectos**: Asignar permisos por proyecto
5. **Equipos**: Crear equipos con permisos compartidos

¡El sistema está listo para usar! 🎉
