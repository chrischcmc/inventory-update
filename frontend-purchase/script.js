// Connect to backend Socket.IO
const socket = io('https://inventory-update.onrender.com');

// Listen for real-time stock updates per product
socket.on('stockUpdate', (update) => {
  // update expected format: { product: "shoes", balance: 95 }
  document.getElementById('msg').innerText =
    `Balance updated for ${update.product}: ${update.balance}`;
});

async function purchase() {
  const product = document.getElementById('product').value;
  const qty = document.getElementById('qty').value;

  const res = await fetch('/purchase', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      product: product,
      quantity: parseInt(qty)
    })
  });

  const data = await res.json();
  document.getElementById('msg').innerText =
    data.success
      ? `Purchase successful. ${product} balance: ${data.balance}`
      : data.error;
}
