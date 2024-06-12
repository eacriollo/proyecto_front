import equipoServices from "../equipo.services.js";
import comparaServices from "../compara.services.js";
export { guardarEquipo, comparaEquipo };

async function guardarEquipo(serie, data) {
  let id = await comparaEquipo(serie);
  try {
    if (id) {
      await equipoServices.funModificar(data, id);
    } else {
      await equipoServices.funGuardar(data);
    }
  } catch (error) {
    console.error("AxiosError:", error);
    alert(error);
  }
}

async function comparaEquipo(serie) {

  const { data } = await comparaServices.funListar(serie);
  let compa = data.data;
  let result = null;

  for (let item of compa) {
    if (item.serie == serie) {
      result = item.id;
      break;
    }
  }
  return result;
}
