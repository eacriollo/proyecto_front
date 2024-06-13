import { funHttp } from "./Http";

export default {
  funDatosOrdenes(q = "", mes = "") {
    return funHttp().get(`/graficas?q=${q}&mes=${mes}`);
  },

  funDatosCiudad(q = "", mes = "") {
    return funHttp().get(`/graficaCiudad?q=${q}&mes=${mes}`);
  },

  funDatosTecnicos(q = "", mes = "", persona = "") {
    return funHttp().get(
      `/graficaTecnico?q=${q}&mes=${mes}&persona=${persona}`
    );
  },

  funReporteOrdenes(q = "", ffin = "") {
    return funHttp().get(
      `/reporteOrdenes?q=${q}&ffin=${ffin}`
    );
  },

  funReporteEquipos(q = "", ffin = "") {
   return funHttp().get(
     `/reporteEquipos?q=${q}&ffin=${ffin}`
   );
 },
};
