<template>
  <div class="home-page">
    <div class="banner">
      <div class="container">
        <h1 class="logo-font">Lagou</h1>
        <p>A place to study knowledge.</p>
      </div>
    </div>

    <div class="container page">
      <div class="row">
        <div class="col-md-9">
          <div class="feed-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item" v-if="user">
                <a
                  class="nav-link"
                  :class="{ active: selectedTag === 'your' }"
                  href=""
                  @click.prevent="changeDefaultTab('your')"
                  >Your Feed</a
                >
              </li>
              <li class="nav-item">
                <a
                  class="nav-link"
                  :class="{ active: selectedTag === 'global' }"
                  href=""
                  @click.prevent="changeDefaultTab('global')"
                  >Global Feed</a
                >
              </li>
              <li class="nav-item" v-if="showTagTab">
                <span class="nav-link active">#{{ selectedTag }}</span>
              </li>
            </ul>
          </div>

          <template v-if="articles.length">
            <article-item
              v-for="item in articles"
              :item="item"
              :key="item.slug"
            />
          </template>

          <div class="article-preview" v-if="loading">
            Loading articles...
          </div>

          <div class="article-preview" v-if="!articles.length && !loading">
            No articles are here... yet.
          </div>

          <nav>
            <ul class="pagination">
              <li
                class="page-item"
                :class="{ active: curr === page }"
                v-for="page in Math.ceil(articlesCount / limit)"
                :key="page"
              >
                <span
                  class="page-link"
                  style="cursor: pointer;"
                  @click="
                    onPageChange(page, showTagTab ? selectedTag : undefined)
                  "
                  >{{ page }}</span
                >
              </li>
            </ul>
          </nav>
        </div>

        <div class="col-md-3">
          <div class="sidebar">
            <p>Popular Tags</p>

            <div class="tag-list">
              <a
                href=""
                class="tag-pill tag-default"
                v-for="(tag, index) in tags"
                :key="index"
                @click.prevent="onTagChange(tag)"
                >{{ tag }}</a
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex"
import { getList, getTags, getFeed, like, unlike } from "@/api/articles"
export default {
  data() {
    return {
      curr: 1,
      limit: 10,
      loading: false,
      selectedTag: "global",
      articlesCount: 0,
      articles: [],
      tags: [],
    }
  },
  computed: {
    ...mapState(["user"]),
    showTagTab() {
      return (
        this.selectedTag != null &&
        this.selectedTag !== "your" &&
        this.selectedTag !== "global"
      )
    },
  },
  async asyncData() {
    const [article, tag] = await Promise.all([
      getList({ limit: 10, offset: 0 }),
      getTags(),
    ])

    const { articles, articlesCount } = article.data
    const { tags } = tag.data
    return {
      articles: articles.map(v => ({ ...v, liking: false })),
      articlesCount,
      tags,
    }
  },
  methods: {
    async onPageChange(page, tag, isFeed) {
      if (this.loading) return
      this.loading = true
      const params = {
        limit: this.limit,
        offset: (page - 1) * this.limit,
      }
      if (tag != undefined) {
        params.tag = tag
      }
      const { data } = isFeed ? await getFeed(params) : await getList(params)
      const { articles, articlesCount } = data
      this.loading = false
      this.curr = page
      this.articlesCount = articlesCount
      this.articles = articles.map(v => ({ ...v, liking: false }))
    },
    async onTagChange(tag) {
      this.articles = []
      this.articlesCount = 0
      this.selectedTag = tag
      await this.onPageChange(1, tag)
    },
    async changeDefaultTab(flag) {
      this.articles = []
      this.articlesCount = 0
      this.selectedTag = flag
      await this.onPageChange(1, undefined, flag === "your")
    },
  },
}
</script>
