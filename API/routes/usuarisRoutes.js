import express from "express";
import fs from "fs";

const router = express.Router();

// Función para leer y escribir el archivo de usuarios
const readData = () => JSON.parse(fs.readFileSync(".json/usuaris.json"));
const writeData = (data) => fs.writeFileSync(".json/usuaris.json", JSON.stringify(data, null, 2));

// GET página principal de usuarios
router.get("/", (req, res) => {
    const user = { name: "Cata" };
    const htmlMessage = ` <p>Consulta los usuarios</p>
                         <a href="http://localhost:3006/">Torna enrere</a>`;
    /*para volver a home
    const htmlMessage = ` <p>Consulta los usuarios</p>
                         <a href="/home">Torna enrere</a>`;*/
    const data = readData();
    res.render("usuaris/usuaris", { user, data, htmlMessage });
});

// GET usuario por ID
router.get("/:id", (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const userName={name:"Cata"};
    const usuari  = data.usuaris.find((u) => u.id === id);
    res.render("usuaris/usuariDetall", {usuari, userName});

});

// GET usuario por ID para modificar
router.get("/put/:id", (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const userName={name:"Cata"};
    const usuari  = data.usuaris.find((u) => u.id === id);
    res.render("usuaris/modificarUsuari", {usuari , userName});

});
// PUT actualizar usuario
router.put("/put/:id", (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const userIndex = data.usuaris.findIndex((u) => u.id === id);

    data.usuaris[userIndex] = {
         ...data.usuaris[userIndex],
          ...req.body 
        };

    writeData(data);
    res.json({ message: "Usuari actualitzat correctament" });
});

/*
// DELETE eliminar usuario
router.delete("/:id", (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const userIndex = data.usuaris.findIndex((u) => u.id === id);

    if (userIndex === -1) {
        return res.status(404).json({ message: "Usuari no trobat" });
    }

    data.usuaris.splice(userIndex, 1);
    writeData(data);
    res.json({ message: "Usuari eliminat correctament" });
});
// POST nuevo usuario
router.post("/", (req, res) => {
    const data = readData();
    const newUser = {
        id: data.usuaris.length > 0 ? data.usuaris[data.usuaris.length - 1].id + 1 : 1,
        ...req.body,
    };
    data.usuaris.push(newUser);
    writeData(data);
    res.json(newUser);
});
*/
export default router;
