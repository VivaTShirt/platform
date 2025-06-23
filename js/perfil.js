  // Atualiza o ano no rodapé
  document.getElementById("current-year").textContent = new Date().getFullYear();

  // Preenche os dados do perfil na tela de perfil
  document.addEventListener("DOMContentLoaded", function() {
    const perfil = JSON.parse(localStorage.getItem("user")) || {};
    document.getElementById("nome").textContent = perfil.name || "Nome do Usuário";
    document.getElementById("email").textContent = perfil.email || "usuario@email.com";
  });

  function logout() {
    localStorage.removeItem("user");
    window.location.href = "/login";
  }