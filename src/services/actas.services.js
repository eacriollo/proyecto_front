import { funHttp } from "./Http"

export default {

   funListar(page=1, limit=10, q="") {

      return funHttp().get(`/orden?page=${page}&limit=${limit}&q=${q}`);

   },

   funGuardar(datos) {

      return funHttp().post("/orden",datos);

   },
   funMostrar(id) {

      return funHttp().get("/orden/" + id);

   },

   funModificar(datos, id) {

      return funHttp().put("/orden/" + id, datos);

   },

   funliminar(id) {

      return funHttp().delete("/orden/" + id);

   }
 
}