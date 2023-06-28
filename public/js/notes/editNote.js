const titel = document.querySelector('#titel');
const description = document.querySelector('#description');
const btnDelete = document.querySelector('#btnDelete');
const getId = document.querySelector('#id').value;
const select = document.querySelector('select');
console.log(getId);

// console.log(titel.value, description.value);

const geteditNote = async (e) => {
    e.preventDefault();
    try {
        let res = await fetch(`/dashboard/view-note/${getId}`, {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({
                titel: titel.value,
                description: description.value,
                category: select.options[select.selectedIndex].value,
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
    fetch(`/dashboard/delete-note/${getId}`)
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
