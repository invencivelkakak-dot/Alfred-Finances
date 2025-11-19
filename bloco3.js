// ======================= MENU LATERAL =======================
const abas = document.querySelectorAll(".sidebar li");
const paineis = document.querySelectorAll(".painel");

abas.forEach((aba) => {
  aba.addEventListener("click", () => {
    abas.forEach((a) => a.classList.remove("active"));
    aba.classList.add("active");

    const alvo = aba.dataset.section;
    paineis.forEach((p) => p.classList.remove("ativo"));
    document.getElementById(alvo).classList.add("ativo");
  });
});

// ======================= SIMULADOR =======================
const btnCalcular = document.getElementById("btnCalcular");
const resultado = document.getElementById("resultado");
let chartJuros;

btnCalcular.addEventListener("click", () => {
  const P = parseFloat(document.getElementById("valorInicial").value);
  const i = parseFloat(document.getElementById("taxa").value) / 100;
  const n = parseInt(document.getElementById("prazo").value);

  if (isNaN(P) || isNaN(i) || isNaN(n)) {
    resultado.innerHTML =
      "<p style='color:red'>Preencha todos os campos corretamente.</p>";
    return;
  }

  const simples = [],
    compostos = [],
    flutuacao = [];
  let valorAtual = P;

  for (let mes = 1; mes <= n; mes++) {
    simples.push(P * (1 + i * mes));
    compostos.push(P * Math.pow(1 + i, mes));
    const variacao = (Math.random() * 4 - 2) / 100;
    valorAtual *= 1 + i + variacao;
    flutuacao.push(valorAtual);
  }

  const finalComposto = compostos[compostos.length - 1];
  const jurosGanhos = finalComposto - P;

  resultado.innerHTML = `
    <p><strong>💵 Valor Investido:</strong> R$ ${P.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
    })}</p>
    <p><strong>💸 Juros Ganhos:</strong> R$ ${jurosGanhos.toLocaleString(
      "pt-BR",
      { minimumFractionDigits: 2 }
    )}</p>
    <p><strong>📈 Montante Final:</strong> R$ ${finalComposto.toLocaleString(
      "pt-BR",
      { minimumFractionDigits: 2 }
    )}</p>
  `;

  if (chartJuros) chartJuros.destroy();
  const ctx = document.getElementById("graficoJuros");
  chartJuros = new Chart(ctx, {
    type: "line",
    data: {
      labels: Array.from({ length: n }, (_, k) => `${k + 1}º mês`),
      datasets: [
        {
          label: "Juros Simples",
          data: simples,
          borderColor: "#00a550",
          backgroundColor: "rgba(0,165,80,0.1)",
          fill: true,
          tension: 0.3,
        },
        {
          label: "Juros Compostos",
          data: compostos,
          borderColor: "#ffcc00",
          backgroundColor: "rgba(255,204,0,0.15)",
          fill: true,
          tension: 0.3,
        },
        {
          label: "Flutuação",
          data: flutuacao,
          borderColor: "#ff0077",
          backgroundColor: "rgba(255,0,120,0.1)",
          fill: true,
          tension: 0.3,
        },
      ],
    },
    options: {
      plugins: { legend: { labels: { color: "#333" } } },
      scales: { x: { ticks: { color: "#555" } }, y: { ticks: { color: "#555" } } },
    },
  });
});

// ======================= RANKING =======================
const rankingContainer = document.getElementById("rankingContainer");
const tabs = document.querySelectorAll(".tab");
const ctxAtivo = document.getElementById("graficoAtivo");
let chartAtivo;
let tipoAtivo = "Ação";

const dados = {
  Ação: ["PETR4", "VALE3", "ITUB4", "BBDC4", "ABEV3", "BBAS3", "MGLU3", "LREN3", "B3SA3", "SUZB3"],
  FII: ["HGLG11", "MXRF11", "KNRI11", "VISC11", "BTLG11", "RBRF11", "XPML11", "HGBS11", "HSML11", "RECT11"],
  Cripto: ["BTC", "ETH", "ADA", "SOL", "XRP", "DOGE", "BNB", "AVAX", "DOT", "MATIC"],
};

const historico = {};
Object.keys(dados).forEach((tipo) => {
  dados[tipo].forEach((nome) => {
    historico[nome] = Array.from({ length: 20 }, () => 100 + Math.random() * 20);
  });
});

