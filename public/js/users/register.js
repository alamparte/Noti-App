const allInputs = document.querySelectorAll('.allInputs');
const nameError = document.querySelector('.nameError');
const emailError = document.querySelector('.emailError');
const emptyError = document.querySelector('.emptyError');

const username = document.querySelector('#username');
const email = document.querySelector('#email');
const password = document.querySelector('#password');

// register
const getUserData = async (e) => {
    e.preventDefault();
    try {
        let res = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username.value,
                email: email.value,
                password: password.value,
            }),
        });
        if (!res.ok) return;

        let data = await res.json();
        console.log(data);

        if (data.status === 'success') {
            console.log(data.status);
            // window.location.href = '/login';
        } else if (data.error === 'Benutzername bereits verwendet') {
            nameError.innerHTML = data.error;
            username.classList.add('invalid');
        } else if (data.error === 'E-Mail bereits verwendet') {
            emailError.textContent = data.error;
            email.classList.add('invalid');
        } else {
            emptyError.textContent = data.error;

            allInputs.forEach((item) => {
                console.log(item);
                if (item.value == '') {
                    item.classList.add('invalid');
                }
            });
        }
    } catch (error) {
        throw new Error(error);
    }
};

document.querySelector('#register').addEventListener('click', getUserData);

// Remove class
allInputs.forEach((item) => {
    item.addEventListener('focus', () => {
        item.classList.remove('invalid');
        item.classList.remove('valid');
        // error message löschen
        document.querySelectorAll('.error').forEach((item) => {
            item.textContent = '';
        });
    });
});
