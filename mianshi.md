- mutationObserver
  - 什么是？观察 dom 的 api
  - 应用？ 模拟 promise、计算首屏时间、利用 canvas 做水印，防止被修改。
- promise

  - api

    - any all allSettled race reject resolve then finally catch
    - all
    - 是什么？返回全部成功期约数组或第一个失败的期约
    - 场景：大文件的切片上传、
    - 不管 all 是否失败，我都要拿到全部的结果
      - allSettled [es2020]
      - 自己?
      ```js
      var arr = [];
      promise.all(
        arr.map((v) => {
          return v.catch((v) => {
            console.log(v);
          });
        })
      );
      ```
    - all 源码看过吗？

      ```js
      function myPromiseAll(arr) {
        let resolveARR = [];
        return new Promise((resolve,reject)=>{

        }
         arr.map((p) => {
          p.then(
            (val) =>
              resolveARR.push(val);
              if (resolveARR.length == arr.length) {
                resolve(resolveARR);
              }
            },
            (e) => reject(e)
          );
        });
      }
      ```

- web worker?
- 是什么？
- 应用？
- 注意点？
- api？

- http
- http1.0 and 1.2 区别？
- 第几层
- 缓存的类型？
- 协商
  - 关键字
  - 流程
- 强~

  - 关键字
  - 流程

- tcp
- 网络第几层
- 三次、四次
- upd 区别

- websocket
- spa 切换页面如何关闭 websocket
