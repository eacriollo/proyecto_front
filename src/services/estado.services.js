import { funHttp } from "./Http"

export default {

   funListar() {

      return funHttp().get("/estado");

   },

   funGuardar(datos) {

      return funHttp().post("/estado",datos);

   },
   funMostrar(id) {

      return funHttp().get("/estado/" + id);

   },

   funModificar(datos, id) {

      return funHttp().put("/estado/" + id, datos);

   },

   funliminar(id) {

      return funHttp().delete("/estado/" + id);

   }
}