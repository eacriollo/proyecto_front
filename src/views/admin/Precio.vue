<template>
    <div class="card">

        <h2>Precios ordenes</h2>

        <Button label="Nuevo precio" icon="pi pi-external-link" @click="visible = true" />
        <Dialog v-model:visible="visible" modal header="Valor actividad" :style="{ width: '50vw' }" class="p-fluid">
            <label for="">Ingresar valor</label>
            <InputText type="number" v-model="prec.precio" />
            <br>
            <br>
            
            <Button label="Guardar" :style="{ width: '10vw' }" icon="pi pi-save" @click="guardarPrecio()" />
        </Dialog>


        <DataTable :value="precios" tableStyle="min-width: 50rem">
            <Column field="id" header="id"></Column>
            <Column field="precio" header="Valor"></Column>
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
import precioServicios from "../../services/precio.services.js"
import { useToast } from "primevue/usetoast";

const toast = useToast();

// variables
const precios = ref([])
const prec = ref({ precio: '' })
const visible = ref(false);

//metodos

onMounted(() => {

    getPrecios()
})

async function getPrecios() {

    const datos = await precioServicios.funListar();

    precios.value = datos.data

}

async function guardarPrecio() {

    try {

        if (prec.value.id) {

            await precioServicios.funModificar(prec.value, prec.value.id)
            getPrecios()
            visible.value = false
            prec.value = { precio: '' }
            toast.add({ severity: 'success', summary: 'Precio Modificado', detail: 'Se ha modificado el precio', life: 3000 });

        } else {

            await precioServicios.funGuardar(prec.value)
            getPrecios()
            visible.value = false
            prec.value = { precio: '' }
            toast.add({ severity: 'success', summary: 'Precio Guardado', detail: 'Se ha guardado', life: 3000 });


        }
    } catch (error) {
        alert(error)
    }




}

function editar(precio) {

    prec.value = precio;
    visible.value = true;

}

async function eliminar(id) {
    if (confirm("Esta seguro de eliminar valor")) {
        await precioServicios.funliminar(id);
        getPrecios();
        toast.add({ severity: 'success', summary: 'Valor eliminado', detail: 'Se ha eliminado', life: 3000 });
    }
}

</script>