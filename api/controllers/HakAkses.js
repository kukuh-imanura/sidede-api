import execute from '../connect.js';
import response from '../response.js';
import bcryptjs from 'bcryptjs';

export const getAll = async (req, res) => {
  const sql = 'SELECT * FROM hak_akses';

  await execute(sql)
    .then((result) => {
      if (result.length === 0) return response(res, 404, 'Data tidak ditemukan');

      response(res, 200, 'Berhasil mengambil data', result);
    })
    .catch((err) => {
      console.error(err);
      response(res, 500, 'Gagal mengambil data');
    });
};

export const get = async (req, res) => {
  const { id } = req.params;

  const sql = 'SELECT * FROM hak_akses WHERE id_akses = ?';

  await execute(sql, id)
    .then((result) => {
      if (result.length === 0) return response(res, 404, 'Data tidak ditemukan');

      response(res, 200, 'Berhasil mengambil data', result);
    })
    .catch((err) => {
      console.error(err);
      response(res, 500, 'Gagal mengambil data');
    });
};

export const post = async (req, res) => {
  const { foto, username, password, hak_akses } = req.body;

  let sql = `SELECT * FROM hak_akses WHERE username = ?`;
  await execute(sql, username).then((result) => {
    if (result.length > 0) throw new Error('Username sudah ada');
  });

  // HASH PASSWORD
  const salt = await bcryptjs.genSalt(12);
  const hashPass = await bcryptjs.hash(password, salt);

  sql = 'INSERT INTO hak_akses (foto, username, password, hak_akses) VALUES (?, ?, ?, ?)';
  const value = [foto, username, hashPass, hak_akses];

  await execute(sql, value)
    .then((result) => {
      if (result.affectedRows) response(res, 200, 'Berhasil menambah data', result);
    })
    .catch((err) => {
      console.error(err);

      response(res, 500, 'Gagal menambah data');
    });
};

export const patch = async (req, res) => {
  const id = req.params.id;
  const datas = { ...req.body };

  // Jika terdapat password di request body, hash terlebih dahulu
  if (datas.password) {
    const salt = await bcryptjs.genSalt(12); // Generate salt
    datas.password = await bcryptjs.hash(datas.password, salt); // Hash password
  }

  const sql = `UPDATE hak_akses SET ? WHERE id_akses = ?`;
  const value = [datas, id];
  const result = await execute(sql, value);

  response(200, result, 'Ubah data berhasil', res);
};

export const del = async (req, res) => {
  const id = req.params.id;

  const sql = 'DELETE FROM hak_akses WHERE id_akses = ?';
  const result = await execute(sql, id);

  response(200, result, 'Hapus data berhasil', res);
};
