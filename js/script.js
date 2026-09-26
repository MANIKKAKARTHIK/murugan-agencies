document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contactForm');
  const fileInput = document.getElementById('fileInput');
  const fileLabel = document.getElementById('fileLabel');
  const btn = document.getElementById('submitBtn');
  const status = document.getElementById('formStatus');

  if (fileInput && fileLabel) {
    fileInput.addEventListener('change', () => {
      if (fileInput.files && fileInput.files.length > 0) {
        fileLabel.innerHTML = '📎 Selected: <strong>' + fileInput.files[0].name + '</strong>';
        fileLabel.style.borderColor = 'var(--copper)';
        fileLabel.style.color = 'var(--ivory)';
      } else {
        fileLabel.innerHTML = '📎 Upload Photo (optional)';
        fileLabel.style.borderColor = '';
        fileLabel.style.color = '';
      }
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      const origText = btn ? btn.innerHTML : 'Send Message →';
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = 'Sending...';
      }
      if (status) {
        status.style.display = 'none';
        status.innerHTML = '';
      }

      const isFileProtocol = window.location.protocol === 'file:';
      const formData = new FormData(contactForm);

      // Clean empty attachment
      if (fileInput && (!fileInput.files || fileInput.files.length === 0)) {
        formData.delete('attachment');
      }

      // WhatsApp prefill content in case of fallback
      const name = formData.get('Name') || '';
      const phone = formData.get('Phone') || '';
      const req = formData.get('Requirement') || '';
      const loc = formData.get('Location') || '';
      const email = formData.get('Email') || '';
      const msg = formData.get('Message') || '';
      let waMessage = `*New Inquiry - Murugan Agencies*\nName: ${name}\nPhone: ${phone}\nRequirement: ${req}`;
      if (loc) waMessage += `\nLocation: ${loc}`;
      if (email) waMessage += `\nEmail: ${email}`;
      if (msg) waMessage += `\nMessage: ${msg}`;
      const waUrl = `https://wa.me/919976752940?text=${encodeURIComponent(waMessage)}`;

      try {
        const response = await fetch('https://formsubmit.co/ajax/karthik638021@gmail.com', {
          method: 'POST',
          headers: {
            'Accept': 'application/json'
          },
          body: formData
        });

        const data = await response.json().catch(() => null);

        if (response.ok && data && (data.success === 'true' || data.success === true)) {
          showStatus(
            '✓ Thank you! Your message has been sent successfully. We will contact you shortly.',
            'success'
          );
          contactForm.reset();
          if (fileLabel) {
            fileLabel.innerHTML = '📎 Upload Photo (optional)';
            fileLabel.style.borderColor = '';
            fileLabel.style.color = '';
          }
        } else if (data && data.message && data.message.toLowerCase().includes('activation')) {
          showStatus(
            '⚠️ <strong>Form Activation Required:</strong><br>FormSubmit has sent an activation link to <strong>karthik638021@gmail.com</strong>.<br>Please open your Gmail and click <em>"Activate Form"</em> once.<br><br><a href="' + waUrl + '" target="_blank" style="display:inline-block; margin-top:8px; padding:8px 16px; font-size:13px; background:#25D366; color:#fff; border-radius:4px; text-decoration:none;">Send via WhatsApp Instead →</a>',
            'warning'
          );
        } else if (isFileProtocol || (data && data.message && data.message.includes('web server'))) {
          showStatus(
            'ℹ️ You are viewing this page directly as a local file (<code>file://</code>). FormSubmit requires a web server (like VS Code Live Server, localhost, or live website) to send emails.<br><br><a href="' + waUrl + '" target="_blank" style="display:inline-block; margin-top:8px; padding:8px 16px; font-size:13px; background:#25D366; color:#fff; border-radius:4px; text-decoration:none;">Send Message via WhatsApp →</a>',
            'warning'
          );
        } else {
          const errorMsg = (data && data.message) ? data.message : 'Unable to send message at this time.';
          showStatus(
            '⚠️ ' + errorMsg + '<br><br><a href="' + waUrl + '" target="_blank" style="color:#d4af37; text-decoration:underline;">Click here to send via WhatsApp directly</a>',
            'error'
          );
        }
      } catch (err) {
        if (isFileProtocol) {
          showStatus(
            'ℹ️ Form submission requires a web server or live hosting.<br><br><a href="' + waUrl + '" target="_blank" style="display:inline-block; margin-top:8px; padding:8px 16px; font-size:13px; background:#25D366; color:#fff; border-radius:4px; text-decoration:none;">Send Message via WhatsApp →</a>',
            'warning'
          );
        } else {
          showStatus(
            '⚠️ Network error. <a href="' + waUrl + '" target="_blank" style="color:#d4af37; text-decoration:underline;">Click here to send via WhatsApp</a>',
            'error'
          );
        }
      } finally {
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = origText;
        }
      }
    });
  }

  function showStatus(html, type) {
    if (!status) return;
    status.style.display = 'block';
    if (type === 'success') {
      status.style.background = 'rgba(79, 90, 69, 0.45)';
      status.style.border = '1px solid #4F5A45';
      status.style.color = '#E5DED2';
    } else if (type === 'warning') {
      status.style.background = 'rgba(168, 120, 90, 0.25)';
      status.style.border = '1px solid var(--copper)';
      status.style.color = '#E5DED2';
    } else {
      status.style.background = 'rgba(150, 40, 40, 0.3)';
      status.style.border = '1px solid #b24';
      status.style.color = '#fff';
    }
    status.innerHTML = html;
  }
});
