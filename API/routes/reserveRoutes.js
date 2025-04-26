import express from "express";
import fs from "fs";

const router = express.Router();

// Función para leer el archivo JSON de reservas
const readDataReserves = () => {
    return JSON.parse(fs.readFileSync("./reserves.json"));
};

const writeData= () => {
fs.writeFileSync("./reserves.json", JSON.stringify(data, null, 2));
};

// GET todas las reservas
router.get("/", (req, res) => {
    const data = readDataReserves();
    const user = { name: "Cata" };
    const htmlMessage = ` <p>Consulta tus reservas</p>
                         <a href="http://localhost:3006/">Torna enrere</a>`
                        ;
    res.render("reserves/reserves", { user, data, htmlMessage });
});

// GET reserva por ID
router.get("/:id", (req, res) => {
    const data = readDataReserves();
    const id = parseInt(req.params.id);
    const reserva = data.reserves.find((r) => r.id === id);  
    res.render("reserves/reservaDetall", {reserva});
});

// GET reserva por ID
router.get("/put/:id", (req, res) => {
    const data = readDataReserves();
    const id = parseInt(req.params.id);
    const reserva = data.reserves.find((r) => r.id === id);  
    res.render("reserves/modificarReserves", {reserva});
});

// PUT actualizar reserva
router.put("/put/:id", (req, res) => {
    const data = readDataReserves();
    const body= req.body;
    const id = parseInt(req.params.id);
    const reservaIndex = data.reserves.findIndex((r) => r.id === id);


    data.reserves[reservaIndex] = {
         ...data.reserves[reservaIndex],
          ...req.body };

    writeData(data)
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
