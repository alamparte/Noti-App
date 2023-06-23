const titel = document.querySelector('#titel');
const description = document.querySelector('#description');
const btnDelete = document.querySelector('#btnDelete');
const getId = document.querySelector('#id').value;
console.log(getId);

// console.log(titel.value, description.value);

const geteditNote = async () => {
    try {
        let res = await fetch(`/view-note/${getId}`, {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({
                titel: titel.value,
                description: description.value,
            }),
        });
        let data = await res.json();
        console.log(data.status);

        if (data.status === 'success') {
            console.log(data.message);
            window.location.href = '/dashboard';
        }
    } catch (error) {
        throw new Error();
    }
};

document.querySelector('form').addEventListener('submit', geteditNote);

    // DELETE
document.querySelector('#btnDelete').addEventListener('click', () => {
    // DELETE
    fetch(`/delete-note/${getId}`)
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
            if (data.status === 'success') {
                console.log(data.status);
                window.location.href = '/dashboard';
            } else {
                console.log('Oopppss algo salió mal');
            }
        });
});
