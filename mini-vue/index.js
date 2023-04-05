function createApp(rootComponent) {
  return {
    mount(selecter) {
      const container = document.querySelector(selecter);
      let isMounted = false;
      let oldVNode = null;

      watchEffect(() => {
        if (!isMounted) {
          oldVNode = rootComponent.render();
          mount(rootComponent.render(), container);
          isMounted = true;
        } else {
          const newVNode = rootComponent.render();
          patch(oldVNode, newVNodes);
          oldVNode = newVNode;
        }
      });
    },
  };
}
