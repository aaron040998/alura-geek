const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static('public')); // Carpeta para HTML, CSS y JS

// Leer datos del archivo JSON
function readData() {
  const data = fs.readFileSync('data.json');
  return JSON.parse(data);
}

// Guardar datos en el archivo JSON
function writeData(data) {
  fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
}

// Obtener todos los ítems
app.get('/api/items', (req, res) => {
  const data = readData();
  res.json(data.items);
});

// Agregar un nuevo ítem
app.post('/api/items', (req, res) => {
  const data = readData();
  const newItem = {
    id: Date.now(),
    nombre: req.body.nombre,
    precio: req.body.precio,
    urlImagen: req.body.urlImagen,
  };
  data.items.push(newItem);
  writeData(data);
  res.status(201).json(newItem);
});

// Editar un ítem existente
app.put('/api/items/:id', (req, res) => {
  const data = readData();
  const itemId = parseInt(req.params.id);
  const itemIndex = data.items.findIndex((item) => item.id === itemId);

  if (itemIndex === -1) {
    return res.status(404).send('Ítem no encontrado');
  }

  data.items[itemIndex] = {
    ...data.items[itemIndex],
    nombre: req.body.nombre,
    precio: req.body.precio,
    urlImagen: req.body.urlImagen,
  };
  writeData(data);
  res.json(data.items[itemIndex]);
});

// Eliminar un ítem
app.delete('/api/items/:id', (req, res) => {
  const data = readData();
  const itemId = parseInt(req.params.id);
  const newItems = data.items.filter((item) => item.id !== itemId);

  if (newItems.length === data.items.length) {
    return res.status(404).send('Ítem no encontrado');
  }

  data.items = newItems;
  writeData(data);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
