const titel = document.querySelector('#titel');
const description = document.querySelector('#description');
const getId = document.querySelector('#id').value;
const select = document.querySelector('select');

const btnOpenModal = document.querySelector('#openModal');


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
// modal
const mainEdit = document.querySelector('.mainEdit');
const createModal = () => {
    let div = document.createElement('div');
    div.classList.add('modal');
    div.classList.add('modalAnimation');
    div.innerHTML = `
                    <div class="modalContent">
                    <span class="modalClose">&times;</span>
                    <svg xmlns="http://www.w3.org/2000/svg" height="5rem" viewBox="0 0 512 512">
                        <path
                            d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480H40c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24V296c0 13.3 10.7 24 24 24s24-10.7 24-24V184c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"
                        />
                    </svg>
                    <h1 class="h1Modal">Wollen Sie den Eintrag wirklich löschen?</h1>
                    <p>Diese Aktion kann nicht rückgängig gemacht werden.</p>
                    <div class="groupBtn">
                        <a href="/dashboard/view-note/${getId}">Abbrechen</a>
                        <button id="btnDelete">löschen</button>
                    </div>
                    </div>`;

    mainEdit.append(div);
};
createModal()


  //grab close button
  const closeBtn = document.querySelector('.modalClose');
  //grab modal
  const modal = document.querySelector('.modal');

  //toggle modal
  function toggleModal() {
      if (modal.style.display === 'block') {
          modal.style.display = 'none';
      } else {
          modal.style.display = 'block';
      }
  }

  //listner for buttons
  btnOpenModal.addEventListener('click', toggleModal);
  closeBtn.addEventListener('click', toggleModal);







const btnDelete = document.querySelector('#btnDelete');
const deleteModal = () => {
    // DELETE
    fetch(`/dashboard/delete-note/${getId}`)
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
            if (data.status === 'success') {
                window.location.href = '/dashboard';
            } else {
                console.log('Oopppss algo salió mal');
            }
        });
};
btnDelete.addEventListener('click', deleteModal);

// DELETE
// document.querySelector('#btnDelete').addEventListener('click', () => {
//     // DELETE
//     fetch(`/dashboard/delete-note/${getId}`)
//         .then((res) => res.json())
//         .then((data) => {
//             console.log(data);
//             if (data.status === 'success') {
//                 window.location.href = '/dashboard';
//             } else {
//                 console.log('Oopppss algo salió mal');
//             }
//         });
// });
