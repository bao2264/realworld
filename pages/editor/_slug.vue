<template>
  <div class="editor-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-10 offset-md-1 col-xs-12">
          <ul class="error-messages" v-if="errors">
            <div>
              <li
                class="ng-binding ng-scope"
                v-for="err in errorList"
                :key="err"
              >
                {{ err }}
              </li>
            </div>
          </ul>
          <form @submit.prevent="onSubmit">
            <fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control form-control-lg"
                  placeholder="Article Title"
                  v-model="title"
                  minlength="1"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control"
                  placeholder="What's this article about?"
                  v-model="description"
                  minlength="1"
                />
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  class="form-control"
                  rows="8"
                  placeholder="Write your article (in markdown)"
                  v-model="body"
                ></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control"
                  placeholder="Enter tags (use space splite)"
                  v-model="tagList"
                />
                <div class="tag-list"></div>
              </fieldset>
              <button
                class="btn btn-lg pull-xs-right btn-primary"
                :disabled="loading"
              >
                Publish Article
              </button>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { addArticle, editArticle, getArticle } from "@/api/articles"
export default {
  middleware: "auth",
  data() {
    return {
      title: "",
      description: "",
      body: "",
      tagList: "",
      loading: false,
      errors: null,
      article: null,
    }
  },
  async mounted() {
    const { params } = this.$route
    if (params.slug) {
      const { data } = await getArticle(params.slug)
      const { title, description, body, tagList } = data.article
      this.title = title
      this.description = description
      this.body = body
      this.tagList = tagList.join(" ")
      this.article = data.article
      // return {
      //   title,
      //   description,
      //   body,
      //   tagList: tagList.join(" "),
      // }
    }
  },
  computed: {
    errorList() {
      return !this.errors
        ? []
        : Object.entries(this.errors)
            .map(([key, val]) => val.map(tip => `The ${key} ${tip}`))
            .reduce((acc, curr) => acc.concat(curr), [])
    },
  },
  methods: {
    async onSubmit() {
      const arr = ["title", "description", "body", "tagList"]
      const { slug } = this.$route.params
      let params
      if (slug) {
        // 修改
        params = {}
        arr.forEach(v => {
          if (this[v] !== this.article[v]) {
            params[v] = this[v]
          }
        })
      } else {
        // 添加
        params = {
          title: this.title,
          description: this.description,
          body: this.body,
        }
        if (this.tagList.trim()) {
          params.tagList = this.tagList.split(" ")
        }
      }
      try {
        this.loading = true
        const { data } = slug
          ? await editArticle(slug, { article: params })
          : await addArticle({ article: params })
        this.loading = false
        arr.forEach(v => {
          this[v] = ""
        })
        this.errors = null
        this.$router.push(`/article/${data.article.slug}`)
      } catch (error) {
        this.loading = false
        // console.dir(error)
        const { errors } = error.response.data
        this.errors = errors
      }
    },
  },
}
</script>
