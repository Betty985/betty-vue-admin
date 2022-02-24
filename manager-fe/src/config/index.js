/*
 * 环境变量封装
 */
const env = import.meta.env || "prod";
const EnvConfig = {
  dev: {
    baseApi: "/api",
    mockApi:
      "https://www.fastmock.site/mock/c1c302e8baed9894c48c17e4738c092e/api",
  },
  test: {
    baseApi: "//test.futurefe.com/api",
    mockApi:
      "https://www.fastmock.site/mock/c1c302e8baed9894c48c17e4738c092e/api",
  },
  prod: {
    baseApi: "//futurefe.com/api",
    mockApi:
      "https://www.fastmock.site/mock/c1c302e8baed9894c48c17e4738c092e/api",
  },
};

export default {
  namespace: "manager",
  env,
  mock: false,
  ...EnvConfig[env],
};
