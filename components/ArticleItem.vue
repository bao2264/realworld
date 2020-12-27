<template>
  <div class="article-preview">
    <div class="article-meta">
      <nuxt-link :to="`/profile/${item.author.username}`"
        ><img :src="item.author.image"
      /></nuxt-link>
      <div class="info">
        <nuxt-link :to="`/profile/${item.author.username}`" class="author">{{
          item.author.username
        }}</nuxt-link>
        <span class="date">{{ item.createdAt | date }}</span>
      </div>
      <button
        class="btn btn-outline-primary btn-sm pull-xs-right"
        :class="{ active: item.favorited }"
        @click="toggleLike(item)"
        :disabled="item.liking"
      >
        <i class="ion-heart"></i> {{ item.favoritesCount }}
      </button>
    </div>
    <nuxt-link :to="`/article/${item.slug}`" class="preview-link">
      <h1>{{ item.title }}</h1>
      <p>{{ item.description }}</p>
      <span>Read more...</span>
      <ul class="tag-list">
        <li
          class="tag-default tag-pill tag-outline"
          v-for="(tag, idx) in item.tagList"
          :key="idx"
        >
          {{ tag }}
        </li>
      </ul>
    </nuxt-link>
  </div>
</template>

<script>
import { like, unlike } from "@/api/articles"
export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  methods: {
    async toggleLike(item) {
      item.liking = true
      const { data } = item.favorited
        ? await unlike(item.slug)
        : await like(item.slug)
      item.liking = false
      const { favorited, favoritesCount } = data.article
      item.favorited = favorited
      item.favoritesCount = favoritesCount
    },
  },
}
</script>
