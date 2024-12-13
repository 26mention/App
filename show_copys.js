async function fetchProducts() {
    const loader = document.querySelector('#loading');
    loader.style.display = 'block';

    try {
        const response = await fetch("https://script.google.com/macros/s/AKfycbzyizpClSG3FtMqLT368fHSbJJ46XQL4nl6HSEwBEUOyLZgT-4nAuXZKWVJ8llBMMqefA/exec", {
            method: "POST"
        });
        let products = await response.json();
        products = products.sort(() => Math.random() - 0.5);

        let currentIndex = 0;
        const productContainer = document.getElementById('copys');
        const renderProduct = (index) => {
            const product = products[index];
            productContainer.innerHTML = `
            <div class="product-container">
                    <img src="${product.imageUrl}" alt="${product.productName}" />
                    <button onclick='checkLoginStatus("${product.productName}", ${product.price})'>Add To Cart</button>
                </div>
                <div class="full-product">
                        <div class="product-name">${product.productName}</div>
                        <div class="product-price">Price: ₹${product.price}</div>
                        <div class="product-mrp">MRP: ₹${product.mrp}</div>
                    </div>
                <div class="navigation">
                    <button id="prev-btn" ${index === 0 ? 'disabled' : ''}><span class="material-symbols-outlined">arrow_back_ios</span></button>
                    <button id="next-btn" ${index === products.length - 1 ? 'disabled' : ''}><span class="material-symbols-outlined">arrow_forward_ios</span></button>
                </div>
            `;

            document.getElementById('prev-btn').addEventListener('click', () => {
                if (currentIndex > 0) {
                    currentIndex -= 1;
                    renderProduct(currentIndex);
                }
            });

            document.getElementById('next-btn').addEventListener('click', () => {
                if (currentIndex < products.length - 1) {
                    currentIndex += 1;
                    renderProduct(currentIndex);
                }
            });

            const saveProductAndNavigate = () => {
                const currentProduct = {
                    name: product.productName,
                    imageUrl: product.imageUrl,
                    price: product.price,
                    mrp: product.mrp,
                    additionalImages: product.additionalImages || []
                };
                localStorage.setItem('currentProduct', JSON.stringify(currentProduct));
                window.location.href = 'product.html';
            };

            productContainer.querySelector('.product-name').addEventListener('click', saveProductAndNavigate);
            productContainer.querySelector('img').addEventListener('click', saveProductAndNavigate);
        };

        renderProduct(currentIndex);
    } catch (error) {
        console.error('Error fetching products:', error);
        console.log('Failed to load products. Please try again later.');
    } finally {
        loader.style.display = 'none';
    }
}

fetchProducts();
