document.getElementById("submitFormToServer").addEventListener("submit", async (event) =>  {

    toggleLoading(true);

    event.preventDefault();

    const formData = new FormData(document.getElementById("submitFormToServer"));

    const dataObj = Object.fromEntries(formData.entries());

    const response = await requestToServer("/token/code/verify/" + dataObj.code, "GET", null, null);

    if (response?.error) {//caso tenha algum erro ele mostra o erro

        showAlertCard('danger', response.error, 'Algo deu errado.', 3500);
        toggleLoading(false);
        return;
    }

    window.location.href = "/redefinir-senha?token=" + response.tokenable_id + "&code=" + response.token;

});
