<template>
  <div class="article-meta">
    <nuxt-link :to="`/profile/${article.author.username}`"
      ><img :src="article.author.image"
    /></nuxt-link>
    <div class="info">
      <nuxt-link :to="`/profile/${article.author.username}`" class="author">{{
        article.author.username
      }}</nuxt-link>
      <span class="date">{{ article.author.createdAt | date }}</span>
    </div>
    <template v-if="user && user.username === article.author.username">
      <nuxt-link
        class="btn btn-outline-secondary btn-sm"
        :to="`/editor/${article.slug}`"
      >
        <i class="ion-edit"></i> Edit Article
      </nuxt-link>
      <button
        class="btn btn-outline-danger btn-sm"
        @click="onDel"
        :disabled="deleteing"
      >
        <i class="ion-trash-a"></i> Delete Article
      </button>
    </template>
    <template v-else>
      <button
        class="btn btn-sm btn-outline-secondary"
        :disabled="disableFollow"
        @click="toggleFollow"
      >
        <i class="ion-plus-round"></i>
        &nbsp; {{ article.author.following ? "Unfollow" : "Follow" }}
        {{ article.author.username }}
      </button>
      &nbsp;&nbsp;
      <button
        :disabled="disableFav"
        class="btn btn-sm btn-outline-primary"
        :class="{ active: article.favorited }"
        @click="toggleLike"
      >
        <i class="ion-heart"></i>
        &nbsp; Favorite Post
        <span class="counter">({{ article.favoritesCount }})</span>
      </button>
    </template>
  </div>
</template>

<script>
import { mapState } from "vuex"
import { delArticle } from "@/api/articles"
export default {
  data() {
    return {
      deleteing: false,
    }
  },
  computed: {
    ...mapState(["user"]),
  },
  props: {
    article: {
      type: Object,
      required: true,
      default() {
        return {}
      },
    },
    disableFollow: {
      type: Boolean,
      required: true,
      default: false,
    },
    disableFav: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  methods: {
    toggleLike() {
      this.$emit("toggle-like")
    },
    toggleFollow() {
      this.$emit("toggle-follow")
    },
    async onDel() {
      this.deleteing = true
      await delArticle(this.article.slug)
      this.deleteing = false
      this.$router.push("/")
    },
  },
}
</script>
