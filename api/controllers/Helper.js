import response from '../response.js';
import query from '../connect.js';

export const count = async (req, res) => {
  try {
    const [{ jawaban_screening }] = await query(`
      SELECT COUNT(*) AS jawaban_screening
      FROM (
        SELECT id_pendaftaran
        FROM jawaban_screening
        GROUP BY id_pendaftaran
        HAVING COUNT(id_pertanyaan) = 42
      ) AS subquery;
    `);

    const [{ hak_akses }] = await query('SELECT COUNT(*) AS hak_akses FROM hak_akses');
    const [{ pendonor }] = await query('SELECT COUNT(*) AS pendonor FROM pendonor');
    const [{ pendaftaran }] = await query('SELECT COUNT(*) AS pendaftaran FROM pendaftaran');
    const [{ pemeriksaan_kesehatan }] = await query(
      'SELECT COUNT(*) AS pemeriksaan_kesehatan FROM pemeriksaan_kesehatan'
    );
    const [{ mobile_unit }] = await query('SELECT COUNT(*) AS mobile_unit FROM mobile_unit');

    const result = {
      hak_akses,
      pendonor,
      pendaftaran,
      pemeriksaan_kesehatan,
      mobile_unit,
      jawaban_screening,
    };

    return response(res, 200, 'Hitung data berhasil', result);
  } catch (err) {
    console.error('Error saat menghitung data :', err.message);
    return response(res, 500, 'Gagal menghitung data');
  }
};

export const status = async (req, res) => {
  try {
    const id_pendaftaran = req.query.id_pendaftaran;

    // Ambil data screening
    const screeningSql = 'SELECT * FROM jawaban_screening WHERE id_pendaftaran = ?';
    const screeningResult = await query(screeningSql, id_pendaftaran);

    // Cek apakah semua data di field 'verifikasi' sudah terisi
    const verifiedScreening = screeningResult.every(
      (item) => item.verifikasi !== null && item.verifikasi !== undefined
    );

    // Ambil data pemeriksaan kesehatan
    const pemeriksaanSql = 'SELECT * FROM pemeriksaan_kesehatan WHERE id_pendaftaran = ?';
    const pemeriksaanResult = await query(pemeriksaanSql, id_pendaftaran);

    // Susun hasil
    const result = {
      screening: verifiedScreening, // True jika semua data verifikasi terisi
      pemeriksaan: pemeriksaanResult.length > 0, // True jika ada data pemeriksaan
    };

    return response(res, 200, 'Berhasil mengambil data', result);
  } catch (err) {
    console.error(err.message);
    return response(res, 500, 'Gagal mengambil status');
  }
};
