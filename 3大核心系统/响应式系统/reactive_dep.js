class Dep {
  constructor() {
    this.subscribers = new Set();
  }
  addEffect(effect) {
    this.subscribers.add(effect);
  }
  notify() {
    this.subscribers.forEach((effect) => {
      effect();
    });
  }
}

const dep = new Dep();
dep.name = "";

const info = {
  counter: 100,
};

function doubleClick() {
  console.log(info.counter * 2);
}

function powerCounter() {
  console.log(info.counter * info.counter);
}

dep.addEffect(doubleClick);
dep.addEffect(powerCounter);

info.counter++;
dep.notify();
