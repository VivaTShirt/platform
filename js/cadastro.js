//verificar se o usuário já está logado se estiver ele vai para a home
document.addEventListener("DOMContentLoaded", function () {

  redirectIfLogged();

});

//ocultar ou mostrar a senha
function toggleSenha(inputId, iconId) {
  const input = document.getElementById(inputId);
  const icone = document.getElementById(iconId);

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

//enviar formulário de cadastro
document.getElementById("submitFormToServer").addEventListener("submit", async function (event) {

  event.preventDefault();

  const formData = new FormData(document.getElementById("submitFormToServer"));  

  if(formData.get("senha") === formData.get("confirmarSenha")){

    const dataObj = Object.fromEntries(formData.entries());

    //formando obody do request
    const requestBody = {
      "name": dataObj.nome,
      "email": dataObj.email,
      "phone": dataObj.telefone,
      "password": dataObj.senha
    };

    toggleLoading(true);
    const response = await requestToServer("/customer/register", "POST", JSON.stringify(requestBody), null);

    if (response?.error) {//caso tenha algum erro ele mostra o erro

      showAlertCard('danger', response.error, '', 3500);
    } else if(response?.missing){//caso tenha algum campo faltando ele mostra o erro

      showAlertCard('danger', response.missing[0].msg ,'Dados inválidos', 3500);
    }else {//caso entre ele redireciona para o login

      window.location.href = "login?preRegistered=true";
    }

    toggleLoading(false);

    return;

  }else{
    showAlertCard('danger', 'Erro de validação', 'As senhas não coincidem. Por favor, verifique e tente novamente.', 3500);
    return;
  }

});