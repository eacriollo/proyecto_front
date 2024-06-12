<template>
    <div class=card>
        <h2>Ingreso actas</h2>
      <!--
          {{ equipos }}
          {{ equipo }}
          {{ datos }}
        -->  
        <Toast />

        <div class="card">
            <div class="grid p-fluid">
                <div class="field col-12 md:col-2">
                    <Button label="NUEVO ABONADO" icon="pi pi-plus" class="p-button-success mr-2"
                        @click="openNewAbonado" />
                </div>
                <div class="field col-12 md:col-1">
                    <InputText v-model="buscarClie" placeholder="buscar..." @keypress.enter="buscarCliente"
                        required="true" :class="{ 'p-invalid': submitted && !buscarClie }" />
                    <small class="p-invalid" v-if="submitted && !buscarClie">Abonado requerido</small>

                </div>

                <div>
                    <div class="grid p-fluid" v-if="cliente_seleccionado && cliente_seleccionado.length > 0">
                        <div class="field col-12 md:col-2">

                            <h5>CODIGO: {{ cliente_seleccionado[0].codigo }}</h5>
                        </div>
                        <div class="field col-12 md:col-2">

                            <h4>PLAN: {{ cliente_seleccionado[0].plan }}</h4>
                        </div>
                        <div class="field col-12 md:col-5">

                            <h4>NOMBRE: {{ cliente_seleccionado[0].nombre }}</h4>
                        </div>

                    </div>
                </div>

            </div>

            <Dialog v-model:visible="abonadoDialog" :style="{ width: '450px' }" header="ABONADO" :modal="true"
                class="p-fluid">
                {{ abonadoNuevo }}
                <div class="field">
                    <label for="codigo">CODIGO</label>
                    <InputText id="codigo" v-model.trim="abonadoNuevo.codigo" required="true" autofocus
                        :class="{ 'p-invalid': submitted && !abonadoNuevo.codigo }" />
                    <small class="p-invalid" v-if="submitted && !abonadoNuevo.codigo">codigo requerido</small>
                </div>
                <div class="field">
                    <label for="plan">PLAN</label>
                    <InputText id="plan" v-model.trim="abonadoNuevo.plan" required="true" autofocus
                        :class="{ 'p-invalid': submitted && !abonadoNuevo.plan }" />
                    <small class="p-invalid" v-if="submitted && !abonadoNuevo.plan">plan requerido</small>
                </div>
                <div class="field">
                    <label for="nombre">NOMBRE</label>
                    <InputText id="nombre" v-model.trim="abonadoNuevo.nombre" required="true" autofocus
                        :class="{ 'p-invalid': submitted && !abonadoNuevo.nombre }" />
                    <small class="p-invalid" v-if="submitted && !abonadoNuevo.nombre">nombre requerido</small>
                </div>

                <template #footer>
                    <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
                    <Button label="Save" icon="pi pi-check" class="p-button-text" @click="guardarAbonado()" />
                </template>
            </Dialog>
        </div>

        <div class="card">
            <div class="grid p-fluid">
                <div class="field col-12 md:col-2">
                    <label for="dropdown">Tipo activadad</label>
                    <Dropdown id="dropdown" v-model="datos.actividad_id" :options="actividad" optionLabel="tipo"
                        optionValue="id" required="true" autofocus
                        :class="{ 'p-invalid': submitted && !datos.actividad_id }" />
                    <small class="p-invalid" v-if="submitted && !datos.actividad_id">Actividad requerida</small>
                </div>
                <div class="field col-12 md:col-2">
                    <label for="dropdown">Valor</label>
                    <Dropdown id="dropdown" v-model="datos.precio_id" :options="precios" optionLabel="precio"
                        optionValue="id" required="true" :class="{ 'p-invalid': submitted && !datos.precio_id }" />
                    <small class="p-invalid" v-if="submitted && !datos.precio_id">Valor requerido</small>
                </div>
                <div class="field col-12 md:col-2">
                    <label for="calendar">Fecha</label>
                    <Calendar id="calendar" v-model="datos.fecha" showIcon inputId="datos.fecha" @input="onFechaSeleccionada"
                        required="true" :class="{ 'p-invalid': submitted && !datos.fecha }" />
                    <small class="p-invalid" v-if="submitted && !datos.fecha">Fecha requerida</small>
                </div>
                <div class="field col-12 md:col-2">
                    <label for="acta"># ACTA</label>
                    <InputText id="acta" v-model="datos.acta" required="true"
                        :class="{ 'p-invalid': submitted && !datos.acta }" />
                    <small class="p-invalid" v-if="submitted && !datos.acta">Acta requerida</small>

                </div>

                <div class="field col-12 md:col-2">
                    <label for="manga">MANGA</label>
                    <InputText type="text" id="manga" v-model="datos.manga" required="true"
                        :class="{ 'p-invalid': submitted && !datos.manga }" />
                    <small class="p-invalid" v-if="submitted && !datos.manga">Manga requerida</small>

                </div>

                <div class="field col-12 md:col-2">
                    <label for="ticket">TICKET</label>
                    <InputText type="text" id="ticket" v-model="datos.ticket" required="true"
                        :class="{ 'p-invalid': submitted && !datos.ticket }" />
                    <small class="p-invalid" v-if="submitted && !datos.ticket">Ticket requerido</small>

                </div>

                <div class="field col-12 md:col-2">
                    <label for="inputtext">CIUDAD</label>
                    <Dropdown id="dropdown" v-model="datos.ciudad_id" :options="ciudades" optionLabel="nombre"
                        optionValue="id" required="true" :class="{ 'p-invalid': submitted && !datos.ciudad_id }" />
                    <small class="p-invalid" v-if="submitted && !datos.ciudad_id">Ciudad requerida</small>

                </div>

                <div class="field col-12 md:col-2">
                    <label for="inputtext">TECNICO</label>
                    <Dropdown id="dropdown" v-model="datos.persona_id" :options="persona" optionLabel="nombre"
                        optionValue="id" required="true" :class="{ 'p-invalid': submitted && !datos.persona_id }" />
                    <small class="p-invalid" v-if="submitted && !datos.persona_id">Tecnico requerido</small>
                </div>

                <div class="field col-12 md:col-2">
                    <h4> usuario: {{ perfil.name }}</h4>

                </div>
            </div>
        </div>


        <Dialog v-model:visible="productDialog" :style="{ width: '450px' }" header="EQUIPOS" :modal="true"
            class="p-fluid">



            <div class="field">
                <label for="serie">SERIE</label>
                <InputText id="serie" v-model.trim="equipo.serie" required="true" autofocus
                    :class="{ 'p-invalid': submitted && !equipo.serie }" />
                <small class="p-invalid" v-if="submitted && !equipo.serie">serie requerida.</small>
            </div>
            <div class="field">
                <label for="dropdown">Equipo</label>
                <Dropdown id="dropdown" v-model="equipo.producto_id" :options="productos" optionLabel="nombre"
                    optionValue="id" required="true" autofocus
                    :class="{ 'p-invalid': submitted && !equipo.producto_id }" />
                <small class="p-invalid" v-if="submitted && !equipo.producto_id">Actividad requerida</small>
            </div>
            <div class="field">
                <label for="dropdown">Estado Equipo</label>

                <Dropdown id="dropdown" v-model="equipo.estado_id" :options="estado" optionLabel="estado"
                    optionValue="id" required="true" :class="{ 'p-invalid': submitted && !equipo.estado_id }" />
                <small class="p-invalid" v-if="submitted && !equipo.estado_id">Actividad </small>
            </div>


            <template #footer>
                <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
                <Button label="Save" icon="pi pi-check" class="p-button-text" @click="actualizarEquipo()" />
            </template>
        </Dialog>



        <div class="grid p-fluid">
            <div class="field col-12 md:col-3">
                <Button label="NUEVO EQUIPO" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew" />
            </div>
            <div class="field col-12 md:col-3">

            </div>
            <div class="field col-12 md:col-3">

            </div>
            <div class="field col-12 md:col-3">
                <Button label="Guardar" icon="pi pi-save" class="mr-2 mb-2" @click="guardarOrden()" />
            </div>
        </div>



    </div>