function gerarRanking(tipo) {
  rankingContainer.innerHTML = "";
  dados[tipo].forEach((nome) => {
    const lista = historico[nome];
    const variacao = ((lista[lista.length - 1] - lista[0]) / lista[0]) * 100;
    const cor = variacao >= 0 ? "var(--verde)" : "red";
    rankingContainer.innerHTML += `
      <div class="card" onclick="mostrarGrafico('${nome}')">
        <div class="categoria">${tipo}</div>
        <h3>${nome}</h3>
        <p>💵 R$ ${lista[lista.length - 1].toFixed(2)}</p>
        <p style="color:${cor};font-weight:600">${variacao.toFixed(2)}%</p>
      </div>
    `;
  });
}
function mostrarGrafico(nome) {
  const dadosAtivo = historico[nome];
  if (chartAtivo) chartAtivo.destroy();
  chartAtivo = new Chart(ctxAtivo, {
    type: "line",
    data: {
      labels: Array.from({ length: dadosAtivo.length }, (_, i) => `T${i + 1}`),
      datasets: [
        {
          label: `${nome} — Histórico`,
          data: dadosAtivo,
          borderColor: "#00a550",
          backgroundColor: "rgba(0,165,80,0.15)",
          tension: 0.3,
          fill: true,
        },
      ],
    },
    options: {
      plugins: { legend: { labels: { color: "#333" } } },
      scales: { x: { ticks: { color: "#555" } }, y: { ticks: { color: "#555" } } },
    },
  });
}
function atualizarPrecos() {
  Object.values(historico).forEach((lista) => {
    const ultima = lista[lista.length - 1];
    const nova = ultima * (1 + (Math.random() * 0.04 - 0.02));
    lista.push(nova);
    if (lista.length > 20) lista.shift();
  });
  gerarRanking(tipoAtivo);
}
gerarRanking(tipoAtivo);
setInterval(atualizarPrecos, 5000);
tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
    tipoAtivo = tab.dataset.tipo;
    gerarRanking(tipoAtivo);
    if (chartAtivo) chartAtivo.destroy();
  });
});

// ======================= PERFIL DE INVESTIDOR =======================
const perguntas = [
  {
    texto: "1. Qual seu principal objetivo ao investir?",
    opcoes: [
      { txt: "Proteger meu dinheiro da inflação", valor: 1 },
      { txt: "Ganhar um pouco mais que a poupança", valor: 2 },
      { txt: "Aumentar o patrimônio gradualmente", valor: 3 },
      { txt: "Assumir riscos para altos ganhos", valor: 4 },
    ],
  },
  {
    texto: "2. Por quanto tempo pretende manter seus investimentos?",
    opcoes: [
      { txt: "Menos de 1 ano", valor: 1 },
      { txt: "De 1 a 3 anos", valor: 2 },
      { txt: "De 3 a 5 anos", valor: 3 },
      { txt: "Mais de 5 anos", valor: 4 },
    ],
  },
  {
    texto: "3. O que faria se seu investimento caísse 15% em um mês?",
    opcoes: [
      { txt: "Venderia tudo imediatamente", valor: 1 },
      { txt: "Esperaria recuperar", valor: 2 },
      { txt: "Compraria mais por estar barato", valor: 4 },
      { txt: "Rebalancearia aos poucos", valor: 3 },
    ],
  },
  {
    texto: "4. Qual sua experiência com investimentos?",
    opcoes: [
      { txt: "Nenhuma", valor: 1 },
      { txt: "Já investi em renda fixa", valor: 2 },
      { txt: "Já investi em ações e fundos", valor: 3 },
      { txt: "Invisto há anos em bolsa e criptos", valor: 4 },
    ],
  },
  {
    texto: "5. Quanto do seu patrimônio você arriscaria?",
    opcoes: [
      { txt: "Nenhum valor", valor: 1 },
      { txt: "Até 10%", valor: 2 },
      { txt: "Até 30%", valor: 3 },
      { txt: "Mais de 50%", valor: 4 },
    ],
  },
  {
    texto: "6. Como reage a oportunidades de alto retorno e risco?",
    opcoes: [
      { txt: "Evito completamente", valor: 1 },
      { txt: "Avalio com cautela", valor: 2 },
      { txt: "Invisto parcialmente", valor: 3 },
      { txt: "Aproveito sem medo", valor: 4 },
    ],
  },
  {
    texto: "7. Quanto da sua renda mensal consegue investir?",
    opcoes: [
      { txt: "Menos de 5%", valor: 1 },
      { txt: "De 5% a 10%", valor: 2 },
      { txt: "De 10% a 20%", valor: 3 },
      { txt: "Mais de 20%", valor: 4 },
    ],
  },
  {
    texto: "8. Qual sua principal fonte de renda?",
    opcoes: [
      { txt: "Apenas salário fixo", valor: 1 },
      { txt: "Salário e bônus eventuais", valor: 2 },
      { txt: "Negócios próprios", valor: 3 },
      { txt: "Investimentos e empreendimentos", valor: 4 },
    ],
  },
  {
    texto: "9. Você acompanha notícias financeiras?",
    opcoes: [
      { txt: "Nunca", valor: 1 },
      { txt: "Raramente", valor: 2 },
      { txt: "Frequentemente", valor: 3 },
      { txt: "Diariamente", valor: 4 },
    ],
  },
  {
    texto: "10. Como se sentiria ao ver quedas temporárias?",
    opcoes: [
      { txt: "Muito desconfortável", valor: 1 },
      { txt: "Um pouco preocupado", valor: 2 },
      { txt: "Tranquilo", valor: 3 },
      { txt: "Animado para comprar mais", valor: 4 },
    ],
  },
  {
    texto: "11. Que tipo de investimento prefere?",
    opcoes: [
      { txt: "Tesouro Direto / Poupança", valor: 1 },
      { txt: "Fundos conservadores", valor: 2 },
      { txt: "Fundos balanceados", valor: 3 },
      { txt: "Ações e criptos", valor: 4 },
    ],
  },
  {
    texto: "12. Liquidez é importante pra você?",
    opcoes: [
      { txt: "Preciso sacar rápido", valor: 1 },
      { txt: "Prefiro acesso fácil", valor: 2 },
      { txt: "Posso esperar um pouco", valor: 3 },
      { txt: "Posso deixar aplicado por anos", valor: 4 },
    ],
  },
  {
    texto: "13. Você já investe em renda variável?",
    opcoes: [
      { txt: "Não", valor: 1 },
      { txt: "Pouco", valor: 2 },
      { txt: "Regularmente", valor: 3 },
      { txt: "Sim, com foco principal", valor: 4 },
    ],
  },
  {
    texto: "14. Você se considera racional ou emocional nas finanças?",
    opcoes: [
      { txt: "Totalmente emocional", valor: 1 },
      { txt: "Mais emocional que racional", valor: 2 },
      { txt: "Equilibrado", valor: 3 },
      { txt: "Frio e analítico", valor: 4 },
    ],
  },
  {
    texto: "15. Como descreveria seu conhecimento financeiro?",
    opcoes: [
      { txt: "Muito baixo", valor: 1 },
      { txt: "Básico", valor: 2 },
      { txt: "Bom", valor: 3 },
      { txt: "Avançado", valor: 4 },
    ],
  },
];

