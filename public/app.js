// register
const getUserData = async (e) => {
    e.preventDefault();
    try {
        const username = document.querySelector('#username').value;
        const email = document.querySelector('#email').value;
        const password = document.querySelector('#password').value;

        let res = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                //    'Content-Type':'application/x-www-form-urlencoded'
            },
            body: JSON.stringify({
                username: username,
                email: email,
                password: password,
            }),
            // `username=${username}&email=${email}&password=${password}`,
        });

        let data = await res.json();
        // console.log(data);
        if (res.status === 'ok') {
            console.log('Konto erfolgreich erstellt');
            console.log(data.status);

        } else {
            console.log(data.status, data.error); 
        }
    } catch (error) {
        throw new Error(error);
    }
};

document.querySelector('#register').addEventListener('click', getUserData);
