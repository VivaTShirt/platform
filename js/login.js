document.getElementById("loginForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  try {
    const res = await fetch("https://suaapi.com/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha }),
    });

    if (res.ok) {
      alert("Login bem-sucedido!");
      window.location.href = "index.html";
    } else {
      alert("Credenciais inválidas.");
    }
  } catch (error) {
    console.error("Erro no login:", error);
    alert("Erro ao fazer login.");
  }
});
