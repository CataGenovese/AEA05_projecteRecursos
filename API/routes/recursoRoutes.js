// routes/recursosRoutes.js
import express from 'express';
const router = express.Router();

// Importa les funcions per manejar les rutes de recursos
import { getAllRecursos, getRecursoById, addRecurso, updateRecurso, deleteRecurso } from '../controllers/recursosController';

// Ruta per obtenir tots els recursos
router.get('/', getAllRecursos);

// Ruta per obtenir un recurs per ID
router.get('/:id', getRecursoById);

// Ruta per afegir un nou recurs
router.post('/', addRecurso);

// Ruta per actualitzar un recurs
router.put('/:id', updateRecurso);

// Ruta per eliminar un recurs
router.delete('/:id', deleteRecurso);

export default router;
