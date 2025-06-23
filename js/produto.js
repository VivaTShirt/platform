// Função para pegar os parâmetros da URL
function getQueryParams() {
  const params = {};
  window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(str, key, value) {
    params[key] = decodeURIComponent(value);
  });
  return params;
}

const params = getQueryParams();
const imagemPrincipal = "http://localhost:8081/" + params.img || '';
const nomeProduto = params.nome || '';
const valorProduto = params.preco ? `R$ ${params.preco}` : '';
const quantidade = document.getElementById('quantidade')?.textContent.trim() || '';
let productSize = '';
const corProduto = document.getElementById('corProduto')?.textContent.trim() || '';

// Preencher os dados do produto com base na query string
window.addEventListener('DOMContentLoaded', () => {
  const params = getQueryParams();

  if (params.nome) {
    const nomeProdutoEl = document.getElementById('nomeProduto');
    if (nomeProdutoEl) nomeProdutoEl.textContent = params.nome;
  }

  if (params.preco) {
    const valorProdutoEl = document.getElementById('valorProduto');
    if (valorProdutoEl) valorProdutoEl.textContent = `R$ ${params.preco}`;
  }

  if (params.img) {
    const imagemPrincipalEl = document.getElementById('imagemPrincipal');
    if (imagemPrincipalEl) imagemPrincipalEl.src = params.img;
    // Se quiser trocar as miniaturas também, faça aqui
    const imagem1El = document.getElementById('imagem1');
    if (imagem1El) imagem1El.src = params.img;
  }
});

//para efeito de hover nos tamanhos do produto
const botoesTamanho = document.querySelectorAll('.tamanho-btn');

botoesTamanho.forEach((btn) => {
    btn.addEventListener('click', () => {
        botoesTamanho.forEach((b) => b.classList.remove('bg-black', 'text-white'));
        btn.classList.add('bg-black', 'text-white');
        productSize = btn.textContent;
    });
});

//contador produto
  const input = document.getElementById('quantidade');
  document.getElementById('increment').onclick = () => {
      input.value = parseInt(input.value) + 1;
  };
  
  document.getElementById('decrement').onclick = () => {
      if (parseInt(input.value) > 1) input.value = parseInt(input.value) - 1;
  };


//botao ver mais na descrição do produto
  const descricao = document.getElementById('descricao');
  const btnVerMais = document.getElementById('btn-ver-mais');

  btnVerMais.addEventListener('click', () => {
      if (descricao.style.maxHeight === 'none') {
          descricao.style.maxHeight = '3rem';
          btnVerMais.textContent = 'Ver mais';
      } else {
          descricao.style.maxHeight = 'none';
          btnVerMais.textContent = 'Ver menos';
      }
  });

  descricao.style.maxHeight = '3rem';

  //botap que adiciona no localstorage do carrinho e redireciona para a página do carrinho
  document.getElementById('btnAdicionarCarrinho').addEventListener('click', () => {

    if (productSize === '') {
      showAlertCard('danger', 'Por favor, selecione um tamanho para o produto.', 'Tamanho não selecionado', 3500);
      return;
    }

    //document.getElementById('btnAdicionarCarrinho').getAttribute('data-produto-id') || '';
    const produtoId = imagemPrincipal.substr(15,18) + nomeProduto.substr(0,3).toUpperCase() + productSize.substr(0,1).toUpperCase() + corProduto.substr(0,1).toUpperCase();
    const quantidadeProduto = quantidade || 1;
    const precoProduto = valorProduto || 0;

    addProductToCart(imagemPrincipal,produtoId,nomeProduto,productSize,corProduto,precoProduto,quantidadeProduto);

    window.location.href = '/carrinho?addedToCard=USER_ADDED_TO_CARD'; // Redireciona para a página do carrinho
  });
