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