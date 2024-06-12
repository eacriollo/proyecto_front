<template>
    <div class="card">

        <h2>Estado de equipos</h2>
        <Button label="Estado de equipos" icon="pi pi-external-link" @click="visible = true" />
        <Dialog v-model:visible="visible" modal header="Estado" :style="{ width: '50vw' }" class="p-fluid">
            <label for="">Estado de equipos</label>
            <InputText type="text" v-model="est.estado" />
            <br>
            <br>
            
            <Button label="Guardar" :style="{ width: '10vw' }" icon="pi pi-save" @click="guardarEstado()" />
        </Dialog>

        <DataTable :value="estado" tableStyle="min-width: 50rem">
            <Column field="id" header="id"></Column>
            <Column field="estado" header="Estado Equipo"></Column>
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
import estadoSevice from "../../services/estado.services.js"
import { useToast } from "primevue/usetoast";
const toast = useToast();

// variables
const estado = ref([])
const est = ref({ estado: '' })
const visible = ref(false);

//metodos

onMounted(() => {

    getEstado()
})

async function getEstado() {

    const datos = await estadoSevice.funListar();

    estado.value = datos.data
}

async function guardarEstado() {
    try {

        if (est.value.id) {

            await estadoSevice.funModificar(est.value, est.value.id)
            getEstado()
            visible.value = false
            est.value = { estado: '' }
            toast.add({ severity: 'success', summary: 'Estado Modificado', detail: 'Se ha modificado el estado', life: 3000 });
        } else {

            await estadoSevice.funGuardar(est.value)
            getEstado()
            visible.value = false
            est.value = { estado: '' }
            toast.add({ severity: 'success', summary: 'Estado Guardado', detail: 'Se ha guardado el estado', life: 3000 });
        }
    } catch (error) {
        alert(error)
    }

}

function editar(act) {

    est.value = act;
    visible.value = true;

}

async function eliminar(id) {
    if (confirm("Esta seguro de eliminar el estado")) {
        await estadoSevice.funliminar(id);
        getEstado();
        toast.add({ severity: 'success', summary: 'Estado Eliminado', detail: 'Se ha eliminado el estado', life: 3000 });
    }
}

</script>