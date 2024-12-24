import express from 'express';

import hakAkses from './HakAkses.js';
import pendonor from './Pendonor.js';
import pendaftaran from './Pendaftaran.js';

const app = express();

app.use('/hakakses', hakAkses);
app.use('/pendonor', pendonor);
app.use('/pendaftaran', pendaftaran);

export default app;
