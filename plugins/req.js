import axios from "axios"

export const instance = axios.create({
  baseURL: "https://conduit.productionready.io",
})

// 插件接收一个context对象
export default ({ store, redirect, route }) => {
  instance.interceptors.request.use(
    config => {
      // console.log(config)
      const { user } = store.state
      if (user && user.token) {
        config.headers.Authorization = `Token ${user.token}`
      }
      return config
    },
    error => Promise.reject(error),
  )

  instance.interceptors.response.use(
    response => {
      // console.log(response)
      return response
    },
    error => {
      // console.dir(route)
      const { status } = error.response
      if (status === 401) {
        redirect("/login")
      }
      return Promise.reject(error)
    },
  )
}
