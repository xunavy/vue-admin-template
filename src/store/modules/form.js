const state = {
  formData: {
    basic: { name: '', gender: 'male', phone: '', email: '' },
    address: { area: [], detail: '' },
    relatives: [{ name: '', relation: '', phone: '' }]
  },
  isAddressExpanded: false
}

const mutations = {
  UPDATE_FORM_DATA(state, { path, value }) {
    if (path.includes('.')) {
      const [parent, child] = path.split('.')
      state.formData[parent][child] = value
    } else {
      state.formData[path] = value
    }
  },
  UPDATE_RELATIVE(state, { index, field, value }) {
    state.formData.relatives[index][field] = value
  },
  ADD_RELATIVE(state) {
    state.formData.relatives.push({ name: '', relation: '', phone: '' })
  },
  REMOVE_RELATIVE(state, index) {
    state.formData.relatives.splice(index, 1)
  },
  TOGGLE_ADDRESS_EXPANDED(state) {
    state.isAddressExpanded = !state.isAddressExpanded
  },
  RESET_FORM(state) {
    state.formData = {
      basic: { name: '', gender: 'male', phone: '', email: '' },
      address: { area: [], detail: '' },
      relatives: [{ name: '', relation: '', phone: '' }]
    }
    state.isAddressExpanded = false
  }
}

const actions = {
  updateFormData({ commit }, payload) {
    commit('UPDATE_FORM_DATA', payload)
  },
  updateRelative({ commit }, payload) {
    commit('UPDATE_RELATIVE', payload)
  },
  addRelative({ commit }) {
    commit('ADD_RELATIVE')
  },
  removeRelative({ commit }, index) {
    commit('REMOVE_RELATIVE', index)
  },
  toggleAddressExpanded({ commit }) {
    commit('TOGGLE_ADDRESS_EXPANDED')
  },
  resetForm({ commit }) {
    commit('RESET_FORM')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}