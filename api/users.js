import request from "../utils/request"

export const regist = params => request.post("/api/users", params)

export const login = params => request.post("/api/users/login", params)

export const update = params => request.put("/api/user", params)

export const getProfile = username => request.get(`/api/profiles/${username}`)

export const follow = username =>
  request.post(`/api/profiles/${username}/follow`)

export const unFollow = username =>
  request.delete(`/api/profiles/${username}/follow`)
