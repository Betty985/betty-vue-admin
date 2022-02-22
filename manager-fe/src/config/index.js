/*
 * 环境变量封装
 */
const env = import.meta.env || "prod";
const EnvConfig = {
  dev: {
    baseApi: "/api",
    mockApi:
      "https://www.fastmock.site/mock/bcd4a7cd3d1a34b40a72834be02ef012/api",
  },
  test: {
    baseApi: "/",
    mockApi:
      "https://www.fastmock.site/mock/bcd4a7cd3d1a34b40a72834be02ef012/api",
  },
  prod: {
    baseApi: "/",
    mockApi: "",
  },
};

export default {
  namespace: "manager",
  env,
  mock: false,
  ...EnvConfig[env],
};
