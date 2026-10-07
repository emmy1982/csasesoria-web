# CS Asesoría — Rediseño de la web

Rediseño completo y reorganización de **csasesoria.es**: web multipágina estática, moderna y limpia, construida con HTML + CSS + JavaScript puro (sin dependencias ni build).

---

## Estructura del proyecto

```
csasesoria-web/
├── index.html                  → Inicio
├── servicios.html              → Servicios (autónomos, empresas/pymes, particulares, expats + mención administrativa)
├── administrativa.html         → Administrativa freelance (facturación, conciliación, documentación, programas, apoyo)
├── sobre-mi.html               → Sobre mí (Carmen, economista colegiada)
├── blog.html                   → Listado del blog
├── contacto.html               → Formulario + email, teléfono y WhatsApp
├── aviso-legal.html            → Aviso legal (revisar con asesoría jurídica)
├── politica-privacidad.html    → Política de privacidad (revisar con asesoría jurídica)
├── politica-cookies.html       → Política de cookies (revisar con asesoría jurídica)
├── blog/
│   ├── iva-irpf-trimestral-autonomos.html
│   ├── declaracion-renta-guia-basica.html
│   └── alta-autonomo-extranjero-espana.html
└── assets/
    ├── css/styles.css          → Todos los estilos (variables de diseño arriba del todo)
    └── js/main.js              → Menú móvil, animaciones, FAQ, formularios
```

## Cómo verla en local

Doble clic en `index.html`, o con un servidor local (recomendado):

```bash
# Si tienes Python instalado
cd csasesoria-web
python -m http.server 8000
# Abre http://localhost:8000
```

## Sistema de diseño (landing moderna)

Misma paleta que siempre (azul marino + naranja cálido + verde agua) y estética limpia,
con el lenguaje visual de la referencia: títulos con **palabras en cursiva serif naranja**,
mucho espacio en blanco y tarjetas con sombra suave.

**Tipografías** (cargadas desde Google Fonts):

| Uso | Fuente |
|---|---|
| Títulos y botones | Plus Jakarta Sans (700/800) |
| Texto | Inter |
| Palabras de acento en cursiva | Playfair Display italic → clase `em.accent` |

**Componentes principales** (todos en `assets/css/styles.css`, bloque "11. COMPONENTES DEL REDISEÑO"):

- `.hero-collage` + `.tile` / `.ph` → collage visual del hero con tarjetas de dato flotantes (`.float-stat`).
- `.ticker` → banda de servicios en marquesina (se detiene al pasar el ratón).
- `.section-head-row` → cabecera de sección con botón a la derecha.
- `.services-acc` → acordeón de servicios (reutiliza el JS del FAQ).
- `.dark-band` → bloque oscuro (cómo trabajamos).
- `.why-card` → tarjeta naranja con los 4 valores, en dos columnas.
- `.plans` → tres tarjetas de fórmulas de contratación.
- `.testimonial` + `.testimonial-row` → cita destacada con etiqueta vertical.
- `.blog-feature` / `.post-card.post-featured` / `.post-card.post-row` → blog 1 destacado + 2 secundarios.
- `.cta-big` + `.circle-arrow` → CTA final con botón circular naranja.
- `.dot-list` → listas con viñeta redonda naranja.

**Marcadores de foto**: los bloques `<div class="tile ph ph-warm|ph-navy|ph-teal">` son
sustitutos visuales de fotografías (llevan un comentario HTML indicándolo). Cuando el cliente
envíe imágenes, basta con cambiarlos por `<img class="tile" src="assets/img/foto.jpg" alt="...">`.

> Nota: no se han inventado testimonios de clientes ni precios; el bloque de testimonios muestra
> la cita de compromiso de Carmen y las tarifas se presentan como "propuesta a medida".


## Cómo publicarla

1. Subir **todo** el contenido de la carpeta `csasesoria-web/` al servidor por FTP/SFTP o el gestor de archivos del hosting.
2. Si se sustituye la web actual de WordPress, hay que eliminar o renombrar la carpeta `wp-content` y los archivos PHP para que no haya conflictos (o publicar en un dominio/entorno aparte primero).
3. Comprobar que `index.html` queda en la raíz del dominio.

---

## Gestión de contenido (para el cliente)

### Publicar un artículo en el blog

1. Copiar la plantilla existente: duplicar `blog/declaracion-renta-guia-basica.html` con el nuevo nombre en minúsculas y sin acentos, por ejemplo `blog/nuevos-modelos-2027.html`.
2. Cambiar dentro del archivo:
   - El `<title>` y la `meta description`.
   - El `<h1>` del artículo.
   - Los datos de categoría, fecha y minutos de lectura (`.article-meta`).
   - El contenido del `<article class="article">`.
3. Añadir la tarjeta nueva en `blog.html` (copiar cualquiera de los bloques `<article class="post-card">` y ajustar enlace, título, excerpt, categoría y color de la miniatura: `post-thumb`, `post-thumb warm` o `post-thumb teal`).
4. Opcional: añadir el enlace también en `index.html`, dentro de la sección del blog.

> Consejo: mantener el mismo formato (intro, `h2`, listas, un `blockquote` y un `.callout` con CTA) mantiene el aspecto visual del blog.

### Cambiar textos

Todo el texto está en los propios `.html`. Buscando una frase concreta se localiza en segundos. La tipografía, colores y tamaños se controlan desde `assets/css/styles.css` en el bloque `:root`:

```css
--navy-800: #0f2745;   /* azul marino corporativo */
--orange-500: #f97316; /* naranja de acento */
--teal-500: #0fa47f;   /* verde agua de apoyo */
--font-accent: "Playfair Display", serif; /* cursiva de los títulos */
```

### Cambiar colores

Editar solo esas variables en `:root` actualiza toda la web (botones, iconos, cabecera, footer, etc.).

---

## Pendiente antes de publicar

1. **Formulario de contacto**: es estático y ahora mismo muestra un mensaje de confirmación sin enviar. Para recibir emails reales:
   - Crear cuenta gratuita en [Formspree](https://formspree.io), [Basin](https://usebasin.com) o [Getform](https://getform.io).
   - En `contacto.html`, poner en el `<form id="contact-form">`: `action="https://formspree.io/f/TU_ID" method="POST"`.
   - Quitar el `e.preventDefault()` de `assets/js/main.js` (bloque comentado con instrucciones) para que el navegador envíe el formulario.
   - Alternativa sin servicios externos: Netlify Forms (añadiendo `netlify` al `<form>`).
2. **Newsletter**: mismo proceso; el formulario del footer necesita la URL de la plataforma de email marketing (Mailchimp, Brevo, MailerLite...).
3. **Aviso legal**: rellenar los campos marcados como `[PENDIENTE]` (CIF, domicilio social, datos registrales) y revisar los tres textos legales con asesoramiento jurídico.
4. **Fotografías**: hay marcadores de posición en `sobre-mi.html` (`.about-photo` con las iniciales `CS`), en el hero y en las secciones de la portada (bloques `.ph` con comentarios HTML). Sustituirlos por las fotos reales del cliente cuando estén disponibles.
5. **Enlaces legales**: los enlaces del footer ya apuntan a las páginas legales creadas.

## Navegadores y accesibilidad

- Diseño responsive (escritorio, tablet y móvil) con menú hamburguesa.
- Formularios con validación en cliente y mensajes de error junto a cada campo.
- Animaciones de entrada con `IntersectionObserver`, desactivadas si el sistema indica `prefers-reduced-motion`.
- Etiquetas `aria-*` en el menú, el acordeón de FAQ y los estados de los formularios.
