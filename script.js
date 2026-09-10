const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
menuToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', open);
  menuToggle.textContent = open ? '×' : '☰';
});
document.querySelectorAll('.nav-links a').forEach((link) => link.addEventListener('click', () => {
  navLinks.classList.remove('open'); menuToggle.setAttribute('aria-expanded', 'false'); menuToggle.textContent = '☰';
}));

document.querySelectorAll('.filter').forEach((button) => button.addEventListener('click', () => {
  document.querySelectorAll('.filter').forEach((item) => item.classList.remove('active'));
  button.classList.add('active');
  const filter = button.dataset.filter;
  document.querySelectorAll('.food-item').forEach((item) => item.classList.toggle('hide', filter !== 'todos' && item.dataset.category !== filter));
}));

document.querySelector('#calc-button').addEventListener('click', () => {
  const weight = Number(document.querySelector('#peso').value);
  const result = document.querySelector('#resultado');
  if (!weight || weight <= 0) { result.textContent = 'Digite um peso válido para calcular.'; return; }
  const amount = weight * 35;
  result.textContent = `Sua referência diária: ${amount.toLocaleString('pt-BR')} ml (${(amount / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 2 })} L).`;
});

const checks = [...document.querySelectorAll('.checklist input')];
const updateProgress = () => {
  const done = checks.filter((check) => check.checked).length;
  document.querySelector('#progress-label').textContent = `${done} / ${checks.length}`;
  document.querySelector('#progress-fill').style.width = `${done / checks.length * 100}%`;
  checks.forEach((check) => check.closest('label').classList.toggle('checked', check.checked));
};
checks.forEach((check) => check.addEventListener('change', updateProgress));
