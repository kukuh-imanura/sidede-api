import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  // UNTUK LOKAL
  host: 'localhost',
  user: 'root',
  database: 'sidd',
  password: '',
});

const query = async (query, value) => {
  try {
    const [result] = await pool.query(query, value ?? []); // hasil dari query
    return result;
  } catch (error) {
    console.log(error);
  }
};

export default query;
