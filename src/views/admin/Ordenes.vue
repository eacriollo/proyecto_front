<template>
    <div class="card">
        <h2>Ordenes</h2>
        <Toast />

        <Toolbar class="mb-4">
            <template v-slot:end>
                <Button label="Export" icon="pi pi-upload" class="p-button-help" @click="report()" />
            </template>
        </Toolbar>

        <DataTable ref="dt" :value="ordenes" :totalRecords="totalRecords" dataKey="id" lazy :loading='loading'
            @page="onPage($event)" :paginator="true" :rows="10"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            :rowsPerPageOptions="[5, 10, 25]"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} ordenes" responsiveLayout="scroll">
            <template #header>
                <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                    <h5 class="m-0">Gestion Ordenes</h5>
                    <span class="block mt-2 md:mt-0 p-input-icon-left">
                        <i class="pi pi-search" />
                        <InputText placeholder="Serie..." v-model="buscar" @keypress.enter="buscador()" />
                    </span>
                </div>
            </template>
            <Column field="id" header="ID" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                <template #body="slotProps">
                    <span class="p-column-title">ID</span>
                    {{ slotProps.data.id }}
                </template>
            </Column>

            <Column field="actividad_id" header="ACTIVIDAD" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                <template #body="slotProps">
                    <span class="p-column-title">TIPO</span>
                    {{ slotProps.data.actividad.tipo }}
                </template>
            </Column>

            <Column field="precio_id" header="PRECIO" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                <template #body="slotProps">
                    <span class="p-column-title">PRECIO</span>
                    {{ slotProps.data.precio.precio }}
                </template>
            </Column>
            <Column field="fecha" header="FECHA" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                <template #body="slotProps">
                    <span class="p-column-title">FECHA</span>
                    {{ slotProps.data.fecha }}
                </template>
            </Column>
            <Column field="abonado_id" header="CODIGO" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                <template #body="slotProps">
                    <span class="p-column-title">CODIGO</span>
                    {{ slotProps.data.abonado.codigo }}
                </template>
            </Column>

            <Column field="abonado_id" header="NOMBRE" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                <template #body="slotProps">
                    <span class="p-column-title">NOMBRE</span>
                    {{ slotProps.data.abonado.nombre }}
                </template>
            </Column>
            <Column field="abonado_id" header="PLAN" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                <template #body="slotProps">
                    <span class="p-column-title">PLAN</span>
                    {{ slotProps.data.abonado.plan }}
                </template>
            </Column>

            <Column field="ticket" header="TICKET" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                <template #body="slotProps">
                    <span class="p-column-title">TICKET</span>
                    {{ slotProps.data.ticket }}
                </template>
            </Column>

            <Column field="acta" header="ACTA" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                <template #body="slotProps">
                    <span class="p-column-title">ACTA</span>
                    {{ slotProps.data.acta }}
                </template>
            </Column>

            <Column header="GESTION" headerStyle="min-width:10rem;">
                <template #body="slotProps">
                    <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2"
                        @click="editar(slotProps.data)" />
                    <Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2"
                        @click="eliminar(slotProps.data.id)" />
                </template>
            </Column>
        </DataTable>

        <Dialog v-model:visible="productDialog" :style="{ width: '450px' }" header="ORDEN" :modal="true"
            class="p-fluid">
            <!--{{ product }}
            img :src="'demo/images/product/' + product.image" :alt="product.image" v-if="product.image" width="150"
                class="mt-0 mx-auto mb-5 block shadow-2" /
 -->

            <div class="field">
                <label for="dropdown">Tipo</label>
                <Dropdown id="dropdown" v-model="product.actividad_id" :options="actividad" optionLabel="tipo"
                    optionValue="id" required="true" :class="{ 'p-invalid': submitted && !product.actividad_id }" />
                <small class="p-invalid" v-if="submitted && !product.actividad_id">Valor requerido</small>
            </div>

            <div class="field">

                <label for="dropdown">Valor</label>
                <Dropdown id="dropdown" v-model="product.precio_id" :options="precios" optionLabel="precio"
                    optionValue="id" required="true" :class="{ 'p-invalid': submitted && !product.precio_id }" />
                <small class="p-invalid" v-if="submitted && !product.precio_id">Valor requerido</small>

            </div>

            <div class="field">

                <label for="calendar">Fecha</label>
                <Calendar id="calendar" v-model="product.fecha" showIcon inputId="product.fecha"
                    @input="onFechaSeleccionada" required="true"
                    :class="{ 'p-invalid': submitted && !product.fecha }" />
                <small class="p-invalid" v-if="submitted && !product.fecha">Fecha requerida</small>
            </div>

            <div class="field">
                <label for="ticket">TICKET</label>
                <InputText id="ticket" v-model.trim="product.ticket" required="true" autofocus
                    :class="{ 'p-invalid': submitted && !product.serie }" />
                <small class="p-invalid" v-if="submitted && !product.serie">serie requerida.</small>
            </div>

            <div class="field">
                <label for="acta">ACTA</label>
                <InputText id="acta" v-model.trim="product.acta" required="true" autofocus
                    :class="{ 'p-invalid': submitted && !product.acta }" />
                <small class="p-invalid" v-if="submitted && !product.acta">serie requerida.</small>
            </div>
           
            <template #footer>
                <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
                <Button label="Save" icon="pi pi-check" class="p-button-text" @click="actualizarOrden()" />
            </template>

        </Dialog>


        <Dialog v-model:visible="reportDialog" :style="{ width: '450px' }" header="ORDEN" :modal="true" class="p-fluid">
                        
            <div class="field">

                <label for="calendar">Fecha Inicial</label>
                <Calendar id="calendar" v-model="fechas.fechaInicial" showIcon inputId="product.fecha"
                    @input="onFechaSeleccionada" required="true"
                    :class="{ 'p-invalid': submitted && !fechas.fechaInicial }" />
                <small class="p-invalid" v-if="submitted && !fechas.fechaInicial">Fecha requerida</small>
            </div>

            <div class="field">

                <label for="calendar">Fecha Final</label>
                <Calendar id="calendar" v-model="fechas.fechaFinal" showIcon inputId="product.fecha"
                    @input="onFechaSeleccionada" required="true"
                    :class="{ 'p-invalid': submitted && !fechas.fechaFinal }" />
                <small class="p-invalid" v-if="submitted && !fechas.fechaFinal">Fecha requerida</small>
            </div>
            <template #footer>
                <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog2()" />
                <Button label="Save" icon="pi pi-check" class="p-button-text" @click="ordenesReporte()" />
            </template>

        </Dialog>

    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import ordenesReportes from "../../services/reportes.services.js";
