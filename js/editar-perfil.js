    document.getElementById("current-year").textContent = new Date().getFullYear();

    // Carregar dados do localStorage ao abrir a página
    window.onload = function() {
      const perfil = JSON.parse(localStorage.getItem("perfil")) || {};
      document.getElementById("nome").value = perfil.nome || "";
      document.getElementById("email").value = perfil.email || "";
      document.getElementById("senha").value = perfil.senha || "";
      if(perfil.enderecos){
        perfil.enderecos.forEach(e => adicionarEndereco(e));
      }
    }

    // Adicionar campo de endereço
    function adicionarEndereco(valor = "") {
      const container = document.getElementById("enderecosContainer");
      const div = document.createElement("div");
      div.className = "flex gap-2";
      div.innerHTML = `
        <input type="text" value="${valor}" class="w-full border border-roxo rounded-md p-2" placeholder="Endereço">
        <button type="button" onclick="this.parentElement.remove()" class="text-red-500 font-bold">X</button>
      `;
      container.appendChild(div);
    }

    // Salvar no localStorage
    function salvarPerfil() {
      const nome = document.getElementById("nome").value;
      const email = document.getElementById("email").value;
      const senha = document.getElementById("senha").value;
      const enderecos = Array.from(document.querySelectorAll('#enderecosContainer input')).map(e => e.value);
      
      const perfil = { nome, email, senha, enderecos };
      localStorage.setItem("perfil", JSON.stringify(perfil));
      
      // Mostrar modal
      document.getElementById("modal").classList.remove("hidden");
    }

    // Fechar modal
    function fecharModal() {
      document.getElementById("modal").classList.add("hidden");

    // Redireciona para a página de perfil
    window.location.href = "perfil.html";
  }