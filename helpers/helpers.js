import fs from 'fs';

const databaseFolder = './database';
// Datum generate
const getDatum = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    let dateObj = new Date(),
        month = months[dateObj.getMonth()],
        day = dateObj.getDate(),
        year = dateObj.getFullYear();
    return `${month} ${day}, ${year}`;
};

// Generate a random numeric code for password reset
const generateNumericCode = () => {
    return Math.floor(100000 + Math.random() * 900000);
};

// read JSON users
const jsonUsers = async () => {
    try {
        return JSON.parse(await fs.promises.readFile('database/users.json'));
    } catch (error) {
        console.log(error);
        return [];
    }
};

// // read JSON notes
const jsonNotes = async (req) => {
  try {
      let file = await fileName(req);
      return JSON.parse(await fs.promises.readFile(`${databaseFolder}/${file}`));
  } catch (error) {
      console.log(error);
      return [];
  }
};

// file name per user ID
const fileName = async (req) => {
  const users = await jsonUsers();
  const foundUser = users.find((user) => user.username === req.session.username);
  return `${foundUser.id}.json`;
};

export { getDatum, generateNumericCode, jsonUsers, jsonNotes, fileName };
