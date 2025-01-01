import query from '../connect.js';
import response from '../response.js';
import bcryptjs from 'bcryptjs';

export const post = async (req, res) => {
  try {
    const { username, password } = req.body;

    const sql = 'SELECT * FROM hak_akses WHERE username = ?';
    const [result] = await query(sql, username);
    if (!result) return response(res, 404, 'Username tidak ditemukan');

    // Periksa kecocokan password
    const passwordMatch = await bcryptjs.compare(password, result.password);
    if (!passwordMatch) {
      return response(res, 401, 'Password tidak cocok');
    }

    return response(res, 200, 'Login berhasil', result);
  } catch (err) {
    console.error('Error saat mengambil data :', err.message);
    return response(res, 500, 'Gagal mengambil data');
  }
};
