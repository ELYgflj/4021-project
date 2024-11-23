class Maze {
    constructor(portals, itemLocations) {
        this.portals = portals; // Array of portal locations
        this.itemLocations = itemLocations; // Array of item locations
        this.items = []; // Array to hold current items
        this.initializeItems(); // Initialize items in the maze
    }

    initializeItems() {
        this.itemLocations.forEach(location => {
            const itemType = Math.floor(Math.random() * 3) + 1; // Randomize item type (1-3)
            const item = new Item(location.x, location.y, itemType);
            this.items.push(item);
        });
    }

    // Method to regenerate items after collection
    regenerateItems() {
        this.items = [];
        this.initializeItems();
    }
}