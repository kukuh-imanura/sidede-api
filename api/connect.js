import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const pool = mysql.createPool({
  // UNTUK LOKAL
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
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
