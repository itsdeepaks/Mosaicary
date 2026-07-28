(() => {
  const root = document.documentElement;
  const body = document.body;
  const toast = document.getElementById('toast');
  let toastTimer;

  function announce(message) {
    window.clearTimeout(toastTimer);
    toast.textContent = message;
    toast.hidden = false;
    toastTimer = window.setTimeout(() => {
      toast.hidden = true;
    }, 1800);
  }

  const grainToggle = document.getElementById('grainToggle');
  grainToggle.addEventListener('click', () => {
    const isOn = body.dataset.grain === 'on';
    body.dataset.grain = isOn ? 'off' : 'on';
    grainToggle.setAttribute('aria-pressed', String(!isOn));
    grainToggle.setAttribute('aria-label', isOn ? 'Turn grain on' : 'Turn grain off');
    announce(`Grain ${isOn ? 'disabled' : 'enabled'}`);
  });

  const accountButton = document.getElementById('accountButton');
  const accountMenu = document.getElementById('accountMenu');

  function closeAccountMenu() {
    accountMenu.hidden = true;
    accountButton.setAttribute('aria-expanded', 'false');
  }

  accountButton.addEventListener('click', () => {
    const willOpen = accountMenu.hidden;
    accountMenu.hidden = !willOpen;
    accountButton.setAttribute('aria-expanded', String(willOpen));
  });

  document.addEventListener('click', (event) => {
    if (!event.target.closest('.account-wrap')) closeAccountMenu();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeAccountMenu();
      accountButton.focus();
    }
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      const search = document.getElementById('sampleSearch');
      search.focus();
      announce('Search focused');
    }
  });

  document.querySelectorAll('.segment').forEach((segment) => {
    segment.addEventListener('click', (event) => {
      const button = event.target.closest('button[data-value]');
      if (!button) return;
      segment.querySelectorAll('button').forEach((candidate) => candidate.setAttribute('aria-pressed', 'false'));
      button.setAttribute('aria-pressed', 'true');
      const control = segment.dataset.control;
      const value = button.dataset.value;

      if (control === 'displayWeight') {
        root.style.setProperty('--display-weight', value);
        announce(`Display weight ${value}`);
      }
      if (control === 'uiWeight') {
        root.style.setProperty('--ui-weight', value);
        announce(`Interface weight ${value}`);
      }
      if (control === 'previewWidth') {
        const shell = document.getElementById('previewShell');
        const label = document.getElementById('previewLabel');
        shell.dataset.size = value;
        label.textContent = value === 'desktop' ? 'Desktop · fluid' : value === 'tablet' ? 'Tablet · 860px' : 'Mobile · 390px';
        announce(`${button.textContent.trim()} preview selected`);
      }
    });
  });

  document.querySelectorAll('.swatch[data-copy]').forEach((swatch) => {
    swatch.addEventListener('click', async () => {
      const value = swatch.dataset.copy;
      try {
        await navigator.clipboard.writeText(value);
        document.getElementById('copyNote').textContent = `${value} copied to clipboard.`;
        announce(`${value} copied`);
      } catch {
        document.getElementById('copyNote').textContent = `${value} — clipboard permission was not available.`;
      }
    });
  });

  document.querySelectorAll('.save-control').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      const isSaved = button.classList.toggle('saved');
      button.innerHTML = `<i class="${isSaved ? 'ph-fill' : 'ph'} ph-bookmark-simple"></i>`;
      button.setAttribute('aria-label', isSaved ? 'Remove resource from saved' : 'Save resource');
      announce(isSaved ? 'Resource saved' : 'Resource removed');
    });
  });

  document.querySelectorAll('.favicon-preview img').forEach((image) => {
    image.addEventListener('error', () => {
      image.hidden = true;
    });
  });

  document.querySelectorAll('.tabs button').forEach((tab) => {
    tab.addEventListener('click', () => {
      tab.parentElement.querySelectorAll('button').forEach((candidate) => candidate.setAttribute('aria-selected', String(candidate === tab)));
      announce(`${tab.textContent.trim()} state selected`);
    });
  });
})();
