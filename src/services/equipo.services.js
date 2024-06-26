import { funHttp } from "./Http"

export default {
   funListar(page=1, limit=10, q="") {
      return funHttp().get(`/equipo?page=${page}&limit=${limit}&q=${q}`);
   },
   funGuardar(datos) {
      return funHttp().post("/equipo",datos);
   },
   funMostrar(id) {
      return funHttp().get("/equipo/" + id);
   },
   funModificar(datos, id) {
      return funHttp().put("/equipo/" + id, datos);
   },
   funliminar(id) {
      return funHttp().delete("/equipo/" + id);
   }
}