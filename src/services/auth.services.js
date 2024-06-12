import {funHttp} from "./Http"

export default {

    funLogin(credenciales) {
        return funHttp().post("/v1/auth/login", credenciales);
    },

   /* funRegistrar(datos) {
        return funHttp().post("/v1/auth/registrar",datos);
    },*/

    funPerfil() {
        return funHttp().get("/v1/auth/perfil");
    },

    funSalir() {
        return funHttp().post("/v1/auth/salir");
    }

}