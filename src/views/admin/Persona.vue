<template>
    <div class="card">

        <h2>GESTION PERSONAS</h2>
          
        <Button label="Nueva persona" icon="pi pi-external-link" @click="visible = true" />
        <Dialog v-model:visible="visible" modal header="Personas" :style="{ width: '50vw' }" class="p-fluid">
            <label for="">Ingresar nombre</label>
            <InputText type="text" v-model="pers.nombre" />
            <br>
            <br>
            <label for="">Ingresar CI</label>
            <InputText type="text" v-model="pers.ci" />
            <br>
            <br>
            <Button label="Guardar" :style="{ width: '10vw' }" icon="pi pi-save" @click="guardarPersona()" />
        </Dialog>

        <DataTable :value="persona" tableStyle="min-width: 50rem">
            <Column field="id" header="id"></Column>
            <Column field="nombre" header="NOMBRE"></Column>
            <Column field="ci" header="CI"></Column>
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
import personaSevice from "../../services/persona.services.js"
import { useToast } from "primevue/usetoast";
const toast = useToast();

// variables
const persona = ref([])
const pers = ref({ nombre: '', ci:"" })
const visible = ref(false);

//metodos

onMounted(() => {

    getPersona()
})

async function getPersona() {

    const datos = await personaSevice.funListar();

    persona.value = datos.data

}

async function guardarPersona() {

    try {

        if (pers.value.id) {

            await personaSevice.funModificar(pers.value, pers.value.id)
            getPersona()
            visible.value = false
            pers.value = { nombre: '', ci:"" }
            toast.add({ severity: 'success', summary: 'Acción Modificada', detail: 'Se ha modificado', life: 3000 });

        } else {

            await personaSevice.funGuardar(pers.value)
            getPersona()
            visible.value = false
            pers.value = { nombre: '', ci:"" }
            toast.add({ severity: 'success', summary: 'Persona Guardada', detail: 'Se ha guardado la acción', life: 3000 });


        }
    } catch (error) {
        alert(error)
    }
}

function editar(act) {

    pers.value = act;
    visible.value = true;

}

async function eliminar(id) {
    if (confirm("Esta seguro de eliminar la persona")) {
        await personaSevice.funliminar(id);
        getPersona();
        toast.add({ severity: 'success', summary: 'Actividad Eliminada', detail: 'Se ha eliminado la persona', life: 3000 });
    }
}

</script>