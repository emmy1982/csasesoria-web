/* =========================================================
   CS Asesoría — JavaScript principal
   Funciones:
   1. Menú móvil
   2. Cabecera con sombra al hacer scroll
   3. Animaciones de entrada (reveal)
   4. Acordeón de preguntas frecuentes
   5. Formulario de contacto (validación + aviso)
   6. Newsletter del pie
   7. Botón "volver arriba" y año del copyright
   ========================================================= */
(function () {
  "use strict";

  /* ---------- 1. Menú móvil ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("main-nav");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    // Cerrar el menú al pulsar un enlace o al agrandar la ventana
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        nav.classList.remove("is-open");
        toggle.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 940) {
        nav.classList.remove("is-open");
        toggle.classList.remove("is-open");
      }
    });
  }

  /* ---------- 2. Sombra de cabecera ---------- */
  var header = document.querySelector(".site-header");

  function onScrollHeader() {
    if (header) header.classList.toggle("is-stuck", window.scrollY > 8);
  }

  /* ---------- 3. Animaciones de entrada ---------- */
  var revealEls = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in-view"); });
  }

  /* ---------- 4. Acordeón FAQ ---------- */
  document.querySelectorAll(".faq-question").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var item = btn.closest(".faq-item");
      var answer = item.querySelector(".faq-answer");
      var isOpen = item.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
      answer.style.maxHeight = isOpen ? answer.scrollHeight + "px" : "0px";
    });
  });

  // Altura correcta del ítem abierto al cargar y al redimensionar
  function syncOpenAnswers() {
    document.querySelectorAll(".faq-item.is-open .faq-answer").forEach(function (answer) {
      answer.style.maxHeight = answer.scrollHeight + "px";
    });
  }
  syncOpenAnswers();
  window.addEventListener("resize", syncOpenAnswers);

  /* ---------- 5. Formulario de contacto ---------- */
  var form = document.getElementById("contact-form");

  function setError(field, message) {
    field.classList.toggle("is-invalid", Boolean(message));
    var box = field.closest(".field") || field.closest(".checkbox-field");
    var error = box ? box.querySelector(".field-error") : null;
    if (error) error.textContent = message || "";
  }

  function validateField(field) {
    var value = (field.value || "").trim();

    if (field.hasAttribute("required") && !value) {
      setError(field, "Este campo es obligatorio.");
      return false;
    }

    if (field.type === "email" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
      setError(field, "Introduce un email válido.");
      return false;
    }

    if (field.type === "tel" && value && !/^[+\d][\d\s().-]{6,}$/.test(value)) {
      setError(field, "Introduce un teléfono válido.");
      return false;
    }

    setError(field, "");
    return true;
  }

  if (form) {
    var fields = form.querySelectorAll("input, select, textarea");

    fields.forEach(function (field) {
      field.addEventListener("blur", function () { validateField(field); });
      field.addEventListener("input", function () {
        if (field.classList.contains("is-invalid")) validateField(field);
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var valid = true;
      fields.forEach(function (field) {
        if (!validateField(field)) valid = false;
      });

      var consent = form.querySelector('input[name="consent"]');
      if (consent && !consent.checked) {
        valid = false;
        var consentError = consent.closest(".checkbox-field").querySelector(".field-error");
        if (consentError) consentError.textContent = "Debes aceptar la política de privacidad.";
      }

      if (!valid) {
        var firstInvalid = form.querySelector(".is-invalid");
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      /*
        NOTA PARA EL CLIENTE / DESARROLLADOR:
        El formulario es estático. Para enviar mensajes reales basta con
        registrar la acción en un servicio sin servidor, por ejemplo:
          1. Crear cuenta en https://formspree.io (gratis hasta 50 emails/mes)
          2. Sustituir el atributo action del <form> por la URL que faciliten
             (action="https://formspree.io/f/TU_ID" method="POST")
          3. Quitar este bloque e.preventDefault() y dejar que el navegador envíe.
        Alternativas: Netlify Forms, Basin, Getform o un script propio.
      */
      var status = document.getElementById("form-status");
      if (status) {
        status.classList.add("is-visible");
        status.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      form.reset();
      fields.forEach(function (field) { setError(field, ""); });
    });
  }

  /* ---------- 6. Newsletter ---------- */
  var newsletter = document.getElementById("newsletter-form");

  if (newsletter) {
    newsletter.addEventListener("submit", function (e) {
      e.preventDefault();
      var input = newsletter.querySelector("input[type='email']");
      var status = document.getElementById("newsletter-status");
      var value = (input.value || "").trim();

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
        if (status) {
          status.style.color = "#fb923c";
          status.textContent = "Introduce un email válido.";
        }
        input.focus();
        return;
      }

      if (status) {
        status.style.color = "#0fa47f";
        status.textContent = "¡Gracias! Te has suscrito correctamente.";
      }
      newsletter.reset();
      // Mismo caso que el formulario de contacto: conectar con la plataforma
      // de email marketing (Mailchimp, Brevo, MailerLite...) en el action.
    });
  }

  /* ---------- 7. Volver arriba y año ---------- */
  var backBtn = document.querySelector(".back-to-top");

  function onScrollTop() {
    if (backBtn) backBtn.classList.toggle("is-visible", window.scrollY > 600);
  }

  if (backBtn) {
    backBtn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  window.addEventListener("scroll", function () {
    onScrollHeader();
    onScrollTop();
  }, { passive: true });

  onScrollHeader();
  onScrollTop();
})();
