/**
 * Escape from Duxbury - State Management
 * Pure state management with clean separation of concerns
 */

const GameState = (function() {
    // Private state
    let state = {
        // Player info
        player: {
            name: 'Alex',
            health: 100,
            infection: 0
        },
        
        // Current game status
        currentScene: 'harbor',
        currentAction: 'look',
        selectedItem: null,
        
        // Inventory - resources needed to escape
        inventory: [],
        
        // Boat building progress
        boatProgress: {
            hull: false,      // Requires: wood x3
            sail: false,      // Requires: rope x2, cloth x1
            supplies: false   // Requires: food x5, medicine x2
        },
        
        // Scene states (what's been discovered, taken, etc.)
        sceneStates: {
            harbor: {
                visited: true,
                hotspots: {
                    dock: { examined: false },
                    boat_wreck: { examined: false, looted: false },
                    shed: { examined: false, unlocked: false }
                }
            },
            downtown: {
                visited: false,
                hotspots: {}
            },
            forest: {
                visited: false,
                hotspots: {}
            }
        },
        
        // Dialog/encounter state
        activeDialog: null,
        dialogHistory: [],
        
        // Survivors met
        survivors: {},
        
        // Game flags
        flags: {
            gameStarted: true,
            gameOver: false,
            escaped: false
        },
        
        // Random events
        dayCount: 1,
        lastEventDay: 0
    };
    
    // Subscribers for state changes
    const subscribers = [];
    
    // Deep clone utility
    function deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }
    
    // Notify all subscribers of state change
    function notifySubscribers(changedKey) {
        subscribers.forEach(callback => callback(state, changedKey));
    }
    
    return {
        // Get current state (returns a copy to prevent direct mutation)
        getState: function() {
            return deepClone(state);
        },
        
        // Get specific part of state
        get: function(key) {
            const keys = key.split('.');
            let value = state;
            for (const k of keys) {
                if (value === undefined) return undefined;
                value = value[k];
            }
            return deepClone(value);
        },
        
        // Update state with partial updates
        setState: function(updates) {
            state = { ...state, ...updates };
            notifySubscribers(Object.keys(updates));
        },
        
        // Set nested property using dot notation
        set: function(key, value) {
            const keys = key.split('.');
            let obj = state;
            for (let i = 0; i < keys.length - 1; i++) {
                if (obj[keys[i]] === undefined) {
                    obj[keys[i]] = {};
                }
                obj = obj[keys[i]];
            }
            obj[keys[keys.length - 1]] = value;
            notifySubscribers([key]);
        },
        
        // Subscribe to state changes
        subscribe: function(callback) {
            subscribers.push(callback);
            return function unsubscribe() {
                const index = subscribers.indexOf(callback);
                if (index > -1) {
                    subscribers.splice(index, 1);
                }
            };
        },
        
        // Reset to initial state
        reset: function() {
            state = {
                player: { name: 'Alex', health: 100, infection: 0 },
                currentScene: 'harbor',
                currentAction: 'look',
                selectedItem: null,
                inventory: [],
                boatProgress: { hull: false, sail: false, supplies: false },
                sceneStates: {
                    harbor: {
                        visited: true,
                        hotspots: {
                            dock: { examined: false },
                            boat_wreck: { examined: false, looted: false },
                            shed: { examined: false, unlocked: false }
                        }
                    },
                    downtown: { visited: false, hotspots: {} },
                    forest: { visited: false, hotspots: {} }
                },
                activeDialog: null,
                dialogHistory: [],
                survivors: {},
                flags: { gameStarted: true, gameOver: false, escaped: false },
                dayCount: 1,
                lastEventDay: 0
            };
            notifySubscribers(['reset']);
        },
        
        // Save state to localStorage
        save: function() {
            try {
                localStorage.setItem('duxbury_save', JSON.stringify(state));
                return true;
            } catch (e) {
                console.error('Failed to save game:', e);
                return false;
            }
        },
        
        // Load state from localStorage
        load: function() {
            try {
                const saved = localStorage.getItem('duxbury_save');
                if (saved) {
                    state = JSON.parse(saved);
                    notifySubscribers(['load']);
                    return true;
                }
                return false;
            } catch (e) {
                console.error('Failed to load game:', e);
                return false;
            }
        },
        
        // Check if save exists
        hasSave: function() {
            return localStorage.getItem('duxbury_save') !== null;
        }
    };
})();
