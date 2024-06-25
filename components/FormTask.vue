<template>
  <div class="py-5 px-9">
    <h1 class="font-bold text-2xl my-5">{{ editTask ? 'Actualizar tarea': 'Agregar tarea'}}</h1>
    <form action="" class="space-y-5">
      <!--  Input Nombre   -->
      <div>
        <label
          for="nameTask"
          class="block text-sm text-gray-500 mb-3 font-bold"
          :class="{ 'text-red-500': $v.form.name.$error }"
        >Nombre tarea <span class="text-red-400">*</span>
        </label>
        <input
          type="text"
          name="nameTask"
          id="nameTask"
          v-model="form.name"
          :class="[{ 'border-red-300': $v.form.name.$error }]"
          class="w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400"
          placeholder="Nombre de la tarea"
        >
        <p
          class="text-red-400 font-bold text-sm"
          v-if="$v.form.name.$error">
          El nombre es requerido.
        </p>
      </div>
      <!--  Input Url   -->
      <div>
        <label
          for="url"
          class="block text-sm text-gray-500 mb-3 font-bold"
          :class="{ 'text-red-500': $v.form.user_id.$error && (!$v.form.user_id || !$v.form.user_id.required) }"
        >Responsable<span class="text-red-400"> *</span>
        </label>
        <select v-model="form.user_id"  id="user_id" name="user_id" class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
          <option  selected value="">Seleccione un responsable</option>
          <option  v-for="(user, index) in users" :key="index" :value="user.id">{{ user.name }}</option>
        </select>
        <p
          class="text-red-400 font-bold text-sm"
          v-if="$v.form.user_id.$error && !$v.form.user_id.required">
          Debe seleccionar un responsable
        </p>
      </div>
      <div>
        <label
          for="status"
          class="block text-sm text-gray-500 mb-3 font-bold"
          :class="{ 'text-red-500': $v.form.status.$error && (!$v.form.status || !$v.form.status.required) }"
        >Estado<span class="text-red-400"> *</span>
        </label>
        <select v-model="form.status"  id="status" name="status" class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
          <option value="pending" selected>Pendiente</option>
          <option value="in_progress" selected>En progreso</option>
          <option value="finalized" selected>Finalizada</option>
        </select>
        <p
          class="text-red-400 font-bold text-sm"
          v-if="$v.form.user_id.$error && !$v.form.user_id.required">
          Debe seleccionar un responsable
        </p>
      </div>
    
     
      <div>
        <button v-if="!editTask" @click="fcAddTask" type="button"
                class="text-white bg-blue-800 w-full hover:bg-green-500 focus:ring-4 focus:ring-green-100 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2  focus:outline-none">
          Agregar tarea
        </button>
        <button v-else @click="fcUpdateTask" type="button"
                class="text-white bg-blue-800 w-full hover:bg-green-500 focus:ring-4 focus:ring-green-100 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2  focus:outline-none">
          Actualizar
        </button>
        <button  @click="fcCancelTask" type="button"
                class="text-white bg-gray-800 w-full hover:bg-green-500 focus:ring-4 focus:ring-green-100 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2  focus:outline-none">
          Cancelar
        </button>
      </div>
    </form>
  </div>
</template>

<script>

import {bus} from "../plugins/bus";
import {required, url} from "vuelidate/lib/validators";
import {cloneDeep} from 'lodash'
export default {
  name: "FormTask",
  computed:{
    users(){
      return cloneDeep(this.$store.getters['user/listUsers'])
    }
    
  },
  async beforeMount() {
    await this.$store.dispatch('user/getUsers');
  },
  data() {
    return {
      UserId: null,
      form: {
        name: String(),
        user_id: String(),
        status: 'pending',
        assignment_date:this.getCurrentDate()
      }
    }
  },
  props:['user', 'editTask','task'],
  validations: {
    form: {
      name: {required},
      user_id: {required},
      status: {required},
    },
  },
  methods: {
    getCurrentDate() {
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
    submitForm() {
      console.log(this.form);
    },
    validateForm() {
      let validation = false
      this.$v.form.$touch();
      if (this.$v.$invalid) {
        this.$toast.error('Verifique los campos obligatorios.');
        return validation = true
      }
    },  
 
    dataEditTask(data){
      this.form = data
    },
    fcCancelTask(){
      this.$v.form.$reset()
      this.$FModal.hide()
    },
    fcAddTask() {
      const validation = this.validateForm()
      if (validation) return true
      this.$swal.fire(
        this.swalAlert('¿Esta seguro de agregar la tarea?', 'warning', 'Estoy Seguro', 'Cancelar')
      ).then(async result => {
        if (result.value) {
          let response = await this.$store.dispatch('task/saveTask', this.form)
          if (response){
            this.$FModal.hide()
          }
        }
      })
    },
    fcUpdateTask() {
      const validation = this.validateForm()
      if (validation) return true
      this.$swal.fire(
        this.swalAlert('¿Esta seguro de actualizar la tarea?', 'warning', 'Estoy Seguro', 'Cancelar')
      ).then(async result => {
        if (result.value) {
          let response = await this.$store.dispatch('task/updateTask', this.form)
          if (response){
            this.$FModal.hide()
          }
        }
      })
    },
    /*=============================================
    FUNCIÓN PARA LAS OPCIONES DE LA ALERTA DE CONFIRMACIÓN
   =============================================*/
    swalAlert(message, icon, textAccept, textCancel) {
      return {
        title: message,
        icon: icon,
        confirmButtonText: textAccept,
        cancelButtonText: textCancel,
        customClass: {
          confirmButton: 'text-white bg-blue-700 w-full hover:bg-green-500 focus:ring-1 focus:ring-green-600 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2',
          cancelButton: 'text-white bg-gray-700 w-full hover:bg-gray-800 focus:ring-1 focus:ring-gray-600 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2'
        },
        buttonsStyling: false,
        showCancelButton: true,
        reverseButtons: true,
        allowOutsideClick: false,
      }
    }
  },
  mounted() {
    if (this.editTask){
      this.dataEditTask(this.task)
    }
  }
}
</script>

<style scoped>
/* Toggle A */
input:checked ~ .dot {
  transform: translateX(100%);
  background-color: #48bb78;
}

/* Toggle B */
input:checked ~ .dot {
  transform: translateX(100%);
  background-color: #48bb78;
}
</style>
