<template>
  <div class="profile-page">
    <div class="user-info">
      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-md-10 offset-md-1">
            <img :src="profile.image" class="user-img" />
            <h4>{{ profile.username }}</h4>
            <p>{{ profile.bio }}</p>
            <nuxt-link
              class="btn btn-sm btn-outline-secondary action-btn"
              to="/settings"
              v-if="user && user.username === profile.username"
            >
              <i class="ion-gear-a"></i> Edit Profile Settings
            </nuxt-link>
            <button
              v-else
              class="btn btn-sm btn-outline-secondary action-btn"
              @click="toggleFollow"
              :disabled="disabledFollow"
            >
              <i class="ion-plus-round"></i>
              &nbsp; {{ profile.following ? "Unfollow" : "Follow" }}
              {{ profile.username }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="row">
        <div class="col-xs-12 col-md-10 offset-md-1">
          <div class="articles-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item">
                <a
                  class="nav-link"
                  :class="{ active: currtab === 'my' }"
                  href=""
                  @click.prevent="changeTab('my')"
                  >My Articles</a
                >
              </li>
              <li class="nav-item">
                <a
                  class="nav-link"
                  :class="{ active: currtab === 'fav' }"
                  href=""
                  @click.prevent="changeTab('fav')"
                  >Favorited Articles</a
                >
              </li>
            </ul>
          </div>

          <template v-if="myList.length">
            <article-item
              v-for="item in myList"
              :key="item.slug"
              :item="item"
            />
          </template>

          <div class="article-preview" v-if="loading">
            Loading articles...
          </div>

          <div class="article-preview" v-if="!myList.length && !loading">
            No articles are here... yet.
          </div>

          <nav>
            <ul class="pagination">
              <li
                class="page-item"
                :class="{ active: curr === page }"
                v-for="page in Math.ceil(myListCount / limit)"
                :key="page"
              >
                <a
                  class="page-link"
                  href=""
                  @click.prevent="onPageChange(page)"
                  >{{ page }}</a
                >
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getProfile, follow, unFollow } from "@/api/users"
import { getList } from "@/api/articles"
import ArticleItem from "../../../components/ArticleItem.vue"
import { mapState } from "vuex"
export default {
  components: { ArticleItem },
  middleware: "",
  data() {
    return {
      profile: {},
      myList: [],
      myListCount: 0,
      limit: 5,
      curr: 1,
      loading: false,
      currtab: "my",
      disabledFollow: false,
    }
  },
  computed: {
    ...mapState(["user"]),
  },
  async asyncData({ params }) {
    const { username } = params
    const [info, list] = await Promise.all([
      getProfile(username),
      getList({ limit: 5, offset: 0, author: username }),
    ])

    const { profile } = info.data
    const { articles, articlesCount } = list.data
    return {
      profile,
      myList: articles.map(v => ({ ...v, liking: false })),
      myListCount: articlesCount,
    }
  },
  methods: {
    async onPageChange(page, isAuthor = true) {
      const { username } = this.profile
      const params = {
        limit: this.limit,
        offset: this.limit * (page - 1),
        // author: username,
      }
      if (isAuthor) {
        params.author = username
      } else {
        params.favorited = username
      }
      this.loading = true
      const { data } = await getList(params)
      this.loading = false
      this.curr = page
      this.myList = data.articles.map(v => ({ ...v, liking: false }))
      this.myListCount = data.articlesCount
    },
    async changeTab(tab) {
      if (tab === this.currtab) return
      this.myListCount = 0
      this.myList = []
      await this.onPageChange(1, tab === "my")
      this.currtab = tab
    },
    async toggleFollow() {
      const { following, username } = this.profile
      this.disabledFollow = true
      const { data } = following
        ? await unFollow(username)
        : await follow(username)
      this.profile = data.profile
      this.disabledFollow = false
    },
  },
}
</script>
