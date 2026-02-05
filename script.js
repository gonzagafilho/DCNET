// ===============================
// CONFIG GLOBAL
// ===============================
const WHATSAPP_OFICIAL_SITE = "5561991374910"; // DDD + número, sem espaços

function onlyDigits(str) {
  return (str || "").replace(/\D/g, "");
}

// ===============================
// PADRONIZA LINKS DE WHATSAPP
// (usa data-wa-link no HTML)
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-wa-link]").forEach((el) => {
    const text =
      el.getAttribute("data-wa-text") ||
      "Olá! Vim pelo site da DCNET Infinity.";

    el.setAttribute(
      "href",
      `https://wa.me/${WHATSAPP_OFICIAL_SITE}?text=${encodeURIComponent(text)}`
    );
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener");
  });
});

// ===============================
// MENU MOBILE + ANO
// ===============================
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");
const yearSpan = document.getElementById("year");

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.classList.toggle("is-open");
    nav.classList.toggle("is-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle.classList.remove("is-open");
      nav.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// ===============================
// FORMULÁRIO CONTATO -> WHATSAPP
// (usa #whatsappForm e campos por name)
// ===============================
function enviarWhatsApp() {
  const form = document.getElementById("whatsappForm");
  if (!form) {
    alert("Formulário não encontrado (whatsappForm).");
    return;
  }

  const nome = form.querySelector('input[name="name"]')?.value?.trim() || "";
  const whatsapp =
    form.querySelector('input[name="whatsapp"]')?.value?.trim() || "";
  const email = form.querySelector('input[name="email"]')?.value?.trim() || "";
  const plano = form.querySelector('select[name="Plano"]')?.value?.trim() || "";
  const mensagem =
    form.querySelector('textarea[name="message"]')?.value?.trim() || "";

  if (!nome || !whatsapp || !email) {
    alert("Por favor, preencha nome, WhatsApp e e-mail.");
    return;
  }

  const texto = [
    "📌 *Novo contato via site - DCNET Infinity*",
    `👤 Nome: ${nome}`,
    `📱 WhatsApp: ${onlyDigits(whatsapp)}`,
    `📧 E-mail: ${email}`,
    `📦 Plano: ${plano || "Não informado"}`,
    mensagem ? `📝 Mensagem: ${mensagem}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  window.open(
    `https://wa.me/${WHATSAPP_OFICIAL_SITE}?text=${encodeURIComponent(texto)}`,
    "_blank"
  );
}

// ===============================
// CHATBOT WIDGET (DCChat)
// ===============================
(function () {
  const API_URL = "https://chatbot.dcinfinity.net.br/api/chat";

  const fab = document.getElementById("dcchatFab");
  const dock = document.getElementById("dcchatDock");
  const close = document.getElementById("dcchatClose");
  const body = document.getElementById("dcchatBody");
  const form = document.getElementById("dcchatForm");
  const input = document.getElementById("dcchatInput");
  const dot = document.getElementById("dcchatDot");

  if (!fab || !dock || !close || !body || !form || !input) return;

  function addMsg(text, who) {
    const div = document.createElement("div");
    div.className =
      "dcchat__msg " +
      (who === "me" ? "dcchat__msg--me" : "dcchat__msg--bot");
    div.textContent = text;
    body.appendChild(div);
    body.scrollTop = body.scrollHeight;
  }

  function setOpen(isOpen) {
    dock.classList.toggle("is-open", isOpen);
    dock.setAttribute("aria-hidden", String(!isOpen));

    if (isOpen) {
      localStorage.setItem("dcnet_chat_open", "1");
      if (dot) dot.style.display = "none";

      // trava scroll no mobile
     if (window.innerWidth <= 640) {
       document.body.style.overflow = "hidden";
       document.documentElement.style.overflow = "hidden";
       document.body.classList.add("dcchat-lock");
      }

       setTimeout(() => input.focus(), 80);
      } else {
        localStorage.setItem("dcnet_chat_open", "0");
        document.body.style.overflow = "";
        document.documentElement.style.overflow = "";
        document.body.classList.remove("dcchat-lock");
      }
    }

  async function sendMsg(text) {
  const msg = (text ?? input.value ?? "").trim();
  if (!msg) return;

  // estado simples de lead (fica em memória)
  window.dcchatLead = window.dcchatLead || {
    name: "",
    phone: "",
    neighborhood: "",
    plan: ""
  };

  addMsg(msg, "me");
  input.value = "";

  try {
    const payload = {
      message: msg,
      name: window.dcchatLead.name,
      phone: window.dcchatLead.phone,
      neighborhood: window.dcchatLead.neighborhood,
      plan: window.dcchatLead.plan
    };

    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (data && data.reply) {
      addMsg(data.reply, "bot");
    } else {
      addMsg("Não entendi direito 😅 pode repetir?", "bot");
    }
  } catch (e) {
    addMsg("No momento estou sem conexão. Tente novamente em instantes 🙏", "bot");
  }
}
let dcchatStep = 0; // 0=normal, 1=nome, 2=whats, 3=bairro, 4=plano

function startLeadFlow() {
  window.dcchatLead = window.dcchatLead || { name: "", phone: "", neighborhood: "", plan: "" };
  dcchatStep = 1;
  addMsg("Perfeito! 😊 Qual seu *nome*?", "bot");
}

function handleLeadFlow(userText) {
  const t = (userText || "").trim();
  if (!t) return false;

  window.dcchatLead = window.dcchatLead || { name: "", phone: "", neighborhood: "", plan: "" };

  if (dcchatStep === 1) {
    window.dcchatLead.name = t;
    dcchatStep = 2;
    addMsg("Agora me diga seu *WhatsApp* com DDD (ex: 61999999999).", "bot");
    return true;
  }

  if (dcchatStep === 2) {
    const digits = onlyDigits(t);
    if (digits.length < 10) {
      addMsg("Digite um WhatsApp válido com DDD 🙂 (ex: 61999999999).", "bot");
      return true;
    }
    window.dcchatLead.phone = digits;
    dcchatStep = 3;
    addMsg("Qual seu *bairro* (e rua se quiser)?", "bot");
    return true;
  }

  if (dcchatStep === 3) {
    window.dcchatLead.neighborhood = t;
    dcchatStep = 4;
    addMsg("Qual plano você quer? *350 / 400 / 500 / 600* (ou escreva outro).", "bot");
    return true;
  }

  if (dcchatStep === 4) {
    window.dcchatLead.plan = t;
    dcchatStep = 0;

    addMsg(
      "Show! ✅ Já registrei seus dados.\n" +
      "Agora me diga: você quer *instalação* ou tirar *dúvida* antes?",
      "bot"
    );
    return true;
  }

  return false;
}
  // Abrir/fechar
  fab.addEventListener("click", () => setOpen(!dock.classList.contains("is-open")));
  close.addEventListener("click", () => setOpen(false));

  // Quick buttons
  document.querySelectorAll(".dcchat__pill").forEach((btn) => {
  btn.addEventListener("click", () => {
    const q = btn.getAttribute("data-q");
    if (!q) return;

    setOpen(true);

    if (q === "comercial") {
      startLeadFlow();
      return;
    }

    input.value = q;
    sendMsg();
  });
});


  // Submit
  form.addEventListener("submit", (e) => {
  e.preventDefault();
  setOpen(true);

  const userText = input.value;

  // se estiver no fluxo de lead, não chama API, só coleta
  if (dcchatStep !== 0) {
    addMsg(userText, "me");
    input.value = "";
    handleLeadFlow(userText);
    return;
  }

  // se usuário pedir comercial/contratar, inicia coleta
  const t = (userText || "").toLowerCase();
  if (/(comercial|contratar|assinar|instalar|quero internet|vendas|orcamento)/.test(t)) {
    addMsg(userText, "me");
    input.value = "";
    startLeadFlow();
    return;
  }

  sendMsg();
});

  // Mensagem inicial (1 vez)
  const started = localStorage.getItem("dcnet_chat_started") === "1";
  if (!started) {
    addMsg(
      "Olá! 👋 Sou o assistente da DCNET Infinity.\n\n" +
        "🚀 Internet fibra em Planaltina DF\n" +
        "📶 Planos de 350 a 600 Mega\n\n" +
        "Como posso te ajudar agora?\n" +
        "👉 Planos | Suporte | Comercial",
      "bot"
    );
    localStorage.setItem("dcnet_chat_started", "1");
  }

  // Manter aberto ao recarregar
  const keepOpen = localStorage.getItem("dcnet_chat_open") === "1";
  if (keepOpen) setOpen(true);

  // “notificação” discreta depois de 6s se o chat estiver fechado
  setTimeout(() => {
    if (!dock.classList.contains("is-open") && dot) dot.style.display = "block";
  }, 6000);
})();

