class ActionForm extends FormApplication {
    constructor(action, options = {}) {
        super(action, options);
        this.action = action || { actionId: '', name: '', icon: '', items: [] };
    }

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            id: 'action-form',
            title: this.action.actionId ? 'Edit Action' : 'New Action',
            template: 'modules/action-sequence/templates/action-form.html',
            classes: ['action-sequence'],
            width: 400,
            closeOnSubmit: false
        });
    }

    getData() {
        return {
            action: this.action,
            isEdit: this.action.actionId !== ''
        };
    }

    activateListeners(html) {
        super.activateListeners(html);
        html.find('.item-add').click(this._addItem.bind(this));
        html.on('click', '.item-delete', this._deleteItem.bind(this));
        this.initializeDragDrop(html);
        this.initializeSortableList(html);
    }
    
    async _updateObject(event, formData) {
        const settings = game.settings.get('action-sequence', 'settingsData');
        let actions = settings.actions;
        if (this.action.actionId) {
            // Update existing action
            const index = actions.findIndex(a => a.actionId === this.action.actionId);
            actions[index] = mergeObject(actions[index], formData);
        } else {
            // Add new action
            this.action.actionId = randomID(); // Assign a unique ID
            formData.actionId = this.action.actionId;
            actions.push(formData);
        }
        await game.settings.set('action-sequence', 'settingsData', settings);
        this.close(); // Close the form once saved
    }

    _addItem(event) {
        this.action.items.push({ type: 'emote', value: '' });
        this.render();
    }

    _deleteItem(event) {
        const index = event.currentTarget.dataset.index;
        this.action.items.splice(index, 1);
        this.render();
    }

    initializeDragDrop(html) {
        const dropArea = html.find('#drop-area');
        dropArea.on('dragover', event => event.preventDefault());
        dropArea.on('drop', this.handleDrop.bind(this));
    }

    handleDrop(event) {
        event.preventDefault();
        const data = JSON.parse(event.originalEvent.dataTransfer.getData('text/plain'));
        if (data.type === "Item") {
            const item = game.items.get(data.id);
            this.action.name = item.name;
            this.action.icon = item.img;
            this.render();
        }
    }

    initializeSortableList(html) {
        const list = html.find("#action-items-list");
        new Sortable(list[0], {
            handle: '.handle',
            animation: 150,
            onSort: () => this._onSortItems(list)
        });
    }

    _onSortItems(list) {
        const newOrder = list.find('li').toArray().map(li => $(li).data('index'));
        const reorderedItems = newOrder.map(index => this.action.items[index]);
        this.action.items = reorderedItems;
        this.render();
    }

    _updateObject(event, formData) {
        // Method implementation as defined in previous response
    }
}