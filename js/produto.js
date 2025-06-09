function carregarDetalhes() {
  const produto = JSON.parse(localStorage.getItem("produtoSelecionado"));
  const container = document.getElementById("produtoDetalhes");

  if (!produto) {
    container.innerHTML = "<p>Produto não encontrado.</p>";
    return;
  }

  container.innerHTML = `
    <h2>${produto.name}</h2>
    <img src="${produto.image}" alt="${produto.name}" style="width:100%;max-width:400px;">
    <p><strong>Preço:</strong> R$ ${(produto.price_cents / 100).toFixed(2)}</p>
    <p><strong>Descrição:</strong> ${produto.description || "Sem descrição disponível."}</p>
    <a href="index.html">← Voltar para produtos</a>
  `;
}

carregarDetalhes();
// Adiciona um evento de clique ao botão de voltar
document.getElementById("voltar").addEventListener("click", () => {
  window.location.href = "index.html";
});