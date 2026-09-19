/* ============================================================
   CONFIGURAÇÃO DO GOOGLE FORMS
   Substitua os valores abaixo pelos do SEU formulário.
   Veja o README (seção "Enviar resultados para o Google Forms")
   para o passo a passo completo de como obter esses valores.
   ============================================================ */
const GOOGLE_FORM_CONFIG = {
  actionUrl: "https://docs.google.com/forms/d/e/1FAIpQLSecYofi4GQ0gnuyTjGYnG4zKI8B3VMJGpe_IWYmOyXBBQMBfQ/formResponse",

  entryIds: {
    nome: "entry.1043327687",
    pontuacao: "entry.612356937",
    resposta1: "entry.714269983",
    resposta2: "entry.1861532963",
    resposta3: "entry.1752974373",
    resposta4: "entry.1526196511",
    resposta5: "entry.226261519"
  }
};

/* ============================================================
   DADOS DO QUIZ
   Para editar perguntas, respostas ou explicações, altere apenas
   este array. Veja o README para instruções detalhadas.
   ============================================================ */
const QUESTIONS = [
  {
    title: "🚨 Situação 1 — Alerta do banco",
    message: "ATENÇÃO!\n\nIdentificamos uma compra de R$ 2.847,00 em seu cartão.\n\nPara cancelar imediatamente, clique no link abaixo.",
    fakeLink: "CANCELAR COMPRA",
    question: "O que você faria?",
    options: [
      { letter: "A", text: "Clicaria no link imediatamente." },
      { letter: "B", text: "Procuraria o banco pelo aplicativo ou canal oficial." },
      { letter: "C", text: "Responderia à mensagem perguntando se é verdadeira." }
    ],
    correct: 1,
    explanation: "Mensagens que utilizam urgência e medo podem tentar fazer você agir sem verificar a informação. Se receber um alerta desse tipo, não utilize o link da mensagem. Acesse o aplicativo ou canal oficial do banco por conta própria."
  },
  {
    title: "💰 Situação 2 — Pedido de PIX",
    message: "Você recebe uma mensagem de alguém conhecido:\n\n\"Oi! Troquei de número. Preciso pagar uma conta urgente. Você consegue fazer um PIX de R$ 500 para mim?\"",
    question: "O que você faria?",
    options: [
      { letter: "A", text: "Faria o PIX porque reconheci a foto da pessoa." },
      { letter: "B", text: "Pediria o CPF e faria o PIX." },
      { letter: "C", text: "Confirmaria a identidade da pessoa por outro meio antes de pagar." }
    ],
    correct: 2,
    explanation: "Uma foto ou nome no WhatsApp não é suficiente para confirmar a identidade de alguém. Antes de enviar dinheiro, confirme diretamente com a pessoa por outro canal."
  },
  {
    title: "🎁 Situação 3 — Prêmio inesperado",
    message: "PARABÉNS!\n\nVocê foi selecionado para receber um prêmio de R$ 5.000.\n\nPara liberar o valor, pague uma taxa de R$ 49,90 através do link abaixo.",
    question: "O que você faria?",
    options: [
      { letter: "A", text: "Pagaria a taxa." },
      { letter: "B", text: "Procuraria informações sobre a promoção nos canais oficiais." },
      { letter: "C", text: "Clicaria no link para descobrir mais." }
    ],
    correct: 1,
    explanation: "Promessas de prêmios inesperados associadas a pagamentos ou links devem ser verificadas com cuidado. Não pague ou forneça informações antes de confirmar a legitimidade da oferta."
  },
  {
    title: "🔐 Situação 4 — Código de autenticação",
    message: "Alguém entra em contato dizendo ser funcionário de uma empresa:\n\n\"Vou enviar um código para confirmar seu cadastro. Me informe o número que acabou de chegar no seu celular.\"",
    question: "O que você faria?",
    options: [
      { letter: "A", text: "Passaria o código." },
      { letter: "B", text: "Não compartilharia o código." },
      { letter: "C", text: "Passaria apenas parte do código." }
    ],
    correct: 1,
    explanation: "Códigos de autenticação são pessoais. Nunca compartilhe códigos recebidos por SMS, aplicativos ou outros meios, mesmo que alguém diga ser funcionário de uma empresa."
  },
  {
    title: "🔗 Situação 5 — Link inesperado",
    message: "CONSULTE AGORA SE VOCÊ TEM DIREITO AO BENEFÍCIO!\n\nÚltimo dia para cadastro.\n\nClique aqui para consultar.",
    extraText: "Você não estava esperando nenhuma informação sobre esse benefício.",
    question: "O que você faria?",
    options: [
      { letter: "A", text: "Clicaria para descobrir." },
      { letter: "B", text: "Encaminharia para familiares." },
      { letter: "C", text: "Procuraria informações nos canais oficiais." }
    ],
    correct: 2,
    explanation: "Mensagens inesperadas com urgência, benefícios ou promessas podem ser usadas para induzir a vítima a acessar páginas fraudulentas. Procure informações diretamente nos canais oficiais."
  }
];

