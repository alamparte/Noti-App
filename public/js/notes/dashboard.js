const noteForm = document.querySelector('#noteForm');
const mainDashboard = document.querySelector('#mainDashboard');
///////////////----------------------------------------------------------------
const renderItem = (note) => {
    const { id, titel, description, date } = note;
    return `
    <a class="link" data-id="${id}" href="/dashboard/view-note/${id}">
    <div class="note">
        <h2>${titel}</h2>
        <p>${description}</p>
        <div class="datum">${date}</div>
    </div>
</a>
    `;
};

//////////////////////////////////--------------------------------------------------

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

//     // Element sortieren
// const arrSortiert = async () => {
//     const sortieren = document.querySelector('#sortieren');
//     console.log(sortieren);
//     // original Array kopieren

//     if (sortieren.value !== '') {

//         let res = await fetch(`/dashboard/sort-notes`, {
//             method: 'POST',
//             headers: { 'Content-type': 'application/json' },
//             body: JSON.stringify({
//                 selected: sortieren.value,
//             }),
//         });

//         if (!res.ok) return;

//         let data = await res.json();
//         console.log(data);

//         if (data.status === 'auf') {
//             // renderNotes(data);
//         console.log(data.notes);

//         } else {
//             // renderNotes(data);
//         console.log(data.notes);

//         }
//     }
// };

// const renderNotes = async (data) => {
//     mainDashboard.innerHTML = ''
//     const section = document.createElement('section');
//     section.classList.add('renderNotes');

//     section.innerHTML = `
//     <div class="head">
//         <h1>Servus <span id="userName"></span></h1>
//         <select id="sortieren">
//              <option value="">Ergebnisse sortieren</option>
//              <option value="auf">nach Datum (aufsteigend)</option>
//              <option value="ab">nach Datum (absteigend)</option>
//         </select>
//         <select id="filter">
//              <option value="">Filter hinzufügen</option>
//              <option value="alle">Alle ansehen</option>
//              <option value="hohe">hohe Priorität</option>
//              <option value="mittlere">mittlere Priorität</option>
//              <option value="niedrige">niedrige Priorität</option>
//         </select>
//         <button type="button">
//             <a href="/dashboard/noteform" id="noteForm">+ neue Notiz</a>
//         </button>
//     </div>
//     <div class="notes" id="notesContainer">
//     ${await data.notes
//         .map(
//             ({ id, titel, description, date }) => `
//                                         <a class="link" data-id="${id}" href="/dashboard/view-note/${id}">
//                                                <div class="note">
//                                                    <h2>${titel}</h2>
//                                                    <p>${description}</p>
//                                                    <div class="datum">${date}</div>
//                                                </div>
//                                            </a>`
//         )
//         .join('')}
//     </div>
// </section>`;
//     mainDashboard.append(section);
//     printName();
//     const sortieren = document.querySelector('#sortieren');

//     sortieren.addEventListener('change', arrSortiert);
// };

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
//NotesContainer div
let divNotesContainer = document.createElement('div');
divNotesContainer.classList.add('notes');

 //section
 const section = document.createElement('section');
 section.classList.add('renderNotes');
 
const renderNotes = async (data) => {
    const { notes } = data;
    // //section
    // const section = document.createElement('section');
    // section.classList.add('renderNotes');
    //head div
    const divHead = document.createElement('div');
    divHead.classList.add('head');

    divHead.innerHTML = `   
        <h1>Servus <span id="userName"></span></h1>
        <select id="sortieren">
             <option value="">Ergebnisse sortieren</option>
             <option value="auf">nach Datum (aufsteigend)</option>
             <option value="ab">nach Datum (absteigend)</option>
        </select>
        <select id="filtern">
             <option value="">Filter hinzufügen</option>
             <option value="alle">Alle ansehen</option>
             <option value="hohe">hohe Priorität</option>
             <option value="mittlere">mittlere Priorität</option>
             <option value="niedrige">niedrige Priorität</option>
        </select>
        <button type="button">
            <a href="/dashboard/noteform" id="noteForm">+ neue Notiz</a>
        </button>`;

    // //NotesContainer div
    // let divNotesContainer = document.createElement('div');
    // divNotesContainer.classList.add('notes');

    divNotesContainer.innerHTML = `${await notes.map((note) => renderItem(note)).join('')}`;

    section.append(divHead, divNotesContainer);
    mainDashboard.append(section);
    printName();

    // sortieren
    const sortieren = document.querySelector('#sortieren');
    sortieren.addEventListener('change', arrSortiert);
    // filter
    const filterNotes = document.querySelector('#filtern');
    console.log(filterNotes);
    filterNotes.addEventListener('change', arrFilter);
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

// Element sortieren
const arrSortiert = async () => {
    if (sortieren.value !== '') {
        let res = await fetch(`/dashboard/sort-notes`, {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({
                selected: sortieren.value,
            }),
        });

        if (!res.ok) return;

        let data = await res.json();
        console.log(data);

        if (data.status === 'auf' || data.status === 'ab') {
            renderSortNotes(data);
        }
    }
};

const renderSortNotes = async (data) => {
    const { notes } = data;
    divNotesContainer.innerHTML = '';
    divNotesContainer.innerHTML = `${await notes.map((note) => renderItem(note)).join('')}`;
};

// Element filtern
const arrFilter = async () => {
    const filterNotes = document.querySelector('#filtern');
    if (filterNotes.value !== '') {
        let res = await fetch(`/dashboard/filter-notes`, {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({
                filtered: filterNotes.value,
            }),
        });

        if (!res.ok) return;

        let data = await res.json();
        console.log(data);
        console.log(data.status);

        if (data.status === 'hohe' || data.status === 'mittlere' || data.status === 'niedrige' || data.status === 'alle') {
            renderFilterNotes(data);
        }
    }
};

//AGREGAR SINO HAY NOTAS ; UN MSJ DE AVISO  >>> NO HAY NADA EN ESA CATEGORIA
const renderFilterNotes = async (data) => {
    divNotesContainer.innerHTML = '';
    if (data.status === 'alle') {
        const { notes } = data;
        divNotesContainer.innerHTML = `${await notes.map((note) => renderItem(note)).join('')}`;
    } else {
        const { notesFilteredArr } = data;

        if (notesFilteredArr < 1) {
            let text = document.createElement('p');
            text.textContent = 'In dieser Kategorie wurden keine Notizen gefunden';
            section.append(text);
        } else {
            divNotesContainer.innerHTML = `${await notesFilteredArr.map((note) => renderItem(note)).join('')}`;
        }
    }
};

///////////////////////---------------------------------------

// await data.notes.forEach(({ id, titel, description, date }) => {
//     divNotesContainer += ` <a class="link" data-id="${id}" href="/dashboard/view-note/${id}">
//                                               <div class="note">
//                                                   <h2>${titel}</h2>
//                                                   <p>${description}</p>
//                                                   <div class="datum">${date}</div>
//                                               </div>
//                                           </a>`;
// });
