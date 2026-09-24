/**
 * Entry point — renders the dynamic content and starts the UI modules.
 */
import { event } from './data.js';
import { renderSchedule, renderSpeakers, renderStats, renderSummary } from './render.js';

renderSummary(event, document.querySelector('[data-event-summary]'));
renderStats(event, document.querySelector('[data-event-stats]'));
renderSchedule(
  event,
  document.querySelector('[data-schedule-tabs]'),
  document.querySelector('[data-schedule-panels]'),
);
renderSpeakers(event, document.querySelector('[data-speakers]'));
