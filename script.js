let cart = [];
let itemToBeAdded = null;
let allData = [];
let isSearchContainerVisible = false;

const fetchData = async () => {
    try {
        document.body.classList.add('blur-effect');
        const response = await fetch('https://script.google.com/macros/s/AKfycbzWMr9VdRNAz4scFju2CyCfkmjblr43C5tVIHRRuFCedG3egRRs0b6s2kJS0W9L9Pw0Qw/exec');
        allData = await response.json();
        generateFilterButtons(allData);
    } catch (error) {
        console.error('Error fetching data:', error);
        document.getElementById('dataContainer').innerHTML = '<p style="display:none;">There was an error loading the data.</p>';
    } finally {
        document.getElementById('loading').style.display = 'none';
        document.getElementById('blurBackground').style.display = 'none';
        document.body.classList.remove('blur-effect');
    }
};

const searchProducts = () => {
    const query = document.getElementById('searchBox').value.toLowerCase();
    const filteredData = allData.filter(item => item.name.toLowerCase().includes(query));

    if (filteredData.length > 0) {
        displayData(filteredData);
        document.querySelectorAll('.books').forEach(div => {
            div.style.display = 'none';
        });
        document.querySelectorAll('.offer-div').forEach(div => {
            div.style.display = 'none';
        });
    } else {
        document.getElementById('dataContainer').innerHTML = '<p>No products found.</p>';
        document.querySelectorAll('.offer-div').forEach(div => {
            div.style.display = 'block';
        });
    }

    document.getElementById('dataContainer').style.display = 'block';
};

const toggleSearchContainer = () => {
    const searchContainer = document.querySelector('.search-container');
    const blurBackground = document.getElementById('blurBackground');
    const dataContainer = document.getElementById('dataContainer');
    const bodyChildren = Array.from(document.body.children);

    isSearchContainerVisible = !isSearchContainerVisible;

    if (isSearchContainerVisible) {
        bodyChildren.forEach(child => {
            if (child !== searchContainer && child !== dataContainer) {
                child.style.display = 'none';
            }
        });

        searchContainer.style.display = 'flex';
        blurBackground.style.display = 'block';
        document.body.classList.add('blur-effect');
        document.getElementById('searchBox').focus();
        dataContainer.style.display = 'none';
    } else {
        bodyChildren.forEach(child => {
            child.style.display = '';
        });

        searchContainer.style.display = 'none';
        blurBackground.style.display = 'none';
        document.body.classList.remove('blur-effect');
        document.getElementById('searchBox').value = '';
        dataContainer.style.display = 'none';
    }
};

const displayData = (data) => {
    const container = document.getElementById('dataContainer');
    container.innerHTML = '';
    data.forEach(item => {
        const div = document.createElement('div');
        div.className = 'item';
        div.innerHTML = `
            <img src="${item.imageUrl}" alt="${item.name}" onclick='viewProduct("${item.name}")'>
            <div class="box-d">
                <h2 class="head-t">${item.name}</h2>
                <p style="text-align: left;" class="text-p">${item.description}</p>
                <del><p class="price">M.R.P: ₹${item.disprice}</p></del>
                <p class="price">Price: ₹${item.price}</p>
            </div>
            <button onclick='checkLoginStatus("${item.name}", ${item.price})'><p>Add To Cart</p></button>
        `;
        container.appendChild(div);
    });

    if (data.length > 0) {
        document.querySelectorAll('.offer-div').forEach(div => {
            div.style.display = 'none';
        });
        document.querySelector('.head-part').style.display = 'none';
        document.querySelector('.books').style.display = 'none';
        container.style.display = 'block';
    } else {
        container.innerHTML = '<p>No products found.</p>';
        document.querySelector('.head-part').style.display = 'block';
        document.querySelectorAll('.offer-div').forEach(div => {
            div.style.display = 'block';
        });
    }
};

const generateFilterButtons = (data) => {
    const filterContainer = document.getElementById('filterContainer');
    filterContainer.innerHTML = '';
    const types = [...new Set(data.map(item => item.type))];
    types.forEach(type => {
        const button = document.createElement('button');
        button.textContent = type;
        button.onclick = () => filterData(type);
        filterContainer.appendChild(button);
    });
};

