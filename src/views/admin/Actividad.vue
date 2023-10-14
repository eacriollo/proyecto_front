<template>
    <div class="card">

        <h2>GESTION TIPO DE ACTIVIDADES</h2>

        <Button label="Nueva actividad" icon="pi pi-external-link" @click="visible = true" />
        <Dialog v-model:visible="visible" modal header="Tipo actividad" :style="{ width: '50vw' }" class="p-fluid">
            <label for="">Ingresar nombre</label>
            <InputText type="text" v-model="tipoActi.tipo" />
            <br>
            <br>
            
            <Button label="Guardar" :style="{ width: '10vw' }" icon="pi pi-save" @click="guardarActividad()" />
        </Dialog>


        <DataTable :value="actividad" tableStyle="min-width: 50rem">
            <Column field="id" header="id"></Column>
            <Column field="tipo" header="tipo actividad"></Column>
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
import actividadSevice from "../../services/actividad.services.js"
import { useToast } from "primevue/usetoast";
const toast = useToast();

// variables
const actividad = ref([])
const tipoActi = ref({ tipo: '' })
const visible = ref(false);

//metodos

onMounted(() => {

    getActividad()
})

async function getActividad() {

    const datos = await actividadSevice.funListar();

    actividad.value = datos.data

}

async function guardarActividad() {

    try {

        if (tipoActi.value.id) {

            await actividadSevice.funModificar(tipoActi.value, tipoActi.value.id)
            getActividad()
            visible.value = false
            tipoActi.value = { tipo: '' }
            toast.add({ severity: 'success', summary: 'Actividad Modificada', detail: 'Se ha modificado la actividad', life: 3000 });

        } else {

            await actividadSevice.funGuardar(tipoActi.value)
            getActividad()
            visible.value = false
            tipoActi.value = { tipo: '' }
            toast.add({ severity: 'success', summary: 'Actividad Guardada', detail: 'Se ha guardado la actividad', life: 3000 });


        }
    } catch (error) {
        alert(error)
    }




}

function editar(act) {

    tipoActi.value = act;
    visible.value = true;

}

async function eliminar(id) {
    if (confirm("Esta seguro de eliminar la actividad")) {
        await actividadSevice.funliminar(id);
        getActividad();
        toast.add({ severity: 'success', summary: 'Actividad Eliminada', detail: 'Se ha eliminado actividad', life: 3000 });
    }
}

</script>