<template>
  <div class="article-page">
    <div class="banner">
      <div class="container">
        <h1>{{ article.title }}</h1>
        <Author
          :article="article"
          :disable-fav="disableFav"
          :disable-follow="disableFollow"
          @toggle-like="toggleLike"
          @toggle-follow="toggleFollow"
        />
      </div>
    </div>

    <div class="container page">
      <div class="row article-content">
        <div class="col-md-12" v-html="article.body"></div>
      </div>

      <hr />

      <div class="article-actions">
        <Author
          :article="article"
          :disable-fav="disableFav"
          :disable-follow="disableFollow"
          @toggle-like="toggleLike"
          @toggle-follow="toggleFollow"
        />
      </div>

      <div class="row">
        <div class="col-xs-12 col-md-8 offset-md-2">
          <form class="card comment-form" v-if="user">
            <div class="card-block">
              <textarea
                class="form-control"
                placeholder="Write a comment..."
                rows="3"
                v-model="content"
              ></textarea>
            </div>
            <div class="card-footer">
              <img :src="user.image" class="comment-author-img" />
              <button
                class="btn btn-sm btn-primary"
                :disabled="submiting"
                @click="onAddComment"
              >
                Post Comment
              </button>
            </div>
          </form>
          <p show-authed="false" style="display: inherit;" v-else>
            <nuxt-link to="/login">Sign in</nuxt-link> or
            <nuxt-link to="/register">sign up</nuxt-link> to add comments on
            this article.
          </p>

          <div class="card" v-for="comment in comments" :key="comment.id">
            <div class="card-block">
              <p class="card-text">{{ comment.body }}</p>
            </div>
            <div class="card-footer">
              <nuxt-link
                :to="`/profile/${comment.author.username}`"
                class="comment-author"
              >
                <img :src="comment.author.image" class="comment-author-img" />
              </nuxt-link>
              &nbsp;
              <nuxt-link
                :to="`/profile/${comment.author.username}`"
                class="comment-author"
                >{{ comment.author.username }}</nuxt-link
              >
              <span class="date-posted">{{ comment.createdAt | date }}</span>
              <span class="mod-options">
                <!-- <i class="ion-edit"></i> -->
                <i
                  class="ion-trash-a"
                  v-if="user && user.username === comment.author.username"
                  @click="onDelComment(comment.id)"
                ></i>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MarkdownIt from "markdown-it"
import {
  getArticle,
  getComments,
  like,
  unlike,
  delComment,
  addComment,
} from "@/api/articles"
import { follow, unFollow } from "@/api/users"
import { mapState } from "vuex"
export default {
  head() {
    // 配置个性化meta
    return {
      title: `${this.article.title} - RealWorld`,
      meta: [
        {
          hid: "description",
          name: "description",
          content: this.article.description,
        },
      ],
    }
  },
  data() {
    return {
      article: {},
      comments: [],
      disableFav: false,
      disableFollow: false,
      content: null,
      submiting: false,
    }
  },
  computed: {
    ...mapState(["user"]),
  },
  async asyncData({ params }) {
    const { slug } = params
    const [detail, commentsList] = await Promise.all([
      getArticle(slug),
      getComments(slug),
    ])
    const { article } = detail.data
    const { comments } = commentsList.data
    const md = new MarkdownIt()
    return {
      article: { ...article, body: md.render(article.body) },
      comments,
    }
  },
  methods: {
    async toggleLike() {
      this.disableFav = true
      const { favorited, slug } = this.article
      const { data } = favorited ? await unlike(slug) : await like(slug)
      this.article.favorited = data.article.favorited
      this.article.favoritesCount = data.article.favoritesCount
      this.disableFav = false
    },
    async toggleFollow() {
      this.disableFollow = true
      const { following, username } = this.article.author
      const { data } = following
        ? await unFollow(username)
        : await follow(username)
      this.article.author = data.profile
      this.disableFollow = false
    },
    async onDelComment(commentId) {
      const { slug } = this.article
      const { data } = await delComment(slug, commentId)
      this.comments = this.comments.filter(v => v.id !== commentId)
    },
    async onAddComment() {
      if (!this.content) return
      this.submiting = true
      const { slug } = this.article
      const { data } = await addComment(slug, {
        comment: { body: this.content },
      })
      this.content = null
      this.comments.push(data.comment)
      this.submiting = false
    },
  },
}
</script>
