import express from "express";
import bodyParser from "body-parser";
import fs from "fs";

const app = express();
app.use(bodyParser.json());

app.use(express.static("public")); 
app.set("view engine", "ejs"); 
app.set("views", "./views"); 

// Funciones para leer y escribir en usuaris.json
const readData = () => JSON.parse(fs.readFileSync("./usuaris.json"));
const readDataRecursos = () => JSON.parse(fs.readFileSync("./recursos.json"));

const writeData = (data) =>
  fs.writeFileSync("./usuaris.json", JSON.stringify(data, null, 2));

// Página principal
app.get("/", (req, res) => {
  res.render("home");
});

// POST: Crear un nuevo usuario
app.post("/usuaris", (req, res) => {
  const data = readData();
  const newUser = {
    id: data.usuaris.length > 0 ? data.usuaris[data.usuaris.length - 1].id + 1 : 1,
    ...req.body,
  };
  data.usuaris.push(newUser);
  writeData(data);
  res.json(newUser);
});

// GET: Obtener todos los usuarios
app.get("/usuaris", (req, res) => {
  const user = { name: "Cata" };
  const htmlMessage = `
    <p>Aquest és un text <strong>amb estil</strong> i un enllaç:</p>
    <a href="https://www.example.com">Visita Example</a>`;
  const data = readData();
  res.render("usuaris", { user, data, htmlMessage });
});

// GET: Obtener un usuario por ID
app.get("/usuaris/:id", (req, res) => {
  const data = readData();
  const id = parseInt(req.params.id);
  const user = data.usuaris.find((user) => user.id === id);

  if (!user) {
    return res.status(404).json({ message: "Usuari no trobat" });
  }
  res.json(user);
});

// PUT: Actualizar un usuario por ID
app.put("/usuaris/:id", (req, res) => {
  const data = readData();
  const id = parseInt(req.params.id);
  const userIndex = data.usuaris.findIndex((user) => user.id === id);

  if (userIndex === -1) {
    return res.status(404).json({ message: "Usuari no trobat" });
  }

  data.usuaris[userIndex] = {
    ...data.usuaris[userIndex],
    ...req.body,
  };
  writeData(data);
  res.json({ message: "Usuari actualitzat correctament" });
});

// DELETE: Eliminar un usuario por ID
app.delete("/usuaris/:id", (req, res) => {
  const data = readData();
  const id = parseInt(req.params.id);
  const userIndex = data.usuaris.findIndex((user) => user.id === id);

  if (userIndex === -1) {
    return res.status(404).json({ message: "Usuari no trobat" });
  }

  data.usuaris.splice(userIndex, 1);
  writeData(data);
  res.json({ message: "Usuari eliminat correctament" });
});

app.get("/", (req, res) => {
    res.send("Welcome to my API");
});

// Obtener todos los recursos
app.get("/recursos", (req, res) => {
    const data = readDataRecursos(); // Usa readDataRecursos() para leer el archivo correcto
    const user = { name: "Cata" };
    const htmlMessage = `
        <p>Aquest és un text <strong>amb estil</strong> i un enllaç:</p>
        <a href="https://www.example.com">Visita Example</a>`;
    
    res.render("recursos", { user, data, htmlMessage });
});

// Obtener un recurso por ID
app.get("/recursos/:id", (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const recurso = data.recursos.find((recurso) => recurso.id === id);
    
    if (recurso) {
        res.json(recurso);
    } else {
        res.status(404).json({ message: "Recurso no encontrado" });
    }
});

// Agregar un nuevo recurso
app.post("/recursos", (req, res) => {
    const data = readData();
    const body = req.body;

    const newRecurso = {
        id: data.recursos.length + 1,
        ...body,
    };

    data.recursos.push(newRecurso);
    writeData(data);
    res.json(newRecurso);
});

// Modificar un recurso
app.put("/recursos/:id", (req, res) => {
    const data = readData();
    const body = req.body;
    const id = parseInt(req.params.id);
    const recursoIndex = data.recursos.findIndex((recurso) => recurso.id === id);

    if (recursoIndex !== -1) {
        data.recursos[recursoIndex] = { ...data.recursos[recursoIndex], ...body };
        writeData(data);
        res.json({ message: "Recurso actualizado correctamente" });
    } else {
        res.status(404).json({ message: "Recurso no encontrado" });
    }
});

// Eliminar un recurso
app.delete("/recursos/:id", (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const recursoIndex = data.recursos.findIndex((recurso) => recurso.id === id);

    if (recursoIndex !== -1) {
        data.recursos.splice(recursoIndex, 1);
        writeData(data);
        res.json({ message: "Recurso eliminado correctamente" });
    } else {
        res.status(404).json({ message: "Recurso no encontrado" });
    }
});


// Iniciar servidor
app.listen(3006, () => {
  console.log("Servidor està escoltant al port 3006...");
});
