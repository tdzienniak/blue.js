this.BlueJS = this.BlueJS || {};

(function (app) {
    function Entity (core) {
        this.core = core;
        this.id = core.generateEntityId();
    }
    
    Entity.prototype = {
        addComponent: function (component) {
            component.id = this.id;
            this.core.addComponent(this, component);
            return this;
        },
        removeComponent: function (component) {
            this.core.removeComponent(this, component.type);
            return this;
        }
    };

    app.Entity = Entity;
})(this.BlueJS);