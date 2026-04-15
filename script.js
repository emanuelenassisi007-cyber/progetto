let dati = JSON.parse(localStorage.getItem('dati')) || [];

function salva() {
  const cal = document.getElementById('calorie').value;
  const peso = document.getElementById('peso').value;
  const obj = document.getElementById('obiettivo').value;

  const oggi = new Date().toLocaleDateString();

  dati.push({ data: oggi, calorie: cal, peso: peso });

  localStorage.setItem('dati', JSON.stringify(dati));
  localStorage.setItem('obiettivo', obj);

  aggiorna();
}

function aggiorna() {
  const storicoDiv = document.getElementById('storico');
  storicoDiv.innerHTML = "";

  dati.forEach(d => {
    storicoDiv.innerHTML += `<div class="box">${d.data} - ${d.peso}kg - ${d.calorie} kcal</div>`;
  });

  const obj = localStorage.getItem('obiettivo') || 0;
  const ultimoPeso = dati.length ? dati[dati.length - 1].peso : 0;

  document.getElementById('diff').innerText = (ultimoPeso - obj) > 0 ? (ultimoPeso - obj) : 0;

  disegnaGrafico();
}

function calcolaCalorie() {
  const peso = document.getElementById('peso').value;
  const altezza = document.getElementById('altezza').value;
  const eta = document.getElementById('eta').value;
  const sesso = document.getElementById('sesso').value;

  let bmr;

  if (sesso === "uomo") {
    bmr = 10*peso + 6.25*altezza - 5*eta + 5;
  } else {
    bmr = 10*peso + 6.25*altezza - 5*eta - 161;
  }

  document.getElementById('calCons').innerText = Math.round(bmr);
}

function disegnaGrafico() {
  const canvas = document.getElementById("grafico");
  const ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (dati.length < 2) return;

  const pesi = dati.map(d => parseFloat(d.peso));

  const max = Math.max(...pesi);
  const min = Math.min(...pesi);

  const stepX = canvas.width / (pesi.length - 1);

  ctx.beginPath();

  pesi.forEach((p, i) => {
    const x = i * stepX;
    const y = canvas.height - ((p - min) / (max - min)) * canvas.height;

    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });

  ctx.stroke();
}

aggiorna();
