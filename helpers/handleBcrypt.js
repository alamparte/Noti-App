import bcrypt from 'bcrypt';

const encrypt = async (textPlain) => {
    const hash = await bcrypt.hash(textPlain, 10);
    return hash;
};

const compare = async (passPlain, hashPass) => {
    return await bcrypt.compare(passPlain, hashPass);
};

export { encrypt, compare };
