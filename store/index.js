const cookieparser = process.server ? require("cookieparser") : undefined

export const state = () => ({
  user: null,
})

export const mutations = {
  setUser(state, payload) {
    state.user = payload
  },
}

export const actions = {
  // nuxt 特殊action
  nuxtServerInit({ commit }, { req }) {
    if (req.headers.cookie) {
      const cookie = cookieparser.parse(req.headers.cookie)
      try {
        const user = JSON.parse(cookie.user)
        commit("setUser", user)
      } catch (error) {}
    }
  },
}
