//Beggining of class work
class GameObject {
    constructor(id, name, description, parent) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.parent = parent;
    }
}

class Container extends GameObject {
  constructor(id, name, description, parent, contents) {
    super(id, name, description, parent);
    this.contents = contents;
  }
  addChild(obj) {
    this.contents.push(obj);
  }

  removeChild(obj) {
    const childLoc = this.contents.indexOf(obj);
    if (childLoc == -1) {
        console.log("Couldn't find item")
    }
    else {
        this.contents.splice(childLoc, 1);
    }
  }

  getChildById(id) {
    return this.contents[id];
  }
}

class Room extends Container {
    constructor (id, name, description, parent, contents, exits) {
        super(id, name, description, parent, contents);
        this.exits = exits
    }

    setExit(direction, room) {
        this.exits[direction] = room
    }

    getExit(direction) {
        return this.exits[direction]
    }
}

class Item extends GameObject {
    constructor(id, name, description, parent, actions) {
        super(id, name, description, parent);
        this.actions = actions
    }
    getDesc() {
        return this.description
    }
    getActions() {
        return this.actions
    }
    take(world) {

    }
    drop(world) {

    }
}

class Player extends Container {
    constructor (id, name, description, parent, contents) {
        super(id, name, description, parent, contents);
    }

    inventoryDescription(){
        return this.contents
    }
}


//End of class work

console.log("Succesfully Received JS file")
const world = {
    currentRoom: null,
    rooms: null,
    items: null,
    player: null
};

const roomNameEl = document.querySelector('#room-name')
const roomDescEl = document.querySelector('#room-desc')
const messageAreaEl = document.querySelector('#message-area')
const exitsAreaEl = document.querySelector('#exits-area')
const northButtonEl = document.getElementById("north-button")
const eastButtonEl = document.getElementById("east-button")
const southButtonEl = document.getElementById("south-button")
const westButtonEl = document.getElementById("west-button")

const roomContentsEl = document.getElementById("room-contents")
const inventorContentEl = document.getElementById("inventory-contents")

if (northButtonEl != undefined && southButtonEl != undefined && eastButtonEl != undefined && westButtonEl != undefined) {
    northButtonEl.onclick = function() {onNorthClick()};
    southButtonEl.onclick = function() {onSouthClick()};
    westButtonEl.onclick = function() {onWestClick()};
    eastButtonEl.onclick = function() {onEastClick()};
}

function onNorthClick() {
    const roomName = world.currentRoom["exits"].get("north")["name"]
    world.currentRoom = world.currentRoom["exits"].get("north");
    messageAreaEl.textContent = "You entered the " + roomName;
    render();
}
function onEastClick() {
    const roomName = world.currentRoom["exits"].get("east")["name"]
    world.currentRoom = world.currentRoom["exits"].get("east");
    messageAreaEl.textContent = "You entered the " + roomName;
    render();
}
function onSouthClick() {
    const roomName = world.currentRoom["exits"].get("south")["name"]
    world.currentRoom = world.currentRoom["exits"].get("south");
    messageAreaEl.textContent = "You entered the " + roomName;
    render();
}
function onWestClick() {
    const roomName = world.currentRoom["exits"].get("west")["name"]
    world.currentRoom = world.currentRoom["exits"].get("west");
    messageAreaEl.textContent = "You entered the " + roomName;
    render();
}

