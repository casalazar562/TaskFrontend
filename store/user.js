export const state = () => ({
    users: [],
    dataLoading: false
  })
  export const mutations = {
    notData(state) {
      state.dataLoading = true
    },
    setUsers(state, data) {
      if (data.length > 0) {
        state.users = data
        state.dataLoading = false
      } else {
        state.dataLoading = true
      }
    },
    setUser(state, data) {
      if (data) {
        state.users.unshift(data)
        state.dataLoading = false
      }
    },

  
  }
  // Los getters se utilizan para acceder al estado de la aplicación en Vuex.
  export const getters = {
    listUsers: state => state.users
  }
  // Las acciones se utilizan para realizar operaciones asincrónicas en Vuex.
  export const actions = {
    async getUsers({commit, state}) {
      try {
        const response = await this.$axios.get('/api/v1/list-user')
        console.log(response.data)
        if (response && response.data && response.data.users.length > 0) {
          commit('setUsers', response.data.users)
          return true
        } else {
          commit('notData')
          console.log('No se encontraron usuarios')
          return false
        }
      } catch (error) {
        commit('notData')
        console.log(error)
        return false
      }
    },
  
  }
  
  