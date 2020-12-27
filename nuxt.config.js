export default {
  components: true, // 组件自动导入
  router: {
    linkActiveClass: "active",
    extendRoutes(routes, resolve) {
      routes.push({
        path: "/register",
        name: "register",
        component: resolve(__dirname, "pages/login"),
      })
    },
  },
  plugins: ["~/plugins/req.js", "~/plugins/format.js"],
  server: {
    host: "0.0.0.0",
    port: 8000,
  },
}
