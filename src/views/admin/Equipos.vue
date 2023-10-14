<template>
    <div class="card">
        <h2>Equipos</h2>
        {{ equipos }}
        {{ product }}
        <Toolbar class="mb-4">
                    <template v-slot:start>
                        <div class="my-2">
                            <Button label="NUEVO EQUIPO" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew" />
                            <Button label="Delete" icon="pi pi-trash" class="p-button-danger" @click="confirmDeleteSelected" :disabled="!selectedProducts || !selectedProducts.length" />
                        </div>
                    </template>

                    <template v-slot:end>
                        <FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Import" chooseLabel="Import" class="mr-2 inline-block" />
                        <Button label="Export" icon="pi pi-upload" class="p-button-help" @click="exportCSV($event)" />
                    </template>
                </Toolbar>

        <DataTable ref="dt" :value="equipos" :totalRecords="totalRecords" dataKey="id" :paginator="true" :rows="10"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            :rowsPerPageOptions="[5, 10, 25]"
            currentPageReportTemplate="Mostrando {first} to {last} of {totalRecords} equipos" responsiveLayout="scroll">
            <template #header>
                <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                    <h5 class="m-0">Gestion Equipos</h5>
                    <span class="block mt-2 md:mt-0 p-input-icon-left">
                        <i class="pi pi-search" />
                        <InputText placeholder="Search..." />
                    </span>
                </div>
            </template>
            <Column field="id" header="ID" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                <template #body="slotProps">
                    <span class="p-column-title">Name</span>
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
                    {{ slotProps.data.producto_id }}
                </template>
            </Column>
            <Column field="estado_id" header="ESTADO" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                <template #body="slotProps">
                    <span class="p-column-title">ESTADO</span>
                    {{ slotProps.data.estado_id }}
                </template>
            </Column>
            <Column field="orden_id" header="ORDEN" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                <template #body="slotProps">
                    <span class="p-column-title">ORDEN</span>
                    {{ slotProps.data.orden_id }}
                </template>
            </Column>
            <Column header="GESTION" headerStyle="min-width:10rem;">
                <template #body="slotProps">
                    <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2"
                        @click="editProduct(slotProps.data)" />
                    <Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2"
                        @click="confirmDeleteProduct(slotProps.data)" />
                </template>
            </Column>
        </DataTable>

        <Dialog v-model:visible="productDialog" :style="{ width: '450px' }" header="EQUIPOS" :modal="true"
            class="p-fluid">
            <!--img :src="'demo/images/product/' + product.image" :alt="product.image" v-if="product.image" width="150"
                class="mt-0 mx-auto mb-5 block shadow-2" /-->
            <div class="field">
                <label for="serie">SERIE</label>
                <InputText id="serie" v-model.trim="product.serie" required="true" autofocus
                    :class="{ 'p-invalid': submitted && !product.serie }" />
                <small class="p-invalid" v-if="submitted && !product.serie">serie requerida.</small>
            </div>
            <!--div class="field">
                <label for="description">Description</label>
                <Textarea id="description" v-model="product.description" required="true" rows="3" cols="20" />
            </div-->


            <div class="field">
                <label class="mb-3">Producto</label>
                <div class="formgrid grid">
                    <div class="field-radiobutton col-6" v-for="pro in productos" :key="pro.id">
                        <RadioButton 
                        :value="pro.id" 
                        v-model="product.producto_id"
                        />
                        <label for="category1">{{pro.nombre}}</label>
                    </div>
                </div>
            </div>

            <div class="field">
                <label class="mb-3">Estado</label>
                <div class="formgrid grid">
                    <div class="field-radiobutton col-6" v-for="est in estado" :key="est.id">
                        <RadioButton 
                        :value="est.id" 
                        v-model="product.estado_id"
                        />
                        <label for="category1">{{est.estado}}</label>
                    </div>
                </div>
            </div>

            <div class="formgrid grid">
                <div class="field col">
                    <label for="price">Price</label>
                    <InputNumber id="price" v-model="product.price" mode="currency" currency="USD" locale="en-US"
                        :class="{ 'p-invalid': submitted && !product.price }" :required="true" />
                    <small class="p-invalid" v-if="submitted && !product.price">Price is required.</small>
                </div>
                <div class="field col">
                    <label for="quantity">Quantity</label>
                    <InputNumber id="quantity" v-model="product.quantity" integeronly />
                </div>
            </div>
            <template #footer>
                <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
                <Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveProduct" />
            </template>
        </Dialog>

    </div>
</template>   

<script setup>
import { ref, onMounted } from "vue";
import equipoServices from "./../../services/equipo.services.js";
import productoSevice from "../../services/producto.services.js";
import estadoSevice from "../../services/estado.services.js";

const equipos = ref([]);
const dt = ref(null);
const totalRecords = ref(0)
const productDialog = ref(false);
const product = ref({});
const submitted = ref(false);
const productos = ref()
const estado = ref()

onMounted(() => {
    listarEquipos()
    listarProducto()
    listarEstado()
})

async function listarEquipos() {
    const { data } = await equipoServices.funListar();
    equipos.value = data.data
    totalRecords.value = data.total

}

async function listarProducto() {
    const { data } = await productoSevice.funListar();
    productos.value = data  
}

async function listarEstado() {
    const { data } = await estadoSevice.funListar();
    estado.value = data  
}

const openNew = () => {
    product.value = {};
    submitted.value = false;
    productDialog.value = true;
};

const exportCSV = () => {
    dt.value.exportCSV();
};

</script>