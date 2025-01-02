import query from '../connect.js';
import response from '../response.js';

export const getAll = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 1; // Ambil 5 screening
    const page = parseInt(req.query.page) || 1; // Halaman default 1
    const offset = (page - 1) * limit; // Hitung offset

    // Hitung total pendaftaran
    const countSql = `
      SELECT COUNT(DISTINCT id_pendaftaran) AS total 
      FROM jawaban_screening
    `;
    const totalResult = await query(countSql);
    const total = totalResult[0].total;

    const totalPages = Math.ceil(total / limit);
    const prev = page > 1 ? page - 1 : null;
    const next = page < totalPages ? page + 1 : null;

    // Ambil ID pendaftaran berdasarkan limit dan offset
    const idSql = `
      SELECT id_pendaftaran 
      FROM jawaban_screening 
      GROUP BY id_pendaftaran 
      ORDER BY id_pendaftaran ASC 
      LIMIT ? OFFSET ?
    `;
    const idValue = [limit, offset];
    const idResult = await query(idSql, idValue);
    if (!idResult.length) return response(res, 204, 'Data kosong');

    const idPendaftaranList = idResult.map((item) => item.id_pendaftaran);

    // Ambil data jawaban screening berdasarkan ID pendaftaran yang sudah didapat
    const dataSql = `
      SELECT * 
      FROM jawaban_screening 
      WHERE id_pendaftaran IN (?)
      ORDER BY id_pendaftaran ASC, id_pertanyaan ASC
    `;
    const dataResult = await query(dataSql, [idPendaftaranList]);

    // Kelompokkan data berdasarkan id_pendaftaran
    const groupedData = dataResult.reduce((acc, item) => {
      const id = item.id_pendaftaran;
      if (!acc[id]) acc[id] = []; // Jika belum ada array untuk ID ini, buat array baru
      acc[id].push(item); // Tambahkan item ke array berdasarkan ID
      return acc; // Kembalikan accumulator (acc) untuk iterasi berikutnya
    }, {});

    return response(res, 200, 'Berhasil mengambil data', groupedData, prev, next, totalPages);
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
    const { id_pendaftaran, ...questions } = req.body;

    const checkSql = `SELECT * FROM jawaban_screening WHERE id_pendaftaran = ?`;
    const checkResult = await query(checkSql, id_pendaftaran);
    if (checkResult.length) return response(res, 409, 'ID Pendaftaran sudah ada');

    // Memasukkan jawaban ke database
    const insertSql =
      'INSERT INTO jawaban_screening (id_pendaftaran, id_pertanyaan, jawaban) VALUES (?, ?, ?)';

    for (const [key, value] of Object.entries(questions)) {
      const insertValue = [id_pendaftaran, key, value];
      const insertResult = await query(insertSql, insertValue);

      if (!insertResult.affectedRows) {
        return response(res, 400, 'Gagal menyimpan jawaban ke database');
      }
    }

    return response(res, 200, 'Berhasil menambah data');
  } catch (err) {
    console.error('Error saat menambah data :', err.message);
    return response(res, 500, 'Gagal menambah data');
  }
};

export const patch = async (req, res) => {
  try {
    const { id_pendaftaran, ...questions } = req.body;

    const updateSql =
      'UPDATE jawaban_screening SET verifikasi = ? WHERE id_pendaftaran = ? AND id_pertanyaan = ?';

    for (const [id_pertanyaan, verifikasi] of Object.entries(questions)) {
      const updateResult = await query(updateSql, [verifikasi, id_pendaftaran, id_pertanyaan]);

      if (!updateResult.affectedRows) {
        return response(res, 400, `Gagal mengupdate id_pertanyaan: ${id_pertanyaan}`);
      }
    }

    return response(res, 200, 'Ubah data berhasil');
  } catch (err) {
    console.error('Error saat mengubah data:', err.message);
    return response(res, 500, 'Gagal mengubah data');
  }
};

export const del = async (req, res) => {
  try {
    const id = req.params.id;

    const sql = 'DELETE FROM jawaban_screening WHERE id_pendaftaran = ?';
    const result = await query(sql, id);

    if (result.affectedRows) return response(res, 200, 'Hapus data berhasil');
  } catch (err) {
    console.error('Error saat menghapus data :', err.message);
    return response(res, 500, 'Gagal menghapus data');
  }
};
