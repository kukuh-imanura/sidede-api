import express from 'express';

import hakAkses from './HakAkses.js';
import pendonor from './Pendonor.js';

const app = express();

app.use('/hakakses', hakAkses);
app.use('/pendonor', pendonor);

export default app;
