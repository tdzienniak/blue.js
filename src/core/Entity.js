this.BlueJS = this.BlueJS || {};

(function (app) {
    function Entity (core) {
        this.components = {};
        this.nodes = {};
        this.core = core;
        this.id = core.generateEntityId();
        this.componentsBits = new Bits();
    }
    
    Entity.prototype = {
        add: function (component) {
            var bit = this.core.componentTypeBit[component.type];

            if (this.componentsBits.test(bit)) {
                /*there already exists such component*/
                return this;
            }

            this.componentsBits.set(bit);

            component.of = this;
            component.bit = new Bits();
            component.bit.set(bit);
            this.components[component.type] = component;

            for (var i = 0, len = this.core.nodeList.length; i < len; i++) {
                var componentsBitsCopy = this.componentsBits.clone(),
                    node = this.core.nodeList[i],
                    nodeBitMask = node.bitMask;

                componentsBitsCopy.and(nodeBitMask);

                if (componentsBitsCopy.equals(nodeBitMask)) {
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
            if (typeof this.components[type] === "undefined") {
                /*no need to remove*/
                return this;
            }

            var bit = this.core.componentTypeBit[type];

            for (var node in this.nodes) {
                if (this.nodes[node].bitMask.test(bit)) {
                    delete this.nodes[node];
                }
            }

            delete this.components[type];

            return this;
        },
        getNode: function (type) {
            return this.nodes[type];
        }
    };

    app.Entity = Entity;
})(this.BlueJS);