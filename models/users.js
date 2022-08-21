const db = require('./db');
const tbName = 'Users';
const idFieldName = 'f_username';
const idF = 'f_id';
module.exports = {
    all: async () => {
        const res = await db.load(tbName);
        return res;
    },
    get: async username => {
        const res = await db.get(tbName, idFieldName, username);
        if(res.length > 0) {
            return res[0];
        }
        return null;
    },
    add: async user => {
        const res = await db.add(tbName, user);
        return res;
    },
    update : async (user,row) => {
        const res = await db.update(tbName,user,row);
        return res;
    },
    getbyId: async id =>{
        const res = await db.get(tbName, idF, id);
        if(res.length > 0) {
            return res[0];
        }
        return null;
    }
}