const passwordPage = document.getElementById('password-page');
const loginPage = document.getElementById('login-page');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const addPasswordBtn = document.getElementById('add-password-btn');
const passwordList = document.getElementById('passwords');
const loginPasswordInput = document.getElementById('login-password');
const errorMsg = document.getElementById('error-msg');

// Password manager password (in a real app, this should be more secure)
const passwordManagerPassword = 'login'; 

// Login event listener
loginBtn.addEventListener('click', () => {
    const enteredPassword = loginPasswordInput.value;
    if (enteredPassword === passwordManagerPassword) {
        loginPage.style.display = 'none';
        passwordPage.style.display = 'block';
        displayWebsites(); // Show websites after login
    } else {
        errorMsg.textContent = 'Incorrect password!';
    }
});

// Logout event listener
logoutBtn.addEventListener('click', () => {
    loginPage.style.display = 'block';
    passwordPage.style.display = 'none';
    loginPasswordInput.value = '';
    errorMsg.textContent = '';
});

// Add password button event listener
addPasswordBtn.addEventListener('click', () => {
    addNewPassword();
});

// Function to add a new password
function addNewPassword() {
    Swal.fire({
        title: 'Add Password',
        html: `
            <input id="email" class="swal2-input" placeholder="Email">
            <input id="website" class="swal2-input" placeholder="Website">
            <input id="password" class="swal2-input" placeholder="Password">
        `,
        confirmButtonText: 'Save',
        preConfirm: () => {
            const email = document.getElementById('email').value;
            const website = document.getElementById('website').value;
            const password = document.getElementById('password').value;
            if (!email || !website || !password) {
                Swal.showValidationMessage('Please fill out all fields');
                return false;
            }

            // Save the new password to localStorage
            const savedPasswords = JSON.parse(localStorage.getItem('savedPasswords')) || [];
            savedPasswords.push({ email, website, password });
            localStorage.setItem('savedPasswords', JSON.stringify(savedPasswords));
            displayWebsites(); // Refresh the displayed websites
        }
    });
}

// Function to display the saved websites and passwords
function displayWebsites() {
    const savedPasswords = JSON.parse(localStorage.getItem('savedPasswords')) || [];
    passwordList.innerHTML = '';

    if (savedPasswords.length === 0) {
        passwordList.innerHTML = '<li>No websites saved yet.</li>';
        return;
    }

    savedPasswords.forEach((item, index) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <div>
                <strong><span class="tag">Website:</span> ${item.website}</strong><br>
                <strong><span class="tag">Email:</span> ${item.email}</strong>
                <br>
                <strong id="password-${index}" style="display:none;"><span class="tag">Password:</span> ${item.password}</strong>
            </div>
            <button id="toggle-btn-${index}" onclick="togglePasswordVisibility(${index})">Show Password</button> <!-- Show/Hide button -->
            <button class="del" onclick="editPassword(${index})">Edit</button>
            <button class="edi" onclick="deletePassword(${index})">Delete</button>
        `;
        passwordList.appendChild(listItem);
    });
}

// Function to toggle password visibility
function togglePasswordVisibility(index) {
    const passwordField = document.getElementById(`password-${index}`);
    const toggleButton = document.getElementById(`toggle-btn-${index}`);

    if (passwordField.style.display === 'none') {
        passwordField.style.display = 'inline';
        toggleButton.textContent = 'Hide Password'; // Change button label to "Hide"
    } else {
        passwordField.style.display = 'none';
        toggleButton.textContent = 'Show Password'; // Change button label to "Show"
    }
}

// Function to edit password
function editPassword(index) {
    const savedPasswords = JSON.parse(localStorage.getItem('savedPasswords'));
    const password = savedPasswords[index];
    Swal.fire({
        title: 'Edit Password',
        html: `
            <input id="edit-email" class="swal2-input" value="${password.email}" placeholder="Email">
            <input id="edit-website" class="swal2-input" value="${password.website}" placeholder="Website">
            <input id="edit-password" class="swal2-input" value="${password.password}" placeholder="Password">
        `,
        confirmButtonText: 'Save',
        preConfirm: () => {
            const newEmail = document.getElementById('edit-email').value;
            const newWebsite = document.getElementById('edit-website').value;
            const newPassword = document.getElementById('edit-password').value;
            savedPasswords[index] = { email: newEmail, website: newWebsite, password: newPassword };
            localStorage.setItem('savedPasswords', JSON.stringify(savedPasswords));
            displayWebsites(); 
        }
    });
}

// Function to delete password
function deletePassword(index) {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to recover this password!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            const savedPasswords = JSON.parse(localStorage.getItem('savedPasswords'));
            savedPasswords.splice(index, 1);
            localStorage.setItem('savedPasswords', JSON.stringify(savedPasswords));
            displayWebsites(); // Refresh the displayed websites
        }
    });
}

// Service Worker for offline functionality (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js')
            .then(registration => console.log('Service Worker registered', registration))
            .catch(error => console.log('Service Worker registration failed', error));
    });
}
