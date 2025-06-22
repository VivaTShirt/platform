console.log("oii");

// Atualiza o ano atual no footer (se existir no HTML)
document.getElementById("current-year").textContent = new Date().getFullYear();

// Carregar dados do localStorage ao abrir a página
window.onload = function() {

  const perfil = JSON.parse(localStorage.getItem("user")) || {};
  document.getElementById("nome").value = perfil.name || "";
  document.getElementById("email").value = perfil.email || "";
  document.getElementById("telefone").value = perfil.phone || "";

  if(perfil.enderecos){
    perfil.enderecos.forEach(e => adicionarEndereco(e));
  }

};

function buscarCep(input, index) {
  const cep = input.value.replace(/\D/g, '');
  if (cep.length === 8) {
    fetch(`https://viacep.com.br/ws/${cep}/json/`)
      .then(res => res.json())
      .then(data => {
        if (!data.erro) {
          document.getElementById(`rua-${index}`).value = data.logradouro || '';
          document.getElementById(`bairro-${index}`).value = data.bairro || '';
          document.getElementById(`cidade-${index}`).value = data.localidade || '';
          document.getElementById(`estado-${index}`).value = data.uf || '';
        }
      });
  }
}

// Limitar campo telefone a 11 dígitos numéricos (DD + 9 números)
document.getElementById("telefone").addEventListener("input", function() {
  this.value = this.value.replace(/\D/g, '').slice(0, 11);
});

// Validação de e-mail visual
document.getElementById("email").addEventListener("input", function() {
  const emailMsg = document.getElementById("email-erro");
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(this.value)) {
    emailMsg.textContent = "E-mail inválido. Deve conter '@' e domínio.";
  } else {
    emailMsg.textContent = "";
  }
});

//ENVIA USUARIO MUDADO PARA O SERVIDOR E SALVA NO LOCALSTORAGE
document.getElementById("profileForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(document.getElementById("profileForm"));
  const dataObj = Object.fromEntries(formData.entries());

  // Get values for client-side validation and localStorage update
  const nome = dataObj.nome ? dataObj.nome.trim() : '';
  const email = dataObj.email ? dataObj.email.trim() : '';
  const telefone = dataObj.telefone ? dataObj.telefone.trim() : '';

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const telefoneNumeros = telefone.replace(/\D/g, '');

  let valido = true;

  // --- Client-side Validation ---
  // Validação Nome
  if (nome === "") {
    document.getElementById("nome-erro").textContent = "O campo Nome é obrigatório.";
    valido = false;
  } else {
    document.getElementById("nome-erro").textContent = "";
  }

  // Validação E-mail
  if (!emailRegex.test(email)) {
    document.getElementById("email-erro").textContent = "E-mail inválido.";
    valido = false;
  } else {
    document.getElementById("email-erro").textContent = "";
  }

  // Validação Telefone
  // Only validate if phone is provided and has content
  if (telefone !== "" && telefoneNumeros.length !== 11) {
    document.getElementById("telefone-erro").textContent = "O telefone deve conter 11 dígitos.";
    valido = false;
  } else {
    document.getElementById("telefone-erro").textContent = "";
  }

  if (!valido) {
    // If client-side validation fails, stop the process
    showAlertCard('danger', 'Por favor, corrija os erros no formulário.', 'Dados inválidos', 3500);
    return;
  }
  // --- End Client-side Validation ---

  // Forming the request body
  const requestBody = {
    "name": nome,
    "email": email,
    "phone": telefone,
  };

  toggleLoading(true);

  const user = JSON.parse(localStorage.getItem("user"));

  // Send request to the server
  const response = await requestToServer("/customer/update/" + user.id, "PUT", JSON.stringify(requestBody), user.jwt_token);

  if (response?.error) {
    // Server-side error
    showAlertCard('danger', response.error, 'Erro ao Atualizar', 3500);
  } else if (response?.missing) {
    // Server-side missing data validation
    showAlertCard('danger', response.missing[0].msg, 'Dados inválidos', 3500);
  } else {
    // Server request successful, now update localStorage
    user.name = nome;
    user.email = email;
    user.phone = telefone;

    // If the server returns updated user data, you could also use that for localStorage
    // For example: if (response.updatedUser) { localStorage.setItem("user", JSON.stringify(response.updatedUser)); }
    // Otherwise, use the data from the form that was successfully sent.
    localStorage.setItem("user", JSON.stringify(user));

    showAlertCard('success', 'Alterações Salvas', 'Seu perfil foi atualizado com sucesso!', 3000);
    // You can uncomment the line below if you want to redirect after a successful update
    // window.location.href = "/";
  }

  toggleLoading(false);
  return;
});


