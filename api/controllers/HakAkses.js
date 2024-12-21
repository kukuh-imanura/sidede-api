import query from '../connect.js';
import response from '../response.js';
import bcryptjs from 'bcryptjs';

export const getAll = async (req, res) => {
  try {
    const sql = 'SELECT * FROM hak_akses';
    const result = await query(sql);

    if (!result.length) return response(res, 204, 'Data kosong');

    return response(res, 200, 'Berhasil mengambil data', result);
  } catch (err) {
    console.error('Error saat mengambil data :', err.message);
    return response(res, 500, 'Gagal mengambil data');
  }
};

export const get = async (req, res) => {
  try {
    const { id } = req.params;

    const sql = 'SELECT * FROM hak_akses WHERE id_akses = ?';
    const result = await query(sql, id);

    if (!result.length) return response(res, 204, 'Data tidak ditemukan');

    return response(res, 200, 'Berhasil mengambil data', result);
  } catch (err) {
    console.error('Error saat mengambil data :', err.message);
    return response(res, 500, 'Gagal mengambil data');
  }
};

export const post = async (req, res) => {
  try {
    const { foto, username, password, hak_akses } = req.body;
    const checkSql = `SELECT * FROM hak_akses WHERE username = ?`;
    const checkResult = await query(checkSql, username);

    if (checkResult.length) return response(res, 409, 'Username sudah ada');

    // HASH PASSWORD
    const salt = await bcryptjs.genSalt(12);
    const hashPass = await bcryptjs.hash(password, salt);

    const insertSql =
      'INSERT INTO hak_akses (foto, username, password, hak_akses) VALUES (?, ?, ?, ?)';
    const insertValue = [foto, username, hashPass, hak_akses];

    const insertResult = await query(insertSql, insertValue);

    if (insertResult.affectedRows) return response(res, 200, 'Berhasil menambah data');
  } catch (err) {
    console.error('Error saat menambah data :', err.message);
    return response(res, 500, 'Gagal menambah data');
  }
};

export const patch = async (req, res) => {
  try {
    const id = req.params.id;

    const datas = Object.fromEntries(
      Object.entries(req.body).filter(
        ([_, value]) => value !== undefined && value !== null && value !== ''
      )
    );

    if (Object.keys(datas).length === 0) {
      return response(res, 400, 'Tidak ada data untuk diubah');
    }

    if (datas.username) {
      const checkSql = 'SELECT * FROM hak_akses WHERE username = ?';
      const checkResult = await query(checkSql, datas.username);
      if (checkResult.length) return response(res, 409, 'Username sudah ada');
    }

    // Jika terdapat password di request body, hash terlebih dahulu
    if (datas.password) {
      const salt = await bcryptjs.genSalt(12); // Generate salt
      datas.password = await bcryptjs.hash(datas.password, salt); // Hash password
    }

    const updateSql = 'UPDATE hak_akses SET ? WHERE id_akses = ?';
    const updateValue = [datas, id];
    const updateResult = await query(updateSql, updateValue);

    if (updateResult.affectedRows) return response(res, 200, 'Ubah data berhasil');
  } catch (err) {
    console.error('Error saat mengubah data :', err.message);
    return response(res, 500, 'Gagal mengubah data');
  }
};

export const del = async (req, res) => {
  try {
    const id = req.params.id;

    const sql = 'DELETE FROM hak_akses WHERE id_akses = ?';
    const result = await query(sql, id);

    if (result.affectedRows) return response(res, 200, 'Hapus data berhasil');
  } catch (err) {
    console.error('Error saat menghapus data :', err.message);
    return response(res, 500, 'Gagal menghapus data');
  }
};
