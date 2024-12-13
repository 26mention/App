const pincodeMapping = {
    "827010": { state: "Jharkhand", city: "Bokaro" }
};
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
    z-index: 1000;
    width: 80%;
    text-align: center;
  }
`;
document.head.appendChild(style);

// Create the alert box
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

function displayMessage(elementId, message) {
    $("#" + elementId).text(message).show();
}

function clearMessage(elementId) {
    $("#" + elementId).hide();
}

function validateEmail() {
    var email = $("#email").val();
    if (!isValidEmail(email)) {
        showAlert("Please enter a valid email.");
        return;
    }
    var username = $("#username").val();
    var password = $("#password").val();
    localStorage.setItem('password', password);
    requestOTP();
}

function isValidEmail(email) {
    var emailPattern = /^[a-zA-Z0-9._-]+@(gmail|yahoo)\.com$/;
    return emailPattern.test(email);
}

function showPassword() {
    var passwordField = document.getElementById("password");
    passwordField.type = (passwordField.type === "password") ? "text" : "password";
}

function requestOTP() {
    var email = $("#email").val();
    var username = $("#username").val();
    fetch(`https://script.google.com/macros/s/AKfycbzbzavZnxchimBpQZSQWXQjVOzJglyz4S2Mghv2Un_mp1JW1tlmk4i2cRwzWPCjJPLCDQ/exec?requestOTP=true&email=${email}&username=${username}`)
        .then(response => response.text())
        .then(data => {
            if (data === 'Email already exists' || data === 'Username already exists') {
                showAlert(data);
            } else {
                sendOTP(email);
            }
        })
        .catch(error => console.error('Error:', error));
}

function sendOTP(email) {
    fetch(`https://script.google.com/macros/s/AKfycbzbzavZnxchimBpQZSQWXQjVOzJglyz4S2Mghv2Un_mp1JW1tlmk4i2cRwzWPCjJPLCDQ/exec?requestOTP=true&email=${email}`)
        .then(response => response.text())
        .then(data => {
            if (data === 'OTP sent to Google Sheets') {
                $("#otpForm").show();
                $("#signupForm").hide();
                clearMessage("message");
            } else {
                showAlert(data);
            }
        })
        .catch(error => console.error('Error:', error));
}

function verifyOTP() {
    var otpEntered = $("#otp").val();
    var email = $("#email").val();
    fetch(`https://script.google.com/macros/s/AKfycbzbzavZnxchimBpQZSQWXQjVOzJglyz4S2Mghv2Un_mp1JW1tlmk4i2cRwzWPCjJPLCDQ/exec?verifyOTP=true&email=${email}&otp=${otpEntered}`)
        .then(response => response.text())
        .then(data => {
            if (data === 'OTP verified') {
                localStorage.setItem('email', email);
                localStorage.setItem('username', $("#username").val());
                $("#otpForm").hide();
                $("#detailsForm").show();
            } else {
                showAlert(data);
            }
        })
        .catch(error => console.error('Error:', error));
}

function submitDetails() {
    var email = localStorage.getItem('email');
    var username = localStorage.getItem('username');
    var password = localStorage.getItem('password');
    var name = $("#name").val();
    var mobile = $("#mobile").val();
    var pincode = $("#pincode").val();
    var state = $("#state").val();
    var city = $("#city").val();
    var address = $("#address").val();
    if (!name || !mobile || !pincode || !state || !city || !address) {
        showAlert("All fields are required");
        return;
    }
    fetch(`https://script.google.com/macros/s/AKfycbzbzavZnxchimBpQZSQWXQjVOzJglyz4S2Mghv2Un_mp1JW1tlmk4i2cRwzWPCjJPLCDQ/exec?email=${email}&username=${username}&password=${password}&name=${name}&mobile=${mobile}&pincode=${pincode}&state=${state}&city=${city}&address=${address}`)
        .then(response => response.text())
        .then(data => {
            if (data === 'Signup successfully') {
                showAlert("Signup successfully");
                setTimeout(() => window.location.href = "login.html", 4000);
            } else {
                showAlert(data);
            }
        })
        .catch(error => console.error('Error:', error));
}

$("#pincode").on("input", function() {
    var pincode = $(this).val();
    if (pincodeMapping[pincode]) {
        $("#state").val(pincodeMapping[pincode].state);
        $("#city").val(pincodeMapping[pincode].city);
    } else {
        $("#state").val("");
        $("#city").val("");
        if (pincode.length === 6) {
            showAlert("Pincode not found");
        }
    }
});