function render() {
    console.log("Succesfully Rendered")
    const room = world.currentRoom;
    if (!room) {
        console.log("Could not find room")
        return;
    }

    renderRoomContents(room);

    //Section on room buttons
    console.log(room.exits)
    roomNameEl.textContent = room.name;
    roomDescEl.textContent = room.description;
    if (room.exits.get("north") != undefined) {
        northButtonEl.disabled = false;
        northButtonEl.innerHTML = "North: " + room.exits.get("north")["name"];
    }
    else {
        northButtonEl.disabled = true;
        northButtonEl.innerHTML = "North: Wall";
    }
    if (room.exits.get("east") != undefined) {
        eastButtonEl.disabled = false;
        eastButtonEl.innerHTML = "East: " + room.exits.get("east")["name"];
    }
    else {
        eastButtonEl.disabled = true;
        eastButtonEl.innerHTML = "East: Wall";
    }
    if (room.exits.get("south") != undefined) {
        southButtonEl.disabled = false;
        southButtonEl.innerHTML = "South: " + room.exits.get("south")["name"];
    }
    else {
        southButtonEl.disabled = true;
        southButtonEl.innerHTML = "South: Wall";
    }
    if (room.exits.get("west") != undefined) {
        westButtonEl.disabled = false;
        westButtonEl.innerHTML = "West: " + room.exits.get("west")["name"];
    }
    else {
        westButtonEl.disabled = true;
        westButtonEl.innerHTML = "West: Wall";
    }


}

//Room Buttons Stuff
function renderRoomContents(room) {
    roomContentsEl.replaceChildren();
    const ids = room.contents ?? [];
    if (ids.length === 0) {
        roomContentsEl.textContent = "You found everything there was to find here.";
        return;
    }

    roomContentsEl.append("In the room you notice: ");
    console.log(ids)
    ids.forEach((itemId, index) => {
        console.log(itemId)
        const item = itemId;
        if (!item){
            console.log("Could Not Find Items")
            return;
        }
        roomContentsEl.appendChild(createItemButton(item));

        if (index < ids.length  - 1)
            roomContentsEl.append(", ");
        else
            roomContentsEl.append(".");
    })
}

function createItemButton(item) {
    //Big div 
    const dropDown = document.createElement("div");
    dropDown.type = "div";
    dropDown.className = "dropdown"

    //Visible item square
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "room-item";
    btn.dataset.itemId = item.id;
    btn.textContent = item.name;
    
    btn.addEventListener("click", function (){messageAreaEl.textContent = item.getDesc()});

    //Invisible Hover Menu
    const hoverMenu = document.createElement("div");
    hoverMenu.type = "div";
    hoverMenu.className = "dropdown-content";

    const disableButton = document.createElement("button");
    disableButton.type = "button";
    disableButton.className = "dropdown-nonaction";
    disableButton.textContent = "Actions:";
    disableButton.disabled = true;

    const lookButton = document.createElement("button");
    lookButton.type = "button";
    lookButton.className = "dropdown-action";
    lookButton.textContent = "Look";
    lookButton.addEventListener("click", function (){messageAreaEl.textContent = item.getDesc()});

    const takeButton = document.createElement("button");
    takeButton.type = "button";
    takeButton.className = "dropdown-action";
    takeButton.textContent = "Pick Up";
    takeButton.addEventListener("click", function (){takeObject(item.id)});

    hoverMenu.appendChild(disableButton);
    hoverMenu.appendChild(lookButton);
    hoverMenu.appendChild(takeButton);

    //Appending Everything
    dropDown.appendChild(btn);
    dropDown.appendChild(hoverMenu);


    return dropDown;
}

function lookObject(itemDesc) {
    console.log("Item Desc Printed")
    messageAreaEl.textContent = itemDesc;
}

function takeObject(itemId) {
    console.log("Item Taken");
    const roomContent = world.currentRoom.contents
    const index = roomContent.indexOf(world.items.get(itemId));
    const heldItem = world.currentRoom.contents[index]
    heldItem.parent = world.player
    console.log(heldItem)
    if (index != -1) {
        roomContent.splice(index, 1);
    }
    else {
        console.log("Item Not Found");
    }
    messageAreaEl.textContent = "You picked up the " + heldItem.name
    world.player.contents.push(heldItem);
    console.log(world.player.contents)
    renderRoomContents(world.currentRoom);
    renderInventory();
}

