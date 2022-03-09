function full() {
  // 全屏
  document.documentElement.requestFullscreen();
}
function exit() {
  // 退出全屏
  document.exitFullscreen();
}
export { full, exit };