/* ============================================================
   ESTADO
   ============================================================ */
let currentIndex = 0;
let score = 0;
let answered = false;
let userAnswers = []; // resposta escolhida em cada pergunta, na ordem

/* ============================================================
   ELEMENTOS
   ============================================================ */
const heroEl = document.getElementById("hero");
const quizEl = document.getElementById("quiz");
const resultEl = document.getElementById("result");
const startBtn = document.getElementById("start-btn");
const restartBtn = document.getElementById("restart-btn");
const questionContainer = document.getElementById("question-container");
const progressFill = document.getElementById("progress-fill");
const progressLabel = document.getElementById("progress-label");
const progressBar = document.getElementById("progress-bar");
const scoreNumber = document.getElementById("score-number");
const resultMessage = document.getElementById("result-message");
const nameInput = document.getElementById("user-name");
const submitNameBtn = document.getElementById("submit-name-btn");
const captureConfirm = document.getElementById("capture-confirm");
const captureError = document.getElementById("capture-error");

/* ============================================================
   NAVEGAÇÃO ENTRE TELAS
   ============================================================ */
startBtn.addEventListener("click", () => {
  heroEl.hidden = true;
  quizEl.hidden = false;
  currentIndex = 0;
  score = 0;
  userAnswers = [];
  renderQuestion();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

restartBtn.addEventListener("click", () => {
  resultEl.hidden = true;
  quizEl.hidden = false;
  currentIndex = 0;
  score = 0;
  userAnswers = [];
  resetCaptureForm();
  renderQuestion();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

/* ============================================================
   RENDERIZAÇÃO DA PERGUNTA
   ============================================================ */
function renderQuestion() {
  answered = false;
  const q = QUESTIONS[currentIndex];

  updateProgress();

  const linkHtml = q.fakeLink
    ? `<span class="fake-link">[${q.fakeLink}]</span>`
    : "";

  const extraHtml = q.extraText
    ? `<p class="q-extra-text">${q.extraText}</p>`
    : "";

  const optionsHtml = q.options
    .map(
      (opt, i) => `
      <li>
        <button class="option-btn" data-index="${i}">
          <span class="option-letter">${opt.letter}</span>
          <span>${opt.text}</span>
        </button>
      </li>`
    )
    .join("");

  questionContainer.innerHTML = `
    <div class="question-card">
      <p class="q-situation-label">${q.title}</p>
      <div class="message-bubble">${escapeHtml(q.message)}${linkHtml}</div>
      ${extraHtml}
      <p class="q-question">${q.question}</p>
      <ul class="options-list">${optionsHtml}</ul>
      <div id="feedback-slot"></div>
    </div>
  `;

  questionContainer.querySelectorAll(".option-btn").forEach((btn) => {
    btn.addEventListener("click", onOptionClick);
  });
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

/* ============================================================
   RESPOSTA SELECIONADA
   ============================================================ */
function onOptionClick(e) {
  if (answered) return;
  answered = true;

  const chosenIndex = parseInt(e.currentTarget.dataset.index, 10);
  const q = QUESTIONS[currentIndex];
  const isCorrect = chosenIndex === q.correct;
  const chosenOption = q.options[chosenIndex];

  if (isCorrect) score++;

  userAnswers[currentIndex] = {
    situacao: q.title,
    resposta: `${chosenOption.letter}) ${chosenOption.text}`,
    correta: isCorrect
  };

  const buttons = questionContainer.querySelectorAll(".option-btn");
  buttons.forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.correct) {
      btn.classList.add("is-correct");
    } else if (i === chosenIndex) {
      btn.classList.add("is-wrong-chosen");
    }
  });

  const feedbackSlot = document.getElementById("feedback-slot");
  feedbackSlot.innerHTML = `
    <div class="feedback-box ${isCorrect ? "correct" : "incorrect"}">
      <p class="feedback-title">${isCorrect ? "✔ Resposta correta!" : "Vamos entender essa situação"}</p>
      <p class="feedback-explanation">${q.explanation}</p>
    </div>
    <button class="btn btn-primary next-btn" id="next-btn">
      ${currentIndex < QUESTIONS.length - 1 ? "Próxima pergunta" : "Ver resultado"}
    </button>
  `;

  document.getElementById("next-btn").addEventListener("click", onNext);
  document.getElementById("next-btn").scrollIntoView({ behavior: "smooth", block: "center" });
}

/* ============================================================
   AVANÇAR
   ============================================================ */
function onNext() {
  if (currentIndex < QUESTIONS.length - 1) {
    currentIndex++;
    renderQuestion();
    window.scrollTo({ top: 0, behavior: "smooth" });
  } else {
    showResult();
  }
}

/* ============================================================
   BARRA DE PROGRESSO
   ============================================================ */
function updateProgress() {
  const total = QUESTIONS.length;
  const current = currentIndex + 1;
  const percent = (currentIndex / total) * 100;
  progressFill.style.width = `${percent}%`;
  progressLabel.textContent = `Pergunta ${current} de ${total}`;
  progressBar.setAttribute("aria-valuenow", currentIndex);
}

/* ============================================================
   RESULTADO FINAL
   ============================================================ */
function showResult() {
  progressFill.style.width = "100%";
  quizEl.hidden = true;
  resultEl.hidden = false;
  scoreNumber.textContent = score;

  let message;
  if (score <= 2) {
    message =
      "Você pode aprender mais sobre os sinais de golpes digitais. Não se preocupe: o objetivo deste teste é justamente ajudar você a reconhecer situações suspeitas.";
  } else if (score <= 4) {
    message =
      "Bom trabalho! Você já reconhece vários sinais de alerta. Continue mantendo atenção antes de clicar, pagar ou compartilhar informações.";
  } else {
    message =
      "Parabéns! Você demonstrou reconhecer os principais sinais apresentados no teste. Continue atento e compartilhe esse conhecimento.";
  }
  message +=
    " Lembre-se: este teste é educativo e não significa que você esteja protegido contra todos os tipos de golpe.";

  resultMessage.textContent = message;
  resetCaptureForm();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ============================================================
   ENVIO DO NOME PARA O GOOGLE FORMS
   ============================================================ */
function resetCaptureForm() {
  nameInput.value = "";
  nameInput.disabled = false;
  submitNameBtn.disabled = false;
  submitNameBtn.textContent = "Enviar";
  captureConfirm.hidden = true;
  captureError.hidden = true;
}

submitNameBtn.addEventListener("click", async () => {
  const name = nameInput.value.trim();

  if (!name) {
    captureError.textContent = "Digite seu nome antes de enviar.";
    captureError.hidden = false;
    nameInput.focus();
    return;
  }

  captureError.hidden = true;
  submitNameBtn.disabled = true;
  nameInput.disabled = true;
  submitNameBtn.textContent = "Enviando...";

  const ids = GOOGLE_FORM_CONFIG.entryIds;
  const params = new URLSearchParams();
  params.append(ids.nome, name);
  params.append(ids.pontuacao, `${score}/5`);

  QUESTIONS.forEach((q, i) => {
    const key = `resposta${i + 1}`;
    const respostaTexto = userAnswers[i] ? userAnswers[i].resposta : "Não respondida";
    if (ids[key]) params.append(ids[key], respostaTexto);
  });

  try {
    // "no-cors" é necessário porque o Google Forms não libera CORS.
    // A resposta fica "opaca" (não dá pra ler), mas o envio funciona normalmente.
    await fetch(GOOGLE_FORM_CONFIG.actionUrl, {
      method: "POST",
      mode: "no-cors",
      body: params
    });

    captureConfirm.hidden = false;
    submitNameBtn.textContent = "Enviado ✔";
  } catch (err) {
    submitNameBtn.disabled = false;
    nameInput.disabled = false;
    submitNameBtn.textContent = "Enviar";
    captureError.textContent = "Não foi possível enviar agora. Verifique sua internet e tente de novo.";
    captureError.hidden = false;
  }
});