function dropObject(itemId) {
    console.log("Item Dropped");
    const roomContent = world.currentRoom.contents
    const index = world.player.contents.indexOf(world.items.get(itemId));
    const heldItem = world.player.contents[index]
    heldItem.parent = world.currentRoom
    console.log(heldItem)
    if (index != -1) {
        world.player.contents.splice(index, 1);
    }
    else {
        console.log("Item Not Found");
    }
    messageAreaEl.textContent = "You dropped the " + heldItem.name
    roomContent.push(heldItem);
    console.log(world.player.contents)
    renderRoomContents(world.currentRoom);
    renderInventory();
}

//Personal Inventory Stuff
function renderInventory() {
    inventorContentEl.replaceChildren();
    const ids = world.player.contents ?? [];
    if (ids.length === 0) {
        inventorContentEl.textContent = "Your inventory is empty";
        return;
    }

    inventorContentEl.append("In your inventory: ");
    console.log(ids)
    ids.forEach((itemId, index) => {
        const item = itemId;
        if (!item){
            console.log("sadge")
            return;
        }
        inventorContentEl.appendChild(createInventoryButton(item));

        if (index < ids.length  - 1)
            inventorContentEl.append(", ");
        else
            inventorContentEl.append(".");
    })
}

function createInventoryButton(item) {
    //Big div 
    const dropDown = document.createElement("div");
    dropDown.type = "div";
    dropDown.className = "dropdown"

    //Visible item square
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "room-item";
    btn.dataset.itemId = item.id;
    btn.textContent = item.name;
    
    btn.addEventListener("click", function (){messageAreaEl.textContent = item.getDesc()});

    //Invisible Hover Menu
    const hoverMenu = document.createElement("div");
    hoverMenu.type = "div";
    hoverMenu.className = "dropdown-content";

    const disableButton = document.createElement("button");
    disableButton.type = "button";
    disableButton.className = "dropdown-nonaction";
    disableButton.textContent = "Actions:";
    disableButton.disabled = true;

    const lookButton = document.createElement("button");
    lookButton.type = "button";
    lookButton.className = "dropdown-action";
    lookButton.textContent = "Look";
    lookButton.addEventListener("click", function (){messageAreaEl.textContent = item.getDesc()});

    const dropButton = document.createElement("button");
    dropButton.type = "button";
    dropButton.className = "dropdown-action";
    dropButton.textContent = "Drop";
    dropButton.addEventListener("click", function (){dropObject(item.id)});

    hoverMenu.appendChild(disableButton);
    hoverMenu.appendChild(lookButton);
    hoverMenu.appendChild(dropButton);

    //Appending Everything
    dropDown.appendChild(btn);
    dropDown.appendChild(hoverMenu);


    return dropDown;
}



async function init() {
    const resp = await fetch("./db.json");
    const db = await resp.json();
    //world.rooms = db.rooms;
    //world.items = db.items;
    world.rooms = new Map();
    world.items = new Map();
    for (var item in db.items) {
        const nextItem = new Item(db.items[item]["id"],db.items[item]["name"],db.items[item]["description"], null, null);
        world.items.set(db.items[item]["id"], nextItem);
    }
    for (var room in db.rooms) {
        let roomInv = []
        for (var item in db.rooms[room]["contents"]) {
            console.log(db.rooms[room]["contents"][item])
            roomInv.push(world.items.get(db.rooms[room]["contents"][item]))
        }
        const nextRoom = new Room(db.rooms[room]["id"], db.rooms[room]["name"], db.rooms[room]["description"], null, roomInv, []);
        world.rooms.set(db.rooms[room]["id"], nextRoom);
    }
    for (var room in db.rooms) {
        let roomExits = new Map();
        for (var exit in db.rooms[room]["exits"]) {
            roomExits.set(exit, world.rooms.get(db.rooms[room]["exits"][exit]))
        }
        world.rooms.get(db.rooms[room]["id"]).exits = roomExits
    }


    console.log(world.rooms)
    console.log(world.items)

    world.player = new Player("player", "YOU", "You're feeling... Fine :)", null, [])
    world.currentRoom = world.rooms.get("livingRoom")
    renderInventory();
    messageAreaEl.textContent = "You got up from the ground" //Starting message
    
    render();
}
init().then(setupDialogAndQuestDemo).catch(function (err) {
    console.error("Init failed:", err);
    setupDialogAndQuestDemo(); // systems run standalone even if world fails
});


