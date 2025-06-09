document.getElementById("payBtn").addEventListener("click", async () => {
  const nome = document.getElementById("cliente").value.trim();
  const valor = parseFloat(document.getElementById("valor").value);
  const statusDiv = document.getElementById("status");

  if (!nome || !valor || valor <= 0) {
    statusDiv.textContent = "Preencha corretamente os campos.";
    return;
  }

  statusDiv.textContent = "Iniciando checkout...";
  try {
    const bodyCreate = {
      request_id: "req_" + Date.now(),
      payment_reference_id: "ord_" + Date.now(),
      merchant_ext_id: "meuid",
      store_ext_id: "minhaloja1",
      amount: Math.round(valor * 100),
      currency: "IDR",
      return_url: window.location.href + `?order_id=ord_${Date.now()}`
    };

    const res = await fetch("https://seubackend.com/api/shopeepay/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodyCreate)
    });
    const data = await res.json();

    if (res.ok && data.redirect_url) {
      statusDiv.textContent = "Redirecionando para pagamento...";
      window.location.href = data.redirect_url;
    } else {
      statusDiv.textContent = "Falha ao criar pedido.";
    }
  } catch (err) {
    console.error(err);
    statusDiv.textContent = "Erro ao comunicar com o servidor.";
  }
});

// Ao retornar da ShopeePay
window.addEventListener("load", async () => {
  const params = new URLSearchParams(location.search);
  const orderId = params.get("order_id");
  if (!orderId) return;

  const statusDiv = document.getElementById("status");
  statusDiv.textContent = "Verificando status do pagamento...";

  try {
    const res = await fetch("https://seubackend.com/api/shopeepay/status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ payment_reference_id: orderId })
    });
    const data = await res.json();

    if (res.ok && data.latest_transaction_status === "SUCCESS") {
      statusDiv.textContent = "✅ Pagamento aprovado!";
    } else {
      statusDiv.textContent = `Status: ${data.latest_transaction_status || "desconhecido"}`;
    }
  } catch (err) {
    console.error(err);
    statusDiv.textContent = "Erro ao verificar status.";
  }
});
