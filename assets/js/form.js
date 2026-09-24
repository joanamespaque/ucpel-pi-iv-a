/**
 * Registration form — client-side validation and feedback.
 * There is no backend: a valid submission shows a confirmation message.
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
    const email = form.elements.email.value.trim();
    showStatus(
      status,
      'success',
      `Inscrição confirmada, ${firstName}! Enviamos os detalhes do evento para ${email}.`,
    );
    form.reset();
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
