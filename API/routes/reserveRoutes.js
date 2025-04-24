import express from "express";
import fs from "fs";

const router = express.Router();

// Función para leer el archivo JSON de reservas
const readDataReserves = () => {
    return JSON.parse(fs.readFileSync("./reserves.json"));
};

// GET todas las reservas
router.get("/", (req, res) => {
    const data = readDataReserves();
    const user = { name: "Cata" };
    const htmlMessage = `<p>Aquest és un text <strong>amb estil</strong> i un enllaç:</p>
                         <a href="https://www.example.com">Visita Example</a>`;
    res.render("reserves", { user, data, htmlMessage });
});

// GET reserva por ID
router.get("/:id", (req, res) => {
    const data = readDataReserves();
    const id = parseInt(req.params.id);

    if (!data.reserves) {
        return res.status(500).json({ message: "Error en la carga de reservas" });
    }

    const reserva = data.reserves.find((r) => r.idReserva === id);
    if (!reserva) {
        return res.status(404).json({ message: "Reserva no encontrada" });
    }
    
    res.json(reserva);
});


// PUT actualizar reserva
router.put("/:id", (req, res) => {
    const data = readDataReserves();
    const id = parseInt(req.params.id);
    const reservaIndex = data.reserves.findIndex((r) => r.idReserva === id);

    if (reservaIndex === -1) {
        return res.status(404).json({ message: "Reserva no encontrada" });
    }

    data.reserves[reservaIndex] = { ...data.reserves[reservaIndex], ...req.body };
    fs.writeFileSync("./reserves.json", JSON.stringify(data, null, 2));
    res.json({ message: "Reserva actualizada correctamente" });
});
/*
// DELETE eliminar reserva
router.delete("/:id", (req, res) => {
    const data = readDataReserves();
    const id = parseInt(req.params.id);
    const reservaIndex = data.reserves.findIndex((r) => r.idReserva === id);

    if (reservaIndex === -1) {
        return res.status(404).json({ message: "Reserva no encontrada" });
    }

    data.reserves.splice(reservaIndex, 1);
    fs.writeFileSync("./reserves.json", JSON.stringify(data, null, 2));
    res.json({ message: "Reserva eliminada correctamente" });
});
// POST nueva reserva
router.post("/", (req, res) => {
    const data = readDataReserves();
    const newReserva = {
        idReserva: data.reserves.length + 1,
        ...req.body,
    };

    data.reserves.push(newReserva);
    fs.writeFileSync("./reserves.json", JSON.stringify(data, null, 2));
    res.json(newReserva);
});
*/

export default router;
