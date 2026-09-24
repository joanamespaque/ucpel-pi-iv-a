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

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectTab(tab));

    // Keyboard support as recommended by the WAI-ARIA tabs pattern
    tab.addEventListener('keydown', (keyEvent) => {
      const keyMap = {
        ArrowRight: index + 1,
        ArrowDown: index + 1,
        ArrowLeft: index - 1,
        ArrowUp: index - 1,
        Home: 0,
        End: tabs.length - 1,
      };
      if (!(keyEvent.key in keyMap)) return;

      keyEvent.preventDefault();
      const nextTab = tabs[(keyMap[keyEvent.key] + tabs.length) % tabs.length];
      selectTab(nextTab);
      nextTab.focus();
    });
  });

  return { tabs, selectTab };
}
