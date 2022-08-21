const ConnectionParameters = require('pg/lib/connection-parameters');

const pgp = require('pg-promise')({
    capSQL:true,
});

const cn = {
  user: 'postgres',
  host: 'localhost',
  database: 'users',
  password: '123456',
  port: 5432,
};



const db = pgp(cn);

const schema= 'public';
exports.load = async tbName => {
    const table = new pgp.helpers.TableName({table: tbName, schema: schema});
    const qStr = pgp.as.format('SELECT * FROM $1', table);
    try {
        const res = await db.any(qStr);
        return res;
    } catch (error){
        console.log('error db/load:', error);
    }
};

exports.get = async (tbName, fieldName, value) => {
    const table = new pgp.helpers.TableName({table: tbName, schema:schema});
    const qStr =  pgp.as.format(`SELECT * from $1 WHERE "${fieldName}"='${value}'`,table);
    try {
        const res = await db.any(qStr);
        return res;
    } catch (error){
        console.log('error db/get:', error);
    }
};
exports.getname = async (tbName, name, value) => {
    const table = new pgp.helpers.TableName({table: tbName, schema:schema});
    const qStr =  pgp.as.format(`SELECT * from $1 WHERE "${name}"='${value}'`,table);
    try {
        const res = await db.any(qStr);
        return res;
    } catch (error){
        console.log('error db/get:', error);
    }
};

exports.add = async (tbName, entity) => {
    const table = new pgp.helpers.TableName({table: tbName, schema:schema});
    const qStr = pgp.helpers.insert(entity,null,table) + 'RETURNING *';
    try {
        const res = await db.one(qStr);
        return res;
    } catch(error){
        console.log('error db/add', error);
    }
}

exports.update = async (tbName,entity, row) => {
    const table = new pgp.helpers.TableName({table: tbName, schema:schema});
    const condition = pgp.as.format(` WHERE f_username = ${row}`, tbName);
    /* const q2 = pgp.helpers.update(entity,null,table) + `WHERE f_username = '${row}'`; */
    try{
        const res = await db.one(pgp.helpers.update(entity,null,table) + `WHERE f_username = '${row}'` + 'RETURNING *');
        return res;
    } catch(error)
    {
        console.log('error db/addcolumn', error);
    }
}