const filterData = (type) => {
    const filteredData = type ? allData.filter(item => item.type === type) : allData;
    displayData(filteredData);
    document.getElementById('dataContainer').style.display = 'block';
};

const viewProduct = (name) => {
    const product = allData.find(item => item.name === name);
    if (product) {
        localStorage.setItem('currentProduct', JSON.stringify(product));
        window.location.href = 'product.html';
    }
};

const checkLoginStatus = (name, price) => {
    if (!localStorage.getItem('loggedIn') || !localStorage.getItem('sdsUsername')) {
        itemToBeAdded = { name, price };
        window.location.href = 'login.html';
    } else {
        addToCart(name, price);
    }
};

const addToCart = (name, price) => {
    const product = allData.find(item => item.name === name);
    if (!product) return;

    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price, quantity: 1, imageUrl: product.imageUrl });
    }
    saveCart();
    updateCart();
};

const updateCart = () => {
    const cartItems = document.getElementById('cartItems');
    const cartCounter = document.getElementById('cartCounter');
    cartItems.innerHTML = '';
    let totalItems = 0;

    cart.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <img src="${item.imageUrl}">
            <p>${item.name}</p> - ₹${item.price}
            <button onclick="decreaseQuantity(${index})" class="btn-boy">-</button>
            <span>${item.quantity}</span>
            <button onclick="increaseQuantity(${index})" class="btn-boy">+</button>
            <button onclick="removeFromCart(${index})" class="btn-rmv"><span class="material-symbols-outlined">delete</span></button>`;
        cartItems.appendChild(div);
        totalItems += item.quantity;
    });
    cartCounter.textContent = totalItems;
};

const increaseQuantity = (index) => {
    cart[index].quantity += 1;
    saveCart();
    updateCart();
};

const decreaseQuantity = (index) => {
    if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
    } else {
        removeFromCart(index);
    }
    saveCart();
    updateCart();
};

const removeFromCart = (index) => {
    cart.splice(index, 1);
    saveCart();
    updateCart();
};

const saveCart = () => {
    localStorage.setItem('cart', JSON.stringify(cart));
};

const loadCart = () => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
    updateCart();
};

const toggleCart = () => {
    const cartContainer = document.getElementById('cartContainer');
    const dataContainer = document.getElementById('dataContainer');
    cartContainer.style.display = cartContainer.style.display === 'none' || !cartContainer.style.display ? 'block' : 'none';
    dataContainer.classList.toggle('hidden');
};

const closeCart = () => {
    document.getElementById('cartContainer').style.display = 'none';
    document.getElementById('dataContainer').classList.remove('hidden');
};

const goToCartPage = () => {
    if (cart.length === 0) {
        showAlert('Your cart is empty. Please add items to the cart before proceeding.');
    } else {
        window.location.href = 'checkout.html';
    }
};

const toggleMenu = () => {
    const sideMenu = document.getElementById('side-menu');
    const blurBackground = document.getElementById('blurBackground');
    sideMenu.style.width = sideMenu.style.width === '60%' ? '0' : '60%';
    blurBackground.style.display = blurBackground.style.display === 'block' ? 'none' : 'block';
};

const showAlert = (message) => {
    const alertBox = document.createElement('div');
    alertBox.className = 'alert-box';
    alertBox.textContent = message;

    document.body.appendChild(alertBox);

    setTimeout(() => {
        alertBox.remove();
    }, 5000);
};

const style = document.createElement('style');
style.textContent = `
    .alertBox {
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
    text-align: center;
  }
`;
document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', () => {
    const searchContainer = document.querySelector('.search-container');
    searchContainer.style.display = 'none';

    const searchIcon = document.getElementById('searchIcon');
    searchIcon.addEventListener('click', toggleSearchContainer);

    document.addEventListener('click', (event) => {
        const searchContainer = document.querySelector('.search-container');
        const searchIcon = document.getElementById('searchIcon');
        
        if (isSearchContainerVisible && 
            !searchContainer.contains(event.target) && 
            !searchIcon.contains(event.target)) {
            toggleSearchContainer();
        }
    });

    const searchBox = document.getElementById('searchBox');
    searchBox.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchProducts();
            toggleSearchContainer();
        }
    });
});

loadCart();
fetchData();
