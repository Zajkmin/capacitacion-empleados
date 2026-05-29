-- Demo content for Nexo.
-- Run this in Supabase SQL Editor after schema.sql.
-- It recreates only records marked with the "Demo -" prefix.

begin;

delete from public.project_groups
where name like 'Demo - %';

delete from public.training_topics
where category = 'admin'
  and (
    title like 'Admin Demo - %'
    or title in (
      '1. Orientacion inicial del administrador',
      '2. Configurar grupos y proyectos',
      '3. Cargar secciones operativas',
      '4. Mantener reglas y excepciones',
      '5. Usar aprendizaje visual',
      '6. Gestionar biblioteca y evidencias',
      '7. Administrar usuarios, roles y permisos',
      '8. Informar cambios y revisar notificaciones',
      '9. Rutina semanal de control'
    )
  );

do $$
declare
  group_id uuid;
  project_id uuid;
  section_id uuid;
  project_index integer := 0;
  group_name text;
  project_name text;
  project_names text[];
  group_names text[] := array[
    'Demo - Retail y Consumo Masivo',
    'Demo - Auditorias Comerciales',
    'Demo - Operaciones de Campo'
  ];
  section_definitions text[][] := array[
    array['Reglas del Proyecto', 'Normativas y procedimientos a seguir', 'rules', 'bg-primary'],
    array['Excepciones', 'Casos especiales y permisos', 'exceptions', 'bg-amber-500'],
    array['Aprendizaje Visual', 'Comparativas y ejemplos ilustrados', 'visual-learning', 'bg-violet-500'],
    array['Biblioteca', 'Recursos y documentos del proyecto', 'library', 'bg-slate-500'],
    array['Fotos Guia', 'Referencias visuales de ejecucion', 'photos', 'bg-emerald-500'],
    array['Errores Frecuentes', 'Que evitar en campo', 'errors', 'bg-rose-500'],
    array['Actualizaciones', 'Cambios y novedades recientes', 'updates', 'bg-cyan-500']
  ];
  section_def text[];
  section_order integer;
  item_count integer;
  i integer;
