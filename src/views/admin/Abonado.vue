<template>
    <div class="card">
        <h2>Abonados</h2>

        <Toast />
        <Toolbar class="mb-4">
            <template v-slot:start>
                <div class="my-2">
                    <Button label="NUEVO ABONADO" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew" />               
                  </div>
            </template>

            <template v-slot:end>
                <!--FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Import" chooseLabel="Import"
                    class="mr-2 inline-block" /-->
                <Button label="Export" icon="pi pi-upload" class="p-button-help" @click="exportCSV($event)" />
            </template>
        </Toolbar>

        <DataTable ref="dt" :value="abonados" :totalRecords="totalRecords" dataKey="id" lazy :loading='loading'
            @page="onPage($event)" :paginator="true" :rows="10"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            :rowsPerPageOptions="[5, 10, 25]"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} abonados" responsiveLayout="scroll">
            <template #header>
                <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                    <h5 class="m-0">Gestion abonados</h5>
                    <span class="block mt-2 md:mt-0 p-input-icon-left">
                        <i class="pi pi-search" />
                        <InputText placeholder="Buscar.." v-model="buscar" @keypress.enter="buscador()" />
                    </span>
                </div>
            </template>
            <Column field="id" header="ID" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                <template #body="slotProps">
                    <span class="p-column-title">ID</span>
                    {{ slotProps.data.id }}
                </template>
            </Column>
            <Column field="codigo" header="CODIGO" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                <template #body="slotProps">
                    <span class="p-column-title">CODIGO</span>
                    {{ slotProps.data.codigo }}
                </template>
            </Column>
            <Column field="plan" header="PLAN" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                <template #body="slotProps">
                    <span class="p-column-title">PLAN</span>
                    {{ slotProps.data.plan }}
                </template>
            </Column>
            <Column field="nombre" header="NOMBRE" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                <template #body="slotProps">
                    <span class="p-column-title">NOMBRE</span>
                    {{ slotProps.data.nombre }}
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

        <Dialog v-model:visible="productDialog" :style="{ width: '450px' }" header="ABONADO" :modal="true" class="p-fluid">
            {{ product }}
            <!--img :src="'demo/images/product/' + product.image" :alt="product.image" v-if="product.image" width="150"
                class="mt-0 mx-auto mb-5 block shadow-2" /-->
            <div class="field">
                <label for="codigo">CODIGO</label>
                <InputText id="codigo" v-model.trim="product.codigo" required="true" autofocus
                    :class="{ 'p-invalid': submitted && !product.codigo }" />
                <small class="p-invalid" v-if="submitted && !product.codigo">codigo requerido</small>
            </div>
            <div class="field">
                <label for="plan">PLAN</label>
                <InputText id="plan" v-model.trim="product.plan" required="true" autofocus
                    :class="{ 'p-invalid': submitted && !product.plan }" />
                <small class="p-invalid" v-if="submitted && !product.plan">plan requerido</small>
            </div>
            <div class="field">
                <label for="nombre">NOMBRE</label>
                <InputText id="nombre" v-model.trim="product.nombre" required="true" autofocus
                    :class="{ 'p-invalid': submitted && !product.nombre }" />
                <small class="p-invalid" v-if="submitted && !product.nombre">nombre requerido</small>
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

    </div>
</template>   

<script setup>
import { ref, onMounted } from "vue";
import abonadoServices from "./../../services/abonado.services.js";
import { useToast } from 'primevue/usetoast';

const toast = useToast();


const abonados = ref([]);
const abona = ref({ codigo: '', plan: '', nombre: '' });
const dt = ref(null);
const totalRecords = ref(0)
const productDialog = ref(false);
const product = ref({});
const submitted = ref(false);
const visible = ref(false);
const deleteProductDialog = ref(false);
const buscar = ref([])

const loading = ref(false);
const lazyParams = ref({ page: 0 });

onMounted(() => {
    listarAbonado()

})

const onPage = (event) => {
    lazyParams.value = event
    listarAbonado()
}

async function listarAbonado() {
    loading.value = true

    let page = lazyParams.value.page + 1;
    let limit = lazyParams.value.rows;
    const { data } = await abonadoServices.funListar(page, limit, buscar.value);
    loading.value = false
    abonados.value = data.data
    totalRecords.value = data.total

}

async function guardarAbonado() {
    submitted.value = true;
    if (product.value.codigo && product.value.plan && product.value.nombre) {
        try {
            if (product.value.id) {
                await abonadoServices.funModificar(product.value, product.value.id)
                listarAbonado()
                product.value = { codigo: '', plan: '', nombre: '' }
                toast.add({ severity: 'success', summary: 'Abonado modificado', detail: 'Se ha modificado abonado', life: 3000 });
            } else {
                await abonadoServices.funGuardar(product.value)
                listarAbonado()
                product.value = { codigo: '', plan: '', nombre: '' }
                toast.add({ severity: 'success', summary: 'abonado guardado', detail: 'Se ha guardado abonado', life: 3000 });
            }
            productDialog.value = false;
        } catch (error) {
            alert(error)
        }
    }
}

function editar(act) {

    product.value = act;
    productDialog.value = ref(true);

}

async function eliminar(id) {
    if (confirm("Esta seguro de eliminar la actividad")) {
        await abonadoServices.funliminar(id);
        
        listarAbonado()
        toast.add({ severity: 'success', summary: 'Actividad Eliminada', detail: 'Se ha eliminado actividad', life: 3000 });

    }
}


const openNew = () => {
    product.value = {};
    submitted.value = false;
    productDialog.value = true;
};

const exportCSV = () => {
    dt.value.exportCSV();
};
const hideDialog = () => {
    productDialog.value = false;
    submitted.value = false;
};

const buscador = () => {
    listarAbonado();
};

</script>