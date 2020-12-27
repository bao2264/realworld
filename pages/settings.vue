<template>
  <div class="settings-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Your Settings</h1>

          <form @submit.prevent="onUpdate">
            <fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control"
                  type="text"
                  placeholder="URL of profile picture"
                  v-model="user.image"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  type="text"
                  placeholder="Your Name"
                  v-model="user.username"
                />
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  class="form-control form-control-lg"
                  rows="8"
                  placeholder="Short bio about you"
                  v-model="user.bio"
                ></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  type="text"
                  placeholder="Email"
                  v-model="user.email"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  type="password"
                  placeholder="Password"
                />
              </fieldset>
              <button
                class="btn btn-lg btn-primary pull-xs-right"
                :disabled="loading"
              >
                Update Settings
              </button>
            </fieldset>
          </form>
          <hr />
          <button class="btn btn-outline-danger" @click="logout">
            Or click here to logout.
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from "vuex"
import { update } from "@/api/users"
const Cookie = process.client ? require("js-cookie") : undefined

export default {
  data() {
    return {
      loading: false,
      user: Object.assign({}, this.$store.state.user),
    }
  },
  middleware: "auth",
  methods: {
    ...mapMutations(["setUser"]),
    logout() {
      Cookie.remove("user")
      this.setUser(null)
      this.$router.push("/")
    },
    async onUpdate() {
      const arr = ["email", "username", "image", "password", "bio"]
      const params = {}
      arr.forEach(field => {
        if (this.user[field] !== this.$store.state.user[field]) {
          params[field] = this.user[field]
        }
      })
      this.loading = true
      try {
        const result = await update({ user: params })
        this.loading = false
        const { user } = result.data
        Cookie.set("user", user)
        this.setUser(user)
      } catch (error) {
        this.loading = false
      }
    },
  },
}
</script>
