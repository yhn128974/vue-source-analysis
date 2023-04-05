class Dep {
  constructor() {
    this.subscribers = new Set();
  }

  depend() {
    if (activeEffect) {
      this.subscribers.add(activeEffect);
    }
  }
  notify() {
    this.subscribers.forEach((effect) => {
      effect();
    });
  }
}

let activeEffect = null;

function watchEffect(effect) {
  activeEffect = effect;
  effect();
  activeEffect = null;
}

const targetMap = new WeakMap();
function getDep(target, key) {
  // 1.根据对象 target 取出对应的map对象
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }
  // 取出具体的dep对象
  let dep = depsMap.get(key);
  if (!dep) {
    dep = new Dep();
    depsMap.set(key, dep);
  }
  return dep;
}

// vue3对raw进行数据劫持
function reactive(raw) {
  return new Proxy(raw, {
    get(target, key) {
      const dep = new Dep(target, key);
      dep.depend();
      return target[key];
    },
    set(target, key, newValue) {
      const dep = getDep(target, key);
      target[key] = newValue;
      dep.notify();
    },
  });
}

const info = reactive({
  counter: 100,
  name: "longyou",
});
const foo = reactive({
  height: 1.88,
});

// watchEffect1
watchEffect(function () {
  console.log(info.counter * 2, info.name);
});
// watchEffect2
watchEffect(function () {
  console.log(info.counter * info.counter);
});
// watchEffect3
watchEffect(function () {
  console.log(info.counter + 10, info.name);
});

// watchEffect3
watchEffect(function () {
  console.log(foo.height);
});

info.counter++;
// info.name = "ethanyu";
