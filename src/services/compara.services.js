import { funHttp } from "./Http"

export default {

   funListar(q="") {

      return funHttp().get(`/equipo?q=${q}`);

   },
}