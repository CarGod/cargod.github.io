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
  if (announce) status.textContent = `已选择${selected.querySelector('h3').textContent}，共 4 组问答。`;
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
    document.querySelector('#copy-status').textContent = '已复制，安装 Skill 后粘贴给你的 AI 助手。';
  } catch {
    const range = document.createRange();
    range.selectNodeContents(document.querySelector('#example-prompt'));
    const selection = window.getSelection();
    selection.removeAllRanges(); selection.addRange(range);
    document.querySelector('#copy-status').textContent = '请手动复制已选中的提问。';
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
    installStatus.textContent = '已复制！发送给你的 Agent：Claude / Codex / Cursor / Workbuddy 等，让它帮你安装专家顾问团队。';
    installCopy.querySelector('strong').textContent = '已复制安装指令 ✓';
    installCommand.hidden = true;
    document.querySelector('label[for="install-command"]').hidden = true;
  } catch {
    installStatus.textContent = '自动复制不可用，请手动复制下方指令，发送给你的 Agent：Claude / Codex / Cursor / Workbuddy 等。';
    installCommand.hidden = false;
    document.querySelector('label[for="install-command"]').hidden = false;
    installCommand.focus();
    installCommand.select();
  }
});
