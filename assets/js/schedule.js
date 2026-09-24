/**
 * Schedule tabs — switches the visible day of the program.
 */
export function initSchedule(root = document.querySelector('[data-schedule]')) {
  if (!root) return;

  const tabs = [...root.querySelectorAll('[role="tab"]')];
  const panels = [...root.querySelectorAll('[role="tabpanel"]')];

  function selectTab(selectedTab) {
    tabs.forEach((tab) => {
      const isSelected = tab === selectedTab;
      tab.setAttribute('aria-selected', String(isSelected));
      tab.tabIndex = isSelected ? 0 : -1;
    });

    panels.forEach((panel) => {
      panel.hidden = panel.id !== selectedTab.getAttribute('aria-controls');
    });
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => selectTab(tab));
  });

  return { tabs, selectTab };
}
