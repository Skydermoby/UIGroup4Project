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
    constructor (id, name, description, parent, contents, exits, locks, trait, special, quest) {
        super(id, name, description, parent, contents);
        this.exits = exits
        this.locks = locks
        this.trait = trait
        this.special = special
        this.quest = quest
    }

    setExit(direction, room) {
        this.exits[direction] = room
    }

    getExit(direction) {
        return this.exits[direction]
    }
}

class Item extends GameObject {
    constructor(id, name, description, parent, actions, trait, addendum, quest) {
        super(id, name, description, parent);
        this.actions = actions
        this.trait = trait
        this.addendum = addendum
        this.quest = quest
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
    player: null,
    illuminationLevel: null,
    illuminated: null,
    swimmable: false,
    enviromentState: -10,
    playingAudio: false,
    activeClick: null,
    combineInventory: [],
    actionList: ["Look"]
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
const specialRoomContentsEl = document.getElementById("special-room-contents")

const lanternEl = document.getElementById("lantern-level")
const audioEl = document.getElementById("ambient-audio")
const musicToggleEl = document.getElementById("music-toggle")

const bodyEl = document.getElementsByTagName("BODY")[0]

//bodyEl.addEventListener("click", function (){handleOffClick()});

if (northButtonEl != undefined && southButtonEl != undefined && eastButtonEl != undefined && westButtonEl != undefined) {
    northButtonEl.onclick = function() {onNorthClick()};
    southButtonEl.onclick = function() {onSouthClick()};
    westButtonEl.onclick = function() {onWestClick()};
    eastButtonEl.onclick = function() {onEastClick()};
}

function onNorthClick() {
    const roomName = world.currentRoom["exits"].get("north")["name"]
    const roomId = world.currentRoom["exits"].get("north")["id"]
    if (typeof world.currentRoom.locks.get(roomId) !== "undefined" && !checkAction(world.currentRoom.locks.get(roomId), "door")) {
        if (world.currentRoom.locks.get(roomId) == "Key")
            messageAreaEl.textContent = "Hmm, seems like the door to " + roomName + " is locked";
        else
            checkAction(world.currentRoom.locks.get(roomId), "door");
    }
    else {
        diminishLight()
        if (world.currentRoom.quest.length != 0) {
            world.quests.nextStage(world.currentRoom.quest[0]);
            world.currentRoom.quest.pop()
        }
        world.currentRoom = world.currentRoom["exits"].get("north");
        messageAreaEl.textContent = "You entered the " + roomName;
        render();
    }
}
function onEastClick() {
    const roomName = world.currentRoom["exits"].get("east")["name"]
    const roomId = world.currentRoom["exits"].get("east")["id"]
    if (typeof world.currentRoom.locks.get(roomId) != "undefined" && !checkAction(world.currentRoom.locks.get(roomId), "door")) {
        if (world.currentRoom.locks.get(roomId) == "Key")
            messageAreaEl.textContent = "Hmm, seems like the door to " + roomName + " is locked";
        else
            checkAction(world.currentRoom.locks.get(roomId), "door");
    }
    else {
        diminishLight()
        world.currentRoom = world.currentRoom["exits"].get("east");
        messageAreaEl.textContent = "You entered the " + roomName;
        render();
    }
}
function onSouthClick() {
    const roomName = world.currentRoom["exits"].get("south")["name"]
    const roomId = world.currentRoom["exits"].get("south")["id"]
    console.log(world.currentRoom.locks.get(roomId))
    if (typeof world.currentRoom.locks.get(roomId) !== "undefined" && !checkAction(world.currentRoom.locks.get(roomId), "door")) {
        if (world.currentRoom.locks.get(roomId) == "Key")
            messageAreaEl.textContent = "Hmm, seems like the door to " + roomName + " is locked";
        else
            checkAction(world.currentRoom.locks.get(roomId), "door");
    }
    else {
        diminishLight()
        world.currentRoom = world.currentRoom["exits"].get("south");
        messageAreaEl.textContent = "You entered the " + roomName;
        render();
    }
}
function onWestClick() {
    const roomName = world.currentRoom["exits"].get("west")["name"]
    const roomId = world.currentRoom["exits"].get("west")["id"]
    if (typeof world.currentRoom.locks.get(roomId) !== "undefined" && !checkAction(world.currentRoom.locks.get(roomId), "door")) {
        if (world.currentRoom.locks.get(roomId) == "Key")
            messageAreaEl.textContent = "Hmm, seems like the door to " + roomName + " is locked";
        else
            checkAction(world.currentRoom.locks.get(roomId), "door");
    }
    else {
        diminishLight()
        world.currentRoom = world.currentRoom["exits"].get("west");
        messageAreaEl.textContent = "You entered the " + roomName;
        render();
    }
}

function render() {
    console.log("Succesfully Rendered")
    const room = world.currentRoom;
    console.log(room)
    if (!room) {
        console.log("Could not find room")
        return;
    }

    //Section on room buttons
    console.log(room.exits)
    roomNameEl.textContent = room.name;
    console.log(Number(world.illuminationLevel))
    if (world.currentRoom.trait == "Dark" && Number(world.illuminationLevel) == 0) {
        roomDescEl.textContent = "Hmm, the room is too dark to see"
        clearRoomContents();
    }
    else {
        roomDescEl.textContent = room.description;
        renderRoomContents(room);
    }
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
function clearRoomContents() {
    roomContentsEl.replaceChildren();
}

function clearSpecialContents() {
    specialRoomContentsEl.replaceChildren();
}

function handleSpecial(special){
    if (special === "TallMan") {
        specialRoomContentsEl.append("You also see ")
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "room-item";
        btn.textContent = "A very long pair of legs";
        
        btn.addEventListener("click", function (){openLongNeckedManDialog()});

        specialRoomContentsEl.appendChild(btn);
    }
    else if (special === "AppleTree") {
        specialRoomContentsEl.append("You also see ")
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "room-item";
        btn.textContent = "A smiling apple tree";
        
        btn.addEventListener("click", function (){openTreeDialog()});

        specialRoomContentsEl.appendChild(btn);
    }
    else if (special === "TheEnd") {
        specialRoomContentsEl.append("THE END");
    }
}

function renderRoomContents(room) {
    roomContentsEl.replaceChildren();
    specialRoomContentsEl.replaceChildren();
    const specials = room.special
    if (typeof specials !== "undefined") {
        handleSpecial(specials)
    }
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

function handleOffClick() {
    if (world.activeClick != null){
        world.activeClick.className = "dropdown"
        world.activeClick = null
    }
}

function changeActiveButton(button) {
    if (world.activeClick == null) {
        world.activeClick = button
        button.className = "dropdown-clicked"
    }
    else if (world.activeClick != button) {
        world.activeClick.className = "dropdown"
        world.activeClick = button
        button.className = "dropdown-clicked"
    }
    else {
        world.activeClick = null
        button.className = "dropdown"
    }
    console.log(world.activeClick)
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
    
    btn.addEventListener("click", function (){changeActiveButton(dropDown)});

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
    lookButton.addEventListener("click", function (){messageAreaEl.textContent = item.getDesc(); handleOffClick()});

    hoverMenu.appendChild(disableButton);
    hoverMenu.appendChild(lookButton);

    if (item.trait == "Stuck") {
        const stuckButton = document.createElement("button");
        stuckButton.type = "button";
        stuckButton.className = "dropdown-action";
        stuckButton.textContent = "Interact";
        stuckButton.addEventListener("click", function (){interactObject(item); handleOffClick()});

        hoverMenu.appendChild(stuckButton);
    }
    else if (item.trait == "Campfire") {
        const cfButton = document.createElement("button");
        cfButton.type = "button";
        cfButton.className = "dropdown-action";
        cfButton.textContent = "Refuel";
        cfButton.addEventListener("click", function (){useCampfire(); handleOffClick()});

        hoverMenu.appendChild(cfButton);
    }
    else if (item.trait == "Sign") {

    }
    else {
        const takeButton = document.createElement("button");
        takeButton.type = "button";
        takeButton.className = "dropdown-action";
        takeButton.textContent = "Pick Up";
        takeButton.addEventListener("click", function (){takeObject(item.id); handleOffClick()});

        hoverMenu.appendChild(takeButton);
    }

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
    if (heldItem.trait == "Combine") {
        world.combineInventory.push(heldItem)
    }
    if (typeof heldItem.quest != "undefined") {
        world.quests.nextStage(heldItem.quest);
        heldItem.quest = undefined
    }
    console.log(world.player.contents)
    console.log(world.combineInventory)
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
        if (heldItem.trait == "Combine") {
            // combineInventory has its own index, not the player-contents one
            const cIdx = world.combineInventory.indexOf(heldItem);
            if (cIdx !== -1) world.combineInventory.splice(cIdx, 1);
        }
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

function interactObject(item) {
    if (checkAction(item.addendum[0], "item")) {
        if (item.addendum[1] == "") {
            messageAreaEl.textContent = "Hmm, seems like it's empty"
        }
        else{
            addItem(item.addendum[1])
            messageAreaEl.textContent = messageAreaEl.textContent + ", you got a " + item.addendum[1] + "!"
            if (typeof item.quest != "undefined") {
                world.quests.nextStage(item.quest);
                item.quest = undefined
            }
        }
    }
}

//Personal Inventory Stuff
function renderInventory() {
    inventorContentEl.replaceChildren();
    const ids = world.player.contents ?? [];
    if (ids.length === 0) {
        const empty = document.createElement("div");
        empty.className = "inventory-empty";
        empty.textContent = "Empty.";
        inventorContentEl.appendChild(empty);
        return;
    }

    ids.forEach((item) => {
        if (!item) return;
        inventorContentEl.appendChild(createInventoryButton(item));
    });
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
    
    btn.addEventListener("click", function (){changeActiveButton(dropDown)});

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
    lookButton.addEventListener("click", function (){messageAreaEl.textContent = item.getDesc(); handleOffClick()});

    const dropButton = document.createElement("button");
    dropButton.type = "button";
    dropButton.className = "dropdown-action";
    dropButton.textContent = "Drop";
    dropButton.addEventListener("click", function (){dropObject(item.id); handleOffClick()});

    hoverMenu.appendChild(disableButton);
    hoverMenu.appendChild(lookButton);
    hoverMenu.appendChild(dropButton);

    if (item.trait == "Key") {
        const keyButton = document.createElement("button");
        keyButton.type = "button";
        keyButton.className = "dropdown-action";
        keyButton.textContent = "Use";
        keyButton.addEventListener("click", function (){useKey(item.addendum); handleOffClick()});

        hoverMenu.appendChild(keyButton);
    }
    else if (item.trait == "Lantern") {
        const toolButton = document.createElement("button");
        toolButton.type = "button";
        toolButton.className = "dropdown-action";
        toolButton.textContent = "Use";
        toolButton.addEventListener("click", function (){useLantern(item); handleOffClick()});

        hoverMenu.appendChild(toolButton);
    }
    else if (item.trait == "Tool") {
        const toolButton = document.createElement("button");
        toolButton.type = "button";
        toolButton.className = "dropdown-action";
        toolButton.textContent = "Use";
        toolButton.addEventListener("click", function (){useTool(item); handleOffClick()});

        hoverMenu.appendChild(toolButton);
    }
    else if (item.trait == "Combine") {
        const combineButton = document.createElement("button");
        combineButton.type = "button";
        combineButton.className = "dropdown-action";
        if (world.combineInventory.length > 1)
            combineButton.textContent = "Combine";
        else
            combineButton.textContent = "Nothing to Combine With";
        const hoverMenu2 = document.createElement("div");
        hoverMenu2.type = "div";
        hoverMenu2.className = "dropdown-content";

        for (let i = 0; i < world.combineInventory.length; i++) {
            if (world.combineInventory[i].name == item.name) {
                continue
            }
            const disableButton2 = document.createElement("button");
            disableButton2.type = "button";
            disableButton2.className = "dropdown-action";
            disableButton2.textContent = world.combineInventory[i].name;
            disableButton2.addEventListener("click", function (){combineItems(item, world.combineInventory[i]); handleOffClick()});

            hoverMenu2.appendChild(disableButton2)
        }

        combineButton.appendChild(hoverMenu2)

        hoverMenu.appendChild(combineButton);
    }
    else if (item.trait == "Quest") {
        const questButton = document.createElement("button");
        questButton.type = "button";
        questButton.className = "dropdown-action";
        questButton.textContent = "Use";
        questButton.addEventListener("click", function (){playPause()});

        hoverMenu.appendChild(questButton);
    }
    //Appending Everything
    dropDown.appendChild(btn);
    dropDown.appendChild(hoverMenu);


    return dropDown;
}

function addItem(itemId) {
    console.log("Added ", itemId)
    const heldItem = world.items.get(itemId);
    world.player.contents.push(heldItem);
    console.log(heldItem)
    if (heldItem.trait == "Combine") {
        world.combineInventory.push(heldItem)
    }
    renderInventory();
}

function removeItem(itemId) {
    const roomContent = world.items
    const index = world.player.contents.indexOf(world.items.get(itemId));
    const heldItem = world.player.contents[index]
    console.log(heldItem)
    if (index != -1) {
        world.player.contents.splice(index, 1);
        if (heldItem.trait == "Combine") {
            const indexComb = world.combineInventory.indexOf(world.items.get(itemId));
            world.combineInventory.splice(indexComb, 1);
        }
    }
    else {
        console.log("Item Not Found");
    }
}



function combineItems(item1, item2) {
    if (item1.addendum == item2.addendum) {
        let combiendItem = world.items.get(item1.addendum)
        console.log(combiendItem)
        if (typeof combiendItem == "undefined") {
            console.log("Combined unexisting item")
            return
        }
        messageAreaEl.textContent = "You were able to combine " + item1.name + " and " + item2.name + " into " + combiendItem.name;
        removeItem(item1.id)
        removeItem(item2.id)
        world.player.contents.push(combiendItem);
        console.log(world.player.contents)
        renderInventory();
    }
    else {
        messageAreaEl.textContent = "You tried combining " + item1.name + " and " + item2.name + ", but it dosen't seem to match";
    }
}

function useKey(roomName) {
    if (typeof world.currentRoom.locks.get(roomName) !== "undefined") {
        world.currentRoom.locks.delete(roomName);
        messageAreaEl.textContent = "You Unlocked the door leading to " + world.rooms.get(roomName).name + "!";
    }
    else {
        messageAreaEl.textContent = "Hmm, seems like there's no doors left that can be unlocked with this key...";
    }
}

function useLantern(item) {
    if (world.illuminated == false) {
        world.illuminated = true
        setLanternLevel(item.addendum)
        messageAreaEl.textContent = "You used the " + item.name + ", it is now on";
    }
    else {
        world.illuminated = false
        item.addendum = world.illuminationLevel
        setLanternLevel(0)
        messageAreaEl.textContent = "You used the " + item.name + ", it is now off";
    }
    render()
}

function useCampfire() {
    messageAreaEl.textContent = "You used the campfire, lantern fuel restored";
    setLanternLevel(100)
}

function useTool(item) {
    if (item.addendum == "used") {
        messageAreaEl.textContent = "You already used the " + item.name;
    }
    else {
        world.actionList.push(item.addendum)
        messageAreaEl.textContent = "You used the " + item.name + ", you can now " + item.addendum;
        item.addendum = "used"
    }
    render()
}

function checkAction(action, type) {
    const index = world.actionList.indexOf(action);
    if (index == -1) {
        if (type == "door") {
            messageAreaEl.textContent = "You can't get pass without being able to " + action;
        }
        else {
            messageAreaEl.textContent = "You can't interact without " + action;
        }
        return false
    }
    else {
        if (type == "door") {
            messageAreaEl.textContent = "You managed to pass via " + action;
        }
        else {
            messageAreaEl.textContent = "You interacted via " + action;
        }
        return true
    }
}

function diminishLight() {
    if (world.illuminationLevel > 0) {
        changeLanternLevel(world.enviromentState)
    }
}

function setLanternLevel(setNumber) {
    world.illuminationLevel = setNumber
    lanternEl.value = world.illuminationLevel
}

function changeLanternLevel(changeNumber) {
    world.illuminationLevel = Number(world.illuminationLevel) + changeNumber
    lanternEl.value = world.illuminationLevel
}

// Ambient music: low-volume loop with autoplay-safe start and a mute toggle.
function playPause() {
    if (!audioEl) return;
    if (audioEl.paused) {
        const p = audioEl.play();
        if (p && typeof p.catch === "function") p.catch(() => {});
        world.playingAudio = true;
    } else {
        audioEl.pause();
        world.playingAudio = false;
    }
    updateMusicToggleUI();
}

function updateMusicToggleUI() {
    if (!musicToggleEl) return;
    const playing = audioEl && !audioEl.paused;
    musicToggleEl.classList.toggle("muted", !playing);
    musicToggleEl.setAttribute("aria-pressed", playing ? "true" : "false");
    musicToggleEl.title = playing ? "Mute music" : "Play music";
}

function initAmbientMusic() {
    if (!audioEl) return;
    audioEl.volume = 0.06; // intentionally subtle
    audioEl.loop = true;

    // Try once; browsers may block until the user interacts.
    const tryStart = audioEl.play();
    if (tryStart && typeof tryStart.catch === "function") tryStart.catch(() => {});

    // Fallback: start on first user gesture. Skip the music toggle itself
    // so its click handler stays the source of truth.
    const startOnInteract = (e) => {
        if (musicToggleEl && e && e.target && musicToggleEl.contains(e.target)) return;
        if (audioEl.paused) {
            const p = audioEl.play();
            if (p && typeof p.catch === "function") p.catch(() => {});
        }
        updateMusicToggleUI();
        document.removeEventListener("pointerdown", startOnInteract);
        document.removeEventListener("keydown", startOnInteract);
    };
    document.addEventListener("pointerdown", startOnInteract);
    document.addEventListener("keydown", startOnInteract);

    if (musicToggleEl) {
        musicToggleEl.addEventListener("click", (e) => {
            e.stopPropagation();
            playPause();
        });
    }
    updateMusicToggleUI();
}


async function init() {
    const resp = await fetch("./game.json");
    const db = await resp.json();
    //world.rooms = db.rooms;
    //world.items = db.items;
    world.rooms = new Map();
    world.items = new Map();
    for (var item in db.items) {
        const nextItem = new Item(db.items[item]["id"],db.items[item]["name"],db.items[item]["description"], null, null, db.items[item]["trait"], db.items[item]["Addendum"], db.items[item]["Quest"]);
        world.items.set(db.items[item]["id"], nextItem);
    }
    for (var room in db.rooms) {
        let roomInv = []
        for (var item in db.rooms[room]["contents"]) {
            console.log(db.rooms[room]["contents"][item])
            roomInv.push(world.items.get(db.rooms[room]["contents"][item]))
        }
        let special = undefined
        if (db.rooms[room]["special-contents"].length != 0) {
            special = db.rooms[room]["special-contents"][0]
        }
        let quest = []
        if (db.rooms[room]["quest"].length != 0) {
            quest.push(db.rooms[room]["quest"][0])
        } 
        const nextRoom = new Room(db.rooms[room]["id"], db.rooms[room]["name"], db.rooms[room]["description"], null, roomInv, [], [], db.rooms[room]["trait"], special, quest);
        world.rooms.set(db.rooms[room]["id"], nextRoom);
    }
    for (var room in db.rooms) {
        let roomExits = new Map();
        let roomLocks = new Map();
        for (var exit in db.rooms[room]["exits"]) {
            roomExits.set(exit, world.rooms.get(db.rooms[room]["exits"][exit]))
        }
        for (var lock in db.rooms[room]["locks"]) {
            roomLocks.set(lock, db.rooms[room]["locks"][lock])
        }
        world.rooms.get(db.rooms[room]["id"]).exits = roomExits
        world.rooms.get(db.rooms[room]["id"]).locks = roomLocks
    }


    console.log(world.rooms)
    console.log(world.items)

    world.player = new Player("player", "YOU", "You're feeling... Fine :)", null, [])
    world.currentRoom = world.rooms.get("cabinDoor")
    world.illuminated = false
    setLanternLevel(0)
    renderInventory();
    messageAreaEl.textContent = "You suddenly awake infront of a door, not sure when, where, why, all you know is you need to escape" //Starting message
    
    render();
}

init().then(setupDialogAndQuestSystems).catch(function (err) {
    console.error("Init failed:", err);
    setupDialogAndQuestSystems();
});

// FOR SHRESTA: Put all your dialog here, thx

const Diag1 = "Placeholder1"
const Diag2 = "Placeholder2"
const Diag3 = "Placeholder3"
const Diag4 = "Placeholder4"
const Diag5 = "Placeholder5"
const Diag6 = "Placeholder6"
const Diag7 = "Placeholder7"
const Diag8 = "Placeholder8"
const Diag9 = "Placeholder9"
const Diag10 = "Placeholder10"
const Diag11 = "Placeholder11"
const Diag12 = "Placeholder12"
const Diag13 = "Oh goody what have we here? I think I see someone with too much to bear! Answer some riddles I'm sure you can handle, and in return I'll give you an apple!"
const Diag14 = "Wait, why do you want riddles?"
const Diag15 = "Oh uh, I guess I can answer some riddles"
const Diag16 = "Knowledge is my power! My dear young friend! It will help you always until the end."
const Diag17 = "Yes that's correct horray for you, but don't celebrate yet, prepare for round two!"
const Diag18 = "Oh fnatastic I couldn't have asked for more, keep that train going cuz this ain't a bore"
const Diag19 = "Oh joyous fantastic this is wonderful news, you've proven you're worthy of this honeydew, so go on your way wish a smile and buck, I sincerely with you the best of luck"

//End of dialog storage

const TUTORIAL_QUEST_ID = "Tutorial";
const RIDDLE_QUEST_ID = "Riddle";

function defineTutorialQuest() {
    world.quests.defineQuest({
        id: TUTORIAL_QUEST_ID,
        title: "Tutorial",
        description: "Basics",
        stages: [
            { id: "find_light",           description: "It's dark, find a light source" },
            { id: "find_key",    description: "Find a key to get out the cabin" },
            { id: "find_leave", description: "Okay, now use the key and get out" },
            { id: "left", description: "Good, You're on your own now" }
        ]
    });
}

function defineRiddleQuest() {
    world.quests.defineQuest({
        id: RIDDLE_QUEST_ID,
        title: "The Riddle Roads",
        description: "What has rings without having fingers, and leaves without going anywhere",
        stages: [
            { id: "riddle1",           description: "Solve the first riddle and go through the right path" },
            { id: "riddle2", description: "Solve the second riddle and go through the right path" },
            { id: "riddle3", description: "Solve the third riddle and go through the right path" },
            { id: "passed", description: "Don't worry, we're done with riddles, for now..." }
        ]
    });
}


// ============================================================
// Dialog + Quest wiring (Backlog #4, #5, #13)
// Owner: Abhishek Subramanian
// Instantiates the dialog/quest systems and registers all quests.
// ============================================================

const LONGNECKED_QUEST_ID = "long-necked-man";
const LONGNECKED_NPC = { id: "long_necked_man", name: "Long-Necked Man" };

const TREE_QUEST_ID = "apple-tree";
const TREE_NPC = { id: "apple_tree", name: "The Apple Tree" };

function defineLongNeckedManQuest() {
    world.quests.defineQuest({
        id: LONGNECKED_QUEST_ID,
        title: "The Long-Necked Man",
        description: "A pale figure in the clearing seems to want something from you.",
        stages: [
            { id: "met",           description: "Spoke to the Long-Necked Man." },
            { id: "find_apple",    description: "Find an apple to bring back to him." },
            { id: "path_revealed", description: "He hands you the diving suit and asks wishes of luck to you." }
        ]
    });
}

function defineTreeQuest() {
    world.quests.defineQuest({
        id: TREE_QUEST_ID,
        title: "The Apple Tree",
        description: "What has rings without having fingers, and leaves without going anywhere",
        stages: [
            { id: "met",           description: "Spoke to the Apple Tree" },
            { id: "answer_riddle1",    description: "Answer the first riddle" },
            { id: "answer_riddle2", description: "Answer the second riddle" },
            { id: "answer_riddle3", description: "Answer the third riddle" },
            { id: "apple_received", description: "An apple gotten, time to give it back" }
        ]
    });
}

function setupDialogAndQuestSystems() {
    world.dialog = new DialogSystem(world);
    world.quests = new QuestSystem(world);
    defineLongNeckedManQuest();
    defineTreeQuest();
    defineTutorialQuest();
    defineRiddleQuest();
    world.quests.setStage(TUTORIAL_QUEST_ID, "find_light");

    // Diagnostics
    world.dialog.on("onResponse", (p) => console.log("[dialog] response:", p));
    world.quests.on("onStageChange", (p) => console.log("[quest] stage change:", p.quest.id, "->", p.stage));
    world.quests.on("onQuestComplete", (p) => console.log("[quest] complete:", p.quest.id));

    initAmbientMusic();
}


function openTreeDialog() {
    world.dialog.startDialog(TREE_NPC);

    // Branch by quest stage (first-meeting / mid-quest / post-completion pools)
    const stage = world.quests.getStage(TREE_QUEST_ID);
    const stageId = stage ? stage.id : null;

    if (world.quests.isComplete(TREE_QUEST_ID))   scenePostTreeQuest();
    else if (stageId === "answer_riddle1")            sceneRiddle1();
    else if (stageId === "answer_riddle2")            sceneRiddle2();
    else if (stageId === "answer_riddle3")            sceneRiddle3();
    else                                          sceneFirstTreeMeeting();
}

function sceneFirstTreeMeeting() {
    world.dialog.say(Diag13);
    world.quests.setStage(TREE_QUEST_ID, "met");
    world.dialog.setChoices([
        { label: Diag14,                    value: "forgot" },
        { label: Diag15, value: "ask_path" }
    ], function (value) {
        if (value === "forgot") {
            world.dialog.say(Diag16);
            world.dialog.setChoices([ { label: Diag15, value: "ask_path" }], function () { sceneRiddle1()});
            world.dialog.addLeaveOption();
        }
        if (value === "ask_path") sceneRiddle1();
    });
    world.dialog.addLeaveOption();
}

const RIDDLE1_ANSWERS = ["cold", "colds", "sickness", "a cold"];
const isRiddle1Correct = (answer) => RIDDLE1_ANSWERS.includes(answer.toLowerCase().trim());

function sceneRiddle1() {
    console.log("this")
    world.dialog.say(
        "What can you catch, but not throw?"
    );
    console.log("this")
    world.dialog.setFreeTextInput("Type your answer", handleRiddle1Answer);
}

function sceneRiddle1Retry() {
    world.dialog.say("No, no... think harder. What can you catch, but not throw?");
    world.dialog.setFreeTextInput("Try again", handleRiddle1Answer);
}

function handleRiddle1Answer(answer) {
    console.log("thihs")
    if (!isRiddle1Correct(answer)) { sceneRiddle1Retry(); return; }
    if (!world.quests.isActive(TREE_QUEST_ID) && !world.quests.isComplete(TREE_QUEST_ID)) {
        world.quests.startQuest(TREE_QUEST_ID);
    }
    world.quests.setStage(TREE_QUEST_ID, "answer_riddle1");
    sceneRiddle1Solved();
}

function sceneRiddle1Solved() {
    world.dialog.say(
        Diag17
    );
    world.dialog.setChoices([
        { label: "I'm ready for the second puzzle",             value: "clarify" }
    ], function (value) {
        sceneRiddle2();
    });
}

const RIDDLE2_ANSWERS = ["clock", "clocks", "the clock", "a clock"];
const isRiddle2Correct = (answer) => RIDDLE2_ANSWERS.includes(answer.toLowerCase().trim());

function sceneRiddle2() {
    world.dialog.say(
        "What has hands but cannot clap?"
    );
    world.dialog.setFreeTextInput("Type your answer", handleRiddle2Answer);
}

function sceneRiddle2Retry() {
    world.dialog.say("No, no... think harder. What has hands but cannot clap?");
    world.dialog.setFreeTextInput("Try again", handleRiddle2Answer);
}

function handleRiddle2Answer(answer) {
    if (!isRiddle2Correct(answer)) { sceneRiddle2Retry(); return; }
    if (!world.quests.isActive(TREE_QUEST_ID) && !world.quests.isComplete(TREE_QUEST_ID)) {
        world.quests.startQuest(TREE_QUEST_ID);
    }
    world.quests.setStage(TREE_QUEST_ID, "answer_riddle2");
    sceneRiddle2Solved();
}

function sceneRiddle2Solved() {
    world.dialog.say(
        Diag18
    );
    world.dialog.setChoices([
        { label: "I'm ready for the third puzzle",             value: "clarify" }
    ], function (value) {
        sceneRiddle3();
    });
}

const RIDDLE3_ANSWERS = ["redpaint", "redpaints", "red paint", "red paints", "the redpaint", "the redpaints", "the red paint", "the red paints"];
const isRiddle3Correct = (answer) => RIDDLE3_ANSWERS.includes(answer.toLowerCase().trim());

function sceneRiddle3() {
    world.dialog.say(
        "What is red and smells like blue paint?"
    );
    world.dialog.setFreeTextInput("Type your answer", handleRiddle3Answer);
}

function sceneRiddle3Retry() {
    world.dialog.say("No, no... think harder. What is red and smells like blue paint?");
    world.dialog.setFreeTextInput("Try again", handleRiddle3Answer);
}

function handleRiddle3Answer(answer) {
    if (!isRiddle3Correct(answer)) { sceneRiddle3Retry(); return; }
    if (!world.quests.isActive(TREE_QUEST_ID) && !world.quests.isComplete(TREE_QUEST_ID)) {
        world.quests.startQuest(TREE_QUEST_ID);
    }
    world.quests.nextStage(TREE_QUEST_ID);
    sceneRiddle3Solved();
}

function sceneRiddle3Solved() {
    receiveItem("apple")
    world.dialog.say(
        Diag19
    );
    world.quests.nextStage(TREE_QUEST_ID);
    world.dialog.addLeaveOption("Thank You, Goodbye");
}

// Required by openTreeDialog when the tree quest is complete.
function scenePostTreeQuest() {
    world.dialog.say("The smiling tree rustles softly. It seems content with you now.");
    world.dialog.setChoices([], null);
    world.dialog.addLeaveOption("Farewell");
}

// ============================================================
// Long-Necked Man dialog flow
// Owner: Abhishek Subramanian
// Branches on quest stage so the NPC remembers prior meetings.
// ============================================================

function openLongNeckedManDialog() {
    world.dialog.startDialog(LONGNECKED_NPC);

    const stage = world.quests.getStage(LONGNECKED_QUEST_ID);
    const stageId = stage ? stage.id : null;

    if (world.quests.isComplete(LONGNECKED_QUEST_ID))   scenePostQuest();
    else if (stageId === "find_apple")                  sceneMidQuest();
    else                                                sceneFirstMeeting();
}

function sceneFirstMeeting() {
    world.dialog.say(Diag1);
    world.dialog.setChoices([
        { label: Diag2,                    value: "forgot" },
        { label: Diag3, value: "ask_path" }
    ], function (value) {
        if (value === "forgot") {
            world.dialog.say(Diag4);
            world.dialog.setChoices([ { label: Diag3, value: "ask_path" }], function () { sceneApplePath()});
            world.dialog.addLeaveOption();
        }
        if (value === "ask_path") sceneApplePath();
    });
    world.dialog.addLeaveOption();
}

function sceneApplePath() {
    world.dialog.say(
        Diag5
    );
    if (!world.quests.isActive(LONGNECKED_QUEST_ID) && !world.quests.isComplete(LONGNECKED_QUEST_ID)) {
        world.quests.startQuest(LONGNECKED_QUEST_ID);
    }
    world.quests.setStage(LONGNECKED_QUEST_ID, "find_apple");

    world.dialog.setChoices([
        { label: Diag6, value: "agree" }
    ], function () {
        world.dialog.say(Diag7);
        world.dialog.setChoices([], null);
        world.dialog.addLeaveOption();
    });
    world.dialog.addLeaveOption();
}

function sceneMidQuest() {
    world.dialog.say(Diag8);
    world.dialog.setChoices([
        { label: Diag9, value: "not_yet" },
        // Inventory-gated: hidden when player has no apple (per spec)
        {
            label: Diag10,
            value: "give_apple",
            condition: (world) => playerHasItem(world, "apple")
        }
    ], function (value) {
        if (value === "give_apple") {
            if (giveItem("apple")) {
                world.quests.setStage(LONGNECKED_QUEST_ID, "path_revealed");
                world.dialog.say(
                    Diag12
                );
                receiveItem("divingHelmet")
            } else {
                world.dialog.say("Empty hands, little wanderer. Do not offer what you do not carry.");
            }
        } else {
            world.dialog.say(Diag11);
        }
        world.dialog.setChoices([], null);
        world.dialog.addLeaveOption(value === "give_apple" ? "Goodbye" : "Leave");
    });
}

function scenePostQuest() {
    world.dialog.say("Safe travels, little wanderer.");
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


//Inventory-Dialogue Integration - Sanika

// Conversation Item Integration
// Lets dialogue use existing inventory helpers during conversations.

function giveItem(itemId) {
    if (!playerHasItem(world, itemId)) {
        return false;
    }

    removeItem(itemId);
    renderInventory();
    return true;
}

function receiveItem(itemId) {
    if (!world.items.get(itemId)) {
        console.log("receiveItem failed. Item does not exist:", itemId);
        return false;
    }

    if (playerHasItem(world, itemId)) {
        console.log("Player already as item")
        return false;
    }

    addItem(itemId);
    renderInventory();
    return true;
}