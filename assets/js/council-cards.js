const card = document.querySelector('#method-card');
const front = document.querySelector('#method-front');
const back = document.querySelector('#method-back');
const status = document.querySelector('#flip-status');
let flipped = false;
card.setAttribute('role', 'button');
card.setAttribute('tabindex', '0');
card.setAttribute('aria-pressed', 'false');
card.setAttribute('aria-label', `${front.querySelector('h1').textContent}，点击或按回车翻面查看方法详情`);
back.setAttribute('aria-hidden', 'true');
card.classList.add('flip-ready');
for (const hint of card.querySelectorAll('.flip-hint')) hint.hidden = false;
function flip() {
  flipped = !flipped;
  card.classList.toggle('is-flipped', flipped);
  card.setAttribute('aria-pressed', String(flipped));
  front.setAttribute('aria-hidden', String(flipped));
  back.setAttribute('aria-hidden', String(!flipped));
  card.setAttribute('aria-label', flipped ? back.querySelector('.method-content').textContent + '。点击或按回车返回正面。' : `${front.querySelector('h1').textContent}，点击或按回车翻面查看方法详情`);
  status.textContent = flipped ? '背面 · 再次点击可返回正面' : '正面 · 点击卡片可查看方法详情';
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
