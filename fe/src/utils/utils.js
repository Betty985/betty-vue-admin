/***
 * 工具函数封装
 */
export default {
  formatDate(date, rule) {
    let fmt = rule || "yyyy-MM-dd hh:mm:ss";
    // 年份是四位的要单独处理
    if (/y+/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, date.getFullYear());
    }
    const o = {
      "M+": date.getMonth() + 1,
      "d+": date.getDate(),
      "h+": date.getHours(),
      "m+": date.getMinutes(),
      "s+": date.getSeconds(),
    };
    for (let k in o) {
      // 动态正则需要new RegExp
      if (new RegExp(`(${k})`).test(fmt)) {
        // 变成字符串防止数字相加
        const val = o[k] + "";
        let item = new RegExp(`(${k})`).exec(fmt)[0];
        // 不足两位的前面补0
        fmt = fmt.replace(
          item,
          item.length == 1 ? val : ("00" + val).substring(val.length)
        );
      }
      return fmt;
    }
  },
  generateRoute(menuList) {
    let routes = [];
    const deepList = (list) => {
      while (list.length) {
        let item = list.pop();
        if (item.action) {
          routes.push({
            name: item.component,
            path: item.path,
            meta: {
              title: item.menuName,
            },
            component: item.component,
          });
        }
        if (item.children && !item.action) {
          routes.push({
            name: item.component,
            path: item.path,
            meta: {
              title: item.menuName,
            },
            component: item.component,
          });
          deepList(item.children);
        }
      }
    };
    deepList(menuList);
    return routes;
  },
};