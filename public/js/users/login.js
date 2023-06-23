const allInputs = document.querySelectorAll('.allInputs');
const nameError = document.querySelector('.nameError');
const emailError = document.querySelector('.emailError');
const emptyError = document.querySelector('.emptyError');
const passError = document.querySelector('.passError');

const email = document.querySelector('#email');
const password = document.querySelector('#password');

// login
const getLoginData = async (e) => {
    e.preventDefault();
    try {
        let res = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email.value,
                password: password.value,
            }),
        });
        if (!res.ok) return;

        let data = await res.json();
        console.log(data);
        renderResponse(data);
    } catch (error) {
        throw new Error(error);
    }
};
document.querySelector('form').addEventListener('submit', getLoginData);

const renderResponse = (data) => {
    emptyError.style.color = data.status === 'success' ? '#919537' : 'red';
    if (data.status === 'success') {
        // q la pagina carga cpon un spin, puede ser mi logo y alrededor gira el spin
        //y luego al home
        emptyError.textContent = data.message;
        allInputs.forEach((item) => {
            item.classList.add('valid');
        });
        setTimeout(() => {
            window.location.href = '/dashboard';
        }, 1000);
    } else if (data.status === 'email-error') {
        emailError.textContent = data.error;
        email.classList.add('invalid');
    } else if (data.status === 'password-error') {
        passError.textContent = data.error;
        password.classList.add('invalid');
    }else{
        emptyError.textContent = data.error;
        //add red color to all empty inputs
        allInputs.forEach((item) => {
            if (item.value == '') {
                item.classList.add('invalid');
            }
        });
    }
};

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
