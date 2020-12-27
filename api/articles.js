import request from "@/utils/request"

export const getList = params => request.get("/api/articles", { params })

export const getFeed = params => request.get("/api/articles/feed", { params })

export const getTags = () => request.get("/api/tags")

export const like = slug => request.post(`/api/articles/${slug}/favorite`)

export const unlike = slug => request.delete(`/api/articles/${slug}/favorite`)

export const getArticle = slug => request.get(`/api/articles/${slug}`)

export const getComments = slug => request.get(`/api/articles/${slug}/comments`)

export const delComment = (slug, commentId) =>
  request.delete(`/api/articles/${slug}/comments/${commentId}`)

export const addComment = (slug, params) =>
  request.post(`/api/articles/${slug}/comments`, params)

export const addArticle = params => request.post("/api/articles", params)

export const editArticle = (slug, params) =>
  request.put(`/api/articles/${slug}`, params)

export const delArticle = slug => request.delete(`/api/articles/${slug}`)
