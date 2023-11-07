// Mobile Navigation Menu, when user is logged in (all /dashboard routes html)
const menubar = document.querySelector('#menubar');
const menuLi = document.querySelector('#menu');
const navDash = document.querySelector('.navDash');

const displayMenu = () => {
    navDash.classList.toggle('active');
};
menubar.addEventListener('click', displayMenu);

