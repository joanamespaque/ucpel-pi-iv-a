/**
 * Entry point — renders the dynamic content and starts the UI modules.
 */
import { event } from './data.js';
import {
  renderSchedule,
  renderSpeakers,
  renderStats,
  renderSummary,
  renderWorkshopOptions,
  renderWorkshops,
} from './render.js';
import { initNav } from './nav.js';
import { initSlideshow } from './slideshow.js';
import { initSchedule } from './schedule.js';
import { initForm } from './form.js';

renderSummary(event, document.querySelector('[data-event-summary]'));
renderStats(event, document.querySelector('[data-event-stats]'));
renderSchedule(
  event,
  document.querySelector('[data-schedule-tabs]'),
  document.querySelector('[data-schedule-panels]'),
);
renderSpeakers(event, document.querySelector('[data-speakers]'));
renderWorkshops(event, document.querySelector('[data-workshops]'));
renderWorkshopOptions(event, document.querySelector('[data-workshop-options]'));

initNav();
initSlideshow();
initSchedule();
initForm();
