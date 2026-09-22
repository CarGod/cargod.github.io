const ui = JSON.parse(document.querySelector('#council-ui').textContent);
const card = document.querySelector('#method-card');
const front = document.querySelector('#method-front');
const back = document.querySelector('#method-back');
const status = document.querySelector('#flip-status');
let flipped = false;
card.setAttribute('role', 'button');
card.setAttribute('tabindex', '0');
card.setAttribute('aria-pressed', 'false');
card.setAttribute('aria-label', `${front.querySelector('h1').textContent}. ${ui.flipAriaFront}`);
back.setAttribute('aria-hidden', 'true');
card.classList.add('flip-ready');
for (const hint of card.querySelectorAll('.flip-hint')) hint.hidden = false;
function flip() {
  flipped = !flipped;
  card.classList.toggle('is-flipped', flipped);
  card.setAttribute('aria-pressed', String(flipped));
  front.setAttribute('aria-hidden', String(flipped));
  back.setAttribute('aria-hidden', String(!flipped));
  card.setAttribute('aria-label', flipped ? back.querySelector('.method-content').textContent + `. ${ui.flipAriaBack}` : `${front.querySelector('h1').textContent}. ${ui.flipAriaFront}`);
  status.textContent = flipped ? ui.backStatus : ui.frontStatus;
}
card.addEventListener('click', () => {
  if (window.getSelection()?.toString()) return;
  flip();
});
card.addEventListener('keydown', event => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    flip();
  }
});
