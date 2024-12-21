import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOS,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true, // Tunggu hingga ada koneksi yang tersedia
  connectionLimit: 10, // Batas maksimal koneksi yang dibuat dalam pool
  queueLimit: 0, // Tidak ada batas antrian
});

const execute = async (query, value) => {
  try {
    const newValue = value ? (Array.isArray(value) ? value : [value]) : [];

    const [result] = await pool.execute(query, newValue ?? []); // hasil dari query
    return result;
  } catch (error) {
    console.log(error);
  }
};

export default execute;
