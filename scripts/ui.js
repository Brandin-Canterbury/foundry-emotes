class RollTableConfigurator extends FormApplication {
    constructor(object, options = {}) {
        super(object, options);
        this.actions = object.actions; // Preset or fetched actions
    }

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            id: "rolltable-configurator",
            title: "Roll Table Configurator",
            template: "templates/rolltable-configurator.html",
            classes: ["sheet"],
            width: 400
        });
    }

    getData() {
        return {
            actions: this.actions,
            rollTables: game.tables.entities.map(t => ({ id: t.id, name: t.name }))
        };
    }

    activateListeners(html) {
        super.activateListeners(html);
        html.find(".action-save").click(this._onSave.bind(this));
    }

    async _onSave(event) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget.form);
        // Logic to save roll table linkages to actions
    }
}

Hooks.once('ready', async () => {
    new RollTableConfigurator({actions: ["Attack", "Cast Spell", "Dodge"]}).render(true);
});