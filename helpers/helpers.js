// Datum generate
const getDatum = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    let dateObj = new Date(),
        month = months[dateObj.getMonth()],
        day = dateObj.getDate(),
        year = dateObj.getFullYear();
    return `${month} ${day}, ${year}`;
};


// ver si dejo aca en helpers esta funcion ?????????????????????????????????????????
// read JSON users
// const jsonUsers = async () => {
//     try {
//         return JSON.parse(await fs.promises.readFile('database/users.json'));
//     } catch (error) {
//         console.log(error);
//         return [];
//     }
// };




export { getDatum };
