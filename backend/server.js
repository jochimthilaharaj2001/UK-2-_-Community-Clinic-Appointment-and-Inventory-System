import dotenv from 'dotenv';
dotenv.config();
import app from './src/app.js';

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    const fallbackPort = Math.floor(3000 + Math.random() * 2000);
    console.log(`Port ${PORT} in use, switching to ${fallbackPort}`);
    app.listen(fallbackPort, () => {
      console.log(`Backend running on port ${fallbackPort}`);
    });
  } else {
    console.error(err);
    process.exit(1);
  }
});
