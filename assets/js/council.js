const ui = JSON.parse(document.querySelector('#council-ui').textContent);
const links = [...document.querySelectorAll('[data-advisor]')];
const panels = [...document.querySelectorAll('.advisor-panel')];
const status = document.querySelector('#advisor-status');
function select(id, announce = false) {
  const selected = panels.find(panel => panel.id === id);
  if (!selected) return false;
  for (const panel of panels) panel.hidden = panel !== selected;
  for (const link of links) {
    if (link.getAttribute('href') === `#${id}`) link.setAttribute('aria-current', 'true');
    else link.removeAttribute('aria-current');
  }
  for (const language of document.querySelectorAll('.language-switch a[hreflang]')) {
    const target = new URL(language.href);
    target.hash = id;
    language.href = target.href;
  }
  if (announce) status.textContent = ui.selected.replace('{name}', selected.querySelector('h3').childNodes[0].textContent);
  return true;
}
select(location.hash.slice(1)) || select(panels[0].id);
for (const link of links) link.addEventListener('click', event => {
  event.preventDefault();
  const id = link.hash.slice(1);
  select(id, true);
  history.replaceState(null, '', link.hash);
  if (matchMedia('(max-width: 760px)').matches) {
    document.getElementById(id).focus({ preventScroll: true });
    document.getElementById(id).scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
  }
});
window.addEventListener('hashchange', () => select(location.hash.slice(1), true));
const copy = document.querySelector('#copy-prompt');
copy.hidden = false;
copy.addEventListener('click', async () => {
  const text = document.querySelector('#example-prompt').textContent;
  try {
    await navigator.clipboard.writeText(text);
    document.querySelector('#copy-status').textContent = ui.questionCopied;
  } catch {
    const range = document.createRange();
    range.selectNodeContents(document.querySelector('#example-prompt'));
    const selection = window.getSelection();
    selection.removeAllRanges(); selection.addRange(range);
    document.querySelector('#copy-status').textContent = ui.questionFallback;
  }
});

const installCopy = document.querySelector('#copy-install');
const installCommand = document.querySelector('#install-command');
const installFeedback = document.querySelector('.install-copy-feedback');
const installStatus = document.querySelector('#install-copy-status');
installCopy.hidden = false;
installCopy.addEventListener('click', async () => {
  installFeedback.hidden = false;
  try {
    await navigator.clipboard.writeText(installCommand.value);
    installStatus.textContent = ui.installCopied;
    installCopy.querySelector('strong').textContent = ui.installCopiedLabel;
    installCommand.hidden = true;
    document.querySelector('label[for="install-command"]').hidden = true;
  } catch {
    installStatus.textContent = ui.installFallback;
    installCommand.hidden = false;
    document.querySelector('label[for="install-command"]').hidden = false;
    installCommand.focus();
    installCommand.select();
  }
});
