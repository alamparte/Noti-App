import { renderLinkIcon, renderAllPasswordFelder, showHidePassword } from '../helpers.js';

const emailValidate = document.querySelector('#emailValidate');
const changePassContainer = document.querySelector('#changePassContainer');
const message = document.querySelector('.message');
const main = document.querySelector('main');
const containerForm = document.querySelector('.changePassForm');

// erster Teil, Email überprüfen
const checkEmail = async (e) => {
    e.preventDefault();
    try {
        let res = await fetch('/check-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: emailValidate.value,
            }),
        });
        if (!res.ok) return;

        let data = await res.json();

        if (data.status === 'successEmail') {
            redirectNext(data);
        } else {
            emailValidate.classList.add('invalid');
            message.textContent = data.error;
        }
    } catch (error) {
        throw new Error(error);
    }
};
document.querySelector('#formEmailValidate').addEventListener('submit', checkEmail);
//zweiter Teil >> die Form "Code-überprüfen" erstellen
const renderCodeForm = () => {
    containerForm.innerHTML = '';
    containerForm.innerHTML = `<p class="textChange">Bitte gib den Bestätigungscode ein, den wir dir per E-Mail gesendet haben, um dein Passwort zurückzusetzen.</p>
                                <form id="codeValidate">
                                    <input type="number" min="0" name="codeInput" id="codeInput" class="inputStyles">
                                    <div class="codeMessage"></div>
                                    <button type="submit" id="btnCode">Code überprüfen</button>
                                </form> `;
    document.querySelector('#codeValidate').addEventListener('submit', checkCode);
};
//dritter Teil >> Code hinzufügen und verifizieren
const checkCode = async (e) => {
    e.preventDefault();
    const codeMessage = document.querySelector('.codeMessage');
    const codeInput = document.querySelector('#codeInput');
    try {
        let res = await fetch('/check-code', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                code: codeInput.value,
            }),
        });
        if (!res.ok) return;

        let data = await res.json();

        // message color
        codeMessage.style.color = data.status === 'successCode' ? '#919537' : 'red';

        if (data.status === 'successCode') {
            codeInput.disabled = true;
            document.querySelector('#btnCode').disabled = true;
            document.querySelector('#btnCode').classList.add('btnDisabled');
            redirectNext(data, codeMessage);
        } else {
            codeMessage.textContent = data.error;
            codeInput.classList.add('invalid');
        }
    } catch (error) {
        throw new Error(error);
    }
    removeClass(codeInput, codeMessage);
};
// vierter Teil >> Passwort zurücksetzen Form erstellen
const renderInputPassword = () => {
    let form = document.createElement('form');
    form.setAttribute('id', 'formChangePass');
    form.innerHTML = renderAllPasswordFelder();
    changePassContainer.append(form);
    // show/hide password
    const svg = document.querySelectorAll('svg');
    showHidePassword(svg);
    document.querySelector('#formChangePass').addEventListener('submit', restorePassword);
};
// fünfter Teil >> Passwort zurücksetzen - Daten an den Server senden
const restorePassword = async (e) => {
    e.preventDefault();
    const newPassword = document.querySelector('#newPassword');
    const confirmPassword = document.querySelector('#confirmPassword');

    try {
        let res = await fetch('/forgot-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                newPassword: newPassword.value,
                confirmPassword: confirmPassword.value,
            }),
        });
        if (!res.ok) return;

        let data = await res.json();

        if (data.status) {
            renderResponse(data);
        }
    } catch (error) {
        throw new Error(error);
    }
};
const renderResponse = (data) => {
    const messageDiv = document.querySelector('.messageDiv');
    const newPassError = document.querySelector('.newPassError');
    const confirmPassError = document.querySelector('.confirmPassError');
    const allInputs = document.querySelectorAll('.allInputs');
    const allDivs = document.querySelectorAll('.allDiv');

    messageDiv.style.color = data.status === 'success' ? '#919537' : 'red';

    switch (data.status) {
        case 'success':
            messageDiv.textContent = data.message;
            document.querySelector('#btnChangePass').disabled = true;
            document.querySelector('#aLink').style.pointerEvents = 'none';
            setTimeout(() => {
                resetAttr();
                window.location.href = '/login';
            }, 2000);
            break;

        case 'password format error':
            const sibiling = newPassError.previousElementSibling;
            sibiling.classList.add('invalid');
            newPassError.textContent = data.error;
            break;

        case 'failed-stimmen':
            const sibiling2 = confirmPassError.previousElementSibling;
            sibiling2.classList.add('invalid');
            confirmPassError.textContent = data.error;
            break;

        default:
            messageDiv.textContent = data.error;
            allInputs.forEach((e) => {
                if (!e.value) {
                    e.parentElement.classList.add('invalid');
                }
            });
            break;
    }
    removeStyles(allInputs, allDivs);
};
// Spinner render und redirect
const redirectNext = (data, codeMessage) => {
    if (data.status === 'successEmail') {
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
            renderCodeForm();
        }, 2000);
        //cambiar a 5000 despues
    } else {
        // spinner zeigen
        const div = document.createElement('div');
        div.setAttribute('id', 'spin');
        div.classList.add('spinner');
        div.style.margin = '0 auto';
        const svg = renderLinkIcon();
        div.append(svg);

        changePassContainer.append(div);
        div.style.visibility = 'visible';

        setTimeout(() => {
            codeMessage.textContent = data.message;
            codeInput.classList.add('valid');
            div.remove();
            renderInputPassword();
        }, 2000);
    }
};
// Attribute löschen 
const resetAttr = () => {
    document.querySelector('#btnChangePass').disabled = false;
    codeInput.disabled = false;
    document.querySelector('#btnCode').disabled = false;
    document.querySelector('#btnCode').classList.remove('btnDisabled');
    document.querySelector('#aLink').style.pointerEvents = 'auto';
};
// Remove class of password input
const removeStyles = (allInputs, allDivs) => {
    allInputs.forEach((e) => {
        e.addEventListener('focus', () => {
            e.parentElement.classList.remove('invalid');
            // div message löschen
            allDivs.forEach((e) => {
                e.textContent = '';
            });
        });
    });
};
// Remove class of input verify email
emailValidate.addEventListener('focus', () => {
    emailValidate.classList.remove('invalid');
    // message löschen
    document.querySelector('.message').textContent = '';
});
// styles // textContent löschen
const removeClass = (codeInput, codeMessage) => {
    codeInput.addEventListener('focus', () => {
        codeInput.classList.remove('invalid');
        codeMessage.innerHTML = '';
    });
};
