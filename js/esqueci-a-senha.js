document.getElementById("submitFormToServer").addEventListener("submit", async (event) =>  {

    toggleLoading(true);

    event.preventDefault();

    const formData = new FormData(document.getElementById("submitFormToServer"));

    const dataObj = Object.fromEntries(formData.entries());

    const plyd = {
        "email": dataObj.email
    }

    const response = await requestToServer("/customer/forgot-password/mail", "POST", JSON.stringify(plyd), null);

    if (response?.error) {//caso tenha algum erro ele mostra o erro

        showAlertCard('danger', response.error, '', 3500);
        toggleLoading(false);
        return;
    } else if(response?.missing){//caso tenha algum campo faltando ele mostra o erro

        showAlertCard('danger', response.missing[0].msg ,'Dados inválidos', 3500);
        toggleLoading(false);
        return;
    }

    window.location.href = "/codigo-de-verificacao";

});
