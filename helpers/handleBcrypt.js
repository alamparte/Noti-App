import bcrypt from 'bcrypt';

// encrypt password
const encrypt = async (textPlain) => {
    const hash = await bcrypt.hash(textPlain, 10);
    return hash;
};

// decrypt password
const compare = async (passPlain, hashPass) => {
    return await bcrypt.compare(passPlain, hashPass);
};

export { encrypt, compare };
