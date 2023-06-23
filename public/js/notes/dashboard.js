const notesContainer = document.querySelector('#notesContainer');
const noteForm = document.querySelector('#noteForm');
const mainDashboard = document.querySelector('#mainDashboard');

fetch('/dashboard/notes')
    .then((res) => res.json())
    .then((data) => {
        console.log(data);
        if (data.status === 'success') {
            renderNotes(data);
        } else {
            renderWithoutNotes();
        }
    })
    .catch((error) => {
        throw error;
    });

const renderNotes = async (data) => {
    console.log(data.notesFiltered);
    // notesContainer.innerHTML = '';
    // oder map() ??
    const section = document.createElement('section');
    section.classList.add('renderNotes');

    section.innerHTML = `   
    <div class="head">
        <h1>Servus <span id="userName"></span></h1>
        <button type="button">
            <a href="/dashboard/noteform" id="noteForm">+ neue Notiz</a>
        </button>
    </div>
    <div class="notes" id="notesContainer">
    ${await data.notesFiltered
        .map(
            ({ id, titel, description }) => `
                                        <a class="link" data-id="${id}" href="/view-note/${id}">
                                               <div class="note">
                                                   <h2>${titel}</h2>
                                                   <p>${description}</p>
                                               </div>
                                           </a>`
        )
        .join('')}
    </div>
</section>`;
    mainDashboard.append(section);
    printName();
};

const renderWithoutNotes = () => {
    const section = document.createElement('section');
    section.classList.add('firstNote');

    section.innerHTML = `
                <div class="servus">
                    <h1>Servus <span id="userName"></span></h1>
                </div>
                <div class="createNote">
                    <figure>
                        <img src="../img/notiz.svg" alt="note image" />
                    </figure>
                    <h2>Erstelle deine erste Notiz</h2>
                    <p>Klicke <a href="/dashboard/noteform">here</a> um loszulegen.</p>
                </div>     
    `;

    mainDashboard.append(section);
    printName();
};

const printName = () => {
    fetch('/signed_in')
        .then((res) => res.text())
        .then((username) => {
            username ? (document.querySelector('#userName').innerHTML = username) : (document.querySelector('#userName').innerHTML = 'guest');
        })
        .catch((error) => {
            throw error;
        });
};

// let noteId;

// // render notes
// const renderNotes = async (data) => {
//     // console.log(data.notes);
//     notesContainer.innerHTML = '';
//     await data.notes.map((note) => {
//         notesContainer.innerHTML += `  <a class="link" data-id="${note.id}" href="/view-note/${note.id}">
//                                             <div class="note">
//                                                 <h2>${note.titel}</h2>
//                                                 <p>${note.description}</p>
//                                             </div>
//                                         </a>`;
//     });
//     // setEventListeners();
// };
// // render willkomme Seite wenn es kein Notiz gibt
// const renderHtmlNoNotes = () => {
//     const div = document.createElement('div');
//     div.innerHTML = ` <figure>
//    <img src="../img/notiz.svg" alt="note image" />
// </figure>
// <h1>Erstelle deine erste Notiz</h1>
// <p>Klicke <a href="/client/note-form">here</a> um loszulegen.</p>`;
//     notesContainer.append(div);
// };

// // const setEventListeners = () => {
// //     const note = document.querySelectorAll('.link');
// //     note.forEach((note) => {
// //         note.addEventListener('click', async (event) => {
// //             noteId = event.currentTarget.dataset.id;
// //             console.log(noteId);
// //             // getEditNote(noteId);
// //         });
// //     });
// // };
