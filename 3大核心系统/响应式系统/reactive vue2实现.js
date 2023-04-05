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

function reactive(raw) {
  Object.keys(raw).forEach((key) => {
    const dep = getDep(raw, key);
    let value = raw[key];
    Object.defineProperty(raw, key, {
      get() {
        dep.depend();
        return value;
      },
      set(newValue) {
        if (value !== newValue) {
          value = newValue;
          dep.notify();
        }
      },
    });
  });
  return raw;
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
