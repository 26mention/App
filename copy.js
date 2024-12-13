const galleryDiv = document.getElementById('gallery');
const DEPLOYED_URL = 'https://script.google.com/macros/s/AKfycbxpdQ1Mhbqu-27wRSH0UmHAhJf8u7krAnyrB_EOcJgu27AD1l3K7r3k6ztqv6cOmrHcsQ/exec';

fetch(DEPLOYED_URL, {
  method: 'POST',
  body: new URLSearchParams({ action: 'fetchSpecialProducts' }),
})
.then(response => response.json())
.then(data => {
  data.forEach(product => {
    const galleryItemDiv = document.createElement('div');
    galleryItemDiv.className = 'gallery-item';
    galleryItemDiv.innerHTML = `
      <img src="${product.image}" alt="${product.title}">
      <h2>${product.title}</h2>
    `;
    galleryItemDiv.addEventListener('click', () => {
      localStorage.setItem('productData', JSON.stringify(product));
      window.location.href = 'special_products.html';
    });
    galleryDiv.appendChild(galleryItemDiv);
  });
})
.catch(error => console.error('Error fetching special products:', error));
