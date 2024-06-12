<template>

    <div class="card">
        <h2>Reportes</h2>
        {{ ordenes }}
        {{ mes }}
        {{ year }}
        <div class="card flex justify-content-center">
            <Calendar v-model="date" view="month" dateFormat="mm/yy" />

            <Button label="Generar" :style="{ width: '10vw' }" icon="pi pi-save" @click="generarReporte()" />
        </div>

        <div class="grid p-fluid" v-if="reportGenerated">

            <div class="col-12 xl:col-6">
                <div class="card">
                    <h5>Actividades</h5>
                    <Chart type="bar" :data="barData" :options="barOptions"></Chart>
                </div>
            </div>

            <div class="col-12 xl:col-6">
                <div class="card flex flex-column align-items-center">
                    <h5 class="text-left w-full">Pie Chart</h5>
                    <Chart type="pie" :data="pieData" :options="pieOptions"></Chart>
                </div>
            </div>
        </div>

    </div>
</template>



<script setup>
import { ref, watch } from 'vue';
import { useLayout } from '@/layout/composables/layout';
import reportes from "../../services/reportes.services.js"
import { compileScript } from 'vue/compiler-sfc';


const barData = ref(null);
const pieData = ref(null);
const pieOptions = ref(null);
const barOptions = ref(null);
const date = ref();
const { layoutConfig } = useLayout();


const ordenes = ref([]);
const ciudades = ref([]);


const mes = ref(null);
const year = ref(null);
const reportGenerated = ref(false);


let documentStyle = getComputedStyle(document.documentElement);
let textColor = documentStyle.getPropertyValue('--text-color');
let textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
let surfaceBorder = documentStyle.getPropertyValue('--surface-border');


async function generarReporte() {

    await generarReporteOrdenes()
    await generarReporteCiudades()
    reportGenerated.value = true;
};

async function generarReporteOrdenes() {

    const datos = await reportes.funDatosOrdenes(year.value, mes.value)
    ordenes.value = datos.data
    setChart(ordenes.value);

};

async function generarReporteCiudades() {

    const datos = await reportes.funDatosCiudad(year.value, mes.value);
    ciudades.value = datos.data
    setChart2(ciudades.value);


};

watch(date, (newDate) => {
    if (newDate) {
        const selectedDate = new Date(newDate);
        mes.value = selectedDate.getMonth() + 1; // Los meses en JavaScript son 0-indexados
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
                label: 'Ordenes',
                backgroundColor: documentStyle.getPropertyValue('--primary-500'),
                borderColor: documentStyle.getPropertyValue('--primary-500'),
                data: ordenes.map(item => item.total_suma)
            },
            /*  {
                  label: 'Visitas',
                  backgroundColor: documentStyle.getPropertyValue('--primary-200'),
                  borderColor: documentStyle.getPropertyValue('--primary-200'),
                  data: [28, 48, 40, 19, 86, 27, 90]
              }*/
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

const setChart2 = (ciudades) => {
    pieData.value = {
        labels: ciudades.map(item => item.ciudad),
        datasets: [
            {
                data: ciudades.map(item => item.total_suma),
                backgroundColor: [documentStyle.getPropertyValue('--indigo-500'), documentStyle.getPropertyValue('--purple-500'), documentStyle.getPropertyValue('--teal-500')],
                hoverBackgroundColor: [documentStyle.getPropertyValue('--indigo-400'), documentStyle.getPropertyValue('--purple-400'), documentStyle.getPropertyValue('--teal-400')]
            }
        ]
    };

    pieOptions.value = {
        plugins: {
            legend: {
                labels: {
                    usePointStyle: true,
                    color: textColor
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
        setChart2(ciudades.value);
    },
    { immediate: true }
);

</script>