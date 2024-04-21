class ActionSequenceConfig extends FormApplication {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            id: 'action-sequence-config',
            title: 'Action Sequence Configuration',
            template: 'modules/action-sequence/templates/settings.html',
            classes: ['action-sequence'],
            width: 500,
            closeOnSubmit: true
        });
    }

    getData() {
        // Fetch the current settings data to populate the form
        const settingsData = game.settings.get('action-sequence', 'settingsData');
        return {
            globalDelay: settingsData.globalDelay,
            actions: settingsData.actions
        };
    }

    activateListeners(html) {
        super.activateListeners(html);
        html.find('#add-action').click(this._onAddAction.bind(this));
        html.on('click', '.edit-action', this._onEditAction.bind(this));
        html.on('click', '.delete-action', this._onDeleteAction.bind(this));
    }

    _onAddAction(event) {
        // Code to handle adding a new action, possibly opening a modal or a new form
        this._openActionForm();
    }

    _onEditAction(event) {
        const actionId = event.currentTarget.dataset.actionId;
        // Code to open the form with existing data
        this._openActionForm(actionId);
    }

    _onDeleteAction(event) {
        const index = event.currentTarget.dataset.index;
        // Code to delete the action from settings
        let actions = game.settings.get('action-sequence', 'settingsData').actions;
        actions.splice(index, 1);
        game.settings.set('action-sequence', 'settingsData', { ...game.settings.get('action-sequence', 'settingsData'), actions });
        this.render(); // Re-render to update the list
    }

    _openActionForm(actionId = null) {
        const action = actionId ? game.settings.get('action-sequence', 'settingsData').actions.find(a => a.actionId === actionId) : { actionId: '', items: [] };
        new ActionForm(action).render(true);
    }

    async _renderActionList(actions) {
        const container = this.element.find('#action-list');
        container.empty(); // Clear current contents

        for (const action of actions) {
            const actionDetails = await this._fetchActionDetails(action.actionId);
            const html = $(`<div class="action-item">
                        <img src="${actionDetails.icon}" alt="${actionDetails.name}" style="width: 24px; height: 24px;">
                        <span>${actionDetails.name}</span>
                        <button class="edit-action" data-index="${action.index}"><i class="fas fa-edit"></i></button>
                        <button class="delete-action" data-index="${action.index}"><i class="fas fa-trash"></i></button>
                      </div>`);
            container.append(html);
        }
    }

    async _fetchActionDetails(actionId) {
        // Example of fetching an action from the compendium
        let pack = game.packs.get('dnd5e.items'); // Adjust as necessary for correct pack
        let entry = await pack.getIndex().then(index => index.find(e => e._id === actionId));
        if (entry) {
            let item = await pack.getEntity(entry._id);
            return {
                name: item.data.name,
                icon: item.data.img
            };
        }
        return { name: "Unknown Action", icon: "icons/svg/mystery-man.svg" }; // Default if not found
    }
}


Hooks.on('ready', () => {
    game.settings.registerMenu('action-sequence', 'configureActions', {
        name: 'Configure Actions',
        label: 'Configure',
        icon: 'fas fa-cogs',
        type: ActionSequenceConfig,
        restricted: true
    });
});