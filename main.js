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
init()