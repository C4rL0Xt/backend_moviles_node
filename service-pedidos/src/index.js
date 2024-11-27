import app from './app.js';
import { getConnection } from './database/connection.js';

getConnection();

const PORT = 3002;

app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});
