import express from "express";
import fs from "fs";

const router = express.Router();

// Función para leer el archivo JSON de recursos
const readDataRecursos = () => {
    return JSON.parse(fs.readFileSync("./recursos.json"));
};

// GET todos los recursos
router.get("/", (req, res) => {
    const data = readDataRecursos();
    const user = { name: "Cata" };
    const htmlMessage = `<p>Aquest és un text <strong>amb estil</strong> i un enllaç:</p>
                         <a href="https://www.example.com">Visita Example</a>`;
    res.render("recursos", { user, data, htmlMessage });
});

// GET recurso por ID
router.get("/:id", (req, res) => {
    const data = readDataRecursos();
    const id = parseInt(req.params.id);

    if (!data.recursos) {
        return res.status(500).json({ message: "Error en la carga de recursos" });
    }

    const recurso = data.recursos.find((r) => r.id === id);
    if (!recurso) {
        return res.status(404).json({ message: "Recurso no encontrado" });
    }
    
    res.json(recurso);
});

// POST nuevo recurso
router.post("/", (req, res) => {
    const data = readDataRecursos();
    const newRecurso = {
        id: data.recursos.length + 1,
        ...req.body,
    };

    data.recursos.push(newRecurso);
    fs.writeFileSync("./recursos.json", JSON.stringify(data, null, 2));
    res.json(newRecurso);
});

// PUT actualizar recurso
router.put("/:id", (req, res) => {
    const data = readDataRecursos();
    const id = parseInt(req.params.id);
    const recursoIndex = data.recursos.findIndex((r) => r.id === id);

    if (recursoIndex === -1) {
        return res.status(404).json({ message: "Recurso no encontrado" });
    }

    data.recursos[recursoIndex] = { ...data.recursos[recursoIndex], ...req.body };
    fs.writeFileSync("./recursos.json", JSON.stringify(data, null, 2));
    res.json({ message: "Recurso actualizado correctamente" });
});

// DELETE eliminar recurso
router.delete("/:id", (req, res) => {
    const data = readDataRecursos();
    const id = parseInt(req.params.id);
    const recursoIndex = data.recursos.findIndex((r) => r.id === id);

    if (recursoIndex === -1) {
        return res.status(404).json({ message: "Recurso no encontrado" });
    }

    data.recursos.splice(recursoIndex, 1);
    fs.writeFileSync("./recursos.json", JSON.stringify(data, null, 2));
    res.json({ message: "Recurso eliminado correctamente" });
});

export default router;
