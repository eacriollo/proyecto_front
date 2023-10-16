import { funHttp } from "./Http"

export default {

   funListar(page=1, limit=10, q="") {

      return funHttp().get(`/abonado?page=${page}&limit=${limit}&q=${q}`);

   },

   funGuardar(datos) {

      return funHttp().post("/abonado",datos);

   },
   funMostrar(id) {

      return funHttp().get("/abonado/" + id);

   },

   funModificar(datos, id) {

      return funHttp().put("/abonado/" + id, datos);

   },

   funliminar(id) {

      return funHttp().delete("/abonado/" + id);

   }
}