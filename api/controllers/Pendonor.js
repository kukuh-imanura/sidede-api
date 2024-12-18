import query from '../connect.js';
import response from '../response.js';

export const getAll = async (req, res) => {
  const sql = 'SELECT * FROM pendonor';
  const result = await query(sql);

  response(200, result, 'Get data pendonor', res);
};

export const get = async (req, res) => {
  const { nik } = req.params;

  const sql = 'SELECT * FROM pendonor WHERE nik = ?';
  const result = await query(sql, nik);

  response(200, result, 'Get data hak_akses', res);
};

export const post = async (req, res) => {
  const { foto, username, password, hak_akses } = req.body;

  // HASH PASSWORD
  const salt = await bcryptjs.genSalt(12);
  const hashPass = await bcryptjs.hash(password, salt);

  const sql = 'INSERT INTO hak_akses (foto, username, password, hak_akses) VALUES (?, ?, ?, ?)';
  const value = [foto, username, hashPass, hak_akses];
  const result = await query(sql, value);

  response(200, result, 'Post data hak_akses', res);
};

export const patch = async (req, res) => {
  const id = req.params.id;
  const datas = { ...req.body };

  // Jika terdapat password di request body, hash terlebih dahulu
  if (datas.password) {
    const salt = await bcryptjs.genSalt(12); // Generate salt
    datas.password = await bcryptjs.hash(datas.password, salt); // Hash password
  }

  // Bangun query secara dinamis
  // Membangun keys/fields
  const fields = Object.keys(datas)
    .map((field) => `${field} = ?`)
    .join(', ');

  // Membangun values
  const values = Object.values(datas);

  // Menambahkan ID
  values.push(id);

  const sql = `UPDATE hak_akses SET ${fields} WHERE id_akses = ?`;
  const result = await query(sql, values);

  response(200, result, 'Patch data hak_akses', res);
};

export const del = async (req, res) => {
  const id = req.params.id;

  const sql = 'DELETE FROM hak_akses WHERE id_akses = ?';
  const result = await query(sql, id);

  response(200, result, 'Hapus data hak_akses', res);
};