// ============================================================
// Dialog + Quest wiring (Backlog #4, #5, #13)
// Owner: Abhishek Subramanian
// Instantiates the systems on `world` and binds the demo trigger.
// ============================================================

const DEMO_QUEST_ID = "demo-long-necked-man";
const DEMO_NPC = { id: "long_necked_man", name: "Long-Necked Man" };

function defineDemoQuest() {
    world.quests.defineQuest({
        id: DEMO_QUEST_ID,
        title: "The Long-Necked Man",
        description: "A pale figure in the clearing seems to want something from you.",
        stages: [
            { id: "met",           description: "Spoke to the Long-Necked Man." },
            { id: "find_apple",    description: "Find an apple to bring back to him." },
            { id: "path_revealed", description: "He pointed you toward the southern glow." }
        ]
    });
}

function setupDialogAndQuestDemo() {
    world.dialog = new DialogSystem(world);
    world.quests = new QuestSystem(world);
    defineDemoQuest();

    // Dev logging so integrators can see the events their hooks will receive
    world.dialog.on("onResponse", (p) => console.log("[dialog] response:", p));
    world.quests.on("onStageChange", (p) => console.log("[quest] stage change:", p.quest.id, "->", p.stage));
    world.quests.on("onQuestComplete", (p) => console.log("[quest] complete:", p.quest.id));

    const demoBtn = document.getElementById("dialog-demo-btn");
    if (demoBtn) demoBtn.addEventListener("click", openLongNeckedManDialog);

    const resetBtn = document.getElementById("quest-demo-reset-btn");
    if (resetBtn) resetBtn.addEventListener("click", function () {
        defineDemoQuest();
        console.log("[quest] demo quest reset");
    });
}


// ============================================================
// Demo dialog flow (Long-Necked Man)
// Owner: Abhishek Subramanian
// Exercises every dialog primitive: say, multi-choice, free-text,
// gated choices, leave, and quest stage advancement.
// Other team members can replace this with real game content.
// ============================================================

function openLongNeckedManDialog() {
    world.dialog.startDialog(DEMO_NPC);

    // Branch by quest stage (first-meeting / mid-quest / post-completion pools)
    const stage = world.quests.getStage(DEMO_QUEST_ID);
    const stageId = stage ? stage.id : null;

    if (world.quests.isComplete(DEMO_QUEST_ID))   scenePostQuest();
    else if (stageId === "find_apple")            sceneMidQuest();
    else                                          sceneFirstMeeting();
}

function sceneFirstMeeting() {
    world.dialog.say("Well, well... and who might you be, little one?");
    world.dialog.setChoices([
        { label: "I... I don't remember.",                    value: "forgot" },
        { label: "Can you tell me where the next campfire is?", value: "ask_path" }
    ], function (value) {
        if (value === "forgot")   sceneRiddle();
        if (value === "ask_path") sceneApplePath();
    });
    world.dialog.addLeaveOption();
}

const RIDDLE_ANSWERS = ["name", "my name", "your name", "a name"];
const isRiddleCorrect = (answer) => RIDDLE_ANSWERS.includes(answer.toLowerCase().trim());

function sceneRiddle() {
    world.dialog.say(
        "A traveler without a name. How quaint. Perhaps a riddle will jog your memory:\n" +
        "What do you have that others use more than you do?"
    );
    world.dialog.setFreeTextInput("Type your answer", handleRiddleAnswer);
}

