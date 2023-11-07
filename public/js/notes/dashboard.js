import { renderLupeIcon, renderItem, renderHeadDashboard } from '../helpers.js';

const noteForm = document.querySelector('#noteForm');
const mainDashboard = document.querySelector('#mainDashboard');

// get data username from req.session.username
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

// render notes or when notes.length == 0
fetch('/dashboard/notes')
    .then((res) => res.json())
    .then((data) => {
        if (data.status === 'success') {
            renderNotes(data);
        } else {
            renderWithoutNotes();
        }
    })
    .catch((error) => {
        throw error;
    });

// render notes.length == 0
const renderWithoutNotes = () => {
    // create section
    const section = document.createElement('section');
    section.classList.add('firstNote');
    // create div for User Name
    const divUserName = document.createElement('div');
    divUserName.classList.add('servus');
    // content of div for User Name
    const h1 = document.createElement('h1');
    h1.textContent = 'Servus ';
    const userName = document.createElement('span');
    userName.id = 'userName';
    // append elements
    h1.append(userName);
    divUserName.append(h1);
    // create div for create a Note
    const createNote = document.createElement('div');
    createNote.classList.add('createNote');
    // content of div for create a Note
    const figure = document.createElement('figure');
    const img = document.createElement('img');
    img.src = '/img/notiz.svg';
    img.alt = 'a vector a big note without color';
    const h2 = document.createElement('h2');
    h2.textContent = 'Erstelle deine erste Notiz';
    const p = document.createElement('p');
    const link = document.createElement('a');
    link.href = '/dashboard/noteform';
    link.textContent = 'here';
    // append elements to p
    p.append(document.createTextNode('Klicke '));
    p.append(link);
    p.append(document.createTextNode(' um loszulegen.'));
    // append elements
    figure.append(img);
    createNote.append(figure, h2, p);
    // append elements to section / main
    section.append(divUserName, createNote);
    mainDashboard.append(section);
    // get username
    printName();
};

// render notes
const renderNotes = async (data) => {
    const { notes } = data;

    // section in dashboard with notes
    const section = document.createElement('section');
    section.classList.add('renderNotes');

    // create Notes Container
    let divNotesContainer = document.createElement('div');
    divNotesContainer.classList.add('notes');

    // create search input container
    const lupeContainer = document.createElement('div');
    lupeContainer.classList.add('divPadre');
    //create search input
    const searchContainer = document.createElement('div');
    searchContainer.classList.add('searchContainer');
    lupeContainer.append(searchContainer);
    // input
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.classList.add('inputSearch');
    // magnifying glass icon
    const searchBtn = document.createElement('span');
    searchBtn.classList.add('btnSearch');
    let lupe = renderLupeIcon();
    searchBtn.append(lupe);
    searchContainer.append(searchInput, searchBtn);

    // div Head in Dashboard
    const divHead = document.createElement('div');
    divHead.classList.add('head');
    // div Head in Dashboard data
    divHead.innerHTML = renderHeadDashboard();
    // render notes
    divNotesContainer.innerHTML = `${await notes.map((note) => renderItem(note)).join('')}`;
    // append section / main
    section.append(divHead, divNotesContainer);
    mainDashboard.append(lupeContainer, section);
    // create events
    setEvents();
    // get username
    printName();
};

// create sort&filter container / set search&reset events
const setEvents = () => {
    // hide dropDown elements
    // sort options container
    const dropDownSort = document.querySelector('.dropDownSort');
    dropDownSort.style.display = 'none';
    // filter options container
    const dropDownFilter = document.querySelector('.dropDownFilter');
    dropDownFilter.style.display = 'none';

    // create and display sort options container
    const dropDownSortIcon = document.querySelector('#dropDownSortIcon');
    dropDownSortIcon.addEventListener('click', createSelectSort);
    // create and display filter options container
    const dropDownFilterIcon = document.querySelector('#dropDownFilterIcon');
    dropDownFilterIcon.addEventListener('click', createSelectFilter);
    // fetch search notes
    const btnSearch = document.querySelector('.btnSearch');
    btnSearch.addEventListener('click', searchNotes);
    // fetch reset filter notes
    const resetFilterBtn = document.querySelector('.resetFilter');
    resetFilterBtn.addEventListener('click', resetFilter);
};

// create Select Sort
const createSelectSort = () => {
    const dropDownSort = document.querySelector('.dropDownSort');

    // create 'sort options container' elements
    const p = document.createElement('p');
    p.textContent = 'SORTIEREN NACH';
    // empty Container
    dropDownSort.innerHTML = '';

    const select = document.createElement('select');
    select.setAttribute('id', 'sortieren');

    select.innerHTML = ` <option value="">Ergebnisse sortieren</option>
                        <option value="auf">nach Datum (aufsteigend)</option>
                        <option value="ab">nach Datum (absteigend)</option>`;

    dropDownSort.append(p, select);
    // show/hide sort container
    dropDownSort.style.display == 'none' ? (dropDownSort.style.display = 'block') : (dropDownSort.style.display = 'none');

    // select value
    document.querySelector('#sortieren').addEventListener('change', arrSortiert);
};

