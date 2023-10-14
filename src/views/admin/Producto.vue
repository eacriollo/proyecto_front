<template>
    <div class="card">

        <h2>GESTION PRODUCTOS</h2>

        <Button label="Nuevo producto" icon="pi pi-external-link" @click="visible = true" />
        <Dialog v-model:visible="visible" modal header="Productos" :style="{ width: '50vw' }" class="p-fluid">
            <label for="">Nombre producto</label>
            <InputText type="text" v-model="prod.nombre" />
            <br>
            <br>
            <label for="">Inventario</label>
            <InputText type="text" v-model="prod.inventario" />
            <br>
            <br>
            <label for="">Codigo Producto</label>
            <InputText type="text" v-model="prod.codigo" />
            <br>
            <br>
            <label for="">Accesorio</label>
            <InputText type="text" v-model="prod.accesorio" />
            <br>
            <br>
            <Button label="Guardar" :style="{ width: '10vw' }" icon="pi pi-save" @click="guardarProducto()" />
        </Dialog>


        <DataTable :value="producto" tableStyle="min-width: 50rem">
            <Column field="id" header="id"></Column>
            <Column field="nombre" header="NOMBRE"></Column>
            <Column field="inventario" header="INVENTARIO"></Column>
            <Column field="codigo" header="CODIGO"></Column>
            <Column field="accesorio" header="ACCESORIO"></Column>
            <Column header="Gestion">

                <template #body="slotProps">
                  
                    <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2"
                    @click="editar(slotProps.data)" />
                    <Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2"
                    @click="eliminar(slotProps.data.id)" />

                </template>
            </Column>


        </DataTable>

        <Toast />

    </div>
</template>

<script setup>

import { ref, onMounted } from "vue";
import productoSevice from "../../services/producto.services.js"
import { useToast } from "primevue/usetoast";
const toast = useToast();

// variables
const producto = ref([])
const prod = ref({ nombre: '', inventario:'', codigo: '', accesorio:'' })
const visible = ref(false);

//metodos

onMounted(() => {

    getProducto()
})

async function getProducto() {

    const datos = await productoSevice.funListar();

    producto.value = datos.data

}

async function guardarProducto() {

    try {

        if (prod.value.id) {

            await productoSevice.funModificar(prod.value, prod.value.id)
            getProducto()
            visible.value = false
            prod.value = { nombre: '', inventario:'', codigo: '', accesorio:''} 
            toast.add({ severity: 'success', summary: 'Acción Modificada', detail: 'Se ha modificado', life: 3000 });

        } else {

            await productoSevice.funGuardar(prod.value)
            getProducto()
            visible.value = false
            prod.value = { nombre: '', inventario:'', codigo: '', accesorio:''}
            toast.add({ severity: 'success', summary: 'Producto Guardado', detail: 'Se ha guardado la acción', life: 3000 });


        }
    } catch (error) {
        alert(error)
    }




}

function editar(pro) {

    prod.value = pro;
    visible.value = true;

}

async function eliminar(id) {
    if (confirm("Esta seguro de eliminar")) {
        await productoSevice.funliminar(id);
        getProducto();
        toast.add({ severity: 'success', summary: 'Producto eliminado', detail: 'Se ha eliminado el producto', life: 3000 });
    }
}

</script>s