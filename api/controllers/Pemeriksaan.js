import query from '../connect.js';
import response from '../response.js';

export const getAll = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * limit;

    const countSql = 'SELECT COUNT(*) AS total FROM pemeriksaan_kesehatan';
    const totalResult = await query(countSql);
    const total = totalResult[0].total;

    const totalPages = Math.ceil(total / limit);
    const prev = Math.max(page - 1, 1);
    const next = Math.min(page + 1, totalPages);

    const dataSql =
      'SELECT * FROM pemeriksaan_kesehatan ORDER BY id_pendaftaran ASC LIMIT ? OFFSET ?';
    const dataValue = [limit, offset];
    const dataResult = await query(dataSql, dataValue);

    if (!dataResult.length) return response(res, 204, 'Data kosong');

    return response(res, 200, 'Berhasil mengambil data', dataResult, prev, next, totalPages);
  } catch (err) {
    console.error('Error saat mengambil data :', err.message);
    return response(res, 500, 'Gagal mengambil data');
  }
};

export const get = async (req, res) => {
  try {
    const { id } = req.params;

    const sql = 'SELECT * FROM pemeriksaan_kesehatan WHERE id_pk = ?';
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
    const {
      id_pendaftaran,
      nama_petugas,
      tekanan_darah,
      denyut_nadi,
      berat_badan,
      tinggi_badan,
      suhu,
      keadaan_umum,
      riwayat_medis,
    } = req.body;
    const checkSql = `SELECT * FROM pemeriksaan_kesehatan WHERE id_pendaftaran = ?`;
    const checkResult = await query(checkSql, id_pendaftaran);

    if (checkResult.length) return response(res, 409, 'ID Pendaftaran sudah ada');

    const insertSql =
      'INSERT INTO pemeriksaan_kesehatan (id_pendaftaran, nama_petugas, tekanan_darah, denyut_nadi, berat_badan, tinggi_badan, suhu, keadaan_umum, riwayat_medis) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const insertValue = [
      id_pendaftaran,
      nama_petugas,
      tekanan_darah,
      denyut_nadi,
      berat_badan,
      tinggi_badan,
      suhu,
      keadaan_umum,
      riwayat_medis,
    ];

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

    if (datas.id_pendaftaran) {
      const checkSql = 'SELECT * FROM pemeriksaan_kesehatan WHERE id_pendaftaran = ?';
      const checkResult = await query(checkSql, datas.id_pendaftaran);
      if (checkResult.length) return response(res, 409, 'ID Pendaftaran sudah ada');
    }

    const updateSql = 'UPDATE pemeriksaan_kesehatan SET ? WHERE id_pk = ?';
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

    const sql = 'DELETE FROM pemeriksaan_kesehatan WHERE id_pk = ?';
    const result = await query(sql, id);

    if (result.affectedRows) return response(res, 200, 'Hapus data berhasil');
  } catch (err) {
    console.error('Error saat menghapus data :', err.message);
    return response(res, 500, 'Gagal menghapus data');
  }
};
