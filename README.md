# Segurança Digital para a Comunidade — Página do Quiz

Página educativa complementar ao panfleto físico do Projeto de Extensão Curricular
**"Segurança Digital para a Comunidade: Prevenção contra Golpes e Ameaças na Internet"**
(Análise e Desenvolvimento de Sistemas — UNISANTA).

Não usa banco de dados, login ou backend. Todo o quiz roda no navegador.

## Estrutura de pastas

```
seguranca-digital/
├── index.html        → estrutura da página (hero, quiz, resultado, seções finais)
├── css/
│   └── style.css      → todo o visual (cores, tipografia, layout responsivo)
├── js/
│   └── script.js       → dados das perguntas + lógica do quiz
└── README.md
```

## Como rodar localmente

Não é necessário instalar nada. Duas opções:

**Opção 1 — abrir direto**
Dê duplo clique em `index.html` e ele abrirá no navegador.

**Opção 2 — servidor local (recomendado, evita bloqueios do navegador)**
Com Python instalado, dentro da pasta `seguranca-digital`:

```bash
python3 -m http.server 8000
```

Depois acesse `http://localhost:8000` no navegador.

## Como publicar (hospedagem estática gratuita)

**GitHub Pages**
1. Crie um repositório no GitHub e envie o conteúdo desta pasta.
2. Em *Settings → Pages*, selecione a branch principal e a pasta raiz (`/`).
3. O GitHub fornecerá um link público — é esse link que deve virar o QR Code do panfleto.

**Netlify**
1. Acesse [app.netlify.com](https://app.netlify.com) e crie uma conta gratuita.
2. Arraste a pasta `seguranca-digital` inteira para a área de upload ("Deploy manually").
3. O Netlify gera um link público automaticamente.

Em ambos os casos, gere o QR Code apontando para o link final (ex.: um gerador gratuito como [qrcode-monkey.com](https://www.qr-code-generator.com/)).

## Como editar os textos, perguntas e respostas

Tudo o que aparece no quiz está em **`js/script.js`**, no início do arquivo, dentro do array `QUESTIONS`.

Cada pergunta é um objeto assim:

```js
{
  title: "🚨 Situação 1 — Alerta do banco",   // título da situação
  message: "Texto da mensagem simulada",       // aparece dentro da "bolha" de mensagem
  fakeLink: "CANCELAR COMPRA",                  // opcional — texto do botão/link falso
  extraText: "Texto complementar",              // opcional — usado só na pergunta 5
  question: "O que você faria?",
  options: [
    { letter: "A", text: "..." },
    { letter: "B", text: "..." },
    { letter: "C", text: "..." }
  ],
  correct: 1,          // índice da alternativa correta (0 = A, 1 = B, 2 = C)
  explanation: "Texto explicativo mostrado após a resposta."
}
```

Para trocar uma pergunta, edite os campos desse objeto. Para adicionar ou remover
perguntas, adicione ou remova objetos do array — a barra de progresso e a numeração
("Pergunta X de 5") se ajustam automaticamente à quantidade de itens no array.

Textos fora do quiz (hero, seções de sinais de alerta, regra de ouro, rodapé) ficam
diretamente em **`index.html`**, no HTML de cada seção.

## Enviar resultados para o Google Forms

Na tela de resultado, a pessoa pode digitar o nome e enviar — junto com a
pontuação e a resposta escolhida em cada uma das 5 situações — direto para um
Google Forms, sem precisar de servidor/backend.

### 1. Crie o formulário

Em [forms.google.com](https://forms.google.com), crie **7 perguntas**, todas
do tipo **"Resposta curta"**, nesta ordem:

1. Nome completo
2. Pontuação
3. Resposta - Situação 1 (Alerta do banco)
4. Resposta - Situação 2 (Pedido de PIX)
5. Resposta - Situação 3 (Prêmio inesperado)
6. Resposta - Situação 4 (Código de autenticação)
7. Resposta - Situação 5 (Link inesperado)

### 2. Pegue os "entry IDs"

No formulário: **⋮ → Obter link pré-preenchido** → preencha qualquer texto de
teste em cada campo → **Obter link**. O link gerado terá algo como:

```
https://docs.google.com/forms/d/e/1FAIpQLSc.../viewform?usp=pp_url&entry.111111111=teste&entry.222222222=teste...
```

Cada `entry.XXXXXXXXX=` é o ID de um campo, na mesma ordem das perguntas.

### 3. Configure o site

Abra **`js/script.js`** e edite o objeto `GOOGLE_FORM_CONFIG` no topo do
arquivo:

```js
const GOOGLE_FORM_CONFIG = {
  // troque "/viewform" por "/formResponse"
  actionUrl: "https://docs.google.com/forms/d/e/SEU_ID_AQUI/formResponse",
  entryIds: {
    nome: "entry.111111111",
    pontuacao: "entry.222222222",
    resposta1: "entry.333333333",
    resposta2: "entry.444444444",
    resposta3: "entry.555555555",
    resposta4: "entry.666666666",
    resposta5: "entry.777777777"
  }
};
```

### 4. Teste com o formulário real

Como o Google Forms não libera CORS, o site **sempre mostra "Enviado ✔"**
depois de clicar em enviar — mesmo que o `entry.ID` esteja errado — porque o
navegador não consegue ler a resposta do Google por questões de segurança.
Por isso, depois de configurar, **preencha o teste você mesmo e confira se a
resposta realmente chegou na planilha de respostas do seu Google Forms**.

## E-book para download

Na tela de resultado, logo após o formulário de nome, há um botão para baixar
o **"Guia Prático de Segurança Digital"** em PDF.

- O arquivo fica em `assets/guia-seguranca-digital.pdf`.
- Foi gerado a partir do Word (`Guia_Pratico_de_Seguranca_Digital_FINAL.docx`)
  fornecido, convertido para PDF (melhor leitura no celular, já que a página
  é acessada principalmente por QR Code).
- Para trocar o conteúdo do e-book, basta substituir esse arquivo por um novo
  PDF com o **mesmo nome** (`guia-seguranca-digital.pdf`) — não precisa mexer
  em nenhum código.
- Se quiser trocar só o texto do botão ou a descrição, edite o bloco
  `<div class="ebook-box">` em `index.html`.

## Notas sobre o conteúdo

Por orientação do projeto, a página não inclui estatísticas, pesquisas ou dados
numéricos que não tenham sido fornecidos, nem referências bibliográficas — o
relatório acadêmico é elaborado à parte, separadamente desta página.
