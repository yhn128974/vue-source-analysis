const h = (tag, props, children) => {
  return {
    tag,
    props,
    children,
  };
};

const mount = (vnode, container) => {
  // vnode->element
  // 创建出真实的元素，并且在vnode上保留el
  const el = (vnode.el = document.createElement(vnode.tag));
  // 处理props
  if (vnode.props) {
    for (const key in vnode.props) {
      const value = vnode.props[key];
      if (vnode.props.hasOwnProperty.call(vnode.props, key)) {
        if (key.startsWith("on")) {
          el.addEventListener(key.slice(2).toLocaleLowerCase(), value);
        } else {
          el.setAttribute(key, value);
        }
      }
    }
  }

  // 处理children
  if (vnode.children) {
    if (typeof vnode.children === "string") {
      el.textContent = vnode.children;
    }
  } else {
    vnode.children.forEach((item) => {
      mount(item, el);
    });
  }

  // 将el挂载到container中
  container.appendChild(el);
};
