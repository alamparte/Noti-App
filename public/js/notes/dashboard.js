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
            <div class="options">
                <div class="sortGroup"> 
                    <svg height="1.5rem" viewBox="0 0 576 512" id="dropDownSortIcon">
                        <path
                            d="M151.6 469.6C145.5 476.2 137 480 128 480s-17.5-3.8-23.6-10.4l-88-96c-11.9-13-11.1-33.3 2-45.2s33.3-11.1 45.2 2L96 365.7V64c0-17.7 14.3-32 32-32s32 14.3 32 32V365.7l32.4-35.4c11.9-13 32.2-13.9 45.2-2s13.9 32.2 2 45.2l-88 96zM320 480c-17.7 0-32-14.3-32-32s14.3-32 32-32h32c17.7 0 32 14.3 32 32s-14.3 32-32 32H320zm0-128c-17.7 0-32-14.3-32-32s14.3-32 32-32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H320zm0-128c-17.7 0-32-14.3-32-32s14.3-32 32-32H480c17.7 0 32 14.3 32 32s-14.3 32-32 32H320zm0-128c-17.7 0-32-14.3-32-32s14.3-32 32-32H544c17.7 0 32 14.3 32 32s-14.3 32-32 32H320z"
                        />
                    </svg>
                    <div class="dropDownSort"></div>   
                </div> 
    
                <div class="filterGroup"> 
                    <svg height="1.5rem" viewBox="0 0 512 512" id="dropDownFilterIcon">
                        <path
                            d="M3.9 54.9C10.5 40.9 24.5 32 40 32H472c15.5 0 29.5 8.9 36.1 22.9s4.6 30.5-5.2 42.5L320 320.9V448c0 12.1-6.8 23.2-17.7 28.6s-23.8 4.3-33.5-3l-64-48c-8.1-6-12.8-15.5-12.8-25.6V320.9L9 97.3C-.7 85.4-2.8 68.8 3.9 54.9z"
                        />
                    </svg>
                    <div class="dropDownFilter"></div>
                </div> 
    
                <button type="button">
                    <a href="/dashboard/noteform" id="noteForm">+ neue Notiz</a>
                </button>
            </div> `;

    divNotesContainer.innerHTML = `${await notes.map((note) => renderItem(note)).join('')}`;

    section.append(divHead, divNotesContainer);
    mainDashboard.append(section);

    printName();

    // // sortieren
    // const sortieren = document.querySelector('#sortieren');
    // sortieren.addEventListener('change', arrSortiert);
    // // filter
    // const filterNotes = document.querySelector('#filtern');
    // console.log(filterNotes);
    // filterNotes.addEventListener('change', arrFilter);

    ///////*****************************************************////////////////////////////////// */

    const dropDownSortIcon = document.querySelector('#dropDownSortIcon');
    const dropDownSort = document.querySelector('.dropDownSort');
    const showSelectSort = () => {
        const p = document.createElement('p');
        p.textContent = 'SORTIEREN NACH';
        dropDownSort.innerHTML = '';
        const select = document.createElement('select');
        select.setAttribute('id', 'sortieren');
        select.innerHTML = ` <option value="">Ergebnisse sortieren</option>
      <option value="auf">nach Datum (aufsteigend)</option>
      <option value="ab">nach Datum (absteigend)</option>`;
        dropDownSort.append(p, select);
        dropDownSort.style.display == 'none' ? (dropDownSort.style.display = 'block') : (dropDownSort.style.display = 'none');

        // // sortieren
        const sortieren = document.querySelector('#sortieren');
        sortieren.addEventListener('change', arrSortiert);
    };
    dropDownSortIcon.addEventListener('click', showSelectSort);

    ///////////////////----------------------------------------------------
    const dropDownFilterIcon = document.querySelector('#dropDownFilterIcon');
    const dropDownFilter = document.querySelector('.dropDownFilter');
    const showSelectFilter = () => {
        const p = document.createElement('p');
        p.textContent = 'Filter hinzufügen';
        dropDownFilter.innerHTML = '';
        const select = document.createElement('select');
        select.setAttribute('id', 'filtern');
        select.innerHTML = `<option value="">Filter hinzufügen</option>
      <option value="alle">Alle ansehen</option>
      <option value="hohe">hohe Priorität</option>
      <option value="mittlere">mittlere Priorität</option>
      <option value="niedrige">niedrige Priorität</option>`;
        dropDownFilter.append(p, select);
        dropDownFilter.style.display == 'none' ? (dropDownFilter.style.display = 'block') : (dropDownFilter.style.display = 'none');

        // // filter
        const filterNotes = document.querySelector('#filtern');
        filterNotes.addEventListener('change', arrFilter);
    };

    dropDownFilterIcon.addEventListener('click', showSelectFilter);
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

let p = document.createElement('p');
p.classList.add('withoutNotes');

const renderFilterNotes = async (data) => {
    divNotesContainer.innerHTML = '';
    if (data.status === 'alle') {
        p.remove();
        const { notes } = data;
        divNotesContainer.innerHTML = `${await notes.map((note) => renderItem(note)).join('')}`;
    } else {
        const { notesFilteredArr } = data;

        if (notesFilteredArr < 1) {
            p.textContent = 'In dieser Kategorie wurden keine Notizen gefunden';
            section.append(p);
        } else {
            p.remove();
            divNotesContainer.innerHTML = `${await notesFilteredArr.map((note) => renderItem(note)).join('')}`;
        }
    }
};

///////////////////////---------------------------------------

// const showSelect = () => {
//     dropDownSort.innerHTML = '';

//     const select = document.createElement('select');
//     select.setAttribute('id', 'select');
//     select.innerHTML = ` <option value="">Ergebnisse sortieren</option>
//     <option value="auf">nach Datum (aufsteigend)</option>
//     <option value="ab">nach Datum (absteigend)</option>`;
//     dropDownSort.append(select);

//     // <div class="dropDownSort"></div>
//     // <select id="sortieren">
//     //      <option value="">Ergebnisse sortieren</option>
//     //      <option value="auf">nach Datum (aufsteigend)</option>
//     //      <option value="ab">nach Datum (absteigend)</option>
//     // </select>
//     // </div>

//     dropDownSort.style.display == 'none' ? (dropDownSort.style.display = 'block') : (dropDownSort.style.display = 'none');
// };
//     <select id="filtern">
//     <option value="">Filter hinzufügen</option>
//     <option value="alle">Alle ansehen</option>
//     <option value="hohe">hohe Priorität</option>
//     <option value="mittlere">mittlere Priorität</option>
//     <option value="niedrige">niedrige Priorität</option>
// </select>
