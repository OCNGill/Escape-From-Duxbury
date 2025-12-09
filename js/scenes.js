/**
 * Escape from Duxbury - Scene System
 * Manages scene interactions and hotspot actions
 */

const Scenes = (function() {
    // Scene definitions with interaction logic
    const sceneData = {
        harbor: {
            name: 'Duxbury Harbor',
            description: 'The harbor is eerily quiet. Abandoned boats and debris litter the shore.',
            ambientMessages: [
                'Seagulls cry in the distance.',
                'The smell of salt and decay fills the air.',
                'Waves lap gently against the broken docks.',
                'You hear something moving in the water...'
            ],
            hotspotActions: {
                dock: {
                    look: () => ({
                        message: 'The wooden dock extends into the murky water. Most planks are rotted, but it\'s still walkable. A few rusted cleats remain bolted to the wood.'
                    }),
                    take: () => ({
                        message: 'The dock is too large to take. Maybe you can find loose wood elsewhere.'
                    }),
                    use: (state) => {
                        if (state.selectedItem === 'fishing_rod') {
                            return {
                                message: 'You cast your line into the water... After a few minutes, you catch a small fish!',
                                addItem: { id: 'fish', name: 'Fish', type: 'food', quantity: 1 }
                            };
                        }
                        return { message: 'You need something to use here.' };
                    }
                },
                boat_wreck: {
                    look: (state) => {
                        const boatState = state.sceneStates.harbor.hotspots.boat_wreck;
                        if (boatState.looted) {
                            return { message: 'A wrecked fishing boat, its hull cracked open. You\'ve already taken everything useful.' };
                        }
                        return { message: 'A fishing boat lies on its side, hull cracked open. Through the damage, you can see some rope and what looks like a toolbox.' };
                    },
                    take: (state) => {
                        const boatState = state.sceneStates.harbor.hotspots.boat_wreck;
                        if (boatState.looted) {
                            return { message: 'You\'ve already searched this wreck thoroughly.' };
                        }
                        return {
                            message: 'You carefully climb into the wreck and salvage what you can: a coil of rope and an old toolbox with some tools inside.',
                            addItems: [
                                { id: 'rope', name: 'Rope', type: 'resource', quantity: 2 },
                                { id: 'tools', name: 'Basic Tools', type: 'tool', quantity: 1 }
                            ],
                            updateHotspot: {
                                scene: 'harbor',
                                hotspot: 'boat_wreck',
                                updates: { looted: true, examined: true }
                            }
                        };
                    },
                    use: () => ({
                        message: 'The boat is too damaged to be useful. Better to salvage what you can.'
                    })
                },
                shed: {
                    look: (state) => {
                        const shedState = state.sceneStates.harbor.hotspots.shed;
                        if (shedState.unlocked) {
                            return { message: 'The storage shed door hangs open. Inside you can see shelves with various supplies.' };
                        }
                        return { message: 'A weathered storage shed with a rusty padlock on the door. The lock looks old but sturdy.' };
                    },
                    take: (state) => {
                        const shedState = state.sceneStates.harbor.hotspots.shed;
                        if (!shedState.unlocked) {
                            return { message: 'The shed is locked. You need to find a way to open it first.' };
                        }
                        if (shedState.looted) {
                            return { message: 'You\'ve already taken everything useful from the shed.' };
                        }
                        return {
                            message: 'Inside the shed you find: planks of wood, a first aid kit, and some canned food!',
                            addItems: [
                                { id: 'wood', name: 'Wood Planks', type: 'resource', quantity: 3 },
                                { id: 'medicine', name: 'First Aid Kit', type: 'medicine', quantity: 1 },
                                { id: 'food', name: 'Canned Food', type: 'food', quantity: 2 }
                            ],
                            updateHotspot: {
                                scene: 'harbor',
                                hotspot: 'shed',
                                updates: { looted: true }
                            }
                        };
                    },
                    use: (state) => {
                        const shedState = state.sceneStates.harbor.hotspots.shed;
                        if (shedState.unlocked) {
                            return { message: 'The shed is already open.' };
                        }
                        if (state.selectedItem === 'tools') {
                            return {
                                message: 'Using your tools, you manage to break the rusty padlock! The shed door swings open.',
                                updateHotspot: {
                                    scene: 'harbor',
                                    hotspot: 'shed',
                                    updates: { unlocked: true }
                                }
                            };
                        }
                        if (state.selectedItem === 'crowbar') {
                            return {
                                message: 'You pry off the padlock with the crowbar. The shed is now accessible.',
                                updateHotspot: {
                                    scene: 'harbor',
                                    hotspot: 'shed',
                                    updates: { unlocked: true }
                                }
                            };
                        }
                        return { message: 'You need a tool to break this lock.' };
                    }
                },
                exit_downtown: {
                    look: () => ({
                        message: 'A cracked asphalt road leads toward the center of town. You can see some buildings in the distance.'
                    }),
                    take: () => ({
                        message: 'You can\'t take a path. Try walking on it instead.'
                    }),
                    use: () => ({
                        message: 'You head toward downtown Duxbury...',
                        changeScene: 'downtown'
                    })
                },
                exit_forest: {
                    look: () => ({
                        message: 'A dirt trail disappears into thick pine trees. It\'s darker in there.'
                    }),
                    take: () => ({
                        message: 'You can\'t take a path. Try walking on it instead.'
                    }),
                    use: () => ({
                        message: 'You venture into the forest...',
                        changeScene: 'forest'
                    })
                }
            }
        },
        
        downtown: {
            name: 'Downtown Duxbury',
            description: 'The main street is littered with abandoned cars and debris.',
            ambientMessages: [
                'A shop sign creaks in the wind.',
                'Glass crunches under your feet.',
                'You think you see movement in a window...'
            ],
            hotspotActions: {}
        },
        
        forest: {
            name: 'Duxbury Forest',
            description: 'Tall pines block most of the light. The forest feels alive... and watching.',
            ambientMessages: [
                'Branches snap somewhere nearby.',
                'Birds suddenly go silent.',
                'The wind whispers through the trees.'
            ],
            hotspotActions: {}
        }
    };
    
    // Get scene data
    function getScene(sceneId) {
        return sceneData[sceneId] || null;
    }
    
    // Execute hotspot action
    function executeAction(sceneId, hotspotId, action, state) {
        const scene = sceneData[sceneId];
        if (!scene || !scene.hotspotActions[hotspotId]) {
            return { message: 'Nothing interesting here.' };
        }
        
        const hotspotActions = scene.hotspotActions[hotspotId];
        if (!hotspotActions[action]) {
            return { message: `You can't ${action} that.` };
        }
        
        return hotspotActions[action](state);
    }
    
    // Get random ambient message
    function getAmbientMessage(sceneId) {
        const scene = sceneData[sceneId];
        if (!scene || !scene.ambientMessages.length) {
            return null;
        }
        const index = Math.floor(Math.random() * scene.ambientMessages.length);
        return scene.ambientMessages[index];
    }
    
    // Handle scene transitions
    function canTravel(fromScene, toScene) {
        // Define valid transitions
        const connections = {
            harbor: ['downtown', 'forest'],
            downtown: ['harbor', 'forest'],
            forest: ['harbor', 'downtown']
        };
        
        return connections[fromScene]?.includes(toScene) || false;
    }
    
    return {
        getScene,
        executeAction,
        getAmbientMessage,
        canTravel
    };
})();
