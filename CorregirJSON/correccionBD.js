const { log } = require('console');
const fs = require('fs');
const jsonString = fs.readFileSync('filtradofinal.json', 'utf-8');

const data = JSON.parse(jsonString)

let libros = []
let cuentatitulos = 0


data.map((libro) => {
    let libroObject = {
        id : libro._id,
       

      }

typeof libro.autores === "object" ? libroObject.autor = libro.autores.a + " " + libro.autores.b : null

typeof libro.titulo === "object" ? libroObject.titulo = libro.titulo.t : null

typeof libro.titulo_alternativo === "object" ? libroObject.tituloAlt = libro.titulo_alternativo.t : null

typeof libro.subtitulo === "object" ? libroObject.subtitulo = libro.subtitulo.t : null

typeof libro.idioma === "string" ? libroObject.idioma = libro.idioma : null

libro.signatura_topografica !== undefined ? libroObject.signaturaTopografica = libro.signatura_topografica : null

libro.fecha_publicacion !== undefined ? libroObject.fechaPublicacion = libro.fecha_publicacion : null

libro.palabras_clave !== undefined ? libroObject.palabrasClave = libro.palabras_clave : null


libros.push(libroObject)
})
// console.log(libros.length);
// console.log(libros);

let librosBD = JSON.stringify(libros)

const cleanedJSON = librosBD.replace(/undefined"/g, 'null');



let librosCorrected = []
const corregir = () => {
  

  libros.map((libro) => {
    if (libro.autor !== undefined) {
      if (libro.autor.includes("undefined")) {
        // console.log(libro);
        const originalString = libro.autor
        
        const trimmedString = originalString.replace("undefined", "")
        
        libro.autor = trimmedString
        
        
        librosCorrected.push(libro)
  
        
      }
    } 

    librosCorrected.includes(libro) ? null : librosCorrected.push(libro)
  
  })
  console.log(librosCorrected);
  console.log(librosCorrected.length);

  const librosCorrectedJSON = JSON.stringify(librosCorrected)
  fs.writeFileSync('librosBD.json', librosCorrectedJSON, 'utf-8');
}

// corregir()



const BD = fs.readFileSync('librosBD.json', 'utf-8');
const BDparsed = JSON.parse(BD)

const eliminarSimbolos = () => {
  let corregir = []
  
  BDparsed.map((libro) => {
    
    const keys = Object.keys(libro)

    keys.forEach((key) =>{

      const value = libro[key]

      if ( String(value).includes('�')) {

        let palabras = []

        const trimeado = value.split(" ")

        palabras.push(trimeado)

        trimeado.map((indice) => {

          
          if (indice.includes('�')) {

            corregir.includes(indice) ? null : corregir.push(indice)
            

          }
        })
      }
    })
    
  })
  corregir.sort()
  console.log(corregir);         
  const corregirPalabrasJSON = JSON.stringify(corregir)
  fs.writeFileSync('corregirPalabras.json', corregirPalabrasJSON, 'utf-8');   
}

eliminarSimbolos()



