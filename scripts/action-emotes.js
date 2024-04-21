Hooks.once('init', function() {
    console.log('Action Emotes | Initializing Action Sequence Module');

    // Register settings
    game.settings.register('action-emotes', 'settingsData', {
        name: 'Action Emotes',
        scope: 'world',
        config: false,
        default: { globalDelay: 1000, actions: [] },
        type: Object
    });
});

Hooks.on('preCreateChatMessage', async function(chatMessage, options, userId) {
    const actions = game.settings.get('action-emotes', 'settingsData').actions;
    const action = actions.find(a => a.actionId === chatMessage.data.actionId);

    if (action) {
        for (const item of action.items) {
            await performAction(chatMessage, item);
            await wait(game.settings.get('action-emotes', 'settingsData').globalDelay);
        }
    }
});

async function performAction(chatMessage, item) {
    // Find the token associated with the speaker
    const speaker = chatMessage.speaker;
    const token = canvas.tokens.placeables.find(t => t.id === speaker.token);

    if (!token) {
        console.log("Token not found for the given speaker.");
        return;
    }

    const content = item.value;
    const type = item.type;

    if (type === 'speech') {
        // Display speech bubble
        ChatMessage.create({ speaker: chatMessage.speaker, content });
        createSpeechBubble(token, content);
    } else if (type === 'emote') {
        // Display styled text
        createStyledText(token, content);
    }
}

function createSpeechBubble(token, text) {
    // Example of creating a speech bubble
    const style = new PIXI.TextStyle({
        fontFamily: 'Arial',
        fontSize: 24,
        fill: '#ffffff',
        stroke: '#000000',
        strokeThickness: 4,
        dropShadow: true,
        dropShadowColor: '#000000',
        dropShadowBlur: 4,
        dropShadowAngle: Math.PI / 6,
        dropShadowDistance: 6,
    });

    const message = new PIXI.Text(text, style);
    message.anchor.set(0.5, 1);
    message.position.set(token.center.x, token.center.y - token.w);
    canvas.stage.addChild(message);

    // Automatically remove the text after a delay
    setTimeout(() => {
        canvas.stage.removeChild(message);
        message.destroy();
    }, 3000);  // Adjust time as necessary
}

function createStyledText(token, text) {
    // Example of creating colored text with a black outline
    const style = new PIXI.TextStyle({
        fontFamily: 'Arial',
        fontSize: 24,
        fontWeight: 'bold',
        fill: '#ff5555',  // Example red color
        stroke: '#000000',
        strokeThickness: 4
    });

    const message = new PIXI.Text(text, style);
    message.anchor.set(0.5, 1);
    message.position.set(token.center.x, token.center.y - token.w);
    canvas.stage.addChild(message);

    // Automatically remove the text after a delay
    setTimeout(() => {
        canvas.stage.removeChild(message);
        message.destroy();
    }, 3000);  // Adjust time as necessary
}

function replaceWildcards(text, actor, chatMessage) {
    // Extract relevant data
    const target = game.user.targets.first();  // This assumes the user has selected a target
    const weapon = actor.items.find(i => i.type === 'weapon');  // Find first weapon, example only
    const spell = actor.items.find(i => i.type === 'spell');  // Find first spell, example only

    // Replace wildcards
    text = text.replace(/<actorname>/g, actor.name);
    if (target) {
        text = text.replace(/<target>/g, target.name);
    }
    if (weapon) {
        text = text.replace(/<weapon>/g, weapon.name);
    }
    if (spell) {
        text = text.replace(/<spell>/g, spell.name);
    }

    return text;
}

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}