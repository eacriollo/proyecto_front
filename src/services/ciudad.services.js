import { funHttp } from "./Http"

export default {

   funListar() {

      return funHttp().get("/ciudad");

   },

   funGuardar(datos) {

      return funHttp().post("/ciudad",datos);

   },
   funMostrar(id) {

      return funHttp().get("/ciudad/" + id);

   },

   funModificar(datos, id) {

      return funHttp().put("/ciudad/" + id, datos);

   },

   funliminar(id) {

      return funHttp().delete("/ciudad/" + id);

   }
}