const { Pool } = require('pg')


const pool = new Pool({
    host:"localhost",
    port:5432,
    user:"postgres",
    password:"4121",
    database:"email1"
})

const pg = async(SQL,...values) => {
const client = await pool.connect();
try {
    const { rows } = await client.query(SQL,values.length ? values : null);
    return rows
} catch (error) {
    console.log(error);
}finally{
    client.release()
}
}

module.exports = pg