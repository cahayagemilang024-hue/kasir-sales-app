let products = JSON.parse(localStorage.getItem('products')) || [
  { id: 1, name: 'Produk A', price: 15000, stock: 20 },
  { id: 2, name: 'Produk B', price: 28000, stock: 15 },
  { id: 3, name: 'Produk C', price: 12000, stock: 30 },
];
let notaItems = JSON.parse(localStorage.getItem('notaItems')) || [];
let orders = JSON.parse(localStorage.getItem('orders')) || [];

function saveData() {
  localStorage.setItem('products', JSON.stringify(products));
  localStorage.setItem('notaItems', JSON.stringify(notaItems));
  localStorage.setItem('orders', JSON.stringify(orders));
}

function showPage(pageId) {
  document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
  document.getElementById(pageId).classList.add('active');
}

function formatRp(value) {
  return 'Rp ' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function renderProducts() {
  const selectKasir = document.getElementById('kasir-produk');
  const selectOrder = document.getElementById('order-product');
  const tableBody = document.getElementById('product-table');
  selectKasir.innerHTML = '';
  selectOrder.innerHTML = '';
  tableBody.innerHTML = '';

  products.forEach(product => {
    const option1 = document.createElement('option');
    option1.value = product.id;
    option1.textContent = `${product.name} (${formatRp(product.price)})`;
    selectKasir.appendChild(option1);

    const option2 = option1.cloneNode(true);
    selectOrder.appendChild(option2);

    const row = document.createElement('tr');
    row.innerHTML = `<td>${product.name}</td><td>${formatRp(product.price)}</td><td>${product.stock}</td>`;
    tableBody.appendChild(row);
  });

  updateKasirHarga();
  updateOrderHarga();
}

function updateKasirHarga() {
  const productId = Number(document.getElementById('kasir-produk').value);
  const qty = Number(document.getElementById('kasir-qty').value);
  const product = products.find(item => item.id === productId);
  const total = product ? product.price * qty : 0;
  document.getElementById('kasir-total').textContent = formatRp(total);
}

function updateOrderHarga() {
  const productId = Number(document.getElementById('order-product').value);
  const qty = Number(document.getElementById('order-qty').value);
  const product = products.find(item => item.id === productId);
  const total = product ? product.price * qty : 0;
  document.getElementById('order-total').textContent = formatRp(total);
}

function addKasirItem() {
  const productId = Number(document.getElementById('kasir-produk').value);
  const qty = Number(document.getElementById('kasir-qty').value);
  const product = products.find(item => item.id === productId);
  if (!product || qty < 1 || qty > product.stock) {
    alert('Stok tidak cukup atau pilihan produk belum valid.');
    return;
  }

  const existing = notaItems.find(item => item.product.id === productId);
  if (existing) {
    existing.qty += qty;
  } else {
    notaItems.push({ product, qty });
  }
  product.stock -= qty;
  renderNota();
  renderProducts();
  saveData();
}

function renderNota() {
  const list = document.getElementById('nota-list');
  list.innerHTML = '';
  let subtotal = 0;

  notaItems.forEach(item => {
    subtotal += item.product.price * item.qty;
    const li = document.createElement('li');
    li.textContent = `${item.product.name} x${item.qty} = ${formatRp(item.product.price * item.qty)}`;
    list.appendChild(li);
  });

  document.getElementById('kasir-subtotal').textContent = formatRp(subtotal);
  document.getElementById('kasir-bayar').value = subtotal;
  renderKasirSummary();
  renderReport();
}

function completeTransaction() {
  if (notaItems.length === 0) {
    alert('Tidak ada item di nota.');
    return;
  }
  const subtotal = notaItems.reduce((sum, item) => sum + item.product.price * item.qty, 0);
  const bayar = Number(document.getElementById('kasir-bayar').value);
  if (bayar < subtotal) {
    alert('Jumlah bayar kurang dari subtotal.');
    return;
  }
  notaItems.length = 0; // Clear nota
  document.getElementById('kasir-bayar').value = 0;
  renderNota();
  renderReport();
  saveData();
  alert('Transaksi selesai!');
}

function addFieldOrder() {
  const customer = document.getElementById('order-customer').value.trim();
  const productId = Number(document.getElementById('order-product').value);
  const qty = Number(document.getElementById('order-qty').value);
  const product = products.find(item => item.id === productId);

  if (!customer || !product || qty < 1) {
    alert('Isi nama pelanggan dan pilih produk dengan jumlah benar.');
    return;
  }

  orders.push({ customer, product, qty, total: product.price * qty, date: new Date() });
  renderOrders();
  renderReport();
  document.getElementById('order-customer').value = '';
  saveData();
}

function renderOrders() {
  const list = document.getElementById('order-list');
  list.innerHTML = '';
  orders.forEach(order => {
    const li = document.createElement('li');
    li.textContent = `${order.customer}: ${order.product.name} x${order.qty} = ${formatRp(order.total)}`;
    list.appendChild(li);
  });
}

function addProduct() {
  const name = document.getElementById('product-name').value.trim();
  const price = Number(document.getElementById('product-price').value);
  const stock = Number(document.getElementById('product-stock').value);

  if (!name || price <= 0 || stock < 0) {
    alert('Isi nama, harga, dan stok produk dengan benar.');
    return;
  }

  products.push({ id: Date.now(), name, price, stock });
  document.getElementById('product-name').value = '';
  document.getElementById('product-price').value = '';
  document.getElementById('product-stock').value = '';
  renderProducts();
  renderReport();
  saveData();
}

function renderReport() {
  const totalSales = notaItems.reduce((sum, item) => sum + item.product.price * item.qty, 0);
  document.getElementById('report-transactions').textContent = notaItems.length;
  document.getElementById('report-sales').textContent = formatRp(totalSales);
  document.getElementById('report-orders').textContent = orders.length;

  const lowStock = products.filter(item => item.stock <= 5);
  const list = document.getElementById('low-stock');
  list.innerHTML = '';
  if (lowStock.length === 0) {
    list.innerHTML = '<li>Tidak ada stok rendah.</li>';
    return;
  }
  lowStock.forEach(item => {
    const li = document.createElement('li');
    li.textContent = `${item.name} - Stok ${item.stock}`;
    list.appendChild(li);
  });
}

renderProducts();
renderOrders();
renderReport();
showPage('kasir');