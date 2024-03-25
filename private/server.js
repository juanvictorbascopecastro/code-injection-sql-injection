require("dotenv").config(); // Cargar variables de entorno desde el archivo .env
const express = require("express");
const cors = require("cors"); // Importar el módulo cors
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000; // Usar la variable de entorno PORT o por defecto 3000
const multer = require("multer");
const conexion = require("./conexion"); // Importa el módulo de configuración de MySQL

// Array con los orígenes permitidos
const todosLosOrigenes = [
  "http://localhost:80",
  "http://localhost",
  "http://localhost:8080",
];

// Middleware para habilitar CORS para múltiples orígenes
app.use(
  cors({
    origin: function (origin, callback) {
      // Verificar si el origen de la solicitud está en la lista de orígenes permitidos
      if (!origin || todosLosOrigenes.includes(origin)) callback(null, true);
      else
        callback(
          new Error(
            "ESTA DIRECCION NO TIENE ACCESO A CONECTARSE CON EL SERVIDOR!"
          )
        );
    },
  })
);

// Middleware para analizar el cuerpo de las solicitudes con datos codificados en URL
app.use(express.urlencoded({ extended: true }));
// Middleware para analizar el cuerpo de las solicitudes JSON
app.use(express.json());

// Ruta base del servidor
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./../public/index.html"));
  // res.send("Ejemplos realizados en clases de code injection y sql injection");
});

// Recibir textos por set
app.get("/texto", (req, res) => {
  console.log(req.query);
  return res.status(200).json(req.query);
});

// Recibir textos por post
app.post("/texto", (req, res) => {
  if (!req.body.nombre) return res.status(400).json("Nombre es requerido!");
  if (!req.body.apellido) return res.status(400).json("Apellido es requerido!");
  return res.status(200).json(req.body);
});
/************  ARCHIVOS  ***************/
// Configuración de Multer para almacenar archivos en el sistema de archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "archivos-subido/"); // Ruta donde se almacenarán los archivos
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Nombre del archivo en el sistema de archivos
  },
});

const upload = multer({ storage: storage });

// Ruta para manejar la solicitud POST con archivos
app.post("/archivo", upload.single("archivo"), (req, res) => {
  console.log("Archivo recibido:", req.file);
  res.send("Archivo recibido correctamente.");
});

/************  BASE DE DATOS  ***************/
app.post("/insercion-no-seguro", (req, res) => {
  const { nombre, apellido } = req.body;
  const sql = `INSERT INTO usuarios (nombre, apellido) VALUES ('${nombre}', '${apellido}')`;
  conexion.query(sql, (err, result) => {
    if (err) {
      return res
        .status(500)
        .send("Error al insertar datos en la base de datos");
    }
    res.send("Datos insertados correctamente en la base de datos");
  });
});

app.post("/insercion-seguro", (req, res) => {
  let { nombre, apellido } = req.body;
  nombre = conexion.escape(nombre); // detecta codigo SQL
  apellido = conexion.escape(apellido); // detecta codigo SQL
  // Consulta SQL para insertar los datos en la tabla
  const sql = `INSERT INTO usuarios (nombre, apellido) VALUES (?, ?)`;
  // Ejecutar la consulta SQL con los datos recibidos
  conexion.query(sql, [nombre, apellido], (err, result) => {
    if (err) {
      return res
        .status(500)
        .send("Error al insertar datos en la base de datos");
    }

    res.send("Datos insertados correctamente en la base de datos");
  });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
