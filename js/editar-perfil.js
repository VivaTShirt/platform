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

// Adicionar campo de endereço
function adicionarEndereco(valor = {}) {
  const container = document.getElementById("enderecosContainer");
  const index = container.children.length; // Para indexar os campos
  const div = document.createElement("div");
  div.className = "flex gap-2";
  div.innerHTML = `
    <div class="border rounded-md p-4 flex items-center gap-4 w-full bg-gray-50">
      <input type="radio" name="endereco-principal" class="accent-roxo" style="width:18px;height:18px;" />
      <div class="flex flex-col gap-1 w-full">
        <input type="hidden" name="endereco_id" value="${valor.id || ''}">
        <div class="flex gap-2 mb-1">
          <input type="text" name="cep" id="cep-${index}" value="${valor.cep || ''}" class="border border-roxo rounded-md p-2 w-1/2" placeholder="CEP" maxlength="9" oninput="buscarCep(this, ${index})">
          <input type="text" name="address" id="rua-${index}" value="${valor.address || ''}" class="border border-roxo rounded-md p-2 w-1/2" placeholder="Endereço">
        </div>
        <div class="flex gap-2">
          <input type="text" name="address_number" value="${valor.address_number || ''}" class="border border-roxo rounded-md p-2 w-1/3" placeholder="Número">
          <input type="text" name="neighborhood" id="bairro-${index}" value="${valor.neighborhood || ''}" class="border border-roxo rounded-md p-2 w-1/3" placeholder="Bairro">
        </div>
        <div class="flex gap-2 mt-1">
          <input type="text" name="city" id="cidade-${index}" value="${valor.city || ''}" class="border border-roxo rounded-md p-2 w-1/2" placeholder="Cidade">
          <input type="text" name="state" id="estado-${index}" value="${valor.state || ''}" class="border border-roxo rounded-md p-2 w-1/4" placeholder="Estado">
        </div>
      </div>
      <button type="button" onclick="this.parentElement.parentElement.remove()" class="text-red-500 font-bold text-lg ml-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  `;
  container.appendChild(div);
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

  const formData = new FormData(document.getElementById("submitFormToServer"));
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
  const response = await requestToServer("/customer/profile", "PUT", JSON.stringify(requestBody), user.jwt_token);

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

// Ensure this script runs after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', async () => {
  const enderecosContainer = document.getElementById("enderecosContainer");

  // Get the user ID from localStorage. It's crucial for the endpoint.
  // Assuming 'user' object in localStorage has an 'id' property.
  const user = JSON.parse(localStorage.getItem("user"));
  const customerId = user ? user.id : null;

  if (!customerId) {
    console.error("User ID not found in localStorage. Cannot fetch addresses.");
    showAlertCard('danger', 'Erro ao carregar endereços.', 'Faça login novamente.', 3500);
    return;
  }

  // --- Show loading indicator before starting the fetch ---
  toggleLoading(true);

  try {
    // Construct the endpoint dynamically with the customerId
    const endpoint = `/customer/address/${customerId}`;

    // Make the request to fetch addresses
    const addresses = await requestToServer(endpoint, "GET", null, user.jwt_token);

    if (addresses && addresses.length > 0) {
      // Clear any existing placeholder content in the container if desired
      enderecosContainer.innerHTML = '';

      // Loop through the fetched addresses and add them to the DOM
      addresses.forEach(address => {
        addListiningServerAdress(address);
      });

      // Set the first address as principal if there are any addresses loaded
      const firstRadio = document.querySelector('input[name="endereco-principal"]');
      if (firstRadio) {
        firstRadio.checked = true;
      }

    } else {
      // No addresses found or response is empty
      console.log("No addresses found for this user.");
      showAlertCard('info', 'Nenhum endereço cadastrado.', 'Adicione seu primeiro endereço!', 3000);
      addListiningServerAdress(); // Add an empty address field to start with
    }
  } catch (error) {
    console.error("Error fetching addresses:", error);
    showAlertCard('danger', 'Erro ao carregar endereços.', 'Tente novamente mais tarde.', 3500);
  } finally {
    // --- Hide loading indicator after the fetch (success or error) ---
    toggleLoading(false);
  }
});

// Your existing addListiningServerAdress function
function addListiningServerAdress(row = {}) {
  const container = document.getElementById("enderecosContainer");
  const index = container.children.length; // Para indexar os campos
  const div = document.createElement("div");
  div.className = "flex gap-2";
  div.innerHTML = `
    <div class="border rounded-md p-4 flex items-center gap-4 w-full bg-gray-50">
      <input type="radio" name="endereco-principal" class="accent-roxo" style="width:18px;height:18px;" ${row.is_active == true ? 'checked' : ''} />
      <div class="flex flex-col gap-1 w-full">
        <input type="hidden" name="endereco_id" value="${row.id || ''}">
        <div class="flex gap-2 mb-1">
          <input type="text" name="cep" id="cep-${index}" value="${row.postcode || ''}" class="border border-roxo rounded-md p-2 w-1/2" placeholder="CEP" maxlength="9" oninput="buscarCep(this, ${index})">
          <input type="text" name="address" id="rua-${index}" value="${row.address || ''}" class="border border-roxo rounded-md p-2 w-1/2" placeholder="Endereço">
        </div>
        <div class="flex gap-2">
          <input type="text" name="address_number" value="${row.address_number || ''}" class="border border-roxo rounded-md p-2 w-1/3" placeholder="Número">
          <input type="text" name="neighborhood" id="bairro-${index}" value="${row.neighborhood || ''}" class="border border-roxo rounded-md p-2 w-1/3" placeholder="Bairro">
        </div>
        <div class="flex gap-2 mt-1">
          <input type="text" name="city" id="cidade-${index}" value="${row.city || ''}" class="border border-roxo rounded-md p-2 w-1/2" placeholder="Cidade">
          <input type="text" name="state" id="estado-${index}" value="${row.state || ''}" class="border border-roxo rounded-md p-2 w-1/4" placeholder="Estado">
        </div>
      </div>
      <button type="button" onclick="this.parentElement.parentElement.remove()" class="text-red-500 font-bold text-lg ml-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  `;
  container.appendChild(div);
}