const divPerguntas = document.getElementById("questionario");
const btnResultado = document.getElementById("btnResultado");
const resultadoPerfil = document.getElementById("resultadoPerfil");
let respostas = {};

perguntas.forEach((p, i) => {
  const bloco = document.createElement("div");
  bloco.innerHTML = `<p>${p.texto}</p>`;
  p.opcoes.forEach((op, j) => {
    const opt = document.createElement("div");
    opt.classList.add("opcao");
    opt.innerText = op.txt;
    opt.addEventListener("click", () => {
      bloco.querySelectorAll(".opcao").forEach((o) => o.classList.remove("selecionada"));
      opt.classList.add("selecionada");
      respostas[i] = op.valor;
    });
    bloco.appendChild(opt);
  });
  divPerguntas.appendChild(bloco);
});

let graficoPerfil;
btnResultado.addEventListener("click", () => {
  const total = Object.values(respostas).reduce((a, b) => a + b, 0);
  const media = total / perguntas.length;
  let perfil = "",
    texto = "",
    dist = {};

  if (media <= 1.8) {
    perfil = "Conservador";
    texto = "Você prioriza segurança e previsibilidade nos investimentos.";
    dist = { "Renda Fixa": 70, FIIs: 20, Ações: 10 };
  } else if (media <= 2.7) {
    perfil = "Moderado";
    texto = "Busca equilíbrio entre segurança e rentabilidade.";
    dist = { "Renda Fixa": 40, FIIs: 35, Ações: 25 };
  } else {
    perfil = "Arrojado";
    texto = "Aceita riscos para buscar maior valorização.";
    dist = { "Renda Fixa": 20, FIIs: 30, Ações: 50 };
  }

  resultadoPerfil.innerHTML = `
    <h3>Seu perfil: <span style="color:var(--verde)">${perfil}</span></h3>
    <p>${texto}</p>
  `;

  if (graficoPerfil) graficoPerfil.destroy();
  const ctx = document.getElementById("graficoPerfil");
  graficoPerfil = new Chart(ctx, {
    type: "pie",
    data: {
      labels: Object.keys(dist),
      datasets: [
        {
          data: Object.values(dist),
          backgroundColor: ["#00a550", "#ffcc00", "#0077ff"],
        },
      ],
    },
    options: { plugins: { legend: { labels: { color: "#333" } } } },
  });
});

// ======================= PANORAMA =======================
const ctxPanorama = document.getElementById("graficoPanorama");
const graficoPanorama = new Chart(ctxPanorama, {
  type: "bar",
  data: {
    labels: ["Ações", "FIIs", "Criptos"],
    datasets: [
      {
        label: "Desempenho Médio (%)",
        data: [12, 8, 20],
        backgroundColor: ["#00a550", "#ffcc00", "#ff0077"],
      },
    ],
  },
  options: {
    plugins: { legend: { labels: { color: "#333" } } },
    scales: { x: { ticks: { color: "#555" } }, y: { ticks: { color: "#555" } } },
  },
});
