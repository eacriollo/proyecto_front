<template>
    <div class="card">
        <Toast />
        <h2>GESTION PRODUCTOS</h2>

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
            <div class="card">
                <div class="grid p-fluid">

                    <div class="field col-12 md:col-2">

                        <label for="dropdown">Equipo</label>
                        <Dropdown id="dropdown" v-model="datos.producto_id" :options="productos" optionLabel="nombre"
                            optionValue="id" required="true"
                            :class="{ 'p-invalid': submitted && !datos.producto_id }" />
                        <small class="p-invalid" v-if="submitted && !equipo.producto_id">Actividad requerida</small>
                    </div>
                    <div class="field col-12 md:col-2">
                        <label for="serie">SERIE</label>
                        <InputText id="serie" v-model="datos.serie" required="true"
                            :class="{ 'p-invalid': submitted && !datos.serie }" />
                        <small class="p-invalid" v-if="submitted && !datos.serie">serie requerida</small>
                    </div>

                    <div class="field col-12 md:col-2">
                        <label for="dropdown">Estado Equipo</label>

                        <Dropdown id="dropdown" v-model="datos.estado_id" :options="estado" optionLabel="estado"
                            optionValue="id" required="true" :class="{ 'p-invalid': submitted && !datos.estado_id }" />
                        <small class="p-invalid" v-if="submitted && !estado.estado_id">Actividad </small>
                    </div>

                    <div class="field col-12 md:col-2">
                        <label for="inputtext">TECNICO</label>
                        <Dropdown id="dropdown" v-model="datos.persona_id" :options="persona" optionLabel="nombre"
                            optionValue="id" required="true" :class="{ 'p-invalid': submitted && !datos.persona_id }" />
                        <small class="p-invalid" v-if="submitted && !datos.persona_id">Tecnico requerido</small>
                    </div>
                </div>
            </div>

            <Dialog v-model:visible="abonadoDialog" :style="{ width: '450px' }" header="ABONADO" :modal="true"
                class="p-fluid">
                {{ abonadoNuevo }}
                <!--img :src="'demo/images/product/' + product.image" :alt="product.image" v-if="product.image" width="150"
                class="mt-0 mx-auto mb-5 block shadow-2" /-->
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
                <!--div class="field">
                <label for="description">Description</label>
                <Textarea id="description" v-model="product.description" required="true" rows="3" cols="20" />
            </div-->


                <template #footer>
                    <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
                    <Button label="Save" icon="pi pi-check" class="p-button-text" @click="guardarAbonado()" />
                </template>
            </Dialog>


            <!--
            

            

            <div class="field col-12 md:col-2">
                <label for="inputtext">TECNICO</label>
                <Dropdown id="dropdown" v-model="datos.persona_id" :options="persona" optionLabel="nombre"
                    optionValue="id" required="true" :class="{ 'p-invalid': submitted && !datos.persona_id }" />
                <small class="p-invalid" v-if="submitted && !datos.persona_id">Tecnico requerido</small>
            </div>
             -->
        </div>

        <div class="grid p-fluid">
            <div class="field col-12 md:col-9">

            </div>
            <div class="field col-12 md:col-2">
                <Button label="Guardar" icon="pi pi-save" class="mr-2 mb-2" @click="actualizarEquipo()" />
            </div>
            <div class="field col-12 md:col-1">

            </div>
        </div>
    </div>


</template>

<script setup>
import { ref, onMounted } from "vue";
import productoSevice from "../../services/producto.services.js"
import estadoSevice from "../../services/estado.services.js";
import abonadoServices from "./../../services/abonado.services.js";
import personaSevice from "../../services/persona.services.js";
import { guardarEquipo } from "../../services/funciones/equipos.js";
import { useToast } from "primevue/usetoast";

//constantes

const datos = ref({

})

const toast = useToast();
const abonadoDialog = ref(false);
const buscarClie = ref("");
const abonadoNuevo = ref({});
const cliente_seleccionado = ref({});
const submitted = ref(false);
const productos = ref()
const equipo = ref({})
const estado = ref()
const persona = ref([]);


onMounted(() => {

    listarProducto()
    listarEstado()
    getPersona()
})

async function listarProducto() {
    const { data } = await productoSevice.funListar();
    productos.value = data
}


async function listarEstado() {
    const { data } = await estadoSevice.funListar();
    estado.value = data
}

async function getPersona() {

    const datos = await personaSevice.funListar();

    persona.value = datos.data

}

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

async function actualizarEquipo() {
    submitted.value = true;
    let serie = datos._rawValue.serie
    let data = datos.value
    if (datos.value.producto_id && datos.value.serie && datos.value.estado_id && datos.value.persona_id) {
        try {
            await guardarEquipo(serie, data)
            datos.value = {
                abonado_id: '',
                producto_id: '',
                serie: '',
                estado_id: '',
                persona_id: ''
            }
            setTimeout(() => {
                window.location.reload();
            }, 3000);
            submitted.value = false;
            toast.add({ severity: 'success', summary: 'orden guardada', detail: 'Se a registrado la orden', life: 10000 });

        } catch (error) {
            console.error('AxiosError:', error);
            alert(error)
        }
    }

}

const openNewAbonado = () => {
    abonadoNuevo.value = {};
    submitted.value = false;
    abonadoDialog.value = true;
};
const hideDialog = () => {
    productDialog.value = false;
    submitted.value = false;
};

</script>