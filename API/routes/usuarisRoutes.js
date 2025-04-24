import express from "express";
import fs from "fs";

const router = express.Router();

// Función para leer y escribir el archivo de usuarios
const readData = () => JSON.parse(fs.readFileSync("./usuaris.json"));
const writeData = (data) => fs.writeFileSync("./usuaris.json", JSON.stringify(data, null, 2));

// GET página principal de usuarios
router.get("/", (req, res) => {
    const user = { name: "Cata" };
    const htmlMessage = `<p>Aquest és un text <strong>amb estil</strong> i un enllaç:</p>
                         <a href="https://www.example.com">Visita Example</a>`;
    const data = readData();
    res.render("usuaris", { user, data, htmlMessage });
});

// GET usuario por ID
router.get("/:id", (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const userName={name:"Cata"};
    const usuari  = data.usuaris.find((u) => u.id === id);
    res.render("usuariDetall", {usuari, userName});

});

// GET usuario por ID para modificar
router.get("/put/:id", (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const userName={name:"Cata"};
    const usuari  = data.usuaris.find((u) => u.id === id);
    res.render("modificarUsuari", {usuari , userName});

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
