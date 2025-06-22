// se estiver autenticado, vai dar boas vindas somente se a largura da tela for maior que 850
document.addEventListener("DOMContentLoaded", async function () {
    if (window.innerWidth > 850) {
        const userLocalStorage = JSON.parse(localStorage.getItem("user"));

        if (userLocalStorage) {
            const welcomeMessage = document.getElementById("userMeetings");
            if (welcomeMessage) {
                welcomeMessage.classList.remove("hidden");
                welcomeMessage.innerHTML = `Olá <strong>${userLocalStorage.name}</strong>!`;
            }
        } else {
            console.log("Usuário não autenticado.");
        }
    }
});

//evento que faz a search bar aparecer e desaparecer
document.getElementById("toggleSearchBar").addEventListener("click", () => {

    let searchBarEl = document.getElementById('searchBar');

    if (searchBarEl.classList.contains("opacity-0")) {
        searchBarEl.classList.remove("opacity-0");        
    } else {
        searchBarEl.classList.add("opacity-0");
    }

});

function toogleModalCard() {
    
    let modalCart = document.getElementById('modalCart');

    if (modalCart.classList.contains("hidden")) {
        modalCart.classList.remove("hidden");        
    } else {
        modalCart.classList.add("hidden");
    }
}

//modal de carrinho
document.getElementById("toggleCardModal").addEventListener("click", () => {

    toogleModalCard();

});

// fechar o modal de carrinho no mobile
document.getElementById("closeModalCartMobile").addEventListener("click", () => {

    let modalCart = document.getElementById('modalCart');

    modalCart.classList.add("hidden");        

});

function renderModalCartProducts() {
    const cartKey = 'cart_products';
    const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
    const container = document.getElementById('cartProductsLines');
    container.innerHTML = '';

    // Calcula subtotal e total
    let subtotal = 0;

    // Usa os campos do objeto diretamente, sem fallback desnecessário
    const mappedCart = cart.map(product => {
        return {
            imgSrc: product.imgSrc || product.mainImgSrc || 'https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small_2x/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg',
            id: product.id || product.productId || 0,
            name: product.name || product.productName || 'N/A',
            size: product.size || product.productSize || 'N/A',
            color: product.color || product.productColor || 'N/A',
            quantity: product.quantity || 1,
            price: product.price || '0.00'
        };
    });

    mappedCart.forEach(product => {
        const price = parseFloat(product.price) || 0;
        const quantity = parseInt(product.quantity) || 1;
        subtotal += price * quantity;
    });

    const total = subtotal;

    const subTotalEl = document.getElementById('modalCardProductsSubTotal');
    const totalEl = document.getElementById('modalCardProductsTotal');
    if (subTotalEl) subTotalEl.textContent = `R$ ${subtotal.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `R$ ${total.toFixed(2)}`;

    if (mappedCart.length === 0) {
        container.innerHTML = '<p class="text-center mb-[300px] text-gray-500">Seu carrinho está vazio.</p>';
        return;
    }

    const ul = document.createElement('ul');
    ul.className = 'space-y-4';
    mappedCart.forEach((product, idx) => {
        const li = document.createElement('li');
        li.className = 'flex items-center gap-4';

        li.innerHTML = `
            <img
                src="${product.imgSrc}"
                alt=""
                class="size-16 rounded-sm object-cover"
            />
            <div>
                <h3 class="text-sm text-gray-900">${product.name}</h3>
                <dl class="mt-0.5 space-y-px text-[10px] text-gray-600">
                    <div>
                        <dt class="inline">Tamanho:</dt>
                        <dd class="inline">${product.size || '-'}</dd>
                    </div>
                    <div>
                        <dt class="inline">Cor:</dt>
                        <dd class="inline">${product.color || '-'}</dd>
                    </div>
                </dl>
            </div>
            <div class="flex flex-1 items-center justify-end gap-2">
                <form onsubmit="return false;">
                    <label for="Line${idx}Qty" class="sr-only"> Quantidade </label>
                    <input
                        type="number"
                        min="1"
                        value="${product.quantity}"
                        id="Line${idx}Qty"
                        data-product-id="${product.id}"
                        class="cart-qty-input h-8 w-12 rounded-sm border-gray-200 bg-gray-50 p-0 text-center text-xs text-gray-600 [-moz-appearance:_textfield] focus:outline-hidden [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
                    />
                </form>
                <button class="cart-remove-btn text-gray-600 transition hover:text-red-600"
                    data-product-id="${product.id}">
                    <span class="sr-only">Remover Item</span>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="size-4"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                        />
                    </svg>
                </button>
            </div>
        `;
        ul.appendChild(li);
    });

    container.appendChild(ul);

    // Adiciona listeners para inputs de quantidade
    ul.querySelectorAll('.cart-qty-input').forEach(input => {
        input.addEventListener('change', function () {
            const productId = this.getAttribute('data-product-id');
            const newQty = this.value;
            updateProductQuantity(productId, newQty);
            renderModalCartProducts();
        });
    });

    // Adiciona listeners para botões de remover
    ul.querySelectorAll('.cart-remove-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const productId = this.getAttribute('data-product-id');
            removeProductFromCart(productId);
            renderModalCartProducts();
        });
    });
}

renderModalCartProducts();