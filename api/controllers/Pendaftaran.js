import query from '../connect.js';
import response from '../response.js';

export const getAll = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5; // Default 5 per halaman
    const page = parseInt(req.query.page) || 1; // Default halaman 1
    const status = req.query.status || '';
    const offset = (page - 1) * limit;

    // Query Kondisi Dinamis
    const whereClauses = [];
    const queryParams = [];

    if (status) {
      whereClauses.push('status = ?');
      queryParams.push(status);
    }

    const whereSql = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : '';

    // Hitung Total Data
    const countSql = `SELECT COUNT(*) AS total FROM pendaftaran ${whereSql}`;
    const totalResult = await query(countSql, queryParams);
    const total = totalResult[0]?.total || 0;

    if (total === 0) return response(res, 204, 'Data kosong');

    // Hitung Pagination
    const totalPages = Math.ceil(total / limit);
    const prev = Math.max(page - 1, 1);
    const next = Math.min(page + 1, totalPages);

    // Ambil Data dengan Limit dan Offset
    const dataSql = `SELECT * FROM pendaftaran ${whereSql} ORDER BY nik ASC LIMIT ? OFFSET ?`;
    queryParams.push(limit, offset);

    const dataResult = await query(dataSql, queryParams);

    return response(res, 200, 'Berhasil mengambil data', dataResult, prev, next, totalPages);
  } catch (err) {
    console.error('Error saat mengambil data:', err.message);
    return response(res, 500, 'Gagal mengambil data');
  }
};

export const get = async (req, res) => {
  try {
    const { id } = req.params;

    console.log({ id });

    const sql = 'SELECT * FROM pendaftaran WHERE id_pendaftaran = ?';
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
    const { nik, lokasi, tipe, penghargaan, donor_puasa, donor_sukarela } = req.body;

    const checkSql = 'SELECT COUNT(*) AS total FROM pendonor WHERE nik = ?';
    const checkRes = await query(checkSql, nik);
    if (checkRes[0].total === 0) return response(res, 404, 'NIK tidak terdaftar');

    const now = new Date();

    const getSql =
      'SELECT donor_ke, tgl_donor, status FROM pendaftaran WHERE nik = ? ORDER BY donor_ke DESC LIMIT 1';
    const getRes = await query(getSql, nik);
    const { donor_ke, tgl_donor, status } = getRes[0] || { donor_ke: 0, tgl_donor: null };

    if (status === 'P')
      return response(res, 409, 'Tidak bisa mendaftar, pendaftaran sebelumnya belum di proses');

    const insertSql =
      'INSERT INTO pendaftaran (nik, tgl_donor,	lokasi,	tipe,	donor_ke,	tgl_akhir_donor,	donor_puasa,	donor_sukarela,	penghargaan,	status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const insertValue = [
      nik,
      now,
      lokasi,
      tipe,
      donor_ke + 1,
      tgl_donor,
      donor_puasa,
      donor_sukarela,
      penghargaan,
      'P',
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

    const updateSql = 'UPDATE pendaftaran SET ? WHERE id_pendaftaran = ?';
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

    const sql = 'DELETE FROM pendaftaran WHERE id_pendaftaran = ?';
    const result = await query(sql, id);

    if (result.affectedRows) return response(res, 200, 'Hapus data berhasil');
  } catch (err) {
    console.error('Error saat menghapus data :', err.message);
    return response(res, 500, 'Gagal menghapus data');
  }
};