// create Select Filter
const createSelectFilter = () => {
    const dropDownFilter = document.querySelector('.dropDownFilter');
    // create 'filter options container' elements
    const p = document.createElement('p');
    p.textContent = 'Filter hinzufügen';
    // create select
    const select = document.createElement('select');
    select.setAttribute('id', 'filtern');

    const selectArray = [
        ['', 'Filter hinzufügen'],
        ['alle', 'Alle ansehen'],
        ['hohe', 'hohe Priorität'],
        ['mittlere', 'mittlere Priorität'],
        ['niedrige', 'niedrige Priorität'],
    ];
    // empty Container
    dropDownFilter.innerHTML = '';
    select.innerHTML = '';

    selectArray.forEach((option) => {
        select.innerHTML += `
        <option value="${option[0]}">${option[1]}</option>         
        `;
    });

    dropDownFilter.append(p, select);
    // show/hide filter container
    dropDownFilter.style.display == 'none' ? (dropDownFilter.style.display = 'block') : (dropDownFilter.style.display = 'none');

    // select value
    document.querySelector('#filtern').addEventListener('change', arrFilter);
};

// sort elements
const arrSortiert = async () => {
    try {
        // // sort select
        const sortieren = document.querySelector('#sortieren');
        if (sortieren.value !== '') {
            let res = await fetch(`/dashboard/sort-notes?sort=${sortieren.value}`);

            if (!res.ok) return;

            let data = await res.json();

            if (data.status === 'success') {
                renderSortedNotes(data);
            }
        }
    } catch (error) {
        throw new Error();
    }
};

// render sorted Notes
const renderSortedNotes = async (data) => {
    // check if p element with error text exists
    if (document.querySelector('.withoutNotes')) {
        deleteTextInfo();
    }
    const { notes } = data;
    // show the sorted notes in divNotesContainer
    // empty Notes Container
    document.querySelector('.notes').innerHTML = '';
    // render the sort option
    document.querySelector('.notes').innerHTML = `${await notes.map((note) => renderItem(note)).join('')}`;
};

// filter elements
const arrFilter = async () => {
    try {
        // grab filter select
        const filterNote = document.querySelector('#filtern');

        if (filterNote.value !== '') {
            let res = await fetch(`/dashboard/filter-notes?filter=${filterNote.value}`);

            if (!res.ok) return;

            let data = await res.json();

            if (data.status === 'success' || data.status === 'allNotes') {
                renderFilterNotes(data);
            } else {
                if (!document.querySelector('.withoutNotes')) {
                    renderInfoText(data);
                }
            }
        }
    } catch (error) {
        throw new Error();
    }
};

// render filtered Notes
const renderFilterNotes = async (data) => {
    // empty Notes Container
    document.querySelector('.notes').innerHTML = '';

    if (data.status === 'allNotes') {
        const { notes } = data;
        // check if p element with error text exists
        if (document.querySelector('.withoutNotes')) {
            deleteTextInfo();
        }
        // render the filter option
        document.querySelector('.notes').innerHTML = `${await notes.map((note) => renderItem(note)).join('')}`;
    } else {
        const { notesFilteredArr } = data;
        // check if p element with error text exists
        if (document.querySelector('.withoutNotes')) {
            deleteTextInfo();
        }
        // render the filter option
        document.querySelector('.notes').innerHTML = `${await notesFilteredArr.map((note) => renderItem(note)).join('')}`;
    }
};

// fetch search notes
const searchNotes = async () => {
    try {
        let inputValue = document.querySelector('.inputSearch');

        if (inputValue.value !== '') {
            let res = await fetch(`/dashboard/search-notes?search=${inputValue.value}`);

            if (!res.ok) return;

            let data = await res.json();
            if (data.status === 'success') {
                renderSearchNotes(data);
            } else {
                renderInfoText(data);
            }
        }
    } catch (error) {
        throw new Error();
    }
};
// fetch reset filter notes
const resetFilter = async () => {
    try {
        let res = await fetch(`/dashboard/reset-filter`);

        if (!res.ok) return;

        let data = await res.json();

        renderResetFilter(data);
    } catch (error) {
        throw new Error();
    }
};
// render reset notes
const renderResetFilter = async (data) => {
    // reset input search
    document.querySelector('.inputSearch').value = '';
    // check if p element with error text exists
    if (document.querySelector('.withoutNotes')) {
        deleteTextInfo();
    }
    const { notes } = data;
    // show the reset filter notes in divNotesContainer
    // empty Notes Container
    document.querySelector('.notes').innerHTML = '';
    // render the reset options filter
    document.querySelector('.notes').innerHTML = `${await notes.map((note) => renderItem(note)).join('')}`;
};
// render result Search Notes
const renderSearchNotes = async (data) => {
    // check if p element with error text exists
    if (document.querySelector('.withoutNotes')) {
        deleteTextInfo();
    }
    const { results } = data;
    // show the match notes in divNotesContainer
    // empty Notes Container
    document.querySelector('.notes').innerHTML = '';
    // render the search option
    document.querySelector('.notes').innerHTML = `${await results.map((note) => renderItem(note)).join('')}`;
};
// create p element with error text
const renderInfoText = (data) => {
    // empty Notes Container
    document.querySelector('.notes').innerHTML = '';

    let p = document.createElement('p');
    p.classList.add('withoutNotes');
    const text = document.querySelector('.withoutNotes');

    if (!text) {
        p.textContent = data.error;
        // append in section
        document.querySelector('.renderNotes').append(p);
    }
};
// remove p element with error text
const deleteTextInfo = () => {
    document.querySelector('.withoutNotes').remove();
};
