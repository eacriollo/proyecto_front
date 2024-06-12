<template>
    <div class="card">
        <h2>GESTION CIUDADES</h2>

        

        <Button label="Nueva Ciudad" icon="pi pi-external-link" @click="visible = true" />
        <Dialog v-model:visible="visible" modal header="Ciudad" :style="{ width: '50vw' }" class="p-fluid">
            <label for="">Ingresar ciudad</label>
            <InputText type="text" v-model="ciudad.nombre" />
            <br>
            <br>         
            <Button label="Guardar" :style="{ width: '10vw'}" icon="pi pi-save" @click="guardarCiudad()" />
        </Dialog>

        <DataTable :value="ciudades" tableStyle="min-width: 50rem">
            <Column field="id" header="id"></Column>
            <Column field="nombre" header="Ciudad"></Column>
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
import ciudadSevice from "../../services/ciudad.services.js"
import { useToast } from "primevue/usetoast";
const toast = useToast();

// variables
const ciudades = ref([])
const ciudad = ref({ nombre: '' })
const visible = ref(false);

//metodos

onMounted(() => {

    getCiudad()
})

async function getCiudad() {

    const datos = await ciudadSevice.funListar();

    ciudades.value = datos.data

}

async function guardarCiudad() {

    try {

        if (ciudad.value.id) {

            await ciudadSevice.funModificar(ciudad.value, ciudad.value.id)
            getCiudad()
            visible.value = false
            ciudad.value = { nombre: '' }
            toast.add({ severity: 'success', summary: 'Ciudad Modificada', detail: 'Se ha modificado la ciudad', life: 3000 });

        } else {

            await ciudadSevice.funGuardar(ciudad.value)
            getCiudad()
            visible.value = false
            ciudad.value = { nombre: '' }
            toast.add({ severity: 'success', summary: 'Ciudad Guardada', detail: 'Se ha guardado la ciudad', life: 3000 });


        }
    } catch (error) {
        alert(error)
    }




}

function editar(ciu) {

    ciudad.value = ciu;
    visible.value = true;

}

async function eliminar(id) {
    if (confirm("Esta seguro de eliminar la ciudad")) {
        await ciudadSevice.funliminar(id);
        getCiudad();
        toast.add({ severity: 'success', summary: 'Ciudad Eliminada', detail: 'Se ha eliminado la ciudad', life: 3000 });
    }
}

</script>