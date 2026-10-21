// Copyright (c) 2026 Stanislav Kazachkov (SupiVPN).

(() => {
  const diagram = document.querySelector('.architecture-map');
  if (!diagram) return;
  let active = null;
  let pinned = false;
  let dismissed = null;

  function close() {
    if (!active) return;
    active.querySelector('.architecture-popover').hidden = true;
    active.querySelector('button').setAttribute('aria-expanded', 'false');
    active.classList.remove('architecture-active');
    active = null;
    pinned = false;
  }

  function positionDetails(node) {
    const popup = node.querySelector('.architecture-popover');
    popup.classList.remove('architecture-above');
    if (window.matchMedia('(max-width: 650px)').matches) return;
    const bounds = popup.getBoundingClientRect();
    if (bounds.bottom > window.innerHeight - 16 && node.getBoundingClientRect().top > bounds.height + 16) {
      popup.classList.add('architecture-above');
    }
  }

  function open(node, pin = false) {
    if (active !== node) close();
    active = node;
    pinned = pin || pinned;
    node.querySelector('.architecture-popover').hidden = false;
    node.querySelector('button').setAttribute('aria-expanded', 'true');
    node.classList.add('architecture-active');
    positionDetails(node);
  }

  function dismiss() {
    dismissed = active;
    close();
  }

  for (const node of diagram.querySelectorAll('.architecture-node')) {
    const heading = node.querySelector('h3');
    const popup = node.querySelector('.architecture-popover');
    if (!heading || !popup) continue;
    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'architecture-trigger';
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('aria-controls', popup.id);
    trigger.setAttribute('aria-describedby', popup.id);
    trigger.append(...heading.childNodes);
    heading.append(trigger);
    let hovered = false;

    node.addEventListener('pointerenter', event => {
      if (event.pointerType !== 'mouse') return;
      hovered = true;
      if (!pinned && dismissed !== node) open(node);
    });
    node.addEventListener('pointerleave', event => {
      if (event.pointerType !== 'mouse') return;
      hovered = false;
      if (dismissed === node) dismissed = null;
      if (!node.contains(document.activeElement)) {
        if (active === node && !pinned) close();
      }
    });
    trigger.addEventListener('focus', () => {
      if (dismissed !== node) open(node);
    });
    trigger.addEventListener('blur', () => {
      if (dismissed === node) dismissed = null;
      if (active === node && !hovered) close();
    });
    trigger.addEventListener('click', () => {
      if (active === node && pinned) dismiss();
      else { dismissed = null; open(node, true); }
    });
  }

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && active) {
      dismiss();
      event.preventDefault();
    }
  });
  document.addEventListener('click', event => {
    if (active && !active.contains(event.target)) dismiss();
  });
  window.addEventListener('resize', () => {
    if (active) positionDetails(active);
  });
  document.querySelector('.architecture-hint').hidden = false;
})();
