const products = [
  {
    id: 1,
    name: 'SPC ЛАМИНАТ ROYCE ENJOY ДУБ ЭШФОРД E310',
    cls: '42 класс 3.5 мм',
    price: 1390, oldPrice: null,
    img: 'img/card1.jpg',
    badges: []
  },
  {
    id: 2,
    name: 'SPC ЛАМИНАТ ROYCE ENJOY ДУБ НОРДБОРГ E306',
    cls: '42 класс 3.5 мм',
    price: 1390, oldPrice: null,
    img: 'img/card2.jpg',
    badges: []
  },
  {
    id: 3,
    name: 'SPC ЛАМИНАТ ROYCE ENJOY ДУБ БЛЭКРОК E308',
    cls: '42 класс 3.5 мм',
    price: 1390, oldPrice: null,
    img: 'img/card3.jpg',
    badges: []
  },
  {
    id: 4,
    name: 'SPC ЛАМИНАТ MODULEO LAYRED LAUREL OAK 51864',
    cls: '33 класс 6 мм',
    price: 1890, oldPrice: 2240,
    img: 'img/card4.jpg',
    badges: ['%', 'New']
  },
  {
    id: 5,
    name: 'SPC ЛАМИНАТ MODULEO LAYRED CANTERA 46930',
    cls: '33 класс 6 мм',
    price: 1790, oldPrice: 2170,
    img: 'img/card5.jpeg',
    badges: ['%', 'New']
  },
  {
    id: 6,
    name: 'SPC ЛАМИНАТ MODULEO LAYRED MOUNTAIN OAK 56275',
    cls: '33 класс 6 мм',
    price: 1850, oldPrice: 2030,
    img: 'img/card6.jpg',
    badges: ['%', 'New']
  },
];

function formatPriceHTML(price, oldPrice = null) {
  return `
    <span class="price-cur">${price.toLocaleString('ru')} ₽</span>
    ${oldPrice ? `<span class="price-old">${oldPrice.toLocaleString('ru')} ₽</span>` : ''}
    <span class="price-unit">/ м²</span>
  `;
}

function renderCards() {
  document.getElementById('cardsGrid').innerHTML = products.map(p => `
    <div class="card">
      <div class="card-img-wrap">
        <img src="${p.img}" alt="${p.name}" onerror="this.style.opacity='0'">
        <div class="badges">
          ${p.badges.includes('%') ? '<span class="badge badge-pct">%</span>' : ''}
          ${p.badges.includes('New') ? '<span class="badge badge-new">New</span>' : ''}
        </div>
        <div class="card-dots">
          <span class="dot active"></span><span class="dot"></span>
        </div>
      </div>
      <div class="card-body">
        <div class="card-name">${p.name}</div>
        <div class="card-class">${p.cls}</div>
        <div class="card-price-row">
          ${formatPriceHTML(p.price, p.oldPrice)}
        </div>
        <button class="btn-buy" onclick="openModal(${p.id})">Купить в 1 клик</button>
      </div>
    </div>
  `).join('');
}

// Всплывающее окно
function openModal(id) {
  const p = products.find(x => x.id === id);
  document.getElementById('mImg').src = p.img;
  document.getElementById('mName').textContent = p.name;
  document.getElementById('mClass').textContent = p.cls;
  document.getElementById('mPrice').innerHTML = formatPriceHTML(p.price, p.oldPrice);
  
  document.getElementById('fName').value = '';
  document.getElementById('fPhone').value = '';
  document.getElementById('fConsent').checked = false;
  clearErrors();
  document.getElementById('overlay').dataset.pid = id;
  document.getElementById('overlay').classList.add('open');
}

function closeModal() { 
  document.getElementById('overlay').classList.remove('open'); 
}

function outsideClose(e) { 
  if (e.target.id === 'overlay') closeModal(); 
}

// Маска телефона
document.getElementById('fPhone').addEventListener('input', function() {
  let v = this.value.replace(/\D/g, '');
  if (v.startsWith('8')) v = '7' + v.slice(1);
  if (!v.startsWith('7')) v = '7' + v;
  v = v.slice(0, 11);
  let r = '+7';
  if (v.length > 1) r += ' (' + v.slice(1, 4);
  if (v.length >= 4) r += ') ' + v.slice(4, 7);
  if (v.length >= 7) r += '-' + v.slice(7, 9);
  if (v.length >= 9) r += '-' + v.slice(9, 11);
  this.value = r;
});

function clearErrors() {
  ['fName','fPhone'].forEach(id => {
    document.getElementById(id).classList.remove('error');
  });
  ['errName','errPhone'].forEach(id => {
    document.getElementById(id).classList.remove('show');
  });
}

// Отправка заказа
function submitOrder() {
  clearErrors();
  let ok = true;
  const name = document.getElementById('fName').value.trim();
  const nameValid = /^[а-яёА-ЯЁa-zA-Z\s\-]+$/.test(name);
  const phone = document.getElementById('fPhone').value.replace(/\D/g,'');
  const consent = document.getElementById('fConsent').checked;
  
  if (!name || !nameValid) {
    document.getElementById('fName').classList.add('error');
    document.getElementById('errName').textContent = !name ? 'Заполните Имя' : 'Имя может содержать только буквы';
    document.getElementById('errName').classList.add('show');
    ok = false;
  }
  
  if (phone.length < 11) {
    document.getElementById('fPhone').classList.add('error');
    document.getElementById('errPhone').classList.add('show');
    ok = false;
  }
  
  if (!consent) {
    alert('Пожалуйста, дайте согласие на обработку персональных данных');
    ok = false;
  }
  
  if (!ok) return;

  const pid = document.getElementById('overlay').dataset.pid;
  const p = products.find(x => x.id == pid);
  const orders = JSON.parse(localStorage.getItem('qv_orders') || '[]');
  orders.push({
    id: Date.now(),
    productId: p.id,
    productName: p.name,
    productClass: p.cls,
    productPrice: p.price,
    customerName: name,
    customerPhone: document.getElementById('fPhone').value,
    status: 'Новый',
    date: new Date().toLocaleString('ru')
  });
  localStorage.setItem('qv_orders', JSON.stringify(orders));

  closeModal();
  
  const toast = document.getElementById('toast');
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
renderCards();