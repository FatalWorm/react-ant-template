(function () {
  try {
    var item = localStorage.getItem('theme-mode');
    var isDark = true; // по умолчанию темная тема, как в сторе
    if (item) {
      var parsed = JSON.parse(item);
      if (parsed.state && parsed.state.mode === 'light') {
        isDark = false;
      }
    }
    var bg = isDark ? '#141414' : '#f5f5f5';
    document.documentElement.style.backgroundColor = bg;
    document.documentElement.style.setProperty('--ant-color-bg-layout', bg);
  } catch (e) {}
})();
