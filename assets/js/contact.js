/* ════════════════════════════════════════════════════════════════════════
   contact.js  —  save to assets/js/contact.js
   Handles: animated dot-grid background (hero only) + EmailJS submission
   ════════════════════════════════════════════════════════════════════════ */

/* ── CONFIG ─────────────────────────────────────────────────────────────── */
const EMAILJS_CONFIG = {
    publicKey:  'HQ2XOh13C-eurT_nV',
    serviceId:  'service_owg2vrb',
    templateId: 'template_jvmaiyr',
  };
  
  /* ── EMAILJS INIT ────────────────────────────────────────────────────────── */
  emailjs.init(EMAILJS_CONFIG.publicKey);
  
  /* ══════════════════════════════════════════════════════════════════════════
     DOT-GRID CANVAS — scoped to .contact-hero
     The canvas is now inside the hero section (position: absolute) so it
     only renders within that element's bounds.
     ══════════════════════════════════════════════════════════════════════════ */
  (function initDotCanvas() {
    const canvas = document.getElementById('dotCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
  
    const SPACING      = 36;
    const BASE_OPACITY = 0.07;
    const PEAK_OPACITY = 0.5;
    const INFLUENCE_R  = 130;
    const DOT_RADIUS   = 1.3;
  
    let W, H, cols, rows;
  
    // Mouse position relative to the HERO element (not the page)
    const hero  = canvas.parentElement;
    let mouse   = { x: -9999, y: -9999 };
  
    function resize() {
      W = canvas.width  = hero.offsetWidth;
      H = canvas.height = hero.offsetHeight;
      cols = Math.ceil(W / SPACING) + 1;
      rows = Math.ceil(H / SPACING) + 1;
    }
  
    function draw() {
      ctx.clearRect(0, 0, W, H);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x  = c * SPACING;
          const y  = r * SPACING;
          const dx = x - mouse.x;
          const dy = y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const t    = Math.max(0, 1 - dist / INFLUENCE_R);
          const opacity = BASE_OPACITY + (PEAK_OPACITY - BASE_OPACITY) * t * t;
          ctx.beginPath();
          ctx.arc(x, y, DOT_RADIUS, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${opacity})`;
          ctx.fill();
        }
      }
      requestAnimationFrame(draw);
    }
  
    // Track mouse relative to the hero element
    window.addEventListener('mousemove', e => {
      const rect = hero.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });
  
    window.addEventListener('touchmove', e => {
      const rect = hero.getBoundingClientRect();
      mouse.x = e.touches[0].clientX - rect.left;
      mouse.y = e.touches[0].clientY - rect.top;
    }, { passive: true });
  
    // When mouse leaves the hero, reset so dots go back to resting state
    hero.addEventListener('mouseleave', () => {
      mouse.x = -9999;
      mouse.y = -9999;
    });
  
    const ro = new ResizeObserver(resize);
    ro.observe(hero);
  
    resize();
    draw();
  })();
  
  /* ══════════════════════════════════════════════════════════════════════════
     FORM — VALIDATION + EMAILJS SUBMISSION
     Uses emailjs.send() with explicit template params — more reliable than
     sendForm() which depends on field names matching exactly.
     ══════════════════════════════════════════════════════════════════════════ */
  (function initForm() {
    const form     = document.getElementById('contactForm');
    const sendBtn  = document.getElementById('sendBtn');
    const statusEl = document.getElementById('formStatus');
  
    const fields = {
      from_name : { el: document.getElementById('from_name'), errEl: document.getElementById('err-name')    },
      reply_to  : { el: document.getElementById('reply_to'),  errEl: document.getElementById('err-email')   },
      subject   : { el: document.getElementById('subject'),   errEl: document.getElementById('err-subject') },
      message   : { el: document.getElementById('message'),   errEl: document.getElementById('err-message') },
    };
  
    Object.values(fields).forEach(({ el, errEl }) => {
      el.addEventListener('input', () => { errEl.textContent = ''; });
    });
  
    function validate() {
      let ok = true;
      const { from_name, reply_to, subject, message } = fields;
  
      if (!from_name.el.value.trim()) {
        from_name.errEl.textContent = 'Please enter your name.';
        ok = false;
      }
  
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!reply_to.el.value.trim()) {
        reply_to.errEl.textContent = 'Please enter your email.';
        ok = false;
      } else if (!emailRe.test(reply_to.el.value.trim())) {
        reply_to.errEl.textContent = "That doesn't look like a valid email.";
        ok = false;
      }
  
      if (!subject.el.value.trim()) {
        subject.errEl.textContent = 'Please add a subject.';
        ok = false;
      }
  
      if (!message.el.value.trim()) {
        message.errEl.textContent = "Don't forget to write a message!";
        ok = false;
      }
  
      return ok;
    }
  
    function setStatus(msg, type) {
      statusEl.textContent = msg;
      statusEl.className   = `form-status ${type}`;
    }
  
    function setLoading(loading) {
      sendBtn.disabled = loading;
      sendBtn.querySelector('.send-btn-text').textContent = loading ? 'Sending…' : 'Send message';
    }
  
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      setStatus('', '');
      if (!validate()) return;
  
      setLoading(true);
  
      // Explicitly pull values — avoids any sendForm name-matching issues
      const templateParams = {
        from_name : fields.from_name.el.value.trim(),
        reply_to  : fields.reply_to.el.value.trim(),
        subject   : fields.subject.el.value.trim(),
        message   : fields.message.el.value.trim(),
        // If your EmailJS template uses {{to_email}}, uncomment the next line:
        // to_email: 'cesar0219sanchez@outlook.com',
      };
  
      try {
        const response = await emailjs.send(
          EMAILJS_CONFIG.serviceId,
          EMAILJS_CONFIG.templateId,
          templateParams
        );
  
        console.log('EmailJS success:', response.status, response.text);
        setStatus("Message sent! I'll get back to you soon. 👋", 'success');
        form.reset();
  
      } catch (err) {
        // Log the full error so you can see exactly what EmailJS returned
        console.error('EmailJS error — full details:', err);
  
        const code   = err?.status   || err?.code   || '?';
        const detail = err?.text     || err?.message || JSON.stringify(err);
        setStatus(
          `Send failed (${code}). Check the browser console for details, or email me directly at cesar.sanc219@gmail.com`,
          'error'
        );
      } finally {
        setLoading(false);
      }
    });
  })();