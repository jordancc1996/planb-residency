(function () {
  "use strict";

  /* Mobile navigation */
  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".nav-toggle");
  if (header && toggle) {
    toggle.addEventListener("click", function () {
      var open = header.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    header.querySelectorAll(".nav-primary a").forEach(function (link) {
      link.addEventListener("click", function () {
        header.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* Testimonials carousel */
  var track = document.querySelector(".testimonials__track");
  var slides = document.querySelectorAll(".testimonial-slide");
  var prevBtn = document.querySelector(".carousel-btn--prev");
  var nextBtn = document.querySelector(".carousel-btn--next");
  var dotsWrap = document.querySelector(".carousel-dots");

  if (track && slides.length) {
    var index = 0;
    var wrap = track.parentElement;
    var n = slides.length;
    track.style.width = n * 100 + "%";
    slides.forEach(function (slide) {
      slide.style.flexBasis = 100 / n + "%";
      slide.style.maxWidth = 100 / n + "%";
    });

    function goTo(i) {
      index = (i + slides.length) % slides.length;
      track.style.transform = "translateX(-" + (index * (100 / n)) + "%)";
      document.querySelectorAll(".carousel-dot").forEach(function (dot, d) {
        dot.classList.toggle("is-active", d === index);
      });
    }

    if (dotsWrap && !dotsWrap.children.length) {
      slides.forEach(function (_, i) {
        var dot = document.createElement("button");
        dot.type = "button";
        dot.className = "carousel-dot" + (i === 0 ? " is-active" : "");
        dot.setAttribute("aria-label", "Slide " + (i + 1));
        dot.addEventListener("click", function () {
          goTo(i);
        });
        dotsWrap.appendChild(dot);
      });
    }

    if (prevBtn) prevBtn.addEventListener("click", function () { goTo(index - 1); });
    if (nextBtn) nextBtn.addEventListener("click", function () { goTo(index + 1); });

    goTo(0);
  }

  /* Advisor assessment multi-step */
  var assessment = document.querySelector(".assessment");
  if (assessment) {
    var steps = assessment.querySelectorAll(".assessment-step");
    var bar = assessment.querySelector(".assessment__progress-bar");
    var btnPrev = assessment.querySelector(".assessment-prev");
    var btnNext = assessment.querySelector(".assessment-next");
    var stepIndex = 0;

    function showStep(n) {
      stepIndex = Math.max(0, Math.min(n, steps.length - 1));
      steps.forEach(function (el, i) {
        el.classList.toggle("is-active", i === stepIndex);
      });
      if (bar) {
        bar.style.width = ((stepIndex + 1) / steps.length) * 100 + "%";
      }
      if (btnPrev) btnPrev.style.visibility = stepIndex === 0 ? "hidden" : "visible";
      if (btnNext) {
        btnNext.textContent = stepIndex === steps.length - 1 ? "Submit" : "Next";
      }
    }

    if (btnPrev) {
      btnPrev.addEventListener("click", function () {
        showStep(stepIndex - 1);
      });
    }
    if (btnNext) {
      btnNext.addEventListener("click", function () {
        if (stepIndex === steps.length - 1) {
          assessment.querySelector(".assessment-form") &&
            assessment.querySelector(".assessment-form").requestSubmit();
        } else {
          showStep(stepIndex + 1);
        }
      });
    }
    showStep(0);
  }

  /* Insights category filter (client-side) */
  var filterRow = document.querySelector(".filter-row");
  if (filterRow) {
    filterRow.addEventListener("click", function (e) {
      var btn = e.target.closest("button");
      if (!btn || !filterRow.contains(btn)) return;
      var cat = btn.getAttribute("data-filter");
      filterRow.querySelectorAll("button").forEach(function (b) {
        b.classList.toggle("is-active", b === btn);
      });
      document.querySelectorAll("[data-category]").forEach(function (card) {
        var show = !cat || cat === "all" || card.getAttribute("data-category") === cat;
        card.style.display = show ? "" : "none";
      });
    });
  }

  /* Advisor resources email gate + in-page lead forms */
  var gateRoot = document.querySelector("[data-resource-gate]");
  if (gateRoot) {
    var LS_KEY = "pbr_advisor_resources_unlock_v1";
    var gatePanel = document.getElementById("resource-gate-panel");
    var gatedMain = document.getElementById("resource-gated-main");

    function scrollToHash() {
      var h = window.location.hash;
      if (!h) return;
      var target = document.querySelector(h);
      if (target) target.scrollIntoView({ behavior: "smooth" });
    }

    function unlockResources() {
      try {
        localStorage.setItem(LS_KEY, "1");
      } catch (err) {}
      if (gatePanel) gatePanel.hidden = true;
      if (gatedMain) gatedMain.hidden = false;
      scrollToHash();
    }

    if (localStorage.getItem(LS_KEY) === "1") {
      unlockResources();
    }

    var primaryForm = gateRoot.querySelector("form.resource-lead-form[data-unlocks='true']");
    var sharedSubmitUrl = primaryForm ? (primaryForm.getAttribute("data-submit-url") || "").trim() : "";
    if (sharedSubmitUrl) {
      gateRoot.querySelectorAll("form.resource-lead-form").forEach(function (f) {
        if (!(f.getAttribute("data-submit-url") || "").trim()) {
          f.setAttribute("data-submit-url", sharedSubmitUrl);
        }
      });
    }

    gateRoot.querySelectorAll("form.resource-lead-form").forEach(function (gateForm) {
      var unlocks = gateForm.getAttribute("data-unlocks") === "true";
      var gateErr = gateForm.querySelector(".resource-gate-form__error");
      var gateBtn = gateForm.querySelector("button[type='submit']");
      var defaultBtnText = gateBtn ? gateBtn.textContent : "";
      var thanks = gateForm.querySelector(".resource-lead-form__thanks");

      gateForm.addEventListener("submit", function (e) {
        e.preventDefault();
        if (gateErr) gateErr.hidden = true;
        if (thanks) thanks.hidden = true;
        var url = (gateForm.getAttribute("data-submit-url") || "").trim();
        if (!url) {
          if (unlocks) unlockResources();
          else if (thanks) {
            thanks.hidden = false;
          }
          return;
        }
        if (gateBtn) {
          gateBtn.disabled = true;
          gateBtn.textContent = "Sending…";
        }
        var fd = new FormData(gateForm);
        fetch(url, {
          method: "POST",
          body: fd,
          headers: { Accept: "application/json" },
        })
          .then(function (res) {
            if (!res.ok) throw new Error("bad status");
            if (unlocks) unlockResources();
            else if (thanks) thanks.hidden = false;
          })
          .catch(function () {
            if (gateErr) gateErr.hidden = false;
          })
          .finally(function () {
            if (gateBtn) {
              gateBtn.disabled = false;
              gateBtn.textContent = defaultBtnText;
            }
          });
      });
    });
  }

  /* Typeform / Jotform embed for advisor assessment (set data-assessment-embed-url on shell) */
  var embedShell = document.querySelector("[data-assessment-embed-url]");
  if (embedShell) {
    var embedUrl = (embedShell.getAttribute("data-assessment-embed-url") || "").trim();
    if (typeof window.PBR_ASSESSMENT_EMBED_URL === "string" && window.PBR_ASSESSMENT_EMBED_URL.trim()) {
      embedUrl = window.PBR_ASSESSMENT_EMBED_URL.trim();
    }
    var placeholder = embedShell.querySelector(".assessment-embed-placeholder");
    if (embedUrl) {
      if (placeholder) placeholder.hidden = true;
      var iframe = document.createElement("iframe");
      iframe.className = "assessment-embed-iframe";
      iframe.title = "Advisor qualification questionnaire";
      iframe.setAttribute("loading", "lazy");
      iframe.src = embedUrl;
      embedShell.appendChild(iframe);
    }
  }

  /* Forms without a configured POST target */
  document.querySelectorAll('form[data-endpoint="none"]').forEach(function (form) {
    if (form.classList.contains("resource-gate-form")) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      alert("No submission endpoint is configured. Point this form at your CRM API, secure webhook, or ESP via action/method or fetch().");
    });
  });
})();
