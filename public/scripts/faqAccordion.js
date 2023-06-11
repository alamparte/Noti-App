const questions = document.querySelectorAll('.accordion button');

function accordionToggle() {
    const selectedItem = this.getAttribute('aria-expanded');
    for (i = 0; i < questions.length; i++) {
        questions[i].setAttribute('aria-expanded', 'false');
    }
    if (selectedItem == 'false') {
        this.setAttribute('aria-expanded', 'true');
    }
}

questions.forEach((question) => question.addEventListener('click', accordionToggle));