begin
  for g in 1..array_length(group_names, 1) loop
    group_name := group_names[g];

    insert into public.project_groups (name, type, sort_order)
    values (group_name, 'demo', g)
    returning id into group_id;

    project_names := case g
      when 1 then array['Gondolas Express', 'Precio Perfecto', 'Stock Radar']
      when 2 then array['Ruta Supermercados', 'Control PDV', 'Mystery Shopper PY', 'Promos 360']
      else array['Censo Barrial', 'Entrega Material POP', 'Checklist Sucursales', 'Mapa de Cobertura', 'Soporte Terreno']
    end;

    for p in 1..array_length(project_names, 1) loop
      project_index := project_index + 1;
      project_name := project_names[p];

      insert into public.projects (
        group_id,
        name,
        bg_color,
        text_color,
        cover_image,
        sort_order
      )
      values (
        group_id,
        project_name,
        (array[
          'bg-sky-600',
          'bg-emerald-600',
          'bg-rose-600',
          'bg-amber-600',
          'bg-indigo-600',
          'bg-teal-600',
          'bg-fuchsia-600'
        ])[1 + ((project_index - 1) % 7)],
        'text-white',
        case when project_index % 2 = 0 then '/placeholder.jpg' else null end,
        p
      )
      returning id into project_id;

      section_order := 0;
      foreach section_def slice 1 in array section_definitions loop
        section_order := section_order + 1;

        insert into public.project_sections (
          project_id,
          title,
          description,
          type,
          color,
          sort_order
        )
        values (
          project_id,
          section_def[1],
          section_def[2],
          section_def[3],
          section_def[4],
          section_order
        )
        returning id into section_id;

        item_count := 1 + ((project_index + char_length(section_def[3])) % 3);

        for i in 1..item_count loop
          if section_def[3] = 'rules' then
            insert into public.section_items (
              section_id,
              type,
              title,
              description,
              content,
              metadata,
              sort_order
            )
            values (
              section_id,
              'rule',
              format('Regla %s - %s', i, project_name),
              case i
                when 1 then 'Registrar la visita solo desde el punto de venta asignado.'
                when 2 then 'Completar todos los campos obligatorios antes de finalizar.'
                else 'Validar precios, stock y exhibicion con evidencia visible.'
              end,
              'Aplicar esta regla en cada visita y dejar observaciones claras si no se puede cumplir.',
              '{}'::jsonb,
              i
            );
          elsif section_def[3] = 'exceptions' then
            insert into public.section_items (
              section_id,
              type,
              title,
              description,
              content,
              metadata,
              sort_order
            )
            values (
              section_id,
              'exception',
              format('Excepcion %s - %s', i, project_name),
              case i
                when 1 then 'Local cerrado o sin responsable disponible.'
                when 2 then 'Producto temporalmente fuera de surtido.'
                else 'Zona sin conectividad para sincronizacion inmediata.'
              end,
              'Documentar la excepcion con comentario, hora y evidencia cuando corresponda.',
              jsonb_build_object('validUntil', 'Durante la prueba piloto'),
              i
            );
          elsif section_def[3] = 'visual-learning' then
            insert into public.section_items (
              section_id,
              type,
              title,
              description,
              content,
              image_url,
              metadata,
              sort_order
            )
            values (
              section_id,
              'visual-learning',
              format('Comparativa %s - Evidencia en %s', i, project_name),
              'Ejemplo visual para distinguir una ejecucion correcta de una observacion incompleta.',
              'Prioriza fotos limpias, encuadradas y con el elemento auditado claramente visible.',
              '/placeholder.jpg',
              jsonb_build_object(
                'correctLabel', 'Correcto',
                'correctPoints', jsonb_build_array(
                  'Foto enfocada y completa',
                  'Producto o material identificable',
                  'Comentario coherente con la evidencia'
                ),
                'correctImageUrl', '/placeholder.jpg',
                'incorrectLabel', 'Incorrecto',
                'incorrectPoints', jsonb_build_array(
                  'Imagen cortada o borrosa',
                  'No se ve el precio o material requerido',
                  'La observacion no explica el desvio'
                ),
                'incorrectImageUrl', '/placeholder.svg',
                'tip', 'Toma la foto despues de revisar que el dato principal se lea sin hacer zoom.'
              ),
              i
            );
          elsif section_def[3] = 'library' then
            insert into public.section_items (
              section_id,
              type,
              title,
              description,
              source_url,
              image_url,
              metadata,
              sort_order
            )
            values (
              section_id,
              'library',
              format('Recurso %s - %s', i, project_name),
              'guides',
              '/placeholder.svg',
              '/placeholder.jpg',
              jsonb_build_object(
                'resourceType', case when i = 3 then 'image' else 'document' end,
                'category', case when i = 1 then 'guides' when i = 2 then 'documents' else 'images' end,
                'size', case when i = 1 then '1.8 MB' when i = 2 then '620 KB' else '12 archivos' end,
                'date', '29 May 2026',
                'starred', i = 1
              ),
              i
            );
          elsif section_def[3] = 'photos' then
            insert into public.section_items (
              section_id,
              type,
              title,
              description,
              image_url,
              metadata,
              sort_order
            )
            values (
              section_id,
              'photo',
              format('Foto guia %s - %s', i, project_name),
              case i
                when 1 then 'Referencia de encuadre para foto general.'
                when 2 then 'Referencia de evidencia de precio o etiqueta.'
                else 'Referencia de material promocional visible.'
              end,
              '/placeholder.jpg',
              '{}'::jsonb,
              i
            );
          elsif section_def[3] = 'errors' then
            insert into public.section_items (
              section_id,
              type,
              title,
              description,
              content,
              metadata,
              sort_order
            )
            values (
              section_id,
              'error',
              format('Error frecuente %s - %s', i, project_name),
              case i
                when 1 then 'Cerrar la visita sin revisar campos pendientes.'
                when 2 then 'Usar fotos antiguas o de otro local.'
                else 'Reportar un faltante sin validar con el responsable.'
              end,
              'Antes de enviar, revisar evidencia, comentarios y datos numericos.',
              '{}'::jsonb,
              i
            );
          elsif section_def[3] = 'updates' then
            insert into public.activity_events (
              project_id,
              section_id,
              action,
              item_type,
              title,
              description,
              metadata,
              created_at
            )
            values (
              project_id,
              section_id,
              'created',
              'update',
              format('Actualizacion demo %s - %s', i, project_name),
              case i
                when 1 then 'Se cargo el paquete inicial de reglas y recursos.'
                when 2 then 'Se agregaron ejemplos visuales para reforzar calidad.'
                else 'Se actualizaron excepciones operativas del piloto.'
              end,
              jsonb_build_object('source', 'seed_demo_content.sql'),
              now() - (i || ' days')::interval
            );
          end if;
        end loop;
      end loop;
    end loop;
  end loop;
