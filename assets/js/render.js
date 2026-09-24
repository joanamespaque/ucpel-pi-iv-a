/**
 * Renders the dynamic sections (About, Schedule and Speakers)
 * from the domain model defined in data.js.
 */
import { formatShortDate, formatWeekday } from './data.js';

export function renderSummary(event, container) {
  if (!container) return;
  container.innerHTML = event.getSummary();
}

export function renderStats(event, container) {
  if (!container) return;

  const stats = [
    { value: event.days.length, label: 'dias de evento' },
    { value: event.countActivities('talk'), label: 'palestras' },
    { value: event.countActivities('workshop'), label: 'oficinas práticas' },
    { value: event.speakers.length, label: 'palestrantes convidados' },
  ];

  container.innerHTML = stats
    .map(
      ({ value, label }) => `
        <li class="stats__item">
          <strong class="stats__value">${value}</strong>
          <span class="stats__label">${label}</span>
        </li>`,
    )
    .join('');
}

export function renderSchedule(event, tabsContainer, panelsContainer) {
  if (!tabsContainer || !panelsContainer) return;

  tabsContainer.innerHTML = event.days
    .map(
      (day, index) => `
        <button class="tabs__tab" type="button" role="tab"
          id="tab-${day}" aria-controls="panel-${day}"
          aria-selected="${index === 0}" tabindex="${index === 0 ? 0 : -1}">
          <span class="tabs__tab-day">Dia ${index + 1}</span>
          <span class="tabs__tab-date">${formatWeekday(day)}, ${formatShortDate(day)}</span>
        </button>`,
    )
    .join('');

  panelsContainer.innerHTML = event.days
    .map(
      (day, index) => `
        <div class="tabs__panel" role="tabpanel" id="panel-${day}"
          aria-labelledby="tab-${day}" tabindex="0" ${index === 0 ? '' : 'hidden'}>
          <ol class="timeline">
            ${event.getActivitiesByDay(day).map((activity) => activity.renderScheduleItem()).join('')}
          </ol>
        </div>`,
    )
    .join('');
}

export function renderSpeakers(event, container) {
  if (!container) return;
  container.innerHTML = event.speakers.map((speaker) => speaker.renderCard()).join('');
}
