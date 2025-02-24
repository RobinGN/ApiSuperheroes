const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = 3000;

app.use(cors());

const cargarDatos = () => {
  const rawData = fs.readFileSync("villanos_db.json"); 
  return JSON.parse(rawData);
};

//obtener toda la base de datos
app.get("/api/villanos", (req, res) => {
  const data = cargarDatos();
  res.json(data);
});

// solo villanos de Marvel
app.get("/api/villanos/marvel", (req, res) => {
  const data = cargarDatos();
  res.json(data.base_de_datos.tablas.Marvel.datos);
});

// villano específico
app.get("/api/villanos/marvel/:nombre", (req, res) => {
  const data = cargarDatos();
  const nombre = req.params.nombre;
  const villano = data.base_de_datos.tablas.Marvel.datos.find(
    (v) => v.Nombre.toLowerCase() === nombre.toLowerCase()
  );

  if (villano) {
    res.json(villano);
  } else {
    res.status(404).json({ error: "Villano no encontrado" });
  }
});

app.listen(PORT, () => {
  console.log(` Servidor corriendo en http://localhost:${PORT}`);
});