end;
$$;

insert into public.training_topics (
  title,
  category,
  summary,
  body,
  content_type,
  media_url,
  visible_to,
  sort_order
)
values
  (
    '1. Orientacion inicial del administrador',
    'admin',
    'Entiende el objetivo de Nexo, las areas principales y que revisar antes de operar.',
    'Objetivo: administrar el contenido operativo que usan los equipos de campo.

Pasos:
1. Ingresa con una cuenta administradora.
2. Revisa que el panel principal cargue los grupos y proyectos esperados.
3. Entra a Capacitacion para validar las rutas por rol.
4. Entra a Administracion para confirmar usuarios, roles y permisos.
5. Revisa Notificaciones para detectar cambios recientes.

Criterio de cierre: puedes explicar que informacion vive en proyectos, que informacion vive en capacitacion y que acciones solo puede hacer un administrador.',
    'text',
    null,
    array['admin'],
    1
  ),
  (
    '2. Configurar grupos y proyectos',
    'admin',
    'Aprende a crear la estructura base: grupos, proyectos y portadas.',
    'Los grupos ordenan proyectos por cliente, pais, equipo o unidad operativa.

Pasos:
1. Desde Inicio, usa Agregar grupo para crear un contenedor.
2. Dentro del grupo, crea un proyecto con nombre claro.
3. Sube una portada si ayuda a identificarlo visualmente.
4. Mantiene nombres cortos y consistentes.
5. Elimina grupos de prueba solo cuando confirmes que no contienen informacion util.

Buenas practicas:
- Usa prefijos descriptivos si varios equipos trabajan en paralelo.
- Evita duplicar proyectos con el mismo alcance.
- Revisa asignaciones antes de publicar contenido sensible.',
    'text',
    null,
    array['admin'],
    2
  ),
  (
    '3. Cargar secciones operativas',
    'admin',
    'Organiza cada proyecto en reglas, excepciones, aprendizaje visual, biblioteca, fotos, errores y actualizaciones.',
    'Cada proyecto debe tener secciones que respondan a una necesidad operativa.

Pasos:
1. Entra al proyecto.
2. Revisa las secciones existentes.
3. Usa Nueva para agregar una seccion si el proyecto necesita otra categoria.
4. Completa titulo, descripcion y tipo.
5. Guarda y valida que la tarjeta aparezca en el orden esperado.

Recomendacion: mantene una seccion por tema. Si una regla necesita muchas aclaraciones, conviertela en varios contenidos cortos.',
    'text',
    null,
    array['admin'],
    3
  ),
  (
    '4. Mantener reglas y excepciones',
    'admin',
    'Define instrucciones precisas para campo y documenta casos permitidos.',
    'Reglas:
1. Escribe una regla por accion.
2. Usa titulos concretos.
3. Agrega descripcion accionable.
4. Evita textos largos que mezclen varios criterios.

Excepciones:
1. Describe cuando se permite apartarse de la regla.
2. Indica que evidencia debe adjuntarse.
3. Define vigencia si aplica.
4. Revisa periodicamente las excepciones vencidas.

Criterio de calidad: una persona nueva debe poder leer la regla y saber que hacer sin preguntar por chat.',
    'text',
    null,
    array['admin'],
    4
  ),
  (
    '5. Usar aprendizaje visual',
    'admin',
    'Crea comparativas correcto/incorrecto para entrenar criterio visual.',
    'El aprendizaje visual reduce dudas cuando hay fotos, exhibiciones o evidencias.

Pasos:
1. Entra a Aprendizaje Visual.
2. Crea una comparativa con titulo y descripcion.
3. Agrega puntos correctos e incorrectos.
4. Adjunta imagen correcta e incorrecta cuando sea posible.
5. Escribe un tip profesional corto.

Buenas practicas:
- Muestra el mismo caso desde dos calidades distintas.
- No uses fotos ambiguas.
- El tip debe decir que mirar primero.',
    'text',
    null,
    array['admin'],
    5
  ),
  (
    '6. Gestionar biblioteca y evidencias',
    'admin',
    'Carga recursos, documentos y referencias para que el equipo encuentre soporte rapidamente.',
    'La biblioteca sirve para manuales, plantillas, videos, imagenes y guias.

Pasos:
1. Entra a Biblioteca.
2. Agrega un recurso con titulo claro.
3. Define tipo y categoria.
4. Adjunta archivo o enlace.
5. Marca como destacado lo que debe verse primero.

Control recomendado: revisa mensualmente que enlaces y archivos sigan vigentes.',
    'text',
    null,
    array['admin'],
    6
  ),
  (
    '7. Administrar usuarios, roles y permisos',
    'admin',
    'Aprende a asignar roles, proyectos y permisos sin abrir accesos innecesarios.',
    'Desde Administracion puedes gestionar usuarios y roles.

Pasos:
1. Abre Administracion.
2. Revisa el rol actual de cada usuario.
3. Asigna proyectos segun su operacion real.
4. Usa roles base antes de crear permisos especiales.
5. Guarda y solicita al usuario que cierre y vuelva a iniciar sesion si no ve cambios.

Regla de seguridad: entrega el minimo acceso necesario. Los permisos de edicion deben reservarse para personas responsables de mantener contenido.',
    'text',
    null,
    array['admin'],
    7
  ),
  (
    '8. Informar cambios y revisar notificaciones',
    'admin',
    'Usa actualizaciones y actividad reciente para comunicar cambios al equipo.',
    'Cada cambio de contenido puede generar actividad visible en notificaciones.

Pasos:
1. Despues de editar una regla o recurso, revisa Notificaciones.
2. Confirma que el titulo del cambio sea entendible.
3. Si el cambio es critico, agrega una capacitacion o actualizacion complementaria.
4. Comunica a supervisores que revisen la novedad antes de operar.

Buenas practicas:
- Evita cambios grandes sin resumen.
- Agrupa cambios relacionados en una misma ventana de mantenimiento.
- Revisa que no queden instrucciones contradictorias entre reglas y excepciones.',
    'text',
    null,
    array['admin'],
    8
  ),
  (
    '9. Rutina semanal de control',
    'admin',
    'Checklist para mantener la app ordenada, vigente y facil de usar.',
    'Rutina sugerida:
1. Revisar proyectos activos y archivar/eliminar demos innecesarios.
2. Leer las notificaciones de los ultimos cambios.
3. Validar reglas principales de cada proyecto activo.
4. Revisar excepciones y fechas de vigencia.
5. Abrir aprendizaje visual y comprobar imagenes.
6. Verificar enlaces de biblioteca.
7. Confirmar usuarios, roles y asignaciones.
8. Actualizar capacitaciones cuando cambie el proceso.

Resultado esperado: al final de la semana la informacion debe estar vigente, sin duplicados y con responsables claros.',
    'text',
    null,
    array['admin'],
    9
  );

-- Make demo projects visible to every non-admin user currently registered.
-- Admins can already see all projects through RLS.
insert into public.project_assignments (user_id, project_id)
select profiles.id, projects.id
from public.profiles
cross join public.projects
join public.project_groups on project_groups.id = projects.group_id
where project_groups.name like 'Demo - %'
  and profiles.role <> 'admin'
on conflict (user_id, project_id) do nothing;

commit;
