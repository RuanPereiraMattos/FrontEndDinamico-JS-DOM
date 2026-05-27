const API = 'http://localhost:8003/forca/aleatoria';
const PARTES = ['cabeca', 'corpo', 'bDir', 'bEsq', 'pDir', 'pEsq'];
const LETRAS = 'abcdefghijklmnopqrstuvwxyz';

let palavra = '';
let erros = 0;
let acertos = new Set();
let fimDeJogo = false;

function semAcento(c) {
  return c.normalize('NFD').replace(/[̀-ͯ]/g, '');
}

async function novoJogo() {
  erros = 0;
  acertos = new Set();
  fimDeJogo = false;

  document.getElementById('status').textContent = '';
  document.getElementById('status').className = 'status';
  PARTES.forEach(id => document.getElementById(id).classList.add('hidden'));

  try {
    const res = await fetch(API);
    const data = await res.json();
    palavra = data.palavra.toLowerCase();
  } catch {
    document.getElementById('status').textContent = 'Erro ao buscar palavra. Servidor rodando?';
    document.getElementById('status').className = 'status perdeu';
    return;
  }

  renderPalavra();
  renderTeclado();
  document.getElementById('contErros').textContent = 0;
}

function renderPalavra() {
  const el = document.getElementById('palavra');
  el.innerHTML = '';
  for (const c of palavra) {
    const slot = document.createElement('div');
    slot.className = 'letra-slot';
    const base = semAcento(c);
    if (c === ' ') {
      slot.style.borderBottom = 'none';
      slot.style.width = '20px';
    } else if (acertos.has(base)) {
      slot.textContent = c;
    }
    el.appendChild(slot);
  }
}

function renderTeclado() {
  const el = document.getElementById('teclado');
  el.innerHTML = '';
  for (const l of LETRAS) {
    const btn = document.createElement('button');
    btn.className = 'tecla';
    btn.textContent = l;
    btn.onclick = () => chutar(l, btn);
    el.appendChild(btn);
  }
}

function chutar(letra, btn) {
  if (fimDeJogo) return;
  btn.disabled = true;

  const encontrou = [...palavra].some(c => semAcento(c) === letra);

  if (encontrou) {
    acertos.add(letra);
    btn.classList.add('correta');
    renderPalavra();
    verificarVitoria();
  } else {
    erros++;
    btn.classList.add('errada');
    document.getElementById('contErros').textContent = erros;
    document.getElementById(PARTES[erros - 1]).classList.remove('hidden');
    if (erros >= 6) encerrar(false);
  }
}

function verificarVitoria() {
  const ganhou = [...palavra].every(c => c === ' ' || acertos.has(semAcento(c)));
  if (ganhou) encerrar(true);
}

function encerrar(ganhou) {
  fimDeJogo = true;
  const status = document.getElementById('status');
  if (ganhou) {
    status.textContent = '🎉 Parabéns, você acertou!';
    status.className = 'status ganhou';
  } else {
    status.textContent = `💀 A palavra era: ${palavra}`;
    status.className = 'status perdeu';
    renderPalavraCompleta();
  }
  document.querySelectorAll('.tecla:not(:disabled)').forEach(b => b.disabled = true);
}

function renderPalavraCompleta() {
  const slots = document.getElementById('palavra').children;
  let i = 0;
  for (const c of palavra) {
    if (c !== ' ') {
      slots[i].textContent = c;
      if (!acertos.has(semAcento(c))) slots[i].style.color = '#e94560';
    }
    i++;
  }
}

novoJogo();
