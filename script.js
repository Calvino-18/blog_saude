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

const SUPABASE_URL = 'https://jadboofwnkgsybzpcvkx.supabase.co';
// Chave pública (anon); a proteção dos dados é feita pelas políticas RLS do Supabase.
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImphZGJvb2Z3bmtnc3lienBjdmt4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkwNTk3NDAsImV4cCI6MjEwNDYzNTc0MH0.rrnLvXxKc6MdyOPML9kpsD192Nc1QN25zbKRjMEa-As';

document.querySelector('#water-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const name = document.querySelector('#nome').value.trim();
  const email = document.querySelector('#email').value.trim();
  const weight = Number(document.querySelector('#peso').value);
  const result = document.querySelector('#resultado');
  const button = document.querySelector('#calc-button');

  if (!form.reportValidity() || !weight || weight <= 0) {
    result.textContent = 'Preencha nome, e-mail e um peso válido para calcular.';
    return;
  }

  const amount = Math.round(weight * 35);
  button.disabled = true;
  result.textContent = 'Calculando...';

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/calculos_agua`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal'
      },
      body: JSON.stringify({ nome: name, email, peso_kg: weight, quantidade_ml: amount })
    });

    if (!response.ok) throw new Error('Não foi possível salvar o cálculo.');
    result.textContent = `Sua referência diária: ${amount.toLocaleString('pt-BR')} ml (${(amount / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 2 })} L).`;
    form.reset();
  } catch (error) {
    result.textContent = 'Não foi possível salvar seus dados agora. Tente novamente.';
    console.error(error);
  } finally {
    button.disabled = false;
  }
});

const checks = [...document.querySelectorAll('.checklist input')];
const updateProgress = () => {
  const done = checks.filter((check) => check.checked).length;
  document.querySelector('#progress-label').textContent = `${done} / ${checks.length}`;
  document.querySelector('#progress-fill').style.width = `${done / checks.length * 100}%`;
  checks.forEach((check) => check.closest('label').classList.toggle('checked', check.checked));
};
checks.forEach((check) => check.addEventListener('change', updateProgress));

const participantsStatus = document.querySelector('#participants-status');
const participantsList = document.querySelector('#participants-list');

const loadParticipants = async () => {
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/calculos_agua?select=nome,peso_kg,quantidade_ml,criado_em&order=criado_em.desc&limit=1000`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`
        }
      }
    );

    if (!response.ok) throw new Error('Não foi possível carregar os participantes.');

    const records = await response.json();
    const uniqueParticipants = [];
    const seenNames = new Set();

    records.forEach((record) => {
      const name = String(record.nome || '').trim();
      const normalizedName = name.toLocaleLowerCase('pt-BR');
      if (name && !seenNames.has(normalizedName)) {
        seenNames.add(normalizedName);
        uniqueParticipants.push({
          name,
          weight: record.peso_kg,
          amount: record.quantidade_ml,
          date: record.criado_em
        });
      }
    });

    participantsStatus.textContent = uniqueParticipants.length
      ? `${uniqueParticipants.length} participante${uniqueParticipants.length === 1 ? '' : 's'} na nossa comunidade.`
      : 'Ainda não há participantes. Seja o primeiro!';

    participantsList.innerHTML = uniqueParticipants.map(({ name, weight, amount, date }) => {
      const initial = name.charAt(0).toLocaleUpperCase('pt-BR');
      const joinedDate = date
        ? new Date(date).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })
        : '';
      const formattedWeight = Number(weight).toLocaleString('pt-BR', { maximumFractionDigits: 2 });
      const formattedAmount = Number(amount).toLocaleString('pt-BR');
      return `<article class="participant-card"><span class="participant-avatar" aria-hidden="true">${escapeHtml(initial)}</span><div class="participant-details"><strong>${escapeHtml(name)}</strong><small>${formattedWeight} kg · ${formattedAmount} ml de água por dia</small><small>${joinedDate ? `Participante desde ${joinedDate}` : 'Participante da comunidade'}</small></div></article>`;
    }).join('');
  } catch (error) {
    participantsStatus.textContent = 'Não foi possível carregar os participantes agora. Tente novamente mais tarde.';
    console.error(error);
  }
};

const escapeHtml = (value) => value.replace(/[&<>'"]/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
}[character]));

loadParticipants();
