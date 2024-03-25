const mysql = require("mysql");

// Configuración de la conexión a la base de datos MySQL
const connection = mysql.createConnection({
  host: "localhost", // Cambia esto por la dirección de tu servidor MySQL
  user: "root", // Cambia esto por el nombre de usuario de tu base de datos
  password: "", // Cambia esto por la contraseña de tu base de datos
  database: "prueba", // Cambia esto por el nombre de tu base de datos
});

// Establecer conexión a la base de datos
connection.connect((err) => {
  if (err) {
    console.error("Error al conectar a la base de datos:", err);
    return;
  }
  console.log("Conexión a la base de datos correctamente.");
});

module.exports = connection;
