import render from "./render";

const zip = (xs, ys) => {
    const zipped = [];
    for (let i = 0; i < Math.max(xs.length, ys.length); i++) {
        zipped.push([xs[i], ys[i]])
    }
    return zipped;
}

const diffAttrs = (oldAttrs, newAttrs) => {
    const patches = []
    // set new attr
    for (const [k, v] of Object.entries(newAttrs)) {
        patches.push($node => {
            $node.setAttribute(k, v);
            return $node
        })
    }

    // remove old attrs,
    for (const [k, v] of Object.entries(oldAttrs)) {
        if (!(k in newAttrs)) {
            patches.push($node => {
                $node.removeAttribute(k);
                return $node;
            })
        }
    }

    return $node => {
        for (const patch of patches) {
            patch($node);
        }
    }
};

const diffChildren = (oldChildren, newChildren) => {
    const childPatches = [];

    for (const [ oldVChild, newVChild ] of zip(oldChildren, newChildren)) {
        childPatches.push(diff(oldVChild, newVChild));
    }

    const addtionalPatches = [];
    for(const addtionalVChild of newChildren.slice(oldChildren.length)){
        addtionalPatches.push($node=>{
            $node.appendChild(render(addtionalVChild));
            return $node;
        }) 
    }

    return $parent => {
        for (const [patch, child] of zip(childPatches, $parent.childNodes)) {
            patch(child);
        }
        for(const patch of addtionalPatches){
            patch($parent)
        }
        return $parent;
    }
}

const diff = (vOldNode, vNewNode) => {
    if (vNewNode === undefined) {
        return $node => {
            $node.remove();
            return undefined;
        }
    }

    if (typeof vOldNode === 'string' || typeof vNewNode === 'string') {
        if (vOldNode !== vNewNode) {
            return $node => {
                const $newNode = render(vNewNode);
                $node.replaceWith($newNode);
                return $newNode;
            }
        }
        else {
            return $node => undefined;
        }
    }

    if (vOldNode.tagName !== vNewNode.tagName) {
        return $node => {
            const $newNode = render(vNewNode);
            $node.replaceWith($newNode);
            return $newNode;
        }
    };

    const patchAttrs = diffAttrs(vOldNode.attrs, vNewNode.attrs);
    const patchChildren = diffChildren(vOldNode.children, vNewNode.children);


    return $node => {
        patchAttrs($node);
        patchChildren($node);
        return $node;
    };
};

export default diff;