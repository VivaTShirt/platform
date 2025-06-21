document.addEventListener("DOMContentLoaded", () => {

  let carrosel = document.querySelector('.main-carousel');

    let options = {
      contain: true,
      draggable: true,
      autoplay:1500,
      wrapAround: true,
      pageDots: false
    };

  if (window.innerWidth < 1024) {
    options.prevNextButtons = false;
  } else {
    options.prevNextButtons = true;
  }

  let flkty = new Flickity(carrosel, options);

})

//solicitar produtos novidades...
async function fetchProdutos() {
  try {
    const res = await fetch("https://mocki.io/v1/2b5a066b-ec12-4cc4-a474-cc2cb9182b52");
    const data = await res.json();
    const produtos = data.items;

    const container = document.getElementById("products");
    container.innerHTML = "";

    produtos.forEach((produto) => {
      const div = document.createElement("div");
      div.className = "card";
      div.innerHTML = `
        <img src="${produto.image}" alt="${produto.name}">
        <h3>${produto.name}</h3>
        <p>R$ ${(produto.price_cents / 100).toFixed(2)}</p>
      `;
      div.addEventListener("click", () => {
        localStorage.setItem("produtoSelecionado", JSON.stringify(produto));
        window.location.href = "produto";
      });
      container.appendChild(div);
    });
  } catch (err) {
    console.error("Erro ao buscar produtos:", err);
    document.getElementById("products").innerHTML = "<p>Erro ao carregar produtos.</p>";
  }
}

fetchProdutos();