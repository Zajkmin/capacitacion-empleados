# Nexo

Nexo es una plataforma de documentación viva, capacitación organizacional y gestión del conocimiento operativo diseñada para empresas que trabajan mediante proyectos, clientes o unidades operativas.

Su objetivo es centralizar información crítica, reducir la dependencia del conocimiento informal y facilitar el acceso a procedimientos, reglas, excepciones, material visual y actualizaciones desde una única fuente de verdad.

## Características principales

* Gestión de proyectos agrupados por categorías.
* Capacitación estructurada por roles.
* Gestión de usuarios, roles y permisos.
* Asignación de proyectos por usuario.
* Documentación viva con actualización continua.
* Biblioteca documental centralizada.
* Gestión de reglas y excepciones operativas.
* Fotos guía y aprendizaje visual.
* Registro de errores frecuentes.
* Sistema de notificaciones y actualizaciones.

## Casos de uso

Nexo puede ser utilizado por organizaciones que necesiten administrar conocimiento operativo distribuido, tales como:

* Empresas de investigación de mercado.
* Consultoras.
* Empresas de logística.
* Franquicias.
* Organizaciones con múltiples clientes o proyectos.
* Equipos de campo y supervisión.
* Empresas con procesos operativos documentados.

## Arquitectura funcional

```text
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

Los usuarios acceden únicamente a los proyectos y funcionalidades permitidos según su rol y permisos asignados.

## Tecnologías

* Next.js
* React
* TypeScript
* Tailwind CSS
* Supabase (en integración)

## Estado del proyecto

Actualmente Nexo se encuentra en fase MVP (Minimum Viable Product), con funcionalidades de gestión documental, capacitación, control de acceso y administración completamente operativas.

## Documentación

La documentación completa del proyecto se encuentra en la carpeta `/docs`.

* PRODUCTO.md
* ARQUITECTURA.md
* IMPLEMENTACION.md

---

Desarrollado por Jazmín Irazusta.
