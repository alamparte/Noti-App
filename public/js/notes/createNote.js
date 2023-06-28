const titel = document.querySelector('#titel');
const description = document.querySelector('#description');
const select = document.querySelector('select');
const allInputs = document.querySelectorAll('.allInputs');
const emptyError = document.querySelector('.emptyError');


const createNote = async (e) => {
    e.preventDefault();
    try {
        let res = await fetch('/dashboard/noteform', {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({
                titel: titel.value,
                description: description.value,
                category: select.options[select.selectedIndex].value,
            }),
        });
        if (!res.ok) {
            return;
        }
        let data = await res.json();
        console.log(data);
        console.log(data.status);
        if (data.status === 'success') {
            window.location.href = '/dashboard';
        } else {
            emptyError.textContent = data.error;
            //add red color to all empty inputs
            allInputs.forEach((item) => {
                if (item.value == '') {
                    item.classList.add('invalid');
                }
            });
        }
    } catch (error) {
        throw new Error();
    }
};

document.querySelector('form').addEventListener('submit', createNote);

// Remove class
allInputs.forEach((item) => {
    item.addEventListener('focus', () => {
        item.classList.remove('invalid');
        // error message löschen
        emptyError.textContent = '';
    });
});
