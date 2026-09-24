/**
 * Main navigation — mobile menu toggle and active section highlight.
 */
export function initNav() {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('main-nav');
  if (!toggle || !nav) return;

  const toggleLabel = toggle.querySelector('.visually-hidden');
  const links = [...nav.querySelectorAll('.main-nav__link')];

  const setOpen = (isOpen) => {
    nav.classList.toggle('is-open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggleLabel.textContent = isOpen ? 'Fechar menu' : 'Abrir menu';
  };

  toggle.addEventListener('click', () => {
    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });

  nav.addEventListener('click', (clickEvent) => {
    if (clickEvent.target.closest('a')) setOpen(false);
  });

  document.addEventListener('keydown', (keyEvent) => {
    if (keyEvent.key === 'Escape' && nav.classList.contains('is-open')) {
      setOpen(false);
      toggle.focus();
    }
  });

  document.addEventListener('click', (clickEvent) => {
    if (!nav.contains(clickEvent.target) && !toggle.contains(clickEvent.target)) {
      setOpen(false);
    }
  });

  highlightActiveSection(links);
}

function highlightActiveSection(links) {
  const sections = links
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  const observer = new IntersectionObserver(
    (entries) => {
      entries
        .filter((entry) => entry.isIntersecting)
        .forEach((entry) => {
          links.forEach((link) => {
            const isActive = link.getAttribute('href') === `#${entry.target.id}`;
            link.classList.toggle('is-active', isActive);
            if (isActive) {
              link.setAttribute('aria-current', 'true');
            } else {
              link.removeAttribute('aria-current');
            }
          });
        });
    },
    { rootMargin: '-45% 0px -50% 0px' },
  );

  sections.forEach((section) => observer.observe(section));
}
