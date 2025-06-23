//SERVER  
const API_URL = "https://c74a-152-243-252-149.ngrok-free.app/v1";

// usuparii fica salvo em "user" no localStorage

// Função para fazer requisições ao servidor
// rote: rota da API, method: método HTTP (GET, POST, etc.), body: corpo da requisição (opcional), bearerToken: token de autenticação (opcional)
async function requestToServer(rote, method, body = null, bearerToken = null) { 
    const options = {
        method: method,
        headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true"
        },
        //credentials: "include"
    };

    if (body) {
        options.body = body;
    }

    if (bearerToken) {
        options.headers.Authorization = "Bearer " + bearerToken;
    }

    return fetch(API_URL + rote, options)
        .then(async (response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            //verificar se jwt expirou
            const res = await response.json();

            //se expirou ele volta ao login
            if(res.jwt_timeout) {
                localStorage.removeItem("user");
                window.location.href = "login";
                console.log("JWT expirou, redirecionando para login...");
                return;
            }

            return res;

        })
        .catch(error => {
            console.error("Error in requestToServer:", error);
            throw error;
        });
}

//função que verifica se ta logado
async function verifyIfIsLogged() {
    if (localStorage.getItem("user") !== null) {

        //verificando se usuario é existente no sistema...

        const userLocalStorage = getUserLocalData();

        //esse request verifica se o usuário existe e se o token é válido
        //se não existir, redireciona para o login
        const userServer = await requestToServer("/customer/token/" + userLocalStorage.token, "GET", null, userLocalStorage.jwt_token);

        if (userServer.error) {

            window.location.href = "login";
            showAlertCard('danger', 'Erro de autenticação', 'Usuário não existe. Por favor, faça login novamente.', 3500);
            return false;

        }

        return true;
    } else {
        window.location.href = "login";
        return false;
    }
}

//função que redireciona se estiver logado
function redirectIfLogged() {
    const user = localStorage.getItem("user");
    if (user !== null) {
        // Usuário está logado, redireciona para a home
        window.location.href = "/";
        return true;
    }
    // Usuário não está logado, permanece na página
    return false;
}

//DOM
//função que libera o card de alerta, aletType = danger / success
function showAlertCard(alertType, title, description, duration) {
  // Define base classes for the alert container
  const baseAlertClasses = "fixed bottom-4 left-1/2 -translate-x-1/2 w-11/12 lg:w-[500px] p-4 rounded-lg shadow-md z-50";
  let alertClasses = "";
  let svgPath = "";

  if (alertType === 'success') {
    alertClasses = `${baseAlertClasses} bg-green-100 border border-green-300 text-green-800`;
    svgPath = `
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    `;
  } else if (alertType === 'danger') {
    alertClasses = `${baseAlertClasses} bg-red-100 border border-red-300 text-red-800`;
    svgPath = `
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    `;
  } else {
    console.error("Tipo de alerta inválido. Por favor, use 'success' ou 'danger'.");
    return;
  }

  // Create the main alert div
  const alertDiv = document.createElement('div');
  alertDiv.className = alertClasses;
  alertDiv.style.display = 'none'; // Initially hide it

  // Construct the inner HTML
  alertDiv.innerHTML = `
    <div class="flex items-center">
      <svg class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        ${svgPath}
      </svg>
      <div>
        <h3 class="font-semibold text-lg">${title}</h3>
        <p>${description}</p>
      </div>
    </div>
  `;

  // Append the alert to the body
  document.body.appendChild(alertDiv);

  // Show the alert with a fade-in effect (optional, but good for UX)
  alertDiv.style.opacity = '0';
  alertDiv.style.transition = 'opacity 0.3s ease-in-out';
  alertDiv.style.display = 'block';

  // Trigger reflow to apply initial opacity before transition
  void alertDiv.offsetWidth; // eslint-disable-line no-unused-vars

  alertDiv.style.opacity = '1';

  // Set timeout to hide and remove the alert
  setTimeout(() => {
    alertDiv.style.opacity = '0'; // Start fade out
    alertDiv.style.zIndex = '-1'; // Lower z-index to hide it behind other elements
    alertDiv.addEventListener('transitionend', () => {
      alertDiv.remove(); // Remove element after fade out
    }, { once: true }); // Ensure event listener is removed after first execution
  }, duration);
}

