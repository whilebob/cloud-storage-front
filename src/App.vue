<template>
  <router-view></router-view>
</template>

<script>
</script>

<style>
/* 全局样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* 锁定浏览器缩放为100% */
html {
  zoom: 100%;
  -moz-transform: scale(1);
  -moz-transform-origin: 0 0;
  -o-transform: scale(1);
  -o-transform-origin: 0 0;
  -webkit-transform: scale(1);
  -webkit-transform-origin: 0 0;
  transform: scale(1);
  transform-origin: 0 0;
}

/* 禁用用户缩放 */
html {
  touch-action: manipulation;
}

html,
body {
  height: 100%;
  width: 100%;
  overflow: hidden;
  font-family: Arial, sans-serif;
}

/* 应用容器样式 */
#app {
  height: 100%;
  width: 100%;
  background-color: #1a1a1a;
  color: #ffffff;
}
</style>
