document.getElementById("cadastroForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const nome = document.getElementById("nome").value;
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  try {
    const res = await fetch("https://suaapi.com/cadastro", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, email, senha }),
    });

    if (res.ok) {
      alert("Cadastro realizado com sucesso!");
      window.location.href = "login.html";
    } else {
      alert("Erro ao cadastrar.");
    }
  } catch (error) {
    console.error("Erro no cadastro:", error);
    alert("Erro na comunicação com a API.");
  }
});
