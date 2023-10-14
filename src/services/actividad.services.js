import { funHttp } from "./Http"

export default {

   funListar() {

      return funHttp().get("/actividad");

   },

   funGuardar(datos) {

      return funHttp().post("/actividad",datos);

   },
   funMostrar(id) {

      return funHttp().get("/actividad/" + id);

   },

   funModificar(datos, id) {

      return funHttp().put("/actividad/" + id, datos);

   },

   funliminar(id) {

      return funHttp().delete("/actividad/" + id);

   }
}