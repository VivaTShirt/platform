//verificar se o usuário já está logado se estiver ele vai para a home
document.addEventListener("DOMContentLoaded", function () {

  redirectIfLogged();

});

//veiricar se o usuário acabou de se cadastrar
document.addEventListener("DOMContentLoaded", function () {
  
  //se sim libera uma mensagem de sucesso
  const urlParams = new URLSearchParams(window.location.search);
  const preRegistered = urlParams.get("preRegistered");

  if (preRegistered) {
    showAlertCard('success', 'Cadastro realizado com sucesso!', 'Agora você pode fazer login.', 3500);
  }

});

// ocultar ou mostrar a senha
function toggleSenha() {
  const input = document.getElementById("senha");
  const icone = document.getElementById("iconeSenha");
  if (input.type === "password") {
    input.type = "text";
    icone.innerHTML = `
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
      d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10a9.958 9.958 0 012.215-6M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
      d="M2 2l20 20" />
  `;
  } else {
    input.type = "password";
    icone.innerHTML = `
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  `;
  }
}

//enviar formulário de login
document.getElementById("submitFormToServer").addEventListener("submit", async function (event) {

  event.preventDefault();

  const formData = new FormData(document.getElementById("submitFormToServer"));  

  const dataObj = Object.fromEntries(formData.entries());

  //formando obody do request
  const requestBody = {
    "email": dataObj.email,
    "password": dataObj.senha
  };

  toggleLoading(true);
  const response = await requestToServer("/customer/login", "POST", JSON.stringify(requestBody), null);

  if (response?.error) {//caso tenha algum erro ele mostra o erro

    showAlertCard('danger', 'Erro ao entrar', response.error, 3500);
  } else if(response?.missing){//caso tenha algum campo faltando ele mostra o erro

    showAlertCard('danger', 'Dados inválidos', response.missing[0].msg, 3500);
  }else {//caso entre ele guarda os dados no localStorage e redireciona para o home

    localStorage.setItem("user", JSON.stringify(response));

    window.location.href = "/";
  }

  toggleLoading(false);

  return;

});