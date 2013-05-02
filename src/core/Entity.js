this.BlueJS = this.BlueJS || {};

(function (app) {

    function Entity (core) {
        this.components = {};
        this.nodes = {};
        this.core = core;
        this.id = core.generateEntityId();
        this.bitComponents = new Bits();
    }
    
    Entity.prototype = {
        add: function (component) {
            var bit = this.core.componentTypeBit[component.type];

            this.bitComponents.set(bit);
            component.id = this.id;
            component.bit = new Bits();
            component.bit.set(bit);

            this.components[component.type] = component;

            for (var i = 0, len = this.core.nodeList.length; i < len; i++) {
                var bitComponentsCopy = this.bitComponents.clone(),
                    node = this.core.nodeList[i],
                    nodeBitMask = node.bitMask;

                bitComponentsCopy.and(nodeBitMask);

                if (bitComponentsCopy.equals(nodeBitMask)) {
                    this.nodes[node.type] = {};

                    for (var name in node) {
                        if (name !== "type" && name !== "bitMask") {
                            this.nodes[node.type][name] = this.components[node[name]];
                        }
                    }

                    this.nodes[node.type]["bitMask"] = nodeBitMask;        
                }
            }

            return this;
        },
        remove: function (type) {
            var typeBit = this.core.componentTypeBit[type],
                componentBitSet = new Bits();

            for (var i = 0, len = components.length; i < len; i++) {
                var component = components[i];

                componentBitSet.set(this.core.componentTypeBit[component.type]);

                if (componentBitSet.get(typeBit)) {
                    components.splice(i, 1);
                    break;
                }
            }

            this.bitComponents.clear(this.core.componentTypeBit[type]);

            return this;
        },
        getNode: function (type) {
            return this.nodes[type];
        }
    };

    app.Entity = Entity;
})(this.BlueJS);