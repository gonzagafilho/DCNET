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
 
// ===== Envio de formulário direto para WhatsApp =====
function enviarWhatsApp() {
  const nome = document.getElementById("nome").value;
  const whatsapp = document.getElementById("whatsapp").value;
  const email = document.getElementById("email").value;
  const plano = document.getElementById("plano").value;
  const mensagem = document.getElementById("mensagem").value;

  if (!nome || !whatsapp || !email) {
    alert("Por favor, preencha nome, WhatsApp e e-mail.");
    return;
  }

  const texto =
    `Olá, gostaria de solicitar uma proposta!%0A%0A` +
    `👤 Nome: ${nome}%0A` +
    `📱 WhatsApp: ${whatsapp}%0A` +
    `📧 E-mail: ${email}%0A` +
    `📦 Plano de interesse: ${plano}%0A` +
    `📝 Mensagem: ${mensagem}`;

  const numero = "5561998936443"; // WhatsApp DCNET Infinity

  const url = `https://wa.me/${numero}?text=${texto}`;

  window.open(url, "_blank");
}

// ===============================
// Chatbot Widget (DCChat)
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
    div.className = "dcchat__msg " + (who === "me" ? "dcchat__msg--me" : "dcchat__msg--bot");
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
      setTimeout(() => input.focus(), 50);
    } else {
      localStorage.setItem("dcnet_chat_open", "0");
    }
  }

  async function sendMessage(text) {
    addMsg(text, "me");

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      const data = await res.json().catch(() => ({}));
      const reply = data.reply || "No momento estou com instabilidade. Tente novamente em instantes.";
      addMsg(reply, "bot");
    } catch (err) {
      addMsg("Sem conexão com o servidor do chat. Tente novamente em instantes.", "bot");
    }
  }

  // Abrir/fechar
  fab.addEventListener("click", () => setOpen(!dock.classList.contains("is-open")));
  close.addEventListener("click", () => setOpen(false));

  // Quick buttons
  document.querySelectorAll(".dcchat__pill").forEach((btn) => {
    btn.addEventListener("click", () => {
      const q = btn.getAttribute("data-q");
      if (!q) return;
      sendMessage(q);
      setOpen(true);
    });
  });

  // Submit
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = (input.value || "").trim();
    if (!text) return;
    input.value = "";
    sendMessage(text);
    setOpen(true);
  });

  // Mensagem inicial (1 vez)
  const started = localStorage.getItem("dcnet_chat_started") === "1";
  if (!started) {
    addMsg("Olá! 👋 Eu sou o assistente da DCNET Infinity. Quer ver planos, suporte ou falar com o comercial?", "bot");
    localStorage.setItem("dcnet_chat_started", "1");
  }

  // Se quiser manter aberto quando recarregar
  const keepOpen = localStorage.getItem("dcnet_chat_open") === "1";
  if (keepOpen) setOpen(true);

  // “notificação” discreta depois de 6s se o chat estiver fechado
  setTimeout(() => {
    if (!dock.classList.contains("is-open") && dot) dot.style.display = "block";
  }, 6000);
})();
