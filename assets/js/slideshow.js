/**
 * Hero slideshow — autoplay, previous/next, dots and pause control.
 */
const AUTOPLAY_DELAY = 6000;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

export function initSlideshow(root = document.querySelector('.slideshow')) {
  if (!root) return;

  const slides = [...root.querySelectorAll('.slide')];
  const dotsContainer = root.querySelector('.slideshow__dots');
  const prevButton = root.querySelector('[data-slide-prev]');
  const nextButton = root.querySelector('[data-slide-next]');
  const pauseButton = root.querySelector('[data-slide-pause]');
  const pauseIcon = root.querySelector('[data-pause-icon]');
  const pauseLabel = root.querySelector('[data-pause-label]');
  const track = root.querySelector('.slideshow__track');

  let current = Math.max(0, slides.findIndex((slide) => slide.classList.contains('is-active')));
  let timer = null;
  let isPaused = false;

  const dots = slides.map((_, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'slideshow__dot';
    dot.innerHTML = `<span class="visually-hidden">Ir para o slide ${index + 1}</span>`;
    dot.addEventListener('click', () => {
      goTo(index);
      restart();
    });
    dotsContainer.append(dot);
    return dot;
  });

  function goTo(index) {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === current;
      slide.classList.toggle('is-active', isActive);
      slide.setAttribute('aria-hidden', String(!isActive));
      slide.inert = !isActive;
    });
    dots.forEach((dot, dotIndex) => {
      dot.setAttribute('aria-current', String(dotIndex === current));
    });
  }

  function start() {
    if (isPaused || timer) return;
    timer = setInterval(() => goTo(current + 1), AUTOPLAY_DELAY);
  }

  function stop() {
    clearInterval(timer);
    timer = null;
  }

  function restart() {
    stop();
    start();
  }

  function setPaused(paused) {
    isPaused = paused;
    pauseIcon.innerHTML = paused ? '&#9654;' : '&#10074;&#10074;';
    pauseLabel.textContent = paused ? 'Retomar apresentação' : 'Pausar apresentação';
    // Announce slide changes only when they are triggered by the visitor
    track.setAttribute('aria-live', paused ? 'polite' : 'off');
    if (paused) {
      stop();
    } else {
      start();
    }
  }

  prevButton.addEventListener('click', () => {
    goTo(current - 1);
    restart();
  });

  nextButton.addEventListener('click', () => {
    goTo(current + 1);
    restart();
  });

  pauseButton.addEventListener('click', () => setPaused(!isPaused));

  // Pause while the visitor interacts with the slideshow
  root.addEventListener('mouseenter', stop);
  root.addEventListener('mouseleave', start);
  root.addEventListener('focusin', stop);
  root.addEventListener('focusout', (focusEvent) => {
    if (!root.contains(focusEvent.relatedTarget)) start();
  });

  goTo(current);

  // Respect the visitor's reduced motion preference: no autoplay
  if (prefersReducedMotion.matches) {
    setPaused(true);
  } else {
    start();
  }
}
