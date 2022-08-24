const mongoose = require("mongoose");

const conexion = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/mi_blog");

    //Parametros dentro de objeto //esto solamente si me da fallo
    //useNewUrlParser: true
    //useUnifiedTopology: true
    //useCreateIndex: true
    console.log("Conectado correctamente a la base de datos mi_blog");
  } catch (error) {
    throw new Error("no se a podido conectar a la base de datos");
  }
};

module.exports = {
  conexion,
};
