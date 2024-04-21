Hooks.on("preCreateChatMessage", async (action) => {
    console.log(action);
    // let rollTable = findRollTableForAction(action);
    // if (rollTable) {
    //     let result = await rollTable.roll();
    //     displayEmote(result.text, action.token);
    // }
});

function findRollTableForAction(action) {
    // Retrieve the linked roll table based on the action
}

function displayEmote(text, tokenId) {
    // Existing code to display the emote
}