</template>

<script setup>


import { ref, onMounted } from 'vue';
import ordenServices from "./../../services/actas.services.js";
import productoSevice from "../../services/producto.services.js";
import estadoSevice from "../../services/estado.services.js";
import actividadSevice from "./../../services/actividad.services.js";
import precioServicios from "../../services/precio.services.js";
import abonadoServices from "./../../services/abonado.services.js";
import ciudadSevice from "../../services/ciudad.services.js";
import personaSevice from "../../services/persona.services.js";
import authServices from "../../services/auth.services";
import Calendar from 'primevue/calendar';
import { useToast } from 'primevue/usetoast';
import { guardarEquipo } from "../../services/funciones/equipos.js";



const toast = useToast();

//variables

const datos = ref({

})

const actividad = ref([]);
const ciudades = ref([]);
const persona = ref([]);
const precios = ref([]);
const productDialog = ref(false);
const abonadoDialog = ref(false);
const product = ref({});
const abonadoNuevo = ref({});
const submitted = ref(false);
const buscarClie = ref("");
const cliente_seleccionado = ref({});
const perfil = ref({});
const equipos = ref([]);
const equipo = ref({ serie: '', producto_id: '', estado_id: '' })
const productos = ref()
const estado = ref()

onMounted(() => {

    funPerfil()
    getActividad()
    getPrecios()
    getCiudad()
    getPersona()
    listarProducto()
    listarEstado()

    console.log(equipos)
})

async function getActividad() {
    const datos = await actividadSevice.funListar();
    actividad.value = datos.data
}

async function getPrecios() {

    const datos = await precioServicios.funListar();

    precios.value = datos.data

}

async function getCiudad() {

    const datos = await ciudadSevice.funListar();

    ciudades.value = datos.data

}

async function getPersona() {

    const datos = await personaSevice.funListar();

    persona.value = datos.data

}

async function funPerfil() {
    const { data } = await authServices.funPerfil();
    perfil.value = data
}

