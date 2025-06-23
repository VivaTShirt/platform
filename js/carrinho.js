// Função para pegar os parâmetros da URL
function getQueryParams() {
  const params = {};
  window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(str, key, value) {
    params[key] = decodeURIComponent(value);
  });
  return params;
}

// Verifica se a URL contém o parâmetro ?addedToCard=USER_ADDED_TO_CARD
window.addEventListener('DOMContentLoaded', () => {
  const params = getQueryParams();
  if (params.addedToCard === 'USER_ADDED_TO_CARD') {
    showAlertCard('success', 'Produto adicionado ao carrinho com sucesso!', 'Adicionado', 2000);

    // Remove o parâmetro da URL sem recarregar a página
    const url = new URL(window.location);
    url.searchParams.delete('addedToCard');
    window.history.replaceState({}, document.title, url.pathname + url.search);
  }
});

document.addEventListener("DOMContentLoaded", function () {
    renderCarrinhoPage();
});

function renderCarrinhoPage() {
    const cartKey = 'cart_products';
    const cart = JSON.parse(localStorage.getItem(cartKey)) || [];

    const mainProductContainer = document.querySelector('main .bg-white.p-4.rounded-lg.shadow-md.flex');
    const subtotalContainer = document.getElementById('subtotal');
    const quantidadeSubtotal = document.getElementById('quantidade-subtotal');

    if (!mainProductContainer || !subtotalContainer || !quantidadeSubtotal) return;

    if (cart.length === 0) {
        mainProductContainer.innerHTML = `<p class="text-center w-full text-gray-500 py-10">Seu carrinho está vazio.</p>`;
        subtotalContainer.textContent = "R$ 0,00";
        quantidadeSubtotal.textContent = "0";
        return;
    }

    let total = 0;
    let totalQuantity = 0;

    mainProductContainer.innerHTML = cart.map((product, idx) => {
        total += parseFloat(product.price) * product.quantity;
        totalQuantity += product.quantity;
        return `
        <div class="flex flex-col sm:flex-row gap-4 flex-1 border-b py-4" data-idx="${idx}">
            <img src="${product.imgSrc || product.mainImgSrc || 'https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small_2x/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg'}" alt="${product.name || 'Produto'}" class="w-full sm:w-32 h-auto object-contain" />
            <div>
                <h2 class="font-semibold text-lg text-gray-700">${product.name || 'Produto'}</h2>
                <p class="text-green-600 text-sm mt-1">Em estoque</p>
                <p class="text-sm text-gray-600 mt-4">Descrição do produto:</p>
                <p class="text-sm text-gray-500 mt-1">${product.description || 'Sem descrição.'}</p>
                <div class="flex gap-2 mt-2 text-sm">
                    <span class="text-gray-700">${product.color ? product.color : ''}</span>
                    <span class="text-gray-700">${product.size ? 'Tamanho: ' + product.size : ''}</span>
                </div>
                <div class="flex items-center gap-3 mt-4 text-sm text-purple-500">
                    <button class="btn-excluir hover:underline" data-idx="${idx}">Excluir</button>
                    <span>|</span>
                    <button class="btn-compartilhar hover:underline" data-idx="${idx}">Compartilhar</button>
                </div>
            </div>
            <div class="flex flex-col items-end justify-between">
                <p class="text-lg font-semibold text-gray-800">R$${parseFloat(product.price).toFixed(2)}</p>
                <div class="flex items-center border rounded-full mt-4">
                    <button class="btn-diminuir px-3 text-lg font-bold text-purple-500 hover:text-purple-700" data-idx="${idx}">−</button>
                    <span class="quantidade px-3 font-medium text-gray-700">${product.quantity}</span>
                    <button class="btn-aumentar px-3 text-lg font-bold text-purple-500 hover:text-purple-700" data-idx="${idx}">+</button>
                </div>
            </div>
        </div>
        `;
    }).join('');

    subtotalContainer.textContent = `R$ ${total.toFixed(2)}`;
    quantidadeSubtotal.textContent = totalQuantity;

    // Eventos de quantidade e exclusão
    mainProductContainer.querySelectorAll('.btn-diminuir').forEach(btn => {
        btn.onclick = () => {
            const idx = parseInt(btn.getAttribute('data-idx'));
            if (cart[idx].quantity > 1) {
                cart[idx].quantity--;
                localStorage.setItem(cartKey, JSON.stringify(cart));
                renderCarrinhoPage();
                if (typeof renderModalCartProducts === "function") renderModalCartProducts(); // Atualiza header
            }
        };
    });
    mainProductContainer.querySelectorAll('.btn-aumentar').forEach(btn => {
        btn.onclick = () => {
            const idx = parseInt(btn.getAttribute('data-idx'));
            cart[idx].quantity++;
            localStorage.setItem(cartKey, JSON.stringify(cart));
            renderCarrinhoPage();
            if (typeof renderModalCartProducts === "function") renderModalCartProducts(); // Atualiza header
        };
    });
    mainProductContainer.querySelectorAll('.btn-excluir').forEach(btn => {
        btn.onclick = () => {
            const idx = parseInt(btn.getAttribute('data-idx'));
            cart.splice(idx, 1);
            localStorage.setItem(cartKey, JSON.stringify(cart));
            renderCarrinhoPage();
            if (typeof renderModalCartProducts === "function") renderModalCartProducts(); // Atualiza header
        };
    });
    mainProductContainer.querySelectorAll('.btn-compartilhar').forEach(btn => {
        btn.onclick = () => {
            alert('Link do produto copiado!');
        };
    });
}