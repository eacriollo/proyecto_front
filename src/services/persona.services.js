import { funHttp } from "./Http"

export default {

   funListar() {
      return funHttp().get("/persona");
   },

   funGuardar(datos) {
      return funHttp().post("/persona",datos);
   },
   funMostrar(id) {
      return funHttp().get("/persona/" + id);
   },

   funModificar(datos, id) {
      return funHttp().put("/persona/" + id, datos);
   },

   funliminar(id) {
      return funHttp().delete("/persona/" + id);
   }
}