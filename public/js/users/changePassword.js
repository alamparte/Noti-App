const emailValidate = document.querySelector('#emailValidate');
const errorEmail = document.querySelector('.error');
const changePassContainer = document.querySelector('#changePassContainer');
const allInputs = document.querySelectorAll('.allInputs');


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
        console.log(data);
        if (data.status === 'success') {
            errorEmail.textContent = data.message;
            renderInputPassword();
        } else {
            errorEmail.textContent = data.error;
        }
    } catch (error) {
        throw new Error(error);
    }
};
document.querySelector('#formEmailValidate').addEventListener('submit', checkEmail);

const renderInputPassword = () => {
    let form = document.createElement('form');
    form.setAttribute('id', 'formChangePass');
    form.innerHTML = `    <div class="emptyError error"></div>
                    <div>
                        <label for="currentPassword">Aktuelles Passwort</label>
                        <div class="inputBox allInputs">
                            <input type="password" autocomplete="off" id="currentPassword" name="currentPassword" class="passStyles" required />
                            <svg height="1.1rem" viewBox="0 0 640 512" data-id="currentPassword" class="uno">
                                <path
                                    d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zM223.1 149.5C248.6 126.2 282.7 112 320 112c79.5 0 144 64.5 144 144c0 24.9-6.3 48.3-17.4 68.7L408 294.5c8.4-19.3 10.6-41.4 4.8-63.3c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3c0 10.2-2.4 19.8-6.6 28.3l-90.3-70.8zM373 389.9c-16.4 6.5-34.3 10.1-53 10.1c-79.5 0-144-64.5-144-144c0-6.9 .5-13.6 1.4-20.2L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5L373 389.9z"
                                />
                            </svg>
                        </div>
                        <div class="currentPassError error"></div>
                    </div>

                    <div>
                        <label for="newPassword">Neues Passwort</label>
                        <div class="inputBox allInputs">
                            <input type="password" autocomplete="off" id="newPassword" name="newPassword" required class="passStyles" />
                            <svg height="1.1rem" viewBox="0 0 640 512" data-id="newPassword" class="dos">
                                <path
                                    d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zM223.1 149.5C248.6 126.2 282.7 112 320 112c79.5 0 144 64.5 144 144c0 24.9-6.3 48.3-17.4 68.7L408 294.5c8.4-19.3 10.6-41.4 4.8-63.3c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3c0 10.2-2.4 19.8-6.6 28.3l-90.3-70.8zM373 389.9c-16.4 6.5-34.3 10.1-53 10.1c-79.5 0-144-64.5-144-144c0-6.9 .5-13.6 1.4-20.2L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5L373 389.9z"
                                />
                            </svg>
                        </div>
                        <div class="newPassError error"></div>
                    </div>

                    <div>
                        <label for="confirmPassword">Neues Passwort bestätigen</label>
                        <div class="inputBox allInputs">
                            <input type="password" autocomplete="off" id="confirmPassword" name="confirmPassword" required class="passStyles" />
                            <svg height="1.1rem" viewBox="0 0 640 512" data-id="confirmPassword" class="tres">
                                <path
                                    d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zM223.1 149.5C248.6 126.2 282.7 112 320 112c79.5 0 144 64.5 144 144c0 24.9-6.3 48.3-17.4 68.7L408 294.5c8.4-19.3 10.6-41.4 4.8-63.3c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3c0 10.2-2.4 19.8-6.6 28.3l-90.3-70.8zM373 389.9c-16.4 6.5-34.3 10.1-53 10.1c-79.5 0-144-64.5-144-144c0-6.9 .5-13.6 1.4-20.2L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5L373 389.9z"
                                />
                            </svg>
                        </div>
                        <div class="confirmPassError error"></div>
                    </div>

                    <div class="btnGroup">
                        <a href="/">Abbrechen</a>
                        <button type="submit" id="btnChangePass">Speichern</button>
                    </div>
    `;

    changePassContainer.append(form);
    // show/hide password
    const svg = document.querySelectorAll('svg');
    showHidePassword(svg);
    document.querySelector('#formChangePass').addEventListener('submit', changePassword);
};

// // show/hide password
const showHidePassword = (svg) => {
    svg.forEach((item) => {
        item.addEventListener('click', (event) => {
            const svgElem = event.currentTarget;
            const inputElem = svgElem.previousElementSibling;

            if (inputElem.type === 'password') {
                inputElem.type = 'text';
                svgElem.innerHTML = ` <path
                d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"
            />`;
            } else {
                inputElem.type = 'password';
                svgElem.innerHTML = ` <path
                d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zM223.1 149.5C248.6 126.2 282.7 112 320 112c79.5 0 144 64.5 144 144c0 24.9-6.3 48.3-17.4 68.7L408 294.5c8.4-19.3 10.6-41.4 4.8-63.3c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3c0 10.2-2.4 19.8-6.6 28.3l-90.3-70.8zM373 389.9c-16.4 6.5-34.3 10.1-53 10.1c-79.5 0-144-64.5-144-144c0-6.9 .5-13.6 1.4-20.2L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5L373 389.9z"
            />`;
            }
        });
    });
};

const changePassword = async (e) => {
    const currentPassword = document.querySelector('#currentPassword');
    const newPassword = document.querySelector('#newPassword');
    const confirmPassword = document.querySelector('#confirmPassword');
    console.log(currentPassword);
    e.preventDefault();
    try {
        let res = await fetch('/change-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                currentPassword: currentPassword.value,
                newPassword: newPassword.value,
                confirmPassword: confirmPassword.value,
            }),
        });
        if (!res.ok) return;

        let data = await res.json();
        console.log(data);
        if (data.status === 'success') {
            console.log(data);
            // errorEmail.textContent = data.message;
        } else {
            console.log(data);

            // errorEmail.textContent = data.error;
        }
    } catch (error) {
        throw new Error(error);
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
