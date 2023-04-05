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

// tiffing算法
const patch = (n1, n2) => {
  if (n1.tag !== n2.tag) {
    const nlElparent = n1.el.parentElement;
    nlElparent.removeChild(n1.el);
    mount(n2, nlElparent);
  } else {
    // 去出element对象并在n2中进行保存
    const el = (n2.el = n1.el);

    // 处理props
    const oldProps = n1.props || {};
    const newProps = n2.props || {};

    // 获取所有的newprops添加到el中
    for (const key in newProps) {
      if (newProps.hasOwnProperty.call(newProps, key)) {
        const oldValue = oldProps[key];
        const newValue = newProps[key];
        if (newValue !== oldValue) {
          if (key.startsWith("on")) {
            el.addEventListener(key.slice(2).toLocaleLowerCase(), newValue);
          } else {
            el.setAttribute(key, newValue);
          }
        }
      }
    }
    //删除旧的props
    for (const key in oldProps) {
      if (key.startsWith("on")) {
        const value = oldProps[key];
        el.removeEventListener(key.slice(2).toLocaleLowerCase(), value);
      }
      if (!(key in newProps)) {
        el.removeAttribute(key);
      }
    }
  }
  // 处理children
  const oldChildren = n1.children;
  const newChildren = n2.children;
  if (typeof newChildren == "string") {
    // 边界判断（edge，case）
    if (typeof oldChildren == "string") {
      if (newChildren !== oldChildren) {
        el.textContent = newChildren;
      } else {
        el.innerHTML = newChildren;
      }
    } else {
      if (typeof oldChildren == "string") {
        el.innerHTML = "";
        newChildren.forEach((item) => {
          mount(item, el);
        });
      } else {
        // oldChildren:[v1.v2,v3]
        // newChildren:[v1,v2,v5,v8,v9]
        // 前面有相同节点的元素进行patch操作
        const commonLength = Math.min(oldChildren.length, newChildren.length);
        for (let i = 0; i < commonLength.length; i++) {
          patch(oldChildren[i], newChildren[i]);
        }

        // 新的children>oldchildren
        if (newChildren.length > oldChildren.length) {
          newChildren.slice(oldChildren.length).forEach((item) => {
            mount(item, el);
          });
        }

        // 新的children<oldchildren
        if (newChildren.length < oldChildren.length) {
          oldchildren.slice(newChildren.length).forEach((item) => {
            el.removeChild(item.el);
          });
        }
      }
    }
  }
};
