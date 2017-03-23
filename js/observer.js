/**
 * 需要observe的数据对象进行递归遍历，包括子属性对象的属性，都加上 setter和getter
 * 这样的话，给这个对象的某个值赋值，就会触发setter，那么就能监听到了数据变化。
 */

function Observer(data) {
  this.data = data;
  this.walk(data);
}

Observer.prototype = {
  walk: function(data) {
    var me = this;
    Object.keys(data).forEach(function(key) {
      me.convert(key, data[key]);
    });
  },
  convert: function(key, val) {
    this.defineReactive(this.data, key, val);
  },

  defineReactive: function(data, key, val) {
    var dep = new Dep();
    var childObj = observe(val);

    Object.defineProperty(data, key, {
      enumerable: true, // 可枚举
      configurable: false, // 不能再define
      get: function() {
        if (Dep.target) {
          dep.depend();
        }
        return val;
      },
      set: function(newVal) {
        if (newVal === val) {
          return;
        }
        val = newVal;
        // 新的值是object的话，进行监听
        childObj = observe(newVal);
        // 通知订阅者
        dep.notify();
      }
    });
  }
};

function observe(value, vm) {
  if (!value || typeof value !== 'object') {
    return;
  }

  return new Observer(value);
};


var uid = 0;

function Dep() {
  this.id = uid++;
  this.subs = [];
}

Dep.prototype = {
  addSub: function(sub) {
    this.subs.push(sub);
  },

  depend: function() {
    Dep.target.addDep(this);
  },

  removeSub: function(sub) {
    var index = this.subs.indexOf(sub);
    if (index != -1) {
      this.subs.splice(index, 1);
    }
  },

  notify: function() {
    this.subs.forEach(function(sub) {
      sub.update();
    });
  }
};

Dep.target = null;