//função que libera a tela de login, true mostra, false esconde
function toggleLoading(show) {
  const loadingId = 'app-loading-overlay';
  let loadingOverlay = document.getElementById(loadingId);

  if (show) {
    // If we need to show the loading overlay and it doesn't exist, create it
    if (!loadingOverlay) {
      loadingOverlay = document.createElement('div');
      loadingOverlay.id = loadingId;
      loadingOverlay.className = 'fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]'; // Higher z-index to ensure it's on top

      // Spinner container
      const spinnerContainer = document.createElement('div');
      spinnerContainer.className = 'animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-white'; // Tailwind for spinner

      loadingOverlay.appendChild(spinnerContainer);
      document.body.appendChild(loadingOverlay);

      // Optional: Add a fade-in effect
      loadingOverlay.style.opacity = '0';
      loadingOverlay.style.transition = 'opacity 0.3s ease-in-out';
      void loadingOverlay.offsetWidth; // Trigger reflow
      loadingOverlay.style.opacity = '1';
    } else {
      // If it exists but was hidden, just show it
      loadingOverlay.style.display = 'flex';
      loadingOverlay.style.opacity = '1';
      loadingOverlay.style.zIndex = '-1'; // Lower z-index to hide it behind other elements
    }
  } else {
    // If we need to hide the loading overlay and it exists
    if (loadingOverlay) {
      // Optional: Add a fade-out effect before removal
      loadingOverlay.style.opacity = '0';
      loadingOverlay.style.zIndex = '-1'; // Lower z-index to hide it behind other elements
      loadingOverlay.addEventListener('transitionend', () => {
        loadingOverlay.style.display = 'none';
        loadingOverlay.remove(); // Remove element from DOM after fade out
      }, { once: true });
    }
  }
}

// funcão que adiciona produto ao carrinho
function addProductToCart(mainImgSrc, productId, productName, productSize, productColor, productValue, productQuantity) {
  const cartKey = 'cart_products';
  let cart = JSON.parse(localStorage.getItem(cartKey)) || [];

  // Usa productQuantity se fornecido, senão pega do input, senão 1
  const quantity = parseInt(productQuantity) || parseInt(document.getElementById('quantidade').value) || 1;
  const price = parseFloat(productValue.replace(/[^\d,.-]/g, '').replace(',', '.')) || 0;

  const obj = {
    imgSrc: mainImgSrc,
    id: productId,
    name: productName,
    size: productSize,
    color: productColor,
    quantity: quantity,
    price: price
  };

  // Verifica se o produto já existe no carrinho (mesmo id, size e color)
  const existingIndex = cart.findIndex(item =>
    item.id === obj.id &&
    item.size === obj.size &&
    item.color === obj.color
  );

  if (existingIndex !== -1) {
    // Se já existe, soma a quantidade
    cart[existingIndex].quantity += obj.quantity;
  } else {
    // Se não existe, adiciona novo produto
    cart.push(obj);
  }

  localStorage.setItem(cartKey, JSON.stringify(cart));
}

function removeProductFromCart(productId) {
  const cartKey = 'cart_products';
  let cart = JSON.parse(localStorage.getItem(cartKey)) || [];

  // Filtra removendo o produto com o id informado
  cart = cart.filter(item => item.id !== productId);

  // Atualiza o carrinho no localStorage
  localStorage.setItem(cartKey, JSON.stringify(cart));
}

function updateProductQuantity(productId, newQuantity) {
  const cartKey = 'cart_products';
  let cart = JSON.parse(localStorage.getItem(cartKey)) || [];
  const idx = cart.findIndex(item => item.id == productId);
  if (idx !== -1) {
    cart[idx].quantity = parseInt(newQuantity) || 1;
    localStorage.setItem(cartKey, JSON.stringify(cart));
  }
}

//função que retorna a quantidade de itens no carrinho
function getCartTotalItems() {
  const cartKey = 'cart_products';
  const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
  // Soma todas as quantidades dos produtos no carrinho
  return cart.reduce((total, item) => total + (item.quantity || 0), 0);
}

function getCartSubtotalAndTotal() {
  const cartKey = 'cart_products';
  const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
  // Calcula o subtotal
  const subtotal = cart.reduce((sum, item) => {
    const price = Number(item.price) || 0;
    const quantity = Number(item.quantity) || 0;
    return sum + price * quantity;
  }, 0);
  // Por enquanto, total é igual ao subtotal
  const total = subtotal;
  return { subtotal, total };
}

window.removeProductFromCart = removeProductFromCart;
window.updateProductQuantity = updateProductQuantity;

