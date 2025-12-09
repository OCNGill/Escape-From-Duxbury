/**
 * Escape from Duxbury - Main Game Controller
 * Ties all systems together
 */

const Game = (function() {
    // Game variables
    let canvas, ctx;
    let hotspots = [];
    let hoveredHotspot = null;
    let animationTime = 0;
    let lastTime = 0;
    let messageQueue = [];
    let isShowingMessage = false;
    
    // Initialize the game
    function init() {
        console.log('Initializing Escape from Duxbury...');
        
        // Get canvas reference
        canvas = document.getElementById('game-canvas');
        ctx = canvas.getContext('2d');
        
        // Initialize renderer
        Renderer.init();
        
        // Set up event listeners
        setupEventListeners();
        
        // Subscribe to state changes
        GameState.subscribe(onStateChange);
        
        // Initial render
        render();
        
        // Start game loop
        requestAnimationFrame(gameLoop);
        
        // Show welcome message
        showMessage("Welcome to Duxbury Harbor. The apocalypse has left this coastal town in ruins. Your goal: gather supplies and build a boat to escape.");
        
        console.log('Game initialized!');
    }
    
    // Main game loop
    function gameLoop(timestamp) {
        const deltaTime = timestamp - lastTime;
        lastTime = timestamp;
        animationTime += deltaTime * 0.001;
        
        render();
        requestAnimationFrame(gameLoop);
    }
    
    // Render the game
    function render() {
        const state = GameState.getState();
        hotspots = Renderer.render(state, animationTime, hoveredHotspot);
        
        // Render inventory
        Inventory.renderInventory(state.inventory, state.selectedItem);
    }
    
    // Set up all event listeners
    function setupEventListeners() {
        // Canvas mouse events
        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('click', handleClick);
        
        // Action buttons
        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', handleActionClick);
        });
        
        // Inventory clicks
        document.getElementById('inventory-list').addEventListener('click', handleInventoryClick);
        
        // Save/Load buttons
        document.getElementById('save-btn').addEventListener('click', handleSave);
        document.getElementById('load-btn').addEventListener('click', handleLoad);
        
        // Dialog choices
        document.getElementById('dialog-choices').addEventListener('click', handleDialogChoice);
        
        // Keyboard shortcuts
        document.addEventListener('keydown', handleKeyDown);
    }
    
    // Handle mouse movement over canvas
    function handleMouseMove(e) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Check if mouse is over any hotspot
        hoveredHotspot = null;
        for (const hotspot of hotspots) {
            if (x >= hotspot.x && x <= hotspot.x + hotspot.width &&
                y >= hotspot.y && y <= hotspot.y + hotspot.height) {
                hoveredHotspot = hotspot;
                canvas.style.cursor = 'pointer';
                break;
            }
        }
        
        if (!hoveredHotspot) {
            canvas.style.cursor = 'crosshair';
        }
    }
    
    // Handle canvas clicks
    function handleClick(e) {
        if (!hoveredHotspot) {
            showMessage("Nothing interesting there.");
            return;
        }
        
        const state = GameState.getState();
        const action = state.currentAction;
        
        // Handle exit clicks differently
        if (hoveredHotspot.isExit && action === 'use') {
            handleSceneChange(hoveredHotspot.destination);
            return;
        }
        
        // Execute action on hotspot
        const result = Scenes.executeAction(
            state.currentScene,
            hoveredHotspot.id,
            action,
            state
        );
        
        // Process result
        processActionResult(result);
    }
    
    // Process action results
    function processActionResult(result) {
        if (!result) return;
        
        // Show message
        if (result.message) {
            showMessage(result.message);
        }
        
        // Add item to inventory
        if (result.addItem) {
            const inventory = GameState.get('inventory');
            const newInventory = Inventory.addItem(inventory, result.addItem);
            GameState.set('inventory', newInventory);
            showMessage(`Added ${result.addItem.name} to inventory!`, true);
        }
        
        // Add multiple items
        if (result.addItems) {
            let inventory = GameState.get('inventory');
            const itemNames = [];
            result.addItems.forEach(item => {
                inventory = Inventory.addItem(inventory, item);
                itemNames.push(`${item.name}${item.quantity > 1 ? ' x' + item.quantity : ''}`);
            });
            GameState.set('inventory', inventory);
            showMessage(`Found: ${itemNames.join(', ')}!`, true);
        }
        
        // Update hotspot state
        if (result.updateHotspot) {
            const { scene, hotspot, updates } = result.updateHotspot;
            const sceneStates = GameState.get('sceneStates');
            const hotspotState = sceneStates[scene].hotspots[hotspot] || {};
            sceneStates[scene].hotspots[hotspot] = { ...hotspotState, ...updates };
            GameState.set('sceneStates', sceneStates);
        }
        
        // Change scene
        if (result.changeScene) {
            handleSceneChange(result.changeScene);
        }
    }
    
    // Handle scene changes
    function handleSceneChange(newScene) {
        const currentScene = GameState.get('currentScene');
        
        if (!Scenes.canTravel(currentScene, newScene)) {
            showMessage("You can't go that way from here.");
            return;
        }
        
        GameState.set('currentScene', newScene);
        
        const sceneData = Scenes.getScene(newScene);
        if (sceneData) {
            showMessage(`You arrive at ${sceneData.name}. ${sceneData.description}`);
            
            // Mark scene as visited
            const sceneStates = GameState.get('sceneStates');
            if (sceneStates[newScene]) {
                sceneStates[newScene].visited = true;
                GameState.set('sceneStates', sceneStates);
            }
        }
    }
    
    // Handle action button clicks
    function handleActionClick(e) {
        const action = e.target.dataset.action;
        if (!action) return;
        
        // Update current action
        GameState.set('currentAction', action);
        
        // Update button states
        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        e.target.classList.add('active');
        
        showMessage(`Action set to: ${action.toUpperCase()}`);
    }
    
    // Handle inventory clicks
    function handleInventoryClick(e) {
        const itemEl = e.target.closest('.inventory-item');
        if (!itemEl) return;
        
        const itemId = itemEl.dataset.itemId;
        const currentSelected = GameState.get('selectedItem');
        
        if (currentSelected === itemId) {
            // Deselect
            GameState.set('selectedItem', null);
            showMessage("Item deselected.");
        } else {
            // Select item
            GameState.set('selectedItem', itemId);
            const itemData = Inventory.getItemData(itemId);
            showMessage(`Selected: ${itemData?.name || itemId}. ${itemData?.description || ''}`);
        }
    }
    
    // Handle save
    function handleSave() {
        if (GameState.save()) {
            showMessage("Game saved successfully!");
        } else {
            showMessage("Failed to save game.");
        }
    }
    
    // Handle load
    function handleLoad() {
        if (GameState.load()) {
            showMessage("Game loaded successfully!");
            render();
        } else {
            showMessage("No saved game found.");
        }
    }
    
    // Handle dialog choices
    function handleDialogChoice(e) {
        const choiceBtn = e.target.closest('.dialog-choice');
        if (!choiceBtn) return;
        
        if (choiceBtn.dataset.endDialog) {
            Dialog.endDialog();
            Dialog.renderDialog(null);
            return;
        }
        
        const choiceIndex = parseInt(choiceBtn.dataset.choiceIndex);
        const result = Dialog.chooseOption(choiceIndex);
        
        if (result) {
            Dialog.renderDialog(result);
            
            // Handle dialog effects
            if (result.giveItem) {
                const inventory = GameState.get('inventory');
                const newInventory = Inventory.addItem(inventory, result.giveItem);
                GameState.set('inventory', newInventory);
            }
            
            if (result.infectionGain) {
                const player = GameState.get('player');
                player.infection = Math.min(100, player.infection + result.infectionGain);
                GameState.set('player', player);
                showMessage(`Warning: Infection level increased to ${player.infection}%`, true);
            }
        }
    }
    
    // Handle keyboard shortcuts
    function handleKeyDown(e) {
        switch (e.key.toLowerCase()) {
            case 'l':
                GameState.set('currentAction', 'look');
                updateActionButtons('look');
                break;
            case 't':
                GameState.set('currentAction', 'take');
                updateActionButtons('take');
                break;
            case 'u':
                GameState.set('currentAction', 'use');
                updateActionButtons('use');
                break;
            case 'k':
                GameState.set('currentAction', 'talk');
                updateActionButtons('talk');
                break;
            case 's':
                if (e.ctrlKey) {
                    e.preventDefault();
                    handleSave();
                }
                break;
            case 'escape':
                Dialog.endDialog();
                Dialog.renderDialog(null);
                GameState.set('selectedItem', null);
                break;
        }
    }
    
    // Update action button states
    function updateActionButtons(action) {
        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.action === action);
        });
    }
    
    // Show message in message box
    function showMessage(text, append = false) {
        const messageEl = document.getElementById('message-text');
        
        if (append && messageEl.textContent) {
            messageEl.textContent += '\n' + text;
        } else {
            messageEl.textContent = text;
        }
    }
    
    // Handle state changes
    function onStateChange(state, changedKeys) {
        // Check for game over conditions
        if (state.player.infection >= 100) {
            showMessage("The infection has taken hold. Your journey ends here...");
            GameState.set('flags.gameOver', true);
        }
        
        // Check for victory
        if (Inventory.canBuildBoat(state.inventory) && !state.flags.escaped) {
            showMessage("You have gathered all the supplies needed to build your boat! Return to the harbor to escape!");
        }
    }
    
    // Public API
    return {
        init
    };
})();

// Start the game when DOM is ready
document.addEventListener('DOMContentLoaded', Game.init);
