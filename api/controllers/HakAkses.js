import query from '../connect.js';
import response from '../response.js';
import bcryptjs from 'bcryptjs';

export const getAll = async (req, res) => {
  const sql = 'SELECT * FROM hak_akses';
  const result = await query(sql);

  response(200, result, 'Get data hak_akses', res);
};

export const get = async (req, res) => {
  const { id } = req.params;

  const sql = 'SELECT * FROM hak_akses WHERE id_akses = ?';
  const result = await query(sql, id);

  response(200, result, `Get data hak_akses ${id}`, res);
};

export const post = async (req, res) => {
  const { foto, username, password, hak_akses } = req.body;

  // HASH PASSWORD
  const salt = await bcryptjs.genSalt(12);
  const hashPass = await bcryptjs.hash(password, salt);

  const sql = 'INSERT INTO hak_akses (foto, username, password, hak_akses) VALUES (?, ?, ?, ?)';
  const value = [foto, username, hashPass, hak_akses];
  const result = await query(sql, value);

  response(200, result, 'Tambah data berhasil', res);
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
  const result = await query(sql, value);

  response(200, result, 'Ubah data berhasil', res);
};

export const del = async (req, res) => {
  const id = req.params.id;

  const sql = 'DELETE FROM hak_akses WHERE id_akses = ?';
  const result = await query(sql, id);

  response(200, result, 'Hapus data berhasil', res);
};
