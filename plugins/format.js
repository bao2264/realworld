import Vue from "vue"

import dayjs from "dayjs"

Vue.filter("date", (time, format = "MMMM DD, YYYY") =>
  dayjs(time).format(format),
)
