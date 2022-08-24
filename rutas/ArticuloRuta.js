const express = require("express");
const multer = require("multer");
const ArticuloController = require("../controladores/ArticuloController");
const router = express.Router();

const almacenamiento = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./imagenes/articulos/");
  },
  filename: function (req, file, cb) {
    cb(null, "articulo" + Date.now() + file.originalname);
  },
});

//APLICAR SUBIDAS METODO SINGLE EN EL ROUTER
const subidas = multer({
  storage: almacenamiento,
});

//Rustas de prueba
router.get("/ruta-de-prueba", ArticuloController.prueba);
router.get("/curso", ArticuloController.curso);

//Ruta Util
router.post("/crear", ArticuloController.crear);
router.get("/articulos", ArticuloController.listar);
router.get("/articulos/:ultimos?", ArticuloController.listar);
router.get("/articulo/:id", ArticuloController.uno);
router.delete("/articulo/:id", ArticuloController.borrar);
router.put("/articulo/:id", ArticuloController.editar);
router.post("/subir-imagen/:id",subidas.single("file0"), ArticuloController.subir);
router.get("/imagen/:fichero", ArticuloController.imagen);
router.get("/buscar/:busqueda", ArticuloController.buscar);

module.exports = router;
