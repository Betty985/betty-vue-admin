/*
 * 环境变量封装
 */
const env = "development";

const EnvConfig = {
  development: {
    baseApi: "/api",
    mockApi:
      "https://www.fastmock.site/mock/c1c302e8baed9894c48c17e4738c092e/api",
  },
  test: {
    baseApi: "/api",
    mockApi:
      "https://www.fastmock.site/mock/c1c302e8baed9894c48c17e4738c092e/api",
  },
  prod: {
    baseApi: "/api",
    mockApi:
      "https://www.fastmock.site/mock/c1c302e8baed9894c48c17e4738c092e/api",
  },
};
export default {
  namespace: "manager",
  env: "development",
  mock: false,
  ...EnvConfig[env],
};
