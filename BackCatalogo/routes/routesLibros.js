const express = require('express')
const router = express.Router()
const Libro = require('../models/modelsLibros')

//Getting all
router.get('/', async (req, res) => {
    try {
        const libro = await Libro.find()
        res.json(libro)
    } catch (err){
        res.status(500).json({message: err.message})
    }
})

//getting one
router.get('/:id', getLibro,(req,res) => {
    res.json(res.libro)
    
})

//Creating one
router.post('/', async (req,res) => {
    const libro = new Libro({
        titulo: req.body.titulo,
        autor: req.body.autor,
        titulo_alternativo: req.body.titulo_alternativo,
        subtitulo: req.body.subtitulo,
        fechaPublicacion: req.body.fechaPublicacion,
        palabrasClave: req.body.palabrasClave,
        idioma: req.body.idioma,
        signaturaTopografica: req.body.signaturaTopografica
    })
    try {
        const newLibro = await libro.save()
        res.status(201).json(newLibro)
    } catch(err){
        res.status(400).json({ message: err.message})
    }
})

//Updating one
router.patch('/:id', getLibro, async (req, res) => {
    const fields = [
        'titulo', 'autor', 'titulo_alternativo', 'subtitulo',
        'fechaPublicacion', 'palabrasClave', 'idioma', 'signaturaTopografica'
    ];

    fields.forEach(field => {
        if (req.body[field] != null) {
            res.libro[field] = req.body[field];
        }
    });

    try {
        const updatedLibro = await res.libro.save();
        res.json(updatedLibro);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

//Deleting one
router.delete('/:id', getLibro, async (req, res) => {
    try {
        await res.libro.deleteOne();
        res.json({ message: 'Libro eliminado' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

async function getLibro(req, res, next) {
    let libro
try {
    libro = await Libro.findById(req.params.id)
    if(libro == null){
        return res.status(404).json({message: 'No se encontró el libro'})
    }
} catch (err){
    return res.status(500).json({message: err.message})
}

res.libro = libro
next()
}

module.exports = router