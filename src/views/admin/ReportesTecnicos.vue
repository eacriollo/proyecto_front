<template>

    <div class="card">
        <h2>Reportes Tecnicos</h2>


        <div class="card">
            <div class="grid p-fluid">
                <div class="field col-12 md:col-2">

                    <label for="inputtext">TECNICO</label>
                </div>
                <div class="field col-12 md:col-4">

                    <Dropdown id="dropdown" v-model="datos1.persona_id" :options="persona" optionLabel="nombre"
                        optionValue="id" required="true" />
                </div>
                <div class="field col-12 md:col-3">

                    <Calendar v-model="date" view="month" dateFormat="mm/yy" />
                </div>
                <div class="field col-12 md:col-2">

                    <Button label="Generar" :style="{ width: '10vw' }" icon="pi pi-save" @click="generarReporte()" />
                </div>
            </div>
        </div>

        <div class="grid p-fluid" v-if="reportGenerated">

            <div class="col-12 xl:col-6">
                <div class="card">
                    <h5>Actividades por tecnico</h5>
                    <Chart type="bar" :data="barData" :options="barOptions"></Chart>
                </div>
            </div>

        </div>

    </div>
</template>



<script setup>
import { ref, watch, onMounted } from 'vue';
import { useLayout } from '@/layout/composables/layout';
import reportes from "../../services/reportes.services.js";
import personaSevice from "../../services/persona.services.js";
import { compileScript } from 'vue/compiler-sfc';

const datos1 = ref({

})
const barData = ref(null);
const pieData = ref(null);
const pieOptions = ref(null);
const barOptions = ref(null);
const date = ref();
const { layoutConfig } = useLayout();


const ordenes = ref([]);



const mes = ref(null);
const year = ref(null);
const persona = ref(null);
const reportGenerated = ref(false);


let documentStyle = getComputedStyle(document.documentElement);
let textColor = documentStyle.getPropertyValue('--text-color');
let textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
let surfaceBorder = documentStyle.getPropertyValue('--surface-border');

onMounted(() => {

    getPersona()


})


async function getPersona() {

    const datos = await personaSevice.funListar();

    persona.value = datos.data

}

async function generarReporte() {

    await generarReporteOrdenes()
    reportGenerated.value = true;
};

async function generarReporteOrdenes() {

    const datos = await reportes.funDatosTecnicos(year.value, mes.value, datos1._rawValue.persona_id)
    ordenes.value = datos.data

    setChart(ordenes.value);

};



watch(date, (newDate) => {
    if (newDate) {
        const selectedDate = new Date(newDate);
        mes.value = selectedDate.getMonth() + 1;
        year.value = selectedDate.getFullYear();
    }
});



const setColorOptions = () => {
    documentStyle = getComputedStyle(document.documentElement);
    textColor = documentStyle.getPropertyValue('--text-color');
    textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    surfaceBorder = documentStyle.getPropertyValue('--surface-border');
};


const setChart = (ordenes) => {
    barData.value = {
        labels: ordenes.map(item => item.tipo_de_actividad),
        datasets: [
            {
                label: 'Valores tecnicos',
                backgroundColor: documentStyle.getPropertyValue('--primary-500'),
                borderColor: documentStyle.getPropertyValue('--primary-500'),
                data: ordenes.map(item => item.total_suma)
            },

        ]
    };
    barOptions.value = {
        plugins: {
            legend: {
                labels: {
                    fontColor: textColor
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: textColorSecondary,
                    font: {
                        weight: 500
                    }
                },
                grid: {
                    display: false,
                    drawBorder: false
                }
            },
            y: {
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder,
                    drawBorder: false
                }
            }
        }
    };

}

watch(
    layoutConfig.theme,
    () => {
        setColorOptions();
        setChart(ordenes.value);
    },
    { immediate: true }
);

</script>