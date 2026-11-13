// Header scroll effect
const header = document.querySelector('.site-header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// Mobile menu
const menuButton = document.querySelector('.menu-toggle');
const menuPanel  = document.querySelector('.menu-panel');

function toggleMenu(open) {
  menuPanel.classList.toggle('open', open);
  menuPanel.setAttribute('aria-hidden', String(!open));
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.querySelector('span').textContent = open ? '×' : '↗';
  document.body.style.overflow = open ? 'hidden' : '';
}

menuButton.addEventListener('click', () => toggleMenu(!menuPanel.classList.contains('open')));
document.querySelectorAll('.menu-panel a').forEach(link =>
  link.addEventListener('click', () => toggleMenu(false))
);

// Our Approach accordion
const approachTriggers = Array.from(document.querySelectorAll('.approach-trigger'));
let activeApproachTrigger = null;

approachTriggers.forEach(trigger => {
  trigger.addEventListener('click', () => {
    activeApproachTrigger = activeApproachTrigger === trigger ? null : trigger;

    approachTriggers.forEach(itemTrigger => {
      const isOpen = itemTrigger === activeApproachTrigger;
      const item = itemTrigger.closest('.approach-item');
      const panel = document.getElementById(itemTrigger.getAttribute('aria-controls'));

      itemTrigger.setAttribute('aria-expanded', String(isOpen));
      item.classList.toggle('is-open', isOpen);
      panel.setAttribute('aria-hidden', String(!isOpen));
      panel.inert = !isOpen;
    });
  });
});

// Reveal on scroll
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll(
  '.problem-text, .problem-stats-wrap, .approach-inner, .mission-inner, .footer-top'
).forEach(el => {
  el.classList.add('reveal');
  revealObserver.observe(el);
});
