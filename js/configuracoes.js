// Alterar senha
async function alterarSenha() {
  const senhaAtual = document.getElementById('senhaAtual').value.trim();
  const novaSenha = document.getElementById('novaSenha').value.trim();
  const confirmarSenha = document.getElementById('confirmarSenha').value.trim();

  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || !user.token) {
    showAlertCard("danger","Usuário não autenticado.", "Por favor, faça login novamente.", 3500);
    return;
  }

  if (novaSenha.length < 4) {
    showAlertCard("danger","A nova senha deve ter pelo menos 4 caracteres.", "Por favor, escolha uma senha mais longa.", 3500);
    return;
  }

  if (novaSenha !== confirmarSenha) {
    showAlertCard("danger","A nova senha e a confirmação não coincidem.", "Por favor, verifique se digitou a senha corretamente.", 3500);
    return;
  }

  const requestBody = {
    old_password: senhaAtual,
    new_password: novaSenha
  };

  toggleLoading(true);

  const response = await requestToServer(`/customer/update-password/with-old/${user.id}`,"PUT",JSON.stringify(requestBody),user.jwt_token);

  if (response?.error) {
    showAlertCard('danger',response.error, 'Erro ao alterar senha.', 3500);
  } else {
    showAlertCard("success","Senha alterada com sucesso!", 'Sua nova senha já está disponível.', 3500);
    document.getElementById('senhaAtual').value = '';
    document.getElementById('novaSenha').value = '';
    document.getElementById('confirmarSenha').value = '';
  }

  toggleLoading(false);
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
async function confirmarExclusao() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user || !user.token) {
    showAlertCard("danger", "Usuário não autenticado.", "Por favor, faça login novamente.", 3500);
    return;
  }

  toggleLoading(true);

  const response = await requestToServer(
    `/customer/delete/${user.id}`, "DELETE", null, user.jwt_token // Certifique-se que user.token é o JWT Bearer
  );

  if (response?.error) {
    showAlertCard("danger", response.error, "Erro ao excluir conta.", 3500);
  } else {
    localStorage.removeItem("user");
    window.location.href = "login?deletedAccount=SUCCESS_ACCOUNT_DELETED";
  }

  toggleLoading(false);
}
