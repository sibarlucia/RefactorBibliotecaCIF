const fs = require('fs'); // require the 'fs' module to read and write files

// read the JSON file into a string
const jsonString = fs.readFileSync('corregido.json', 'utf-8');

const data = JSON.parse(jsonString)



let libros = data.map(libro => {
    return {
        "titulo" : libro.TITULO,
        "titulo_alternativo" : libro.TITULO_ALT,
        "subtitulo" : libro.SUBTITULO,
        "autor" : libro.AUTOR,
        "autores" : libro.AUTORES,
        "fecha_publicacion" : libro.FECHA_PUBLICACION,
        "palabras_clave" : libro.PALABRAS_CLAVE,
        "idioma" : libro.IDIOMA,
        "descripcion_fisica" : libro.DESCRIPCION_FISICA,
        "signatura_topografica" : libro.SIGNATURA_TOPOGRAFICA
    }
});

console.log(libros);

const filtradoJSON = JSON.stringify(libros)
fs.writeFileSync('filtradofinal.json', filtradoJSON, 'utf-8');