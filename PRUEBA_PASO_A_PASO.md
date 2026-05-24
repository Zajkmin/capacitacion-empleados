# ✅ Guía de Prueba - Sistema de Roles y Permisos

## 🚀 Pasos para Probar la Implementación

### **Paso 1: Acceder a la Aplicación**
```
URL: http://localhost:3000
```

### **Paso 2: Login como Administrador**
1. En el formulario de login:
   - Email: `admin@empresa.com` (cualquier email funciona)
   - Contraseña: `admin123` (cualquier contraseña funciona)
   - **Rol: Selecciona "Administrador"**
2. Haz clic en "Ingresar"

### **Paso 3: Explorar el Panel de Administración**
Verás una nueva opción en el menú lateral: **"Administración" 🔒**

**En la pestaña "Usuarios":**
- ✅ Verás una lista de usuarios
- ✅ Puedes cambiar el rol de cualquier usuario
- ✅ Puedes eliminar usuarios (con confirmación)

**En la pestaña "Roles y Permisos":**
- ✅ Verás cada rol disponible
- ✅ Verás qué permisos tiene cada rol
- ✅ Comparación de accesos

### **Paso 4: Crear/Editar Secciones en un Proyecto**
1. Vuelve al **Inicio** desde el menú
2. Selecciona cualquier proyecto (ej: "Arcor PY")
3. Verás un botón **"Nueva"** en la esquina superior derecha ➕
4. Haz clic para crear una nueva sección:
   - Título: "Mi Nueva Sección"
   - Tipo: Selecciona uno
   - Descripción: "Esta es una prueba"
   - Contenido: Agrega algún texto
5. Haz clic en **"Crear"**

### **Paso 5: Editar/Eliminar Secciones**
1. En el proyecto, pasa el mouse sobre cualquier sección
2. Aparecerán dos botones:
   - ✏️ **Editar** - Modifica la sección
   - 🗑️ **Eliminar** - Elimina la sección (con confirmación)

### **Paso 6: Probar con Otros Roles**

#### **Test como Supervisor de Campo**
1. Logout: Haz clic en el botón de logout en el menú
2. Login nuevamente:
   - **Rol: "Supervisor de Campo"**
3. Observa:
   - ❌ No aparece la opción "Administración"
   - ❌ No hay botón "Nueva" en los proyectos
   - ❌ No puedes editar/eliminar secciones
   - ✅ Solo puedes ver el contenido

#### **Test como Operario**
1. Logout
2. Login:
   - **Rol: "Operario"**
3. Observa:
   - ❌ No ves "Actualizaciones"
   - ❌ No ves opciones de edición
   - ✅ Solo acceso básico a proyectos

#### **Test como Especialista**
1. Logout
2. Login:
   - **Rol: "Especialista"**
3. Observa:
   - ✅ Puedes agregar secciones ➕
   - ✅ Puedes editar secciones ✏️
   - ❌ NO puedes eliminar secciones
   - ✅ Ves actualizaciones

## 📊 Matriz de Pruebas

| Función | Admin | Supervisor | Operario | Especialista |
|---------|-------|-----------|----------|-------------|
| Ver Panel Admin | ✅ | ❌ | ❌ | ❌ |
| Agregar Secciones | ✅ | ❌ | ❌ | ✅ |
| Editar Secciones | ✅ | ❌ | ❌ | ✅ |
| Eliminar Secciones | ✅ | ❌ | ❌ | ❌ |
| Ver Proyectos | ✅ | ✅ | ✅ | ✅ |
| Ver Actualizaciones | ✅ | ✅ | ❌ | ✅ |

## 🔍 Qué Verificar

### En el Código (Opcional)
1. Abre DevTools (F12) → Console
2. No debe haber errores (excepto warnings normales de Next.js)
3. Los permisos se aplican correctamente

### Funcionalidad
- ✅ El selector de rol aparece en el login
- ✅ El menú "Administración" solo aparece para admin
- ✅ Los botones de edición/eliminación se muestran según permisos
- ✅ El modal se abre correctamente
- ✅ Las secciones se crean/editan/eliminan
- ✅ Los permisos se filtran correctamente

### Experiencia de Usuario
- ✅ Interfaz es intuitiva
- ✅ No hay botones confusos
- ✅ Los mensajes de confirmación funcionan
- ✅ Las transiciones son suaves

## 🐛 Solución de Problemas

### "No veo el botón de nueva sección"
- Verifica que estés logeado como **Administrador** o **Especialista**
- El botón solo aparece si tienes permisos

### "No aparece el menú de Administración"
- Solo aparece si tu rol es **"Administrador"**
- Logout y login con el rol correcto

### "No puedo crear una nueva sección"
- Completa TODOS los campos del formulario
- Haz clic en el botón "Crear" o "Guardar"

### "Los cambios no se guardan"
- Los datos se guardan en memoria
- Si recargas la página, se pierden (esto es normal sin base de datos)
- En producción, se guardarán en base de datos

## 💡 Casos de Uso Reales

### Caso 1: Administrador crea contenido
```
1. Administrador inicia sesión
2. Va a un proyecto
3. Hace clic en "Nueva"
4. Crea: "Procedimiento de Seguridad"
5. Todos pueden verlo
6. Solo el admin puede editarlo/eliminarlo
```

### Caso 2: Especialista mejora contenido
```
1. Especialista inicia sesión
2. Ve una sección existente
3. La edita para mejorar la información
4. El cambio se guarda
5. No puede eliminarla (solo admin puede)
```

### Caso 3: Supervisor revisa capacitación
```
1. Supervisor inicia sesión
2. Entra a un proyecto
3. Solo puede leer el contenido
4. No ve opciones de edición
5. Rol restrictivo para garantizar calidad
```

## ✨ Características Agregadas

### Panel de Administración
```
┌─────────────────────────┐
│  Panel de Administración │
├─────────────────────────┤
│ 👥 Usuarios             │  Ver/editar/eliminar usuarios
│ 🔒 Roles y Permisos     │  Matriz de permisos por rol
└─────────────────────────┘
```

### Gestión de Secciones
```
Proyecto
├─ Botón "Nueva" (solo con permiso)
├─ Tarjeta de Sección
│  ├─ Botón "Editar" (sobre pasar mouse)
│  └─ Botón "Eliminar" (sobre pasar mouse)
└─ Modal de Edición
   ├─ Título
   ├─ Tipo de Sección
   ├─ Descripción
   └─ Contenido
```

## 🎉 ¡Listo para Usar!

El sistema está completamente funcional. Ahora puedes:
- ✅ Probar con diferentes roles
- ✅ Crear y editar secciones
- ✅ Gestionar permisos de usuarios
- ✅ Ver la matriz de permisos

¿Preguntas? Revisa los archivos:
- `GUIA_ROLES_PERMISOS.md` - Guía completa de funciones
- `RESUMEN_TECNICO.md` - Detalles técnicos de la implementación
- `lib/roles-permissions.ts` - Configuración de roles y permisos

¡Disfruta del nuevo sistema! 🚀
