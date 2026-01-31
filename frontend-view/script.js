// Connect to backend Socket.IO
const socket = io('https://inventory-update.onrender.com');

// Fetch current stock balances when page loads
function loadStock() {
  console.log('📥 Calling /stock to load inventory...');
  fetch('https://inventory-update.onrender.com/stock')
    .then(res => res.json())
    .then(data => {
      console.log('📦 Received stock data:', data);
      if (data.success) {
        const tbody = document.querySelector('#inventory tbody');
        if (!tbody) {
          console.error('❌ Table body not found in DOM');
          return;
        }
        tbody.innerHTML = ''; // clear existing rows
        data.stock.forEach(item => {
          const row = document.createElement('tr');
          row.id = `item-${item.item_name}`;
          row.innerHTML = `<td>${item.item_name}</td><td>${item.balance}</td>`;
          tbody.appendChild(row);
        });
        console.log('✅ Inventory table populated');
      } else {
        console.error('❌ Failed to load stock:', data.error);
      }
    })
    .catch(err => console.error('❌ Error fetching stock:', err));
}

// Listen for real-time stock updates from backend
socket.on('stockUpdate', (update) => {
  console.log('✅ Received stockUpdate:', update);

  const productName = update.item_name || update.product;
  const balance = update.balance || 0;

  const row = document.getElementById(`item-${productName}`);
  if (row) {
    row.innerHTML = `<td>${productName}</td><td>${balance}</td>`;
    console.log(`🔄 Updated row for ${productName}`);
  } else {
    console.warn(`⚠️ No row found for product: ${productName}, creating new row`);
    const tbody = document.querySelector('#inventory tbody');
    if (tbody) {
      const newRow = document.createElement('tr');
      newRow.id = `item-${productName}`;
      newRow.innerHTML = `<td>${productName}</td><td>${balance}</td>`;
      tbody.appendChild(newRow);
    }
  }
});

// Debug: log all incoming socket events
socket.onAny((event, payload) => {
  console.log(`🔍 Received socket event: ${event}`, payload);
});

// Load stock balances on page load
document.addEventListener('DOMContentLoaded', loadStock);
