const { conexion } = require("./basedatos/conexion");
const express = require("express");
const cors = require("cors")


//Inicializar app
console.log("App de node arrancada");

//Conectar a la base de datos
conexion();

//Crear Servidor Node
const app = express();
const puerto = 3900

//Configurar cors y usar el middleware del cors
app.use(cors());


//Convertir body a json
app.use(express.json())//recibir datos con content-type app-json
app.use(express.urlencoded({extended:true})) //form-urlencoded formato normal de formulario


//rutas como tal
const rutas_articulo = require("./rutas/ArticuloRuta")

//Cargo las rutas
app.use("/api", rutas_articulo)


//Rutas de prueba harcodeadas
/* app.get("/probando", (req, res) => {
  console.log("se ha ejecutado el endpoint probando")
  return res.status(200).send([
    {
    curso: "master en react",
    autor: "victor robles web",
    url: "victorweb.com"
  },
  {
    curso: "master en react",
    autor: "victor robles web",
    url: "victorweb.com"
  },
])
}) */

app.get("/", (req, res) => {

  return res.status(200).send(`
  <div>
    <h1>Probando ruta con node.js</h1>
    <p>Creando api rest con node</p>
  </div>
  `)
})


//Crear servidor y escuchar peticiones Http
app.listen(puerto, () => {
  console.log("Servidor corriendo en el puerto" +puerto)
})