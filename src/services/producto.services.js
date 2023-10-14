import { funHttp } from "./Http"

export default {

   funListar() {

      return funHttp().get("/producto");

   },

   funGuardar(datos) {

      return funHttp().post("/producto",datos);

   },
   funMostrar(id) {

      return funHttp().get("/producto/" + id);

   },

   funModificar(datos, id) {

      return funHttp().put("/producto/" + id, datos);

   },

   funliminar(id) {

      return funHttp().delete("/producto/" + id);

   }
}