async function listarProducto() {
    const { data } = await productoSevice.funListar();
    productos.value = data
}

async function listarEstado() {
    const { data } = await estadoSevice.funListar();
    estado.value = data
}


async function actualizarEquipo() {
    submitted.value = true;
    const data = {
        serie: equipo.value.serie,
        producto_id: equipo.value.producto_id,
        estado_id: equipo.value.estado_id,
        abonado_id: datos.value.abonado_id,
        persona_id: datos.value.persona_id
    }
   // console.log(datos)
  //  console.log(equipo)
   // console.log(data)

    let serie = equipo.value.serie
    if (data.serie) {
        try {
            await guardarEquipo(serie, data)
            equipo.value = {
                producto_id: '',
                serie: '',
                estado_id: '',
            }
            submitted.value = false;
            toast.add({ severity: 'success', summary: 'equipo registrado', detail: 'Se a registrado el equipo', life: 3000 });

        } catch (error) {
            console.error('AxiosError:', error);
            alert(error)
        }
    }
}

async function guardarAbonado() {
    submitted.value = true;
    if (abonadoNuevo.value.codigo && abonadoNuevo.value.plan && abonadoNuevo.value.nombre) {

        try {

            if (abonadoNuevo.value.id) {

                await abonadoServices.funModificar(abonadoNuevo.value, abonadoNuevo.value.id)


                abonadoNuevo.value = { codigo: '', plan: '', nombre: '' }
                toast.add({ severity: 'success', summary: 'Abonado modificado', detail: 'Se ha modificado abonado', life: 3000 });

            } else {

                await abonadoServices.funGuardar(abonadoNuevo.value)


                abonadoNuevo.value = { codigo: '', plan: '', nombre: '' }
                submitted.value = false;
                toast.add({ severity: 'success', summary: 'abonado guardado', detail: 'Se ha guardado abonado', life: 3000 });
            }

            abonadoDialog.value = false;
        } catch (error) {
            alert(error)
        }

    }


}

async function guardarOrden() {
    submitted.value = true;
    if (datos.value.actividad_id && datos.value.precio_id && datos.value.fecha && datos.value.acta && datos.value.ticket) {
        idUsuario()
        formatoFecha()

        try {
            await ordenServices.funGuardar(datos.value)

            datos.value = {
                fecha: '',
                acta: '',
                ticket: '',
                manga: '',
                pdf: '',
                observacion: '',
                abonado_id: '',
                user_id: '',
                persona_id: '',
                precio_id: '',
                actividad_id: '',
                ciudad_id: ''
            }
            cliente_seleccionado.value = { codigo: '', plan: '', nombre: '' }
            setTimeout(() => {
                window.location.reload();
            }, 3000);
            toast.add({ severity: 'success', summary: 'orden guardada', detail: 'Se a registrado la orden', life: 3000 });
        } catch (error) {
            console.error('AxiosError:', error);
            alert(error)
        }
    }

}


const openNew = () => {
    product.value = {};
    submitted.value = false;
    productDialog.value = true;
};

const openNewAbonado = () => {
    abonadoNuevo.value = {};
    submitted.value = false;
    abonadoDialog.value = true;
};


const hideDialog = () => {
    productDialog.value = false;
    submitted.value = false;
};

const buscarCliente = async () => {

    try {
        if (buscarClie.value !== '') {
            const { data } = await abonadoServices.buscar(buscarClie.value);

            if (data.data && data.data.length > 0) {
                cliente_seleccionado.value = data.data;
                datos._rawValue.abonado_id = data.data[0].id;
            } else {
                toast.add({ severity: 'info', summary: 'Información', detail: 'Cliente no resgistrado', life: 3000 });
                cliente_seleccionado.value = { codigo: '', plan: '', nombre: '' }
                datos.value = { abonado_id: '' }
            }
        } else {
            toast.add({ severity: 'error', summary: 'ERROR', detail: 'Ingresar Plan de cliente ', life: 3000 });
            cliente_seleccionado.value = { codigo: '', plan: '', nombre: '' }
            datos.value = { abonado_id: '' }
        }
    } catch (error) {
        console.error('Error al buscar el cliente:', error);
        // Manejar el error según sea necesario
    }


}

function idUsuario() {

    datos._rawValue.user_id = perfil._rawValue.id

}


function formatoFecha() {

    const fechaOriginal = datos._rawValue.fecha;
    console.log(fechaOriginal)
    if (fechaOriginal) {
        // Verifica si la fecha original no es una instancia de Date

        const dateObject = new Date(fechaOriginal);

        if (!isNaN(dateObject)) {
            // Si la creación del objeto Date fue exitosa, actualiza la propiedad datos._rawValue.fecha
            const fechaFormateada = dateObject.toISOString().slice(0, 19).replace("T", " ");
            datos._rawValue.fecha = fechaFormateada;
            console.log(datos._rawValue.fecha)
        } else {
            console.error("La fecha en datos._rawValue.fecha no es válida");
        }


    } else {
        console.error("La fecha en datos._rawValue.fecha es undefined");
    }

}


</script>