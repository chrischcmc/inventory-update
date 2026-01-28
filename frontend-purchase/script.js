async function purchase() {
  const qty = document.getElementById('qty').value;
  const res = await fetch('/purchase', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quantity: parseInt(qty) })
  });
  const data = await res.json();
  document.getElementById('msg').innerText =
    data.success ? `Purchase successful. Balance: ${data.balance}` : data.error;
}
