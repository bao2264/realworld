<template>
  <div class="auth-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">{{ isLogin ? "Sign in" : "Sign up" }}</h1>
          <p class="text-xs-center">
            <nuxt-link to="/register" v-if="isLogin"
              >Need an account?</nuxt-link
            >
            <nuxt-link to="/login" v-else>Have an account?</nuxt-link>
          </p>

          <ul class="error-messages">
            <li v-for="msg in showErrors" :key="msg">{{ msg }}</li>
          </ul>

          <form @submit.prevent="handleSubmit">
            <fieldset class="form-group" v-if="!isLogin">
              <input
                v-model="username"
                class="form-control form-control-lg"
                type="text"
                placeholder="Your Name"
              />
            </fieldset>
            <fieldset class="form-group">
              <input
                v-model="email"
                class="form-control form-control-lg"
                type="email"
                placeholder="Email"
              />
            </fieldset>
            <fieldset class="form-group">
              <input
                v-model="password"
                :minlength="8"
                class="form-control form-control-lg"
                type="password"
                placeholder="Password"
              />
            </fieldset>
            <button
              class="btn btn-lg btn-primary pull-xs-right"
              :disabled="loading"
            >
              {{ isLogin ? "Sign in" : "Sign up" }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { regist, login } from "@/api/users"
import { mapMutations } from "vuex"
const Cookie = process.client ? require("js-cookie") : undefined
export default {
  data() {
    return {
      errors: {},
      username: "",
      email: "bjw2264@88.com",
      password: "abcd1234",
      loading: false,
    }
  },
  name: "LoginOrRegister",
  middleware: "noAuth",
  computed: {
    isLogin() {
      const { name } = this.$route
      return name === "login"
    },
    showErrors() {
      return Object.entries(this.errors)
        .map(([key, arr]) => arr.map(msg => `The ${key} ${msg}`))
        .reduce((acc, curr) => acc.concat(curr), [])
    },
  },
  methods: {
    ...mapMutations(["setUser"]),
    async handleSubmit(e) {
      const params = {
        // username: this.username,
        email: this.email,
        password: this.password,
      }
      try {
        this.loading = true
        let result = {}
        if (this.isLogin) {
          result = await login({ user: params })
        } else {
          params.username = this.username
          result = await regist({ user: params })
        }
        this.loading = false
        const {
          data: { user },
        } = result
        Cookie.set("user", user)
        this.setUser(user)
        this.$router.push("/")
      } catch (error) {
        this.loading = false
        const {
          response: { data },
        } = error
        this.errors = data.errors
      }
    },
  },
}
</script>
