const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const cargarDatos = () => {
  const rawData = fs.readFileSync("villanos_db.json"); 
  return JSON.parse(rawData);
};

//obtener toda la base de datos
app.get("/api/villanos", (req, res) => {
  const data = cargarDatos();
  res.json(data);
});

//villanos de Marvel
app.get("/api/villanos/marvel", (req, res) => {
  const data = cargarDatos();
  res.json(data.base_de_datos.tablas.Marvel.datos);
});

// villano por nombre en específico
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

//Villanos DC
app.get("/api/villanos/dc", (req, res) => {
    const data = cargarDatos();
    res.json(data.base_de_datos.tablas.DC.datos);
  });
  
  //Villano por nombre en especifico
  app.get("/api/villanos/dc/:nombre", (req, res) => {
    const data = cargarDatos();
    const nombre = req.params.nombre;
    const villano = data.base_de_datos.tablas.DC.datos.find(
      (v) => v.Nombre.toLowerCase() === nombre.toLowerCase()
    );
  
    if (villano) {
      res.json(villano);
    } else {
      res.status(404).json({ error: "Villano no encontrado" });
    }
  });


// Villano de Marvel por nombre de nemesis en especifico
app.get("/api/villanos/marvel/nemesis/:nemesis", (req, res) => {
  const data = cargarDatos();
  const nemesisParametro = req.params.nemesis.toLowerCase();
  const villanosFiltrados = data.base_de_datos.tablas.Marvel.datos.filter(
    (villano) => villano.Nemesis.toLowerCase().includes(nemesisParametro)
  );

  if (villanosFiltrados.length === 0) {
    return res.status(404).json({ error: "No se encontraron villanos con ese nemesis" });
  }

  res.json(villanosFiltrados);
});

// Villano de DC por nombre de nemesis en especifico
app.get("/api/villanos/dc/nemesis/:nemesis", (req, res) => {
  const data = cargarDatos();
  const nemesisParametro = req.params.nemesis.toLowerCase();
  const villanosFiltrados = data.base_de_datos.tablas.DC.datos.filter(
    (villano) => villano.Nemesis.toLowerCase().includes(nemesisParametro)
  );

  if (villanosFiltrados.length === 0) {
    return res.status(404).json({ error: "No se encontraron villanos con ese nemesis" });
  }

  res.json(villanosFiltrados);
});



// Agregar un Villano a la tabla de Marvel
app.post("/api/villanos/marvel", (req, res) => {
  const nuevoVillano = req.body; 
  const data = cargarDatos();
  
  data.base_de_datos.tablas.Marvel.datos.push(nuevoVillano);
  
  fs.writeFileSync("villanos_db.json", JSON.stringify(data, null, 2));
  
  res.status(201).json({ message: "Villano agregado a Marvel", villano: nuevoVillano });
});

// Agregar un Villano a la tabla de DC
app.post("/api/villanos/dc", (req, res) => {
  const nuevoVillano = req.body; 
  const data = cargarDatos();
  
  data.base_de_datos.tablas.DC.datos.push(nuevoVillano);
  
  fs.writeFileSync("villanos_db.json", JSON.stringify(data, null, 2));
  
  res.status(201).json({ message: "Villano agregado a DC", villano: nuevoVillano });
});

// Actualizar un Villano de Marvel
app.put("/api/villanos/marvel/:nombre", (req, res) => {
  const data = cargarDatos();
  const nombre = req.params.nombre;
  const index = data.base_de_datos.tablas.Marvel.datos.findIndex(
    (villano) => villano.Nombre.toLowerCase() === nombre.toLowerCase()
  );

  if (index === -1) {
    return res.status(404).json({ error: "Villano no encontrado" });
  }

  data.base_de_datos.tablas.Marvel.datos[index] = {
    ...data.base_de_datos.tablas.Marvel.datos[index],
    ...req.body,
  };

  fs.writeFileSync("villanos_db.json", JSON.stringify(data, null, 2));
  res.json({
    message: `Villano ${nombre} actualizado con éxito`,
    villano: data.base_de_datos.tablas.Marvel.datos[index],
  });
});

// Actualizar un Villano de DC
app.put("/api/villanos/dc/:nombre", (req, res) => {
  const data = cargarDatos();
  const nombre = req.params.nombre;
  const index = data.base_de_datos.tablas.DC.datos.findIndex(
    (villano) => villano.Nombre.toLowerCase() === nombre.toLowerCase()
  );

  if (index === -1) {
    return res.status(404).json({ error: "Villano no encontrado" });
  }

  data.base_de_datos.tablas.DC.datos[index] = {
    ...data.base_de_datos.tablas.DC.datos[index],
    ...req.body,
  };

  fs.writeFileSync("villanos_db.json", JSON.stringify(data, null, 2));
  res.json({
    message: `Villano ${nombre} actualizado con éxito`,
    villano: data.base_de_datos.tablas.DC.datos[index],
  });
});



  // Eliminar a un villano de Marvel por nombre
app.delete("/api/villanos/marvel/:nombre", (req, res) => {
  const data = cargarDatos();
  const nombre = req.params.nombre;
  const index = data.base_de_datos.tablas.Marvel.datos.findIndex(
    (villano) => villano.Nombre.toLowerCase() === nombre.toLowerCase()
  );

  if (index === -1) {
    return res.status(404).json({ error: "Villano no encontrado" });
  }

  data.base_de_datos.tablas.Marvel.datos.splice(index, 1);
  fs.writeFileSync("villanos_db.json", JSON.stringify(data, null, 2));
  res.json({ message: `Villano ${nombre} eliminado con éxito` });
});

// Eliminar a un villano de DC por nombre
app.delete("/api/villanos/dc/:nombre", (req, res) => {
  const data = cargarDatos();
  const nombre = req.params.nombre;
  const index = data.base_de_datos.tablas.DC.datos.findIndex(
    (villano) => villano.Nombre.toLowerCase() === nombre.toLowerCase()
  );

  if (index === -1) {
    return res.status(404).json({ error: "Villano no encontrado" });
  }

  data.base_de_datos.tablas.DC.datos.splice(index, 1);
  fs.writeFileSync("villanos_db.json", JSON.stringify(data, null, 2));
  res.json({ message: `Villano ${nombre} eliminado con éxito` });
});

app.listen(PORT, () => {
  console.log(` Servidor corriendo en http://localhost:${PORT}`);
});