function sceneRiddleRetry() {
    world.dialog.say("No, no... think harder. What do you have that others use more than you do?");
    world.dialog.setFreeTextInput("Try again", handleRiddleAnswer);
}

function handleRiddleAnswer(answer) {
    if (!isRiddleCorrect(answer)) { sceneRiddleRetry(); return; }
    if (!world.quests.isActive(DEMO_QUEST_ID) && !world.quests.isComplete(DEMO_QUEST_ID)) {
        world.quests.startQuest(DEMO_QUEST_ID);
    }
    world.quests.setStage(DEMO_QUEST_ID, "path_revealed");
    sceneRiddleSolved();
}

function sceneRiddleSolved() {
    world.dialog.say(
        "Clever little one. The path south is yours. " +
        "I saw a warm glow coming from down that way. Say hello to it for me, would you?"
    );
    world.dialog.setChoices([
        { label: "Thank you. I'll be on my way.", value: "thanks" },
        { label: "What do you mean?",             value: "clarify" }
    ], function (value) {
        const reply = (value === "clarify")
            ? "Look for the lantern to guide your way, child."
            : "Cautious travels.";
        world.dialog.say(reply);
        world.dialog.setChoices([], null);
        world.dialog.addLeaveOption("Goodbye");
    });
}

function sceneApplePath() {
    world.dialog.say(
        "Of course. But I'd appreciate a small favor first - it has been so long since I tasted an apple. " +
        "Bring me one, and I'll tell you everything."
    );
    if (!world.quests.isActive(DEMO_QUEST_ID) && !world.quests.isComplete(DEMO_QUEST_ID)) {
        world.quests.startQuest(DEMO_QUEST_ID);
    }
    world.quests.setStage(DEMO_QUEST_ID, "find_apple");

    world.dialog.setChoices([
        { label: "I'll find you one.", value: "agree" }
    ], function () {
        world.dialog.say("Wonderful. I'll be waiting right here.");
        world.dialog.setChoices([], null);
        world.dialog.addLeaveOption();
    });
    world.dialog.addLeaveOption();
}

function sceneMidQuest() {
    world.dialog.say("Have you brought me an apple, little wanderer?");
    world.dialog.setChoices([
        { label: "Not yet. I'm still looking.", value: "not_yet" },
        // Inventory-gated: hidden when player has no apple (per spec)
        {
            label: "Here, I brought you an apple.",
            value: "give_apple",
            condition: (world) => playerHasItem(world, "apple")
        }
    ], function (value) {
        if (value === "give_apple") {
            consumePlayerItem(world, "apple");
            world.quests.setStage(DEMO_QUEST_ID, "path_revealed");
            world.dialog.say(
                "Thank you, my friend. A deal is a deal: there is a warm glow to the south. " +
                "Say hello to it for me, would you?"
            );
        } else {
            world.dialog.say("Take your time. I'm not going anywhere.");
        }
        world.dialog.setChoices([], null);
        world.dialog.addLeaveOption(value === "give_apple" ? "Goodbye" : "Leave");
    });
}

function scenePostQuest() {
    world.dialog.say("Safe travels, little wanderer. The path south remains open.");
    world.dialog.setChoices([], null);
    world.dialog.addLeaveOption("Farewell");
}

// Inventory helpers (placeholder until #7 lands a canonical inventory API)
function playerHasItem(world, itemId) {
    if (!world.player || !Array.isArray(world.player.contents)) return false;
    return world.player.contents.some((item) => item && item.id === itemId);
}

function consumePlayerItem(world, itemId) {
    if (!world.player || !Array.isArray(world.player.contents)) return;
    const idx = world.player.contents.findIndex((item) => item && item.id === itemId);
    if (idx === -1) return;
    world.player.contents.splice(idx, 1);
    if (typeof renderInventory === "function") renderInventory();
}