import query from '../connect.js';
import response from '../response.js';
import bcryptjs from 'bcryptjs';

export const getAll = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * limit;

    const countSql = 'SELECT COUNT(*) AS total FROM pendonor';
    const totalResult = await query(countSql);
    const total = totalResult[0].total;

    const totalPages = Math.ceil(total / limit);
    const prev = Math.max(page - 1, 1);
    const next = Math.min(page + 1, totalPages);

    const dataSql = 'SELECT * FROM pendonor ORDER BY nik ASC LIMIT ? OFFSET ?';
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
    const { nik } = req.params;

    const sql = 'SELECT * FROM pendonor WHERE nik = ?';
    const result = await query(sql, nik);

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
      foto,
      username,
      password,
      nik,
      no_kartu,
      nama,
      jenis_kelamin,
      tempat_lahir,
      tgl_lahir,
      pekerjaan,
      kecamatan,
      kelurahan,
      kota,
      alamat,
      telp_rumah,
      alamat_kantor,
      email,
    } = req.body;

    const checkSql = `SELECT * FROM hak_akses WHERE username = ?`;
    const checkResult = await query(checkSql, username);
    if (checkResult.length) return response(res, 409, 'Username sudah ada');

    const checkPendonorSql = `SELECT * FROM pendonor WHERE nik = ? OR no_kartu = ?`;
    const checkPendonorValue = [nik, no_kartu];
    const checkPendonorResult = await query(checkPendonorSql, checkPendonorValue);
    if (checkPendonorResult.length)
      return response(res, 409, 'NIK / No Kartu Donor sudah terdaftar');

    // HASH PASSWORD
    const salt = await bcryptjs.genSalt(12);
    const hashPass = await bcryptjs.hash(password, salt);

    const aksesSql =
      'INSERT INTO hak_akses (foto, username, password, hak_akses) VALUES (?, ?, ?, ?)';
    const aksesValue = [foto || null, username, hashPass, 'D'];
    const aksesResult = await query(aksesSql, aksesValue);
    const id_akses = aksesResult.insertId;

    const pendonorSql =
      'INSERT INTO pendonor (nik, id_akses, no_kartu, nama, jenis_kelamin, tempat_lahir, tgl_lahir, pekerjaan, kecamatan, kelurahan, kota, alamat, telp_rumah, alamat_kantor, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const pendonorValue = [
      nik,
      id_akses,
      no_kartu,
      nama,
      jenis_kelamin,
      tempat_lahir,
      tgl_lahir,
      pekerjaan,
      kecamatan,
      kelurahan,
      kota,
      alamat,
      telp_rumah,
      alamat_kantor,
      email,
    ];
    const pendonorResult = await query(pendonorSql, pendonorValue);

    if (pendonorResult.affectedRows) return response(res, 200, 'Berhasil menambah data');
  } catch (err) {
    console.error('Error saat menambah data :', err.message);
    return response(res, 500, 'Gagal menambah data');
  }
};

export const patch = async (req, res) => {
  try {
    const nik = req.params.nik;

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

    if (datas.nik || datas.nkd) {
      const checkPendonorSql = `SELECT * FROM pendonor WHERE nik = ? OR no_kartu = ?`;
      const checkPendonorValue = [datas.nik, datas.nkd];
      const checkPendonorResult = await query(checkPendonorSql, checkPendonorValue);
      if (checkPendonorResult.length)
        return response(res, 409, 'NIK / No Kartu Donor sudah terdaftar');
    }

    // Jika terdapat password di request body, hash terlebih dahulu
    if (datas.password) {
      const salt = await bcryptjs.genSalt(12); // Generate salt
      datas.password = await bcryptjs.hash(datas.password, salt); // Hash password
    }

    // PISAHKAN DATA
    const { foto, username, password, ...pendonor } = datas;
    const akses = Object.fromEntries(
      Object.entries({ foto, username, password }).filter(
        ([_, value]) => value !== undefined && value !== null && value !== ''
      )
    );

    if (Object.keys(akses).length > 0) {
      const idSql = 'SELECT id_akses FROM pendonor WHERE nik = ?';
      const idRes = await query(idSql, nik);
      const id_akses = idRes[0].id_akses;

      const aksesSql = 'UPDATE hak_akses SET ? WHERE id_akses = ?';
      const aksesValue = [akses, id_akses];
      const aksesResult = await query(aksesSql, aksesValue);
      if (aksesResult.affectedRows)
        response(res, 200, `Berhasil ubah data hak_akses dengan id ${id_akses}`);
    }

    if (Object.keys(pendonor).length > 0) {
      const pendonorSql = 'UPDATE pendonor SET ? WHERE nik = ?';
      const pendonorValue = [pendonor, nik];
      const pendonorResult = await query(pendonorSql, pendonorValue);
      if (pendonorResult.affectedRows) return response(res, 200, `Ubah data berhasil`);
    }
  } catch (err) {
    console.error('Error saat mengubah data :', err.message);
    return response(res, 500, 'Gagal mengubah data');
  }
};

export const del = async (req, res) => {
  try {
    const nik = req.params.nik;

    const idSql = 'SELECT id_akses FROM pendonor WHERE nik = ?';
    const idRes = await query(idSql, nik);
    const id_akses = idRes[0]?.id_akses;

    const aksesSql = 'DELETE FROM hak_akses WHERE id_akses = ?';
    const aksesRes = await query(aksesSql, id_akses);
    if (aksesRes.affectedRows) console.log(`Berhasil hapus data akses dengan id ${id_akses}`);

    const pendonorSql = 'DELETE FROM pendonor WHERE nik = ?';
    const pendonorResult = await query(pendonorSql, nik);

    if (pendonorResult.affectedRows) return response(res, 200, 'Hapus data berhasil');
  } catch (err) {
    console.error('Error saat menghapus data :', err.message);
    return response(res, 500, 'Gagal menghapus data');
  }
};
