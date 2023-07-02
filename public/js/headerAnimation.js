// sticky header
const header = document.querySelector('header');
const toggleClass = 'is-sticky';
const sticky = header.offsetTop;

window.addEventListener('scroll', () => {
    if (window.pageYOffset > sticky) {
        header.classList.add(toggleClass);
    } else {
        header.classList.remove(toggleClass);
    }
});

// responsive menu
const menuBars = document.querySelector('#menuBars');
const ul = document.querySelector('.menu');
const links = document.querySelectorAll('.liLink');

if (menuBars) {
    menuBars.addEventListener('click', () => {
        ul.classList.toggle('show');
    });

    links.forEach((link) => {
        link.addEventListener('click', () => {
            ul.classList.remove('show');
        });
    });
}
