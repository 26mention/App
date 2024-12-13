if (localStorage.getItem("sdsUsername")) {
    document.getElementById("loginLink").style.display = "none";
} else {
    document.getElementById("loginLink").style.display = "block";
}

const gifs = [
    "https://i.ibb.co/CKbzzWy/anim1.gif",
    "https://i.ibb.co/7tZ5G3c/anim2.gif",
    "https://i.ibb.co/g73xcJN/anim3.gif"
];

let currentIndex = 0;
const gifContainer = document.querySelector('.gif-container');
const gifElement = document.createElement('img');
gifElement.src = gifs[currentIndex];
gifContainer.appendChild(gifElement);

function updateGIF() {
    currentIndex = (currentIndex + 1) % gifs.length;
    gifElement.src = gifs[currentIndex];
}

setInterval(updateGIF, 3000);
function toggleSection(id, element) {
    const links = document.getElementById(id);
    const arrow = element.querySelector('.arrow');
    if (links.style.display === 'block') {
        links.style.display = 'none';
        arrow.classList.remove('expanded');
    } else {
        links.style.display = 'block';
        arrow.classList.add('expanded');
    }
}