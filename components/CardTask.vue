<template>
  <div>
    <div
      class="bg-white shadow rounded-lg hover:bg-teal-50 hover:shadow-md hover:shadow-teal-100 hover:transition-shadow">
      
      <div class="p-5 space-y-3">
        <!--  Nombre & Estado -->
        <div class="flex justify-between items-center">
            <h3 class="text-lg hover:text-green-400 font-bold truncate text-gray-700" v-text="task.name"></h3>
          <!-- </a> -->
          <span
            :class="`${task.status ? 'bg-green-100 text-green-800':'bg-red-100 text-red-800'} text-xs font-medium px-2.5 py-0.5 rounded`">{{
              task.status == 'pending' ? 'Pendiente':(task.status === 'in_progress' ? 'En progreso' : 'No Disponible')
            }}</span>
        </div>
        <!--  Description  -->
        <span class="text-gray-500 text-sm" v-text="task.user.name"></span>
        <div class="md:flex md:items-center md:justify-between mt-3">
         
          <!-- Botones de eliminar y actualizar -->
          <div>
            <div class="flex space-x-2">
              <a @click="deleteTask" class="text-red-500 hover:text-red-400 flex items-center justify-between" href="#">
                Eliminar
              </a>
              <a @click="openModalFormProduct"
                 class="text-blue-700 hover:text-blue-400 flex items-center justify-between" href="#">
                Actualizar
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FormTask from "./FormTask";

export default {
  name: "CardTask",
  props: ['task'],
  methods: {
    async deleteTask() {
      this.$swal.fire(
        {
          title: '¿Esta seguro de eliminar la tarea?',
          icon: 'warning',
          confirmButtonText: 'Estoy Seguro',
          cancelButtonText: 'Cancelar',
          customClass: {
            confirmButton: 'text-white bg-blue-700 w-full hover:bg-green-500 focus:ring-1 focus:ring-green-600 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2',
            cancelButton: 'text-white bg-gray-700 w-full hover:bg-gray-800 focus:ring-1 focus:ring-gray-600 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2'
          },
          buttonsStyling: false,
          showCancelButton: true,
          reverseButtons: true,
          allowOutsideClick: false,
        }
      ).then(async result => {
        if (result.value) {
          await this.$store.dispatch('task/deleteTask', this.task)
        }
      })
    },
    openModalFormProduct() {
      this.$FModal.show(
        {
          component: FormTask,
          clickToClose: false,
          escToClose: false,
          placement: 'center top',
        },
        {
          task: this.task,
          editTask: true
        }
      )
    },
   
  }
}
</script>

<style scoped>

</style>
