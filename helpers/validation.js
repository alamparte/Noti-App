// Email validation
const validateEmail = async (email) => {
    const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (mailformat.test(await email)) {
        return true;
    } else {
        return false;
    }
};
// Password validation
const validatePassword = async (password) => {
    //Passwort zwischen 6 and 20 Zeichen lang, bestehend aus Buchstaben(Klein- und Großbuchstaben), Zahlen und Satzzeichen
    const passformat = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{6,20}$/;
    if (passformat.test(await password)) {
        return true;
    } else {
        return false;
    }
};

export { validateEmail, validatePassword };
