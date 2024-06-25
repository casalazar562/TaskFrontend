export const state = () => ({
  tasks: [],
  dataLoading: false
})
export const mutations = {
  notData(state) {
    state.dataLoading = true
  },
  setTasks(state, data) {
    if (data.length > 0) {
      state.tasks = data
      state.dataLoading = false
    } else {
      state.dataLoading = true
    }
  },
  setTask(state, data) {
    if (data) {
      state.tasks.unshift(data)
      state.dataLoading = false
    }
  },
  updateTask(state, data) {
    if (data) {
      state.tasks.map(item => {
        if (item.id === data.id) {
          item.name = data.name
          item.status = data.status
          item.user_id = data.user_id
          
        }
      })
    }
  },
  deleteTask(state, data) {
    if (data) {
      const index = state.tasks.findIndex(task => task.id === data.id);
      console.log(index)
      state.tasks.splice(index, 1)
      if(state.tasks.length === 0){
        state.dataLoading = true
      }
    }
  }
}
export const getters = {
  listTasks: state => state.tasks
}
export const actions = {
  async getTasks({commit, state}) {
    try {
      const response = await this.$axios.get('/api/v1/tasks')
      console.log(response)
      if (response && response.data.data && response.data.data.data.length > 0) {
        commit('setTasks', response.data.data.data)
        return true
      } else {
        commit('notData')
        console.log('No se encontraron tareas')
        return false
      }
    } catch (error) {
      commit('notData')
      console.log(error)
      return false
    }
  },
  
  async saveTask({commit, state}, data) {
    let resp
    try {
      resp = await this.$axios.post(
        '/api/v1/add-task',
        data
      )
      if (resp.status === 201) {
        commit('setTask', resp.data.data)
        this.$toast.success('Tarea agregada exitosamente!');
        return resp = true
      } else {
        console.log(resp)
        return resp = false
      }

    } catch (e) {
      this.$toast.error('Error al agregar la tarea.');
      console.log('ERROR', e)
      return resp = false
    }
  },
  async updateTask({commit, state}, data) {
    let resp
    try {
      resp = await this.$axios.put(
        `/api/v1/${data.id}/update`,
        data
      )
      if (resp.status === 200) {
        commit('updateTask', resp.data.data)
        this.$toast.success('Tarea actualizada exitosamente!');
        return resp = true
      } else {
        console.log(resp)
        return resp = false
      }

    } catch (e) {
      this.$toast.error('Error al actualizar la tarea.');
      console.log('ERROR', e)
      return resp = false
    }
  },

  async deleteTask({commit, state}, data) {
    let resp
    try {
      resp = await this.$axios.delete(
        `/api/v1/${data.id}/delete/`)
      if (resp.status === 200) {
        commit('deleteTask', data)
        this.$toast.success('Tarea eliminada exitosamente!');
        return resp = true
      } else {
        console.log(resp)
        return resp = false
      }

    } catch (e) {
      this.$toast.error('Error al eliminar la tarea.');
      console.log('ERROR', e)
      return resp = false
    }
  },
}