import productoSevice from "../../services/producto.services.js";
import estadoSevice from "../../services/estado.services.js";
import abonadoSevice from "../../services/abonado.services.js";
import personaSevice from "../../services/persona.services.js";
import precioService from "../../services/precio.services.js";
import ordenService from "../../services/actas.services.js";
import actividadSevice from "../../services/actividad.services.js";
import Calendar from 'primevue/calendar';
import { useToast } from 'primevue/usetoast';
import { utils, writeFile } from 'xlsx';

const toast = useToast();

const ordenes = ref([]);
const dt = ref(null);
const totalRecords = ref(0)
const productDialog = ref(false);
const reportDialog = ref(false);
const product = ref({});
const fechas = ref({});
const submitted = ref(false);
const productos = ref()
const estado = ref()
const abonado = ref()
const buscar = ref([])
const persona = ref()
const precios = ref([])
const actividad = ref([])

const loading = ref(false);
const lazyParams = ref({ page: 0 });

onMounted(() => {
    listarOrdenes()
    getPrecios()
    getActividad()
})

const onPage = (event) => {
    lazyParams.value = event
    listarOrdenes()
}
async function listarOrdenes() {
    loading.value = true

    let page = lazyParams.value.page + 1;
    let limit = lazyParams.value.rows;
    const { data } = await ordenService.funListar(page, limit, buscar.value);
    loading.value = false
    ordenes.value = data.data
    totalRecords.value = data.total

}

const buscador = () => {
    listarOrdenes()
};

async function getActividad() {

    const datos = await actividadSevice.funListar();

    actividad.value = datos.data

}

async function getPrecios() {

    const datos = await precioService.funListar();

    precios.value = datos.data

}

async function ordenesReporte(){

    let finicial = formatoFecha(fechas.value.fechaInicial).slice(0, 10)
    console.log(finicial)
    let ffinal = formatoFecha(fechas.value.fechaFinal).slice(0, 10)
    const datos = await ordenesReportes.funReporteOrdenes(finicial, ffinal);
    console.log(datos)
    exportXls(datos)
    hideDialog2()
}

async function listarProducto() {
    const { data } = await productoSevice.funListar();
    productos.value = data
}

async function listarEstado() {
    const { data } = await estadoSevice.funListar();
    estado.value = data
}

async function listarAbonado() {
    const { data } = await abonadoSevice.funListar();
    abonado.value = data
}

async function listarPersona() {
    const { data } = await personaSevice.funListar();
    persona.value = data
}

async function actualizarOrden() {
    submitted.value = true;
    if (product.value.precio_id && product.value.fecha && product.value.ticket && product.value.acta) {
        product.value.fecha = formatoFecha(product.value.fecha)
        try {
            if (product.value.id) {

                //console.log('hola')
                await ordenService.funModificar(product.value, product.value.id)

                product.value = {
                    precio_id: '',
                    fecha: '',
                    ticket: '',
                    acta: ''

                }
                toast.add({ severity: 'success', summary: 'Equipo modificado', detail: 'Se ha modificado equipo', life: 10000 });

            }
            productDialog.value = false;
            listarOrdenes()
        } catch (error) {
            console.error('AxiosError:', error);
            alert(error)
        }
    }
}

function editar(act) {

    product.value = act;
    productDialog.value = ref(true);

}

function report() {
    reportDialog.value = ref(true);
}

const hideDialog = () => {
    productDialog.value = false;
    submitted.value = false;
};

const hideDialog2 = () => {
    reportDialog.value = false
    submitted.value = false;
};



async function eliminar(id) {
    if (confirm("Esta seguro de eliminar el quipo")) {
        await ordenService.funliminar(id);
        listarOrdenes()
        toast.add({ severity: 'success', summary: 'Equipo eliminado', detail: 'Se ha eliminado equipo', life: 3000 });
    }
}


const exportXls = (datos) => {

    const archivo = utils.json_to_sheet(datos.data);
    const libro = utils.book_new();
    utils.book_append_sheet(libro, archivo, 'reporteOrdenes')
    writeFile(libro, 'ordenes.xlsx')
}



function formatoFecha(fecha) {

    const fechaOriginal = fecha;
    console.log(fechaOriginal)

    if (fechaOriginal) {
        // Verifica si la fecha original no es una instancia de Date

        const dateObject = new Date(fechaOriginal);

        if (!isNaN(dateObject)) {
            // Si la creación del objeto Date fue exitosa, actualiza la propiedad datos._rawValue.fecha
            const fechaFormateada = dateObject.toISOString().slice(0, 19).replace("T", " ");
            const fechaNueva = fechaFormateada;
            return fechaNueva
           // console.log(product.value.fecha)
        } else {
            console.error("La fecha en datos._rawValue.fecha no es válida");
        }


    } else {
        console.error("La fecha en datos._rawValue.fecha es undefined");
    }

    
}







</script>