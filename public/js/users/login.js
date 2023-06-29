const allInputs = document.querySelectorAll('.allInputs');
const nameError = document.querySelector('.nameError');
const emailError = document.querySelector('.emailError');
const emptyError = document.querySelector('.emptyError');
const passError = document.querySelector('.passError');
const inputBox = document.querySelector('.inputBox');
const main = document.querySelector('main');

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
        // emptyError.textContent = data.message;
        // allInputs.forEach((item) => {
        //     item.classList.add('valid');
        // });
        // setTimeout(() => {
        //     window.location.href = '/dashboard';
        // }, 1000);

        redirectHome();
    } else if (data.status === 'email-error') {
        emailError.textContent = data.error;
        email.classList.add('invalid');
    } else if (data.status === 'password-error') {
        passError.textContent = data.error;
        password.classList.add('invalid');
    } else {
        emptyError.textContent = data.error;
        if (email.value == '') {
            email.classList.add('invalid');
        }
        let parentElem = password.parentElement;
        if (password.value == '') {
            parentElem.classList.add('invalid');
        }
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
// Remove class from the div parent
password.addEventListener('focus', () => {
    let parentElem = password.parentElement;
    parentElem.classList.remove('invalid');
});

// show/hide password
const svg = document.querySelector('svg');
svg.addEventListener('click', () => {
    if (password.type === 'password') {
        password.type = 'text';
        svg.innerHTML = ` <path
            d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"
        />`;
    } else {
        password.type = 'password';
        svg.innerHTML = ` <path
        d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zM223.1 149.5C248.6 126.2 282.7 112 320 112c79.5 0 144 64.5 144 144c0 24.9-6.3 48.3-17.4 68.7L408 294.5c8.4-19.3 10.6-41.4 4.8-63.3c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3c0 10.2-2.4 19.8-6.6 28.3l-90.3-70.8zM373 389.9c-16.4 6.5-34.3 10.1-53 10.1c-79.5 0-144-64.5-144-144c0-6.9 .5-13.6 1.4-20.2L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5L373 389.9z"
    />`;
    }
});

const redirectHome = () => {
    // hide main
    main.style.display = 'none';

    const div = document.createElement('div');
    div.setAttribute('id', 'spin');
    div.classList.add('spinner');
    const svg = renderLinkIcon();
    div.append(svg);

    document.querySelector('body').prepend(div);
    div.style.visibility = 'visible';

    setTimeout(() => {
        div.remove();
        main.style.display = 'grid';
        window.location.href = '/dashboard';
    }, 1000);
    //cambiar a 5000 despues
};

//create SVGs pinner
const renderLinkIcon = () => {
    const iconSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const iconPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');

    iconSvg.setAttribute('viewBox', '0 0 177.64 181.1');
    iconSvg.setAttribute('height', '5rem');
    iconSvg.setAttribute('fill', 'rgb(34, 178, 34)');
    iconSvg.setAttribute('stroke', 'rgb(34, 178, 34)');

    iconPath.setAttribute(
        'd',
        'M84.58,129.09c-4-1.46-7.84-3.27-11.91-4.3-14-3.55-25.66,1.55-36,10.54C25.06,145.48,17,158.26,10.36,172a10.73,10.73,0,0,1-1.26,2.51,9,9,0,0,1-1.67,1.38A1,1,0,0,1,6,175.64a4.47,4.47,0,0,1-1-2.25c.39-12.82,2.36-25.3,9.1-36.52,1.9-3.17,2.12-6.21.19-9.27C7.23,116.45,11.82,106,20.9,99.26c10.85-8.1,23.33-12.6,36.3-15.79C68.55,80.68,80.08,79,91.79,80.66a46.67,46.67,0,0,1,11.5,3.14c8.47,3.61,11.1,11.06,11.48,19.5.56,12.29-5.88,20.36-16.24,25.88-.71.38-1.4.77-2,1.13a1,1,0,0,0-.33,1.48l10.69,15.45a1,1,0,0,0,1.85-.34c.59-2.46,1.18-4.89,1.81-7.3,2.75-10.52,7.48-20,15-28,7.2-7.68,10.87-16.84,12.4-27.11.47-3.14-.77-4.29-3.44-5.32a72.65,72.65,0,0,1-29-20.1C93.91,45.82,89.88,30.18,90.56,13a22,22,0,0,1,.62-5.59,5.46,5.46,0,0,1,1.55-2.1,1,1,0,0,1,1.61.21,4.57,4.57,0,0,1,.88,2.38c-.54,8.17-.46,16.29,2.35,24.05a49.68,49.68,0,0,0,5.8,11.56c3.3,4.69,6.6,5.48,12,3.56a1,1,0,0,0,.6-1.41c-1.36-2.82-3-5.58-3.72-8.55A57.93,57.93,0,0,1,110.63,25c-.11-2.55,1.89-3.47,3.72-1.86,5,4.41,9.77,9.11,11.1,16a11.89,11.89,0,0,1-.7,6.43c-.69,1.85-.3,2.66,1.16,3.57a10.64,10.64,0,0,0,12.45-1.2c3-2.71,3.4-5.87,1.09-10.57a34.7,34.7,0,0,1-2.18-4,4.46,4.46,0,0,1,.06-2.17,1,1,0,0,1,1.11-.84,3.47,3.47,0,0,1,2,.56c4.64,4.38,5.81,13.92,2.43,18.52-4,5.41-13.09,7.15-19.12,3.26-2.65-1.71-4.73-2.38-8-1.36-2.6.82-5.51.64-8.54.65a1,1,0,0,0-.83,1.64c7.73,10.07,18,17.06,30.65,22.12a1,1,0,0,0,1.41-1c0-2.27-.06-4.23,0-6.19a48.84,48.84,0,0,1,.76-8.39c.76-3.41,3.6-5,6.7-3.45a65.92,65.92,0,0,1,11.22,7.17A147.85,147.85,0,0,1,170.1,75.42c1.4,1.4,2.9,4,2.46,5.56s-3.05,3.16-5,3.57c-7.41,1.57-14.72,0-22-1.59a20.33,20.33,0,0,0-2-.48.86.86,0,0,0-.58.14c-1.76,6.09-2.9,12.16-5.29,17.69a50.45,50.45,0,0,1-8.49,13.26,66.65,66.65,0,0,0-16.68,37.35c-.84,7-.59,14.06-.86,21.1-.06,1.55.45,3.85-2,3.54-.87-.1-2.07-2.3-2.11-3.57-.32-12-3.27-23-10.9-32.51-.22-.27-.43-.55-.65-.83-3.15-4.19-6.41-5.62-12.19-3.83-11.4,3.53-23.23,5.66-34.84,8.56-6.75,1.7-9,7.69-5,13.4,3.67,5.28,7.43,10.5,11,15.85a4.26,4.26,0,0,1,.27,2.47A1,1,0,0,1,54,176c-1-.18-2-.34-2.38-.91C46.24,167.4,41,159.61,36,151.66c-2.28-3.62-1.58-6.71,2.37-8.46a111.07,111.07,0,0,1,16.92-5.7c9.18-2.4,18.49-4.34,27.73-6.51a3.09,3.09,0,0,0,1-.58,1,1,0,0,0,.41-.62Zm-74,31,.94.44c.19-.29.37-.58.55-.88.37-.6.75-1.19,1.1-1.8,5.82-9.9,12.63-19,21.47-26.42,8.3-6.94,17.56-11.68,28.72-11.91,8.73-.18,16.61,2.5,24.15,6.62,1.37.74,3.33,1.85,4.44,1.4,10-4.12,19.45-11.17,18.73-24.41-.52-9.54-4.84-15.2-14.08-17.38a54.25,54.25,0,0,0-12.22-1.54,109.15,109.15,0,0,0-43.86,9.14A113.48,113.48,0,0,0,23,103.14c-6.52,4.31-10.92,12.61-5.84,20.79,3.68,5.92,3.21,11.32-.44,17.1S11.43,153.41,10.54,160.13Zm156.3-79.74a1,1,0,0,0,.54-1.76c-1.21-1.19-2.12-2.1-3.1-2.91-5.81-4.76-11.62-9.53-17.51-14.17-2.29-1.81-3.7-.87-3.9,1.88-.16,2.22-.12,4.46-.13,6.7,0,7.7-.08,7.91,7.3,9.52A41.73,41.73,0,0,0,166.84,80.39Zm-46.6-43.84-3,1.36,1.8,4.22a1,1,0,0,0,1.94-.19A9,9,0,0,0,120.24,36.55Z'
    );

    iconPath.setAttribute('stroke-miterlimit', '10');
    iconPath.setAttribute('stroke-width', '10px');

    iconSvg.appendChild(iconPath);

    return iconSvg;
};
