// Contact form: validates the coupon form and sends it through EmailJS.
// Ids match the form in index.html and components/contact.html.
const EMAILJS_CONFIG = {
  publicKey:  'HQ2XOh13C-eurT_nV',
  serviceId:  'service_owg2vrb',
  templateId: 'template_jvmaiyr',
};

// ?. so a blocked CDN still leaves the form validating and showing the fallback below
window.emailjs?.init(EMAILJS_CONFIG.publicKey);

(function initForm() {
  const form     = document.getElementById('contactForm');
  if (!form) return;
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

    // Explicit params rather than sendForm(), which depends on field names matching
    const templateParams = {
      from_name : fields.from_name.el.value.trim(),
      reply_to  : fields.reply_to.el.value.trim(),
      subject   : fields.subject.el.value.trim(),
      message   : fields.message.el.value.trim(),
    };

    try {
      await emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, templateParams);
      setStatus("Message sent! I'll get back to you soon.", 'success');
      form.reset();
    } catch (err) {
      console.error('EmailJS error:', err);
      const code = err?.status || err?.code || '?';
      setStatus(
        `Send failed (${code}). Check the browser console for details, or email me directly at cesar.sanc219@gmail.com`,
        'error'
      );
    } finally {
      setLoading(false);
    }
  });
})();
