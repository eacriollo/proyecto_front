<template>
  

    <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <div class="flex flex-column align-items-center justify-content-center">

            <div
                style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
                    <div class="text-center mb-5">
                        <!-- <img src="/demo/images/login/avatar.png" alt="Image" height="50" class="mb-3" /> -->
                        <div class="text-900 text-3xl font-medium mb-3">SOT</div>
                        <span class="text-600 font-medium">Ingrese sus credenciales</span>
                    </div>

                    <div>
                        <label for="email1" class="block text-900 text-xl font-medium mb-2">Correo</label>
                        <InputText id="email1" type="text" placeholder="Email address" class="w-full md:w-30rem mb-5"
                            style="padding: 1rem" v-model="usuario.email" />

                        <label for="password1" class="block text-900 font-medium text-xl mb-2">Contraseña</label>
                        <Password id="password1" v-model="usuario.password" placeholder="Password" :toggleMask="true"
                            class="w-full mb-3" inputClass="w-full" :inputStyle="{ padding: '1rem' }"></Password>

                    </div>
                    <Button label="Ingresar" class="w-full p-3 text-xl" v-on:click="funIngresar()"></Button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup> 
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import authServices from "./../services/auth.services.js";

//variables

const usuario = ref({ email: "", password: "" })
const errors = ref({})
const router = useRouter()


//metodos

async function funIngresar() {

    try {

        const { data } = await authServices.funLogin(usuario.value)
        console.log("usuario activo: ", data)

        errors.value = {}
        localStorage.setItem("access_token", data.access_token);
        router.push("/about")

    } catch (error) {
        console.log(error.response.data)
        errors.value = error.response.data.errors

    }



}

</script>


<style></style>