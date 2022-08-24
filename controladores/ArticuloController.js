const validator = require("validator");
const Articulo = require("../modelos/Articulo");
//libreria path me permite coger un archivo y enviarlo
const path = require("path")
const fs = require("fs");

const prueba = (req, res) => {
  return res.status(200).json({
    mensaje: "soy una accion de pruebas en mi controlador de articulos",
  });
};

const curso = (req, res) => {
  console.log("se ha ejecutado el endpoint probando");
  return res.status(200).send([
    {
      curso: "master en react",
      autor: "victor robles web",
      url: "victorweb.com",
    },
    {
      curso: "master en react",
      autor: "victor robles web",
      url: "victorweb.com",
    },
  ]);
};

const crear = (req, res) => {
  //recoger todos los datos a guardar para POST
  let parametros = req.body;

  //Validar datos
  try {
    let validar_titulo =
      !validator.isEmpty(parametros.titulo) &&
      validator.isLength(parametros.titulo, { min: 5, max: undefined });
    let validar_contenido = !validator.isEmpty(parametros.contenido);

    if (!validar_titulo || !validar_contenido) {
      throw new Error("No se ha validado la informacion ! ! !");
    }
  } catch (error) {
    return res.status(400).json({
      status: "error",
      mensaje: "Faltan datos por enviar",
    });
  }

  //Crear el objeto a guardar
  const articulo = new Articulo(parametros);

  //Asignar valores a objeto basado en el modelo (manual o automatico)

  //articulo.titulo = parametros.titulo

  //Guardar el articulo en la base de datos
  articulo.save((error, articuloGuardado) => {
    if (error || !articuloGuardado) {
      return res.status(400).json({
        status: "error",
        mensaje: "No se ha guardado el articulo",
      });
    }

    //devolver resultados

    return res.status(200).json({
      status: "success",
      articulo: articuloGuardado,
      mensaje: "Articulo creado con exito",
    });
  });
};

const listar = (req, res) => {
  let consulta = Articulo.find({});
  if (req.params.ultimos) {
    consulta.limit(3);
  }
  consulta.sort({ fecha: -1 }).exec((error, articulos) => {
    if (error || !articulos) {
      return res.status(404).json({
        status: "error",
        mensaje: "No se han encontrado articulos",
      });
    }
    return res.status(200).send({
      status: "success",
      parametro: req.params.ultimos,
      contador: articulos.length,
      articulos,
    });
  });
};

const uno = (req, res) => {
  // recoger id de la url
  let id = req.params.id;

  //Buscar el articulo
  Articulo.findById(id, (error, articulo) => {
    //si no exite devolver error
    if (error || !articulo) {
      return res.status(404).json({
        status: "error",
        mensaje: "No se ha encontrado el articulo",
      });
    }

    //devolver resultado

    return res.status(200).json({
      status: "success",
      articulo,
    });
  });
};

const borrar = (req, res) => {
  let id = req.params.id;
  Articulo.findOneAndDelete({ _id: id }, (error, articuloBorrado) => {
    if (error || !articuloBorrado) {
      return res.status(404).json({
        status: "error",
        mensaje: "Error al Borrar el articulo",
      });
    }
    return res.status(200).json({
      status: "success",
      articulo: articuloBorrado,
      mensaje: "Metodo de borrar",
    });
  });
};

const validarArticulo = (parametros) => {
  let validar_titulo =
    !validator.isEmpty(parametros.titulo) &&
    validator.isLength(parametros.titulo, { min: 5, max: undefined });
  let validar_contenido = !validator.isEmpty(parametros.contenido);

  if (!validar_titulo || !validar_contenido) {
    throw new Error("No se ha validado la informacion ! ! !");
  }
};

const editar = (req, res) => {
  //Recoger id articulo a editar
  let id = req.params.id;

  //Recoger datos del body
  let parametros = req.body;

  //Validar datos
  try {
    validarArticulo(parametros);

  } catch (error) {
    return res.status(400).json({
      status: "error",
      mensaje: "Faltan datos por enviar",
    });
  }

  // Buscar y actualizar articulo
  Articulo.findOneAndUpdate(
    { _id: id },
    req.body,
    { new: true },
    (error, articuloActualizado) => {
      if (error || !articuloActualizado) {
        return res.status(500).json({
          status: "",
          mensaje: "Error al actualizar",
        });
      }

      //devolver respuesta
      return res.status(200).json({
        status: "success",
        articulo: articuloActualizado,
      });
    }
  );
};

const subir = (req, res) => {
  //Configurar multer

  //Recoger el fichero de imagen subido
  if (!req.file && !req.files) {
    return res.status(404).json({
      status: "error",
      mensaje: "Peticion invalidad",
    });
  }

  //Nombre del archivo
  let archivo = req.file.originalname;

  //Extencion del archivo
  let archivo_split = archivo.split("\.");
  let extension = archivo_split[1];

  //Comprobar extencion correcta
  if (extension != "png" && extension != "jpg" &&
      extension != "jpeg" && extension != "gif") {
    //Borrar archivo y dar respuesta
    fs.unlink(req.file.path, (error) => {
      return res.status(200).json({
        status: "error",
        mensaje: "Imagen Invalidad",
      });
    });
  } else {
    //Si todo va bien, actualizar el articulo

  //Recoger id articulo a editar
  let id = req.params.id;

  // Buscar y actualizar articulo
  Articulo.findOneAndUpdate(
    { _id: id }, {imagen: req.file.filename}, { new: true }, (error, articuloActualizado) => {
      if (error || !articuloActualizado) {
        return res.status(500).json({
          status: "",
          mensaje: "Error al actualizar",
        });
      }

      //devolver respuesta
      return res.status(200).json({
        status: "success",
        articulo: articuloActualizado,
        fichero: req.file
      });
    }
  );
};
  }

  const imagen = (req, res) => {
    let fichero = req.params.fichero

    let ruta_fisica = "./imagenes/articulos/" + fichero

    fs.stat(ruta_fisica, (error, existe) => {
      if(existe) {
      return res.sendFile(path.resolve(ruta_fisica))
      } else {
        return res.status(404).json({
          status: "",
          mensaje: "La imagen no existe",
          existe,
          fichero,
          ruta_fisica
        });
      }
    
    })
  }


  const buscar = ( req, res) => {
    //Sacar string de busqueda
let busqueda = req.params.busqueda


    //Find OR
    Articulo.find({
      "$or": [
        {
          "titulo": { "$regex": busqueda, "$options": "i"},
          "contenido": { "$regex": busqueda, "$options": "i"}
        }
      ]
    }).sort({fecha: -1})
    .exec((error, articulosEncontrados) => {

if(error || !articulosEncontrados || articulosEncontrados.length <= 0) {
  return res.status(404).json({
    status: "error",
    mensaje: "No se han encontrado articulos"
  })
}
return res.status(200).json({
  status: "success",
  articulosEncontrados
})


    })



  }

module.exports = {
  prueba,
  curso,
  crear,
  listar,
  uno,
  borrar,
  editar,
  subir,
  imagen,
  buscar
};
