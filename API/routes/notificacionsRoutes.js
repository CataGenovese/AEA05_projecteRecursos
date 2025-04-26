import express from "express";
import fs from "fs";

const router = express.Router();

// Función para leer y escribir el archivo de notificacions
const readData = () => JSON.parse(fs.readFileSync(".json/notificacions.json"));
const writeData = (data) => fs.writeFileSync(".json/notificacions.json", JSON.stringify(data, null, 2));

// GET página principal de notificacions
router.get("/", (req, res) => {
    const data = readData();
    const user = { name: "Cata" };  
    const htmlMessage = ` <p>Consulta tus notificaciones</p>
    <a href="http://localhost:3006/">Torna enrere</a>`;  // Mensaje HTML de ejemplo
    res.render("notificacions/notificacions", { user, data, htmlMessage });
});


// GET notificación por ID
router.get("/:id", (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const user={name:"Cata"};
    const notificacio = data.notificacions.find((n) => n.id === id);
    res.render("notificacions/notificacioDetall", {notificacio, user});

});

router.get("/put/:id", (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const user={name:"Cata"};
    const notificacio = data.notificacions.find((n) => n.id === id);
    res.render("notificacions/modificarNotificacio", {notificacio, user});

});

// PUT actualizar una notificación
router.put("/put/:id", (req, res) => {
    const data = readData();
    const body= req.body;
    const id = parseInt(req.params.id);
    const notificacioIndex = data.notificacions.findIndex((n) => n.id === id);

    data.notificacions[notificacioIndex] = {
         ...data.notificacions[notificacioIndex],
          ...req.body };

    writeData(data);
    res.json({ message: "Notificació actualitzada correctament" });
});



/*POST nueva notificación
router.post("/", (req, res) => {
    const data = readData();
    const newNotificacio = {
        id: data.notificacions.length > 0 ? data.notificacions[data.notificacions.length - 1].id + 1 : 1,
        ...req.body,
    };
    data.notificacions.push(newNotificacio);
    writeData(data);
    res.json(newNotificacio);
});



// DELETE eliminar una notificación
router.delete("/:id", (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const notificacioIndex = data.notificacions.findIndex((n) => n.id === id);

    if (notificacioIndex === -1) {
        return res.status(404).json({ message: "Notificació no trobada" });
    }

    data.notificacions.splice(notificacioIndex, 1);
    writeData(data);
    res.json({ message: "Notificació eliminada correctament" });
});

export default router;

*/
export default router;

