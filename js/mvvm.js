/**
 * MVVM作为数据绑定的入口，整合Observer、Compile和Watcher三者，
 * 通过Observer来监听自己的model数据变化，通过Compile来解析编译模板指令，
 * 最终利用Watcher搭起Observer和Compile之间的通信桥梁，
 * 达到数据变化 -> 视图更新；视图交互变化(input) -> 数据model变更的双向绑定效果。
 */

function MVVM(options) {
  this.$options = options;
  var data = this._data = this.$options.data;
  var me = this;

  // 数据代理
  // 实现 vm.xxx -> vm._data.xxx
  Object.keys(data).forEach(function(key) {
    me._proxy(key);
  });

  observe(data, this);

  this.$compile = new Compile(options.el || document.body, this)
}

MVVM.prototype = {
  $watch: function(key, cb, options) {
    new Watcher(this, key, cb);
  },

  _proxy: function(key) {
    var me = this;
    Object.defineProperty(me, key, {
      configurable: false,
      enumerable: true,
      get: function proxyGetter() {
        return me._data[key];
      },
      set: function proxySetter(newVal) {
        me._data[key] = newVal;
      }
    });
  }
};