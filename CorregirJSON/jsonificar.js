const fs = require('fs'); // require the 'fs' module to read and write files

// read the JSON file into a string
const jsonString = fs.readFileSync('export.json', 'utf-8');

// use a regular expression to replace specific strings
let modifiedJsonString = jsonString.replace(/"NRO. ACCESO"/g, '"NUMERO_ACCESO"');
modifiedJsonString = modifiedJsonString.replace(/"TITULO \(S\)"/g, '"SUBTITULO"')
modifiedJsonString = modifiedJsonString.replace(/"TITULO \(\M\)"/g, '"TITULO_ALT"')
modifiedJsonString = modifiedJsonString.replace(/"TITULO \(\A\)"/g, '"TITULO"')

modifiedJsonString = modifiedJsonString.replace(/"TIPO DE DOCUMENTO"/g, '"TIPO_DOCUMENTO"')
modifiedJsonString = modifiedJsonString.replace(/"AUTOR PERSONAL \(S\)"/g, '"AUTOR"')
modifiedJsonString = modifiedJsonString.replace(/"AUTOR PERSONAL \(\M\)"/g, '"AUTORES"')
modifiedJsonString = modifiedJsonString.replace(/"FECHA DE PUBLICACION"/g, '"FECHA_PUBLICACION"')
modifiedJsonString = modifiedJsonString.replace(/"PALABRAS CLAVE"/g, '"PALABRAS_CLAVE"')
modifiedJsonString = modifiedJsonString.replace(/"IDIOMA DEL DOCUMENTO"/g, '"IDIOMA"')
modifiedJsonString = modifiedJsonString.replace(/"DESCRIPCION FISICA"/g, '"DESCRIPCION_FISICA"')
modifiedJsonString = modifiedJsonString.replace(/"PALABRAS CLAVE"/g, '"PALABRAS_CLAVE"')
modifiedJsonString = modifiedJsonString.replace(/"SIGNATURA TOPOGRAFICA"/g, '"SIGNATURA_TOPOGRAFICA"')





 


console.log(modifiedJsonString);

// write the modified JSON string back to the file
fs.writeFileSync('corregido.json', modifiedJsonString, 'utf-8');

