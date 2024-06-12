import { funHttp } from "./Http"

export default {



   funDatosOrdenes(q="", mes = ""){
    return funHttp().get(`/graficas?q=${q}&mes=${mes}`);
   },

   funDatosCiudad(q="", mes = ""){
    return funHttp().get(`/graficaCiudad?q=${q}&mes=${mes}`);
   },

   
 
}