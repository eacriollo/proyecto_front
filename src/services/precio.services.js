import { funHttp } from "./Http"

export default {

   funListar() {

      return funHttp().get("/precio");

   },

   funGuardar(datos) {

      return funHttp().post("/precio",datos);

   },
   funMostrar(id) {

      return funHttp().get("/precio/" + id);

   },

   funModificar(datos, id) {

      return funHttp().put("/precio/" + id, datos);

   },

   funliminar(id) {

      return funHttp().delete("/precio/" + id);

   }
}