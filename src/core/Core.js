this.BlueJS = this.BlueJS || {};

(function (app) {
    var systems = new BlueJS.OrderedLinkedList(),
        nextBit = 0,
        entities = [],
        greatestId = 0,
        idsToReuse = [];

    function Core (components, nodes) {
        this.componentTypeBit = {},
        this.nodeList = [],
        this.nodeBitMask = {};

        for (var i = 0, len = components.length; i < len; i++) {
            this.componentTypeBit[components[i]] = this.getNextTypeBit();
        }

        for (var node in nodes) {
            var nodeComponents = nodes[node],
                nodeBitMask = new Bits();

            for (var component in nodeComponents) {
                var componentType = nodeComponents[component];

                nodeBitMask.set(this.componentTypeBit[componentType]);
            }

            var newNode = nodeComponents;

            newNode.type = node;
            newNode.bitMask = nodeBitMask;

            this.nodeList.push(newNode);

            this.nodeBitMask[node] = nodeBitMask;
        }

        this.updating = false;
    }

    Core.prototype = {
        getNextTypeBit: function () {
            return nextBit++;
        },
        getComponentBitSet: function (type) {
            var bit = this.componentTypeBit[type],
                bitset = new Bits();

            if (typeof bit !== "undefined") {
                bitset.set(bit);
            }

            return bitset;
        },
        generateEntityId: function () {
            return idsToReuse.pop() || greatestId + 1;
        },
        addEntity: function (entity) {
            if (entities.indexOf(entity) !== -1) {
                throw new Error("You can't add same entity twice!");
                return;
            }

            if (entity.id > greatestId) {
                greatestId = entity.id;
            }

            entities.push(entity);
            return this;
        },
        removeEntity: function (entity) {
            for (var i = 0, len = entities.length; i < len; i++) {
                if (entities[i] === entity) {
                    entities.splice(i, 1);
                    return;
                }
            }

            return this;
        },
        getNodes: function (type) {
            var nodes = [];

            for (var i = 0, len = entities.length; i < len; i++) {
                var entityBitMaskCopy = entities[i].componentsBits.clone();

                entityBitMaskCopy.and(this.nodeBitMask[type]);

                if (entityBitMaskCopy.equals(this.nodeBitMask[type])) {
                    nodes.push(entities[i].getNode(type));
                }
            }

            return nodes;
        },
        getComponentsByType: function (type) {
            var matchedComponents = [];

            for (var i = 0, len = entities.length; i < len; i++) {

                if (entities[i].componentsBits.test(this.componentTypeBit[type])) {
                    matchedComponents.push(entities[i].components[type]);
                }
            }

            return matchedComponents;
        },
        getComponentsOfEntity: function (entity) {
            var matchedComponents = [],
                id = entity.id;

            for (var i = 0, len = components.length; i < len; i++) {
                if (components[i].id === id) {
                    matchedComponents.push(components[i]);
                }
            }

            return matchedComponents;
        },
        addSystem: function (system, priority) {
            system.core = this;
            systems.insert(system, priority);
            return this;
            //system.onAdd(this);
        },
        removeSystem: function (system) {
            for (var node = systems.head; node; node = node.next) {
                if (node.data === system) {
                    systems.remove(node);
                    system.onRemove();
                    break;
                }
            }
        },
        update: function (delta) {
            this.updating = true;

            for (var node = systems.head; node; node = node.next) {
                node.data.update(delta);
            }

            this.updating = false;

            for (var node = systems.head; node; node = node.next) {
                node.data.afterUpdate();
            }
        }
    };

    app.Core = Core;
})(this.BlueJS);