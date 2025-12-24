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

