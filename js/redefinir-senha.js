//faz verificação se o usuário está logado, se estiver redireciona para a home
// envia a senha par aservidor
document.addEventListener("DOMContentLoaded", async () => {

    //verificar se o usuário existe pelo token, se não enviar de volta para o login
    const urlParams = new URLSearchParams(window.location.search);
    const qToken = urlParams.get("token");
    const qCode = urlParams.get("code");

    if (!qToken || !qCode) {
        window.location.href = "/login?changedPassword=ERR_FORBIDDEN_PASSWORD_RESET";
        return;
    }


    async function verifyAuthenticy() {

        toggleLoading(true);

        const userByToken = await requestToServer("/customer/token/" + qToken, "GET", null, null);

        if (userByToken?.error) { //caso tenha algum erro ele mostra o erro
            window.location.href = "/login?changedPassword=ERR_FORBIDDEN_PASSWORD_RESET";
            console.log('desaprovado');
        }

        console.log('aprovado');

        toggleLoading(false);

        return userByToken;

    }

    const userFound = await verifyAuthenticy();

    //evento de envio do formulário
    document.getElementById("submitFormToServer").addEventListener("submit", async (event) => {

        toggleLoading(true);

        event.preventDefault();

        const formData = new FormData(document.getElementById("submitFormToServer"));

        const dataObj = Object.fromEntries(formData.entries());

        if (dataObj.senha !== dataObj.confirmarSenha) {
            showAlertCard('danger', 'As senhas não coincidem.', 'Por favor, verifique e tente novamente.', 3500);
            toggleLoading(false);
            return;
        }

        const plyd = {
            "token": qCode,
            "new_password": dataObj.senha
        }

        const response = await requestToServer("/customer/update-password/" + userFound.id, "PATCH", JSON.stringify(plyd), userFound.jwt_token);

        if (response?.error) { //caso tenha algum erro ele mostra o erro
            showAlertCard('danger', response.error, 'Algo deu errado.', 3500);
            toggleLoading(false);
            return;
        } else if(response?.missing){//caso tenha algum campo faltando ele mostra o erro

            showAlertCard('danger', response.missing[0].msg ,'Dados inválidos', 3500);
            return;
        }

        toggleLoading(false);
        window.location.href = "/login?changedPassword=SUCCESS_PASSWORD_RESET";

    });

});

//verificar se o usuário já está logado se estiver ele vai para a home
document.addEventListener("DOMContentLoaded", function () {

  redirectIfLogged();

});