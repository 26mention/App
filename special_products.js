const productDetailsDiv = document.getElementById('product-details');
const recommendedPostsListDiv = document.getElementById('recommended-posts-list');
const addToCartButton = document.getElementById('add-to-cart-button');
const buttonGroupDiv = document.querySelector('.button-group');
const DEPLOYED_URL = 'https://script.google.com/macros/s/AKfycbyGgzMgl-ldRG7OihFoKkshEVJ9dG06GqXj2PmnX1xBGfJiUYZwwi8SkAX0sTa88F1EKQ/exec';

let selectedType = '';
let priceDetailsShown = false;
const productData = JSON.parse(localStorage.getItem('productData'));
const style = document.createElement('style');
style.textContent = `
  #alertBox {
    display: none;
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #000;
    color: #fff;
    padding: 10px 20px;
    border-radius: 5px;
    font-size: 16px;
    width: 80%;
    z-index: 1000;
  }
  .selected {
    background-color: #000;
    color: #fff;
  }
`;
document.head.appendChild(style);

const alertBox = document.createElement('div');
alertBox.id = 'alertBox';
document.body.appendChild(alertBox);

function showAlert(message) {
  alertBox.textContent = message;
  alertBox.style.display = 'block';
  setTimeout(() => {
    alertBox.style.display = 'none';
  }, 5000);
}

productDetailsDiv.innerHTML = `
  <h2>${productData.title}</h2>
  <img src="${productData.image}">
  <div class="price-make">
  <del><p id="rest-price"></p></del>
  <p id="cut-price"></p>
  </div>
  <div class="back-btn">
    ${productData.columnB && productData.columnB.split(',')[0] ? `<button id="button-columnB" onclick="showPriceDetails('${productData.columnB.split(',')[1]}', '${productData.columnB.split(',')[2]}', 'columnB')" class="columnb">${productData.columnB.split(',')[0]}</button>` : ''}
    ${productData.columnC && productData.columnC.split(',')[0] ? `<button id="button-columnC" onclick="showPriceDetails('${productData.columnC.split(',')[1]}', '${productData.columnC.split(',')[2]}', 'columnC')" class="columnb">${productData.columnC.split(',')[0]}</button>` : ''}
    ${productData.columnD && productData.columnD.split(',')[0] ? `<button id="button-columnD" onclick="showPriceDetails('${productData.columnD.split(',')[1]}', '${productData.columnD.split(',')[2]}', 'columnD')" class="columnb">${productData.columnD.split(',')[0]}</button>` : ''}
    ${productData.columnE && productData.columnE.split(',')[0] ? `<button id="button-columnE" onclick="showPriceDetails('${productData.columnE.split(',')[1]}', '${productData.columnE.split(',')[2]}', 'columnE')" class="columnb">${productData.columnE.split(',')[0]}</button>` : ''}
  </div>
`;

fetch(DEPLOYED_URL, {
  method: 'POST',
  body: new URLSearchParams({ action: 'fetchSpecialProducts' }),
})
  .then(response => response.json())
  .then(data => {
    const product = data.find(p => p.title === productData.title);
    const buttonGroupLabels = product.buttonGroups.split(',');
    buttonGroupDiv.innerHTML = '';
    buttonGroupLabels.forEach(label => {
      const button = document.createElement('button');
      button.className = 'btn-b';
      button.textContent = label;
      button.onclick = () => handleButtonClick(label);
      buttonGroupDiv.appendChild(button);
    });
  })
  .catch(error => console.error('Error fetching product data:', error));

function showPriceDetails(restPrice, cutPrice, buttonId) {
  const priceDetailsDiv = document.getElementById('price-details');
  priceDetailsDiv.style.display = 'block';
  document.getElementById('rest-price').innerText = `MRP: ${restPrice}`;
  document.getElementById('cut-price').innerText = `Price: ${cutPrice}`;
  priceDetailsShown = true;
  checkAddToCartButton();
  resetButtonSelection();
  document.getElementById(`button-${buttonId}`).classList.add('selected');
}

function handleButtonClick(type) {
  selectedType = type;
  const buttons = document.querySelectorAll('.btn-b');
  buttons.forEach(button => {
    if (button.textContent === type) {
      button.classList.add('selected');
    } else {
      button.classList.remove('selected');
    }
  });
  checkAddToCartButton();
}

function checkAddToCartButton() {
  if (selectedType && priceDetailsShown) {
    addToCartButton.style.display = 'block';
  } else {
    addToCartButton.style.display = 'none';
  }
}

function addToCart() {
  const sdsUsername = localStorage.getItem('sdsUsername');
  if (!sdsUsername) {
    showAlert('Please log in to add items to the cart.');
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 5000);
    return;
  }
  if (!selectedType) {
    showAlert('Please Select Subject.');
    return;
  }
  const cartItem = {
    name: `${productData.title} (${selectedType})`,
    price: document.getElementById('cut-price').innerText.split(': ')[1],
    quantity: 1,
    imageUrl: productData.image,
  };
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const existingItemIndex = cart.findIndex(item => item.name === cartItem.name);
  if (existingItemIndex !== -1) {
    cart[existingItemIndex].quantity += 1;
  } else {
    cart.push(cartItem);
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  showAlert(`${cartItem.name} has been added to the cart!`);
}

function resetButtonSelection() {
  ['B', 'C', 'D', 'E'].forEach(col => {
    const button = document.getElementById(`button-column${col}`);
    if (button) button.classList.remove('selected');
  });
}
