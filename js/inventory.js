/**
 * Escape from Duxbury - Inventory System
 * Manages player inventory and item interactions
 */

const Inventory = (function() {
    // Item definitions
    const itemData = {
        wood: {
            name: 'Wood Planks',
            description: 'Sturdy wooden planks. Essential for building a boat hull.',
            type: 'resource',
            stackable: true,
            maxStack: 10,
            icon: '🪵'
        },
        rope: {
            name: 'Rope',
            description: 'Strong rope made from hemp. Useful for rigging and tying things together.',
            type: 'resource',
            stackable: true,
            maxStack: 5,
            icon: '🪢'
        },
        tools: {
            name: 'Basic Tools',
            description: 'A toolbox with hammer, screwdriver, and pliers. Can break locks and build things.',
            type: 'tool',
            stackable: false,
            icon: '🔧'
        },
        crowbar: {
            name: 'Crowbar',
            description: 'A heavy iron crowbar. Good for prying things open.',
            type: 'tool',
            stackable: false,
            icon: '🔩'
        },
        food: {
            name: 'Canned Food',
            description: 'Non-perishable canned food. Keeps you alive.',
            type: 'food',
            stackable: true,
            maxStack: 10,
            icon: '🥫'
        },
        fish: {
            name: 'Fish',
            description: 'A fresh fish. Should be eaten soon or it will spoil.',
            type: 'food',
            stackable: true,
            maxStack: 5,
            icon: '🐟'
        },
        medicine: {
            name: 'First Aid Kit',
            description: 'Basic medical supplies. Can treat injuries and reduce infection.',
            type: 'medicine',
            stackable: true,
            maxStack: 3,
            icon: '🏥'
        },
        cloth: {
            name: 'Cloth',
            description: 'Fabric salvaged from various sources. Can be used for sails or bandages.',
            type: 'resource',
            stackable: true,
            maxStack: 5,
            icon: '🧵'
        },
        key: {
            name: 'Rusty Key',
            description: 'An old key covered in rust. Might open something.',
            type: 'key',
            stackable: false,
            icon: '🔑'
        },
        fishing_rod: {
            name: 'Fishing Rod',
            description: 'A basic fishing rod. Use it at the dock to catch fish.',
            type: 'tool',
            stackable: false,
            icon: '🎣'
        }
    };
    
    // Get item data by ID
    function getItemData(itemId) {
        return itemData[itemId] || null;
    }
    
    // Add item to inventory
    function addItem(inventory, item) {
        const itemDef = itemData[item.id];
        if (!itemDef) {
            console.warn(`Unknown item: ${item.id}`);
            return inventory;
        }
        
        const newInventory = [...inventory];
        
        // Check if item is stackable and already exists
        if (itemDef.stackable) {
            const existingIndex = newInventory.findIndex(i => i.id === item.id);
            if (existingIndex !== -1) {
                const existing = newInventory[existingIndex];
                const newQuantity = Math.min(existing.quantity + (item.quantity || 1), itemDef.maxStack);
                newInventory[existingIndex] = { ...existing, quantity: newQuantity };
                return newInventory;
            }
        }
        
        // Add as new item
        newInventory.push({
            id: item.id,
            name: item.name || itemDef.name,
            quantity: item.quantity || 1
        });
        
        return newInventory;
    }
    
    // Remove item from inventory
    function removeItem(inventory, itemId, quantity = 1) {
        const newInventory = [...inventory];
        const index = newInventory.findIndex(i => i.id === itemId);
        
        if (index === -1) return inventory;
        
        const item = newInventory[index];
        if (item.quantity <= quantity) {
            newInventory.splice(index, 1);
        } else {
            newInventory[index] = { ...item, quantity: item.quantity - quantity };
        }
        
        return newInventory;
    }
    
    // Check if player has item
    function hasItem(inventory, itemId, quantity = 1) {
        const item = inventory.find(i => i.id === itemId);
        return item && item.quantity >= quantity;
    }
    
    // Get item count
    function getItemCount(inventory, itemId) {
        const item = inventory.find(i => i.id === itemId);
        return item ? item.quantity : 0;
    }
    
    // Render inventory to DOM
    function renderInventory(inventory, selectedItem) {
        const listEl = document.getElementById('inventory-list');
        listEl.innerHTML = '';
        
        if (inventory.length === 0) {
            listEl.innerHTML = '<li class="inventory-empty">Empty</li>';
            return;
        }
        
        inventory.forEach(item => {
            const itemDef = itemData[item.id];
            const li = document.createElement('li');
            li.className = 'inventory-item';
            if (selectedItem === item.id) {
                li.classList.add('selected');
            }
            
            const icon = itemDef?.icon || '📦';
            const quantity = item.quantity > 1 ? ` x${item.quantity}` : '';
            li.innerHTML = `${icon} ${item.name}${quantity}`;
            li.dataset.itemId = item.id;
            li.title = itemDef?.description || item.name;
            
            listEl.appendChild(li);
        });
    }
    
    // Check boat building progress
    function checkBoatProgress(inventory) {
        const progress = {
            hull: getItemCount(inventory, 'wood') >= 3,
            sail: getItemCount(inventory, 'rope') >= 2 && getItemCount(inventory, 'cloth') >= 1,
            supplies: getItemCount(inventory, 'food') >= 5 && getItemCount(inventory, 'medicine') >= 2
        };
        
        return progress;
    }
    
    // Check if boat can be built
    function canBuildBoat(inventory) {
        const progress = checkBoatProgress(inventory);
        return progress.hull && progress.sail && progress.supplies;
    }
    
    return {
        getItemData,
        addItem,
        removeItem,
        hasItem,
        getItemCount,
        renderInventory,
        checkBoatProgress,
        canBuildBoat
    };
})();
