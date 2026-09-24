/**
 * Registration form — client-side validation and feedback.
 * There is no backend (GitHub Pages only serves static files): a valid
 * submission shows a registration code, but nothing is sent or e-mailed.
 */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const validators = {
  name: (value) => {
    if (!value.trim()) return 'Informe seu nome completo.';
    if (value.trim().split(/\s+/).length < 2) return 'Informe nome e sobrenome.';
    return '';
  },
  email: (value) => {
    if (!value.trim()) return 'Informe seu e-mail.';
    if (!EMAIL_PATTERN.test(value.trim())) return 'Informe um e-mail válido, como nome@exemplo.com.';
    return '';
  },
  profile: (value) => (value ? '' : 'Selecione seu perfil.'),
  institution: (value) => (value.trim() ? '' : 'Informe seu curso ou instituição.'),
  consent: (_, field) => (field.checked ? '' : 'É preciso autorizar o uso dos dados para concluir a inscrição.'),
};

export function initForm(form = document.getElementById('registration-form')) {
  if (!form) return;

  const status = form.querySelector('[data-form-status]');

  const validateField = (field) => {
    const validate = validators[field.name];
    if (!validate) return true;

    const message = validate(field.value, field);
    showFieldError(field, message);
    return !message;
  };

  Object.keys(validators).forEach((name) => {
    const field = form.elements[name];
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('change', () => {
      if (field.closest('.form-field').classList.contains('is-invalid')) validateField(field);
    });
  });

  preselectWorkshop(form);

  form.addEventListener('submit', (submitEvent) => {
    submitEvent.preventDefault();

    const fields = Object.keys(validators).map((name) => form.elements[name]);
    const invalidFields = fields.filter((field) => !validateField(field));

    if (invalidFields.length) {
      showStatus(status, 'error', `Revise ${invalidFields.length === 1 ? 'o campo destacado' : `os ${invalidFields.length} campos destacados`} para concluir a inscrição.`);
      invalidFields[0].focus();
      return;
    }

    const firstName = form.elements.name.value.trim().split(/\s+/)[0];
    showStatus(
      status,
      'success',
      `Inscrição registrada, ${firstName}! Seu código é ${generateCode()}. Apresente-o no credenciamento.`,
    );
    form.reset();
  });
}

/** Registration code shown to the participant, e.g. ST26-4821. */
function generateCode() {
  const number = Math.floor(1000 + Math.random() * 9000);
  return `ST26-${number}`;
}

/**
 * "Quero participar" links in the workshop cards carry data-workshop="<id>":
 * following one ticks that workshop in the form (the link itself scrolls to it).
 */
function preselectWorkshop(form) {
  document.addEventListener('click', (clickEvent) => {
    const link = clickEvent.target.closest('[data-workshop]');
    if (!link) return;

    const option = form.querySelector(`input[name="workshops"][value="${link.dataset.workshop}"]`);
    if (option && !option.disabled) option.checked = true;
  });
}

function showFieldError(field, message) {
  const wrapper = field.closest('.form-field');
  const errorId = `${field.id}-error`;
  let error = document.getElementById(errorId);

  wrapper.classList.toggle('is-invalid', Boolean(message));

  if (!message) {
    error?.remove();
    field.removeAttribute('aria-invalid');
    field.removeAttribute('aria-describedby');
    return;
  }

  if (!error) {
    error = document.createElement('p');
    error.id = errorId;
    error.className = 'form-field__error';
    wrapper.append(error);
  }

  error.textContent = message;
  field.setAttribute('aria-invalid', 'true');
  field.setAttribute('aria-describedby', errorId);
}

function showStatus(status, type, message) {
  status.className = `form__status form__status--${type}`;
  status.textContent = message;
}
