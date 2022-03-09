import { ComponentInternalInstance, getCurrentInstance } from "vue";
export default function useCurrentInstance() {
  const { appContext } = getCurrentInstance();
  const proxy = appContext.config.globalProperties;
  return {
    proxy,
  };
}
