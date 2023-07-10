// arrow up
const scrollToTop = document.querySelector('#scrollToTop');
// show icon
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        scrollToTop.style.display = 'block';
    } else {
        scrollToTop.style.display = 'none';
    }
});
// action to top
scrollToTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });