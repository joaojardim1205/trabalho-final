/* =======================================================================
   NOVACELL — script.js
   Funcionalidades: menu mobile, carrossel, FAQ (acordeão),
   validação do formulário de contato (e-mail e telefone).
   ======================================================================= */

document.addEventListener("DOMContentLoaded", function () {

  /* ---------------------------------------------------------------------
     1. MENU MOBILE
  --------------------------------------------------------------------- */
  var navToggle = document.getElementById("navToggle");
  var navbar = document.getElementById("navbar");

  if (navToggle && navbar) {
    navToggle.addEventListener("click", function () {
      var isOpen = navbar.classList.toggle("is-open");
      navToggle.classList.toggle("is-open", isOpen);
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    // Fecha o menu ao clicar em um link (melhora a navegação no celular)
    navbar.querySelectorAll(".nav-link").forEach(function (link) {
      link.addEventListener("click", function () {
        navbar.classList.remove("is-open");
        navToggle.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------------------------------------------------------------------
     2. CARROSSEL DE SLIDES (4 slides, com autoplay e navegação)
  --------------------------------------------------------------------- */
  var slides = document.querySelectorAll(".slide");
  var dots = document.querySelectorAll(".dot");

  var current = 0;
  var autoPlayTimer = null;

  function showSlide(index) {
    slides.forEach(function (slide) { slide.classList.remove("active"); });
    dots.forEach(function (dot) { dot.classList.remove("active"); });

    slides[index].classList.add("active");
    if (dots[index]) dots[index].classList.add("active");
  }

  function nextSlide() {
    current++;
    if (current >= slides.length) current = 0;
    showSlide(current);
  }

  function prevSlide() {
    current--;
    if (current < 0) current = slides.length - 1;
    showSlide(current);
  }

  function startAutoPlay() {
    autoPlayTimer = setInterval(nextSlide, 5000);
  }

  function stopAutoPlay() {
    clearInterval(autoPlayTimer);
  }

  if (slides.length > 0) {
    var nextBtn = document.querySelector(".carousel-btn--next");
    var prevBtn = document.querySelector(".carousel-btn--prev");

    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        nextSlide();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        prevSlide();
      });
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener("click", function () {
        current = index;
        showSlide(current);
      });
    });

    startAutoPlay();

    var carouselWrapper = document.getElementById("carousel");
    if (carouselWrapper) {
      carouselWrapper.addEventListener("mouseenter", stopAutoPlay);
      carouselWrapper.addEventListener("mouseleave", startAutoPlay);
    }

    showSlide(current);
  }

  /* ---------------------------------------------------------------------
     3. FAQ — ACORDEÃO (página SAC)
  --------------------------------------------------------------------- */
  var faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach(function (item) {
    var question = item.querySelector(".faq-question");
    if (!question) return;

    question.addEventListener("click", function () {
      var wasOpen = item.classList.contains("is-open");

      // Fecha todos os outros itens (comportamento de acordeão)
      faqItems.forEach(function (other) {
        other.classList.remove("is-open");
      });

      if (!wasOpen) {
        item.classList.add("is-open");
      }
    });
  });

  /* ---------------------------------------------------------------------
     4. VALIDAÇÃO DO FORMULÁRIO — Fale Conosco
     Valida e-mail e telefone, impedindo o envio quando inválidos.
  --------------------------------------------------------------------- */
  var contactForm = document.getElementById("contactForm");

  if (contactForm) {
    var nameInput = document.getElementById("inputNome");
    var addressInput = document.getElementById("inputEndereco");
    var emailInput = document.getElementById("inputEmail");
    var phoneInput = document.getElementById("inputTelefone");
    var messageInput = document.getElementById("inputMensagem");
    var formStatus = document.getElementById("formStatus");

    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Aceita formatos como (51) 99876-5432, 51999998888, 51 3222-1122
    var phoneRegex = /^\(?\d{2}\)?[\s-]?\d{4,5}-?\d{4}$/;

    function setFieldError(input, message) {
      var group = input.closest(".form-group");
      var errorEl = group.querySelector(".error-msg");
      group.classList.add("field-invalid");
      group.classList.remove("field-valid");
      if (errorEl) errorEl.textContent = message;
    }

    function setFieldValid(input) {
      var group = input.closest(".form-group");
      var errorEl = group.querySelector(".error-msg");
      group.classList.remove("field-invalid");
      group.classList.add("field-valid");
      if (errorEl) errorEl.textContent = "";
    }

    function validateRequired(input, label) {
      if (input.value.trim() === "") {
        setFieldError(input, label + " é obrigatório.");
        return false;
      }
      setFieldValid(input);
      return true;
    }

    function validateEmail() {
      var value = emailInput.value.trim();
      if (value === "") {
        setFieldError(emailInput, "O e-mail é obrigatório.");
        return false;
      }
      if (!emailRegex.test(value)) {
        setFieldError(emailInput, "Digite um e-mail válido. Ex: nome@email.com");
        return false;
      }
      setFieldValid(emailInput);
      return true;
    }

    function validatePhone() {
      var value = phoneInput.value.trim();
      if (value === "") {
        setFieldError(phoneInput, "O telefone é obrigatório.");
        return false;
      }
      if (!phoneRegex.test(value)) {
        setFieldError(phoneInput, "Digite um telefone válido. Ex: (51) 99876-5432");
        return false;
      }
      setFieldValid(phoneInput);
      return true;
    }

    // Validação em tempo real
    emailInput.addEventListener("input", validateEmail);
    phoneInput.addEventListener("input", validatePhone);
    nameInput.addEventListener("input", function () { validateRequired(nameInput, "O nome"); });
    addressInput.addEventListener("input", function () { validateRequired(addressInput, "O endereço"); });
    messageInput.addEventListener("input", function () { validateRequired(messageInput, "A mensagem"); });

    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();

      var isNameValid = validateRequired(nameInput, "O nome");
      var isAddressValid = validateRequired(addressInput, "O endereço");
      var isEmailValid = validateEmail();
      var isPhoneValid = validatePhone();
      var isMessageValid = validateRequired(messageInput, "A mensagem");

      var allValid = isNameValid && isAddressValid && isEmailValid && isPhoneValid && isMessageValid;

      formStatus.classList.remove("show", "success", "error");

      if (!allValid) {
        formStatus.textContent = "Por favor, corrija os campos destacados antes de enviar.";
        formStatus.classList.add("show", "error");
        return;
      }

      // Formulário válido: simula envio (não há backend neste projeto acadêmico)
      formStatus.textContent = "Mensagem enviada com sucesso! Em breve entraremos em contato.";
      formStatus.classList.add("show", "success");
      contactForm.reset();

      document.querySelectorAll(".form-group").forEach(function (group) {
        group.classList.remove("field-valid", "field-invalid");
      });
    });
  }

  /* ---------------------------------------------------------------------
     5. REVELAÇÃO SUAVE DOS CARDS AO ROLAR A PÁGINA
  --------------------------------------------------------------------- */
  var revealTargets = document.querySelectorAll(
    ".product-card, .highlight-card, .support-card, .stat-box, .faq-item"
  );

  if ("IntersectionObserver" in window && revealTargets.length > 0) {
    revealTargets.forEach(function (el) {
      el.style.opacity = "0";
      el.style.transform = "translateY(16px)";
      el.style.transition = "opacity .6s ease, transform .6s ease";
    });

    var observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    revealTargets.forEach(function (el) { observer.observe(el); });
  }

});
