import express from 'express';

import hakAkses from './HakAkses.js';
import pendonor from './Pendonor.js';
import pendaftaran from './Pendaftaran.js';
import pemeriksaan from './Pemeriksaan.js';
import mobileunit from './MobileUnit.js';
import pertanyaan from './Pertanyaan.js';
import screening from './Screening.js';
import auth from './Auth.js';

const app = express();

app.use('/hakakses', hakAkses);
app.use('/pendonor', pendonor);
app.use('/pendaftaran', pendaftaran);
app.use('/pemeriksaan', pemeriksaan);
app.use('/mobileunit', mobileunit);
app.use('/pertanyaan', pertanyaan);
app.use('/screening', screening);
app.use('/auth', auth);

export default app;
