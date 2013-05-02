this.BlueJS = this.BlueJS || {};

(function (app) {
    var systems = new BlueJS.OrderedLinkedList(),
        //componentTypeBit = {},
        nextBit = 0,
        ids = [],
        entities = [],
        greatestId = 0,
        idsToReuse = [],
        nodeBitMask = {};

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
        /*
            components = [{
                name: "position",
                type: "Position"
            },
            {
                name: "motion",
                type: "Motion"
            }];
         */
        /*newCollection: function (name, components) {
            collections[name] = components;
        },
        getCollection: function (name) {
            var collection = collections[name];

            if (typeof collection === "undefined") {
                throw new Error("There is no such collection. Consider defining it.");
            }

            var matchedComponents = [];

            for (entityId in components) {
                var componentsArray = components[entityId];
            }
        },*/
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
            console.log(entities);
            return this;
        },
        removeEntity: function () {

        },
        addComponent: function (entity, component) {
            //this.removeComponent(entity, component.type);

            //ids.push(entity.id);
            components.push(component);

            return this;
        },
        removeComponent: function (entity, type) {
            for (var i = 0, len = components.length; i < len; i++) {
                if (components[i].id === entity.id && components[i].type === type) {
                    //ids.splice(i, 1);
                    components.splice(i, 1);
                    break;
                }
            }

            return this;
        },
        getNodes: function (type) {
            var nodes = [];

            for (var i = 0, len = entities.length; i < len; i++) {
                var entityBitMaskCopy = entities[i].bitComponents.clone();

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

                if (entities[i].bitComponents.test(this.componentTypeBit[type])) {
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
        /*getComponentsGroupedByEntity: function (array) {
            var componentGroups = {};

            for (var i = 0, compLen = components.length; i < compLen; i++) {
                var component = components[i];

                for (var j = 0, arrayLen = array.length; j < arrayLen; j++) {
                    if (component.type === array[j]) {
                        var id = component.id;
                        componentGroups[id] = componentGroups[id] || [];
                        componentGroups[id].push(component);
                    }
                }
            }

            for (var i in componentGroups) {
                if (componentGroups[i].length !== array.length) {
                    delete componentGroups[i];
                }
            }

            return componentGroups;
        },*/
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