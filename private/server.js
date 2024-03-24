require("dotenv").config(); // Cargar variables de entorno desde el archivo .env
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000; // Usar la variable de entorno PORT o por defecto 3000

// Ruta de ejemplo
app.get("/", (req, res) => {
  res.send("¡Hola, mundo!");
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
