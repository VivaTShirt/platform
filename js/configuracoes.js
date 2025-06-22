    // Alterar senha
    function alterarSenha() {
      const senhaAtual = document.getElementById('senhaAtual').value.trim();
      const novaSenha = document.getElementById('novaSenha').value.trim();
      const confirmarSenha = document.getElementById('confirmarSenha').value.trim();

      const perfil = JSON.parse(localStorage.getItem("perfil"));

      if (!perfil) {
        showAlert();
        return;
      }

      if (senhaAtual !== perfil.senha) {
        showAlert("A senha atual está incorreta.");
        return;
      }

      if (novaSenha.length < 4) {
        showAlert("A nova senha deve ter pelo menos 4 caracteres.");
        return;
      }

      if (novaSenha !== confirmarSenha) {
        showAlert("A nova senha e a confirmação não coincidem.");
        return;
      }

    }

    // Apagar conta - abrir modal
    function abrirModalExcluir() {
      document.getElementById("modalExcluir").classList.remove("hidden");
    }

    // Fechar modal
    function fecharModalExcluir() {
      document.getElementById("modalExcluir").classList.add("hidden");
    }

    // Confirmar exclusão
    function confirmarExclusao() {
      localStorage.removeItem("perfil");
      showAlert("Conta excluída com sucesso.");
      window.location.href = "index"; // ou a página inicial
    }