import query from '../connect.js';
import response from '../response.js';

export const getAll = async (req, res) => {
  try {
    const dataSql = 'SELECT * FROM pertanyaan_screening ORDER BY id_pertanyaan ASC';
    const dataResult = await query(dataSql);

    if (!dataResult.length) return response(res, 204, 'Data kosong');

    return response(res, 200, 'Berhasil mengambil data', dataResult);
  } catch (err) {
    console.error('Error saat mengambil data :', err.message);
    return response(res, 500, 'Gagal mengambil data');
  }
};

export const get = async (req, res) => {
  try {
    const { id } = req.params;

    const sql = 'SELECT * FROM pertanyaan_screening WHERE id_pertanyaan = ?';
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
    const { pertanyaan } = req.body;

    const insertSql = 'INSERT INTO pertanyaan_screening (pertanyaan) VALUES (?)';
    const insertResult = await query(insertSql, pertanyaan);

    if (insertResult.affectedRows) return response(res, 200, 'Berhasil menambah data');
  } catch (err) {
    console.error('Error saat menambah data :', err.message);
    return response(res, 500, 'Gagal menambah data');
  }
};

export const patch = async (req, res) => {
  try {
    const id = req.params.id;
    const { pertanyaan } = req.body;

    if (!pertanyaan) return response(res, 400, 'Tidak ada data untuk di ubah');

    const updateSql = 'UPDATE pertanyaan_screening SET ? WHERE id_pertanyaan = ?';
    const updateValue = [pertanyaan, id];
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

    const sql = 'DELETE FROM pertanyaan_screening WHERE id_pertanyaan = ?';
    const result = await query(sql, id);

    if (result.affectedRows) return response(res, 200, 'Hapus data berhasil');
  } catch (err) {
    console.error('Error saat menghapus data :', err.message);
    return response(res, 500, 'Gagal menghapus data');
  }
};
