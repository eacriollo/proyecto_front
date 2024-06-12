<template>
    <div class="card">
        <h2>Equipos</h2>
        <Toast />

        <Toolbar class="mb-4">
            <template v-slot:end>
                <Button label="Export" icon="pi pi-upload" class="p-button-help" @click="exportXls($event)" />
            </template>
        </Toolbar>

        <DataTable ref="dt" :value="equipos" :totalRecords="totalRecords" dataKey="id" lazy :loading='loading'
            @page="onPage($event)" :paginator="true" :rows="10"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            :rowsPerPageOptions="[5, 10, 25]"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} equipos" responsiveLayout="scroll">
            <template #header>
                <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                    <h5 class="m-0">Gestion Equipos</h5>
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
            <Column field="serie" header="SERIE" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                <template #body="slotProps">
                    <span class="p-column-title">SERIE</span>
                    {{ slotProps.data.serie }}
                </template>
            </Column>
            <Column field="producto_id" header="NOMBRE" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                <template #body="slotProps">
                    <span class="p-column-title">NOMBRE</span>
                    {{ slotProps.data.producto.nombre }}
                </template>
            </Column>
            <Column field="estado_id" header="ESTADO" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                <template #body="slotProps">
                    <span class="p-column-title">ESTADO</span>
                    {{ slotProps.data.estado.estado }}
                </template>
            </Column>
            <Column field="abonado_id" header="PLAN" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                <template #body="slotProps">
                    <span class="p-column-title">PLAN</span>
                    {{ slotProps.data.abonado.plan }}
                </template>
            </Column>

            <Column field="abonado_id" header="CODIGO" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                <template #body="slotProps">
                    <span class="p-column-title">CODIGO</span>
                    {{ slotProps.data.abonado.codigo }}
                </template>
            </Column>
            <Column field="persona_id" header="TECNICO" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                <template #body="slotProps">
                    <span class="p-column-title">TECNICO</span>
                    {{ slotProps.data.persona.nombre }}
                </template>
            </Column>

            <Column field="updated_at" header="FECHA" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                <template #body="slotProps">
                    <span class="p-column-title">FECHA</span>
                    {{ slotProps.data.updated_at }}
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

        <Dialog v-model:visible="productDialog" :style="{ width: '450px' }" header="EQUIPO" :modal="true"
            class="p-fluid">
            <!--{{ product }}
            img :src="'demo/images/product/' + product.image" :alt="product.image" v-if="product.image" width="150"
                class="mt-0 mx-auto mb-5 block shadow-2" /-->
            <div class="field">

                <label for="serie">SERIE</label>
                <InputText id="serie" v-model.trim="product.serie" required="true"
                    :class="{ 'p-invalid': submitted && !product.serie }" />
                <small class="p-invalid" v-if="submitted && !product.serie">serie requerida</small>
            </div>

            <div class="field">
                <label for="dropdown">Equipo</label>
                <Dropdown id="dropdown" v-model="product.producto_id" :options="productos" optionLabel="nombre"
                    optionValue="id" required="true" :class="{ 'p-invalid': submitted && !product.producto_id }" />
                <small class="p-invalid" v-if="submitted && !product.producto_id">Actividad requerida</small>


            </div>

            <div class="field">
                <label for="dropdown">Estado Equipo</label>

                <Dropdown id="dropdown" v-model="product.estado_id" :options="estado" optionLabel="estado"
                    optionValue="id" required="true" :class="{ 'p-invalid': submitted && !product.estado_id }" />
                <small class="p-invalid" v-if="submitted && !product.estado_id">Actividad </small>


            </div>


            <div class="field">
                <label for="inputtext">TECNICO</label>
                <Dropdown id="dropdown" v-model="product.persona_id" :options="persona" optionLabel="nombre"
                    optionValue="id" required="true" :class="{ 'p-invalid': submitted && !product.persona_id }" />
                <small class="p-invalid" v-if="submitted && !product.persona_id">Tecnico requerido</small>


            </div>



            <template #footer>
                <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
                <Button label="Save" icon="pi pi-check" class="p-button-text" @click="guardarEquipo()" />
            </template>

        </Dialog>

    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import equipoServices from "./../../services/equipo.services.js";
import productoSevice from "../../services/producto.services.js";
import estadoSevice from "../../services/estado.services.js";
import abonadoSevice from "../../services/abonado.services.js";
import personaSevice from "../../services/persona.services.js";
import { useToast } from 'primevue/usetoast';
import { utils, writeFile } from 'xlsx';

const toast = useToast();

const equipos = ref([]);
const dt = ref(null);
const totalRecords = ref(0)
const productDialog = ref(false);
const product = ref({});
const submitted = ref(false);
const productos = ref()
const estado = ref()
const abonado = ref()
const buscar = ref([])
const persona = ref()

const loading = ref(false);
const lazyParams = ref({ page: 0 });

onMounted(() => {
    listarEquipos()
    listarProducto()
    listarEstado()
    listarAbonado()
    listarPersona()
    
})

const onPage = (event) => {
    lazyParams.value = event
    listarEquipos()
}
async function listarEquipos() {
    loading.value = true

    let page = lazyParams.value.page + 1;
    let limit = lazyParams.value.rows;
    const { data } = await equipoServices.funListar(page, limit, buscar.value);
    loading.value = false
    equipos.value = data.data
    totalRecords.value = data.total

}

const buscador = () => {
    listarEquipos()
};
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

async function guardarEquipo() {
    submitted.value = true;
    if (product.value.producto_id && product.value.serie && product.value.estado_id && product.value.persona_id) {

        try {
            if (product.value.id) {

                //console.log('hola')
                await equipoServices.funModificar(product.value, product.value.id)

                product.value = {
                    abonado_id: '',
                    producto_id: '',
                    serie: '',
                    estado_id: '',
                    persona_id: ''
                }
                toast.add({ severity: 'success', summary: 'Equipo modificado', detail: 'Se ha modificado equipo', life: 10000 });

            }
            productDialog.value = false;
            listarEquipos()
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

const hideDialog = () => {
    productDialog.value = false;
    submitted.value = false;
};



async function eliminar(id) {
    if (confirm("Esta seguro de eliminar el quipo")) {
        await equipoServices.funliminar(id);
        listarEquipos()
        toast.add({ severity: 'success', summary: 'Equipo eliminado', detail: 'Se ha eliminado equipo', life: 3000 });
    }
}


const exportXls = () =>{

    const data = dt.value.value;
    //console.log(data)

    const data2 = data.map(equipo =>({
        id: equipo.id,
        serie: equipo.serie,
        nombre: equipo.producto.nombre,
        estado: equipo.estado.estado,
        plan: equipo.abonado.plan,
        codigo: equipo.abonado.codigo,
        tecnico: equipo.persona.nombre,
        fecha: equipo.updated_at
    }));

    const archivo = utils.json_to_sheet(data2);
    const libro = utils.book_new();
    utils.book_append_sheet(libro, archivo, 'reporteEquipos')
    writeFile(libro, 'equipos.xlsx')
}







</script>