/**
 * Escape from Duxbury - Dialog System
 * Handles survivor encounters and dialog trees
 */

const Dialog = (function() {
    // Dialog tree definitions
    const dialogTrees = {
        survivor_harbor: {
            id: 'survivor_harbor',
            name: 'Marcus',
            description: 'A weathered fisherman in his 50s',
            infected: false,
            portrait: '👨‍🦳',
            nodes: {
                start: {
                    text: "Hey there, survivor. Haven't seen another living soul in days. You look like you're trying to get out of here too.",
                    choices: [
                        { text: "I'm building a boat to escape. Know where I can find supplies?", next: 'supplies' },
                        { text: "Are you infected?", next: 'infected_check' },
                        { text: "Stay back! I don't trust anyone.", next: 'hostile' },
                        { text: "Goodbye.", next: 'end' }
                    ]
                },
                supplies: {
                    text: "Smart plan. The old marina shed has tools and wood. The key's probably still under the mat - old habits die hard. Downtown might have food, but it's crawling with... them.",
                    choices: [
                        { text: "What happened here?", next: 'backstory' },
                        { text: "Want to come with me?", next: 'join' },
                        { text: "Thanks for the info.", next: 'end_friendly' }
                    ]
                },
                infected_check: {
                    text: "*Shows you his arms* Clean as a whistle. You learn to check yourself every hour in this world. How about you?",
                    choices: [
                        { text: "I'm clean too. Just being careful.", next: 'trust_build' },
                        { text: "None of your business.", next: 'suspicious' },
                        { text: "Let's talk about something else.", next: 'start' }
                    ]
                },
                hostile: {
                    text: "*Steps back, hands raised* Easy there. I get it - trust is hard to come by. I'll keep my distance. Just know I'm not looking for trouble.",
                    choices: [
                        { text: "...Sorry. I've had some bad encounters.", next: 'trust_build' },
                        { text: "Just stay away from me.", next: 'end_hostile' }
                    ]
                },
                backstory: {
                    text: "Three weeks ago, something came from the sea. First the fish started dying, then people got sick. Within days... well, you've seen what's left. Duxbury was a quiet town. Now it's a tomb.",
                    choices: [
                        { text: "Is there anyone else alive?", next: 'others' },
                        { text: "I need to focus on escaping.", next: 'supplies' },
                        { text: "I'm sorry for your loss.", next: 'emotional' }
                    ]
                },
                others: {
                    text: "Saw some people holed up in the church downtown. Don't know if they're friendly. There's also... something in the forest. Heard screaming last night. I'd avoid it if I were you.",
                    choices: [
                        { text: "I'll check out the church.", next: 'church_info' },
                        { text: "What's in the forest?", next: 'forest_warning' },
                        { text: "Thanks. I should get moving.", next: 'end_friendly' }
                    ]
                },
                join: {
                    text: "I... appreciate the offer, but I'm too old for boats. Bad knees. I'll take my chances here. But take this - it's the last of my supplies. You'll need it more than me.",
                    choices: [
                        { text: "Thank you, Marcus. I won't forget this.", next: 'give_item' }
                    ],
                    giveItem: { id: 'food', name: 'Canned Food', quantity: 2 }
                },
                trust_build: {
                    text: "*Nods slowly* Good. We survivors need to stick together, even if just for information. Ask me anything.",
                    choices: [
                        { text: "Where can I find supplies?", next: 'supplies' },
                        { text: "What happened here?", next: 'backstory' },
                        { text: "Take care of yourself.", next: 'end_friendly' }
                    ]
                },
                suspicious: {
                    text: "*Eyes narrow* Fair enough. But if you start showing symptoms, do the right thing and stay away from others. That's all I ask.",
                    choices: [
                        { text: "I understand.", next: 'end' },
                        { text: "What are the symptoms?", next: 'symptoms' }
                    ]
                },
                symptoms: {
                    text: "Starts with a fever, then the veins turn dark. By day three, you stop being... you. If you see someone with blackened eyes, run. Don't try to help them. It's too late.",
                    choices: [
                        { text: "That's terrifying.", next: 'end' },
                        { text: "Is there a cure?", next: 'cure' }
                    ]
                },
                cure: {
                    text: "Rumor is the hospital in Plymouth had something - some kind of experimental treatment. But Plymouth's twenty miles away, and the roads... Let's just say walking isn't an option.",
                    choices: [
                        { text: "All the more reason to escape by sea.", next: 'supplies' },
                        { text: "Thanks for the warning.", next: 'end_friendly' }
                    ]
                },
                church_info: {
                    text: "St. John's, on Main Street. Saw candlelight in the windows two nights ago. Could be survivors, could be a trap. These days you never know.",
                    choices: [
                        { text: "I'll be careful.", next: 'end_friendly' }
                    ]
                },
                forest_warning: {
                    text: "*Voice drops to a whisper* Something wrong lives in those woods now. Not infected - something else. The trees move when they shouldn't. I heard voices calling my name... but there was no one there.",
                    choices: [
                        { text: "Sounds like you need rest.", next: 'end' },
                        { text: "I'll avoid the forest at night.", next: 'end_friendly' }
                    ]
                },
                emotional: {
                    text: "*Eyes glisten* My wife... she didn't make it. Thirty years together and I couldn't... *clears throat* You remind me why I keep going. Someone has to survive. Someone has to remember.",
                    choices: [
                        { text: "Her memory lives on through you.", next: 'give_item' },
                        { text: "I'll survive. For all of us.", next: 'end_friendly' }
                    ]
                },
                give_item: {
                    text: "*Hands you a small package* Here. My wife's emergency stash. She'd want it to help someone escape this nightmare. Good luck out there, friend.",
                    choices: [
                        { text: "Thank you. I'll make it count.", next: 'end_friendly' }
                    ],
                    giveItem: { id: 'medicine', name: 'First Aid Kit', quantity: 1 }
                },
                end: {
                    text: "*Nods silently*",
                    choices: [],
                    end: true
                },
                end_friendly: {
                    text: "Stay safe out there. And remember - trust your gut. It's kept me alive this long.",
                    choices: [],
                    end: true,
                    relationshipChange: 1
                },
                end_hostile: {
                    text: "*Backs away slowly, watching you with wary eyes*",
                    choices: [],
                    end: true,
                    relationshipChange: -1
                }
            }
        },
        
        infected_survivor: {
            id: 'infected_survivor',
            name: 'Unknown Woman',
            description: 'A woman with darkened veins visible on her neck',
            infected: true,
            portrait: '🧟‍♀️',
            nodes: {
                start: {
                    text: "*Stumbles toward you* P-please... help me... I can still think... it hasn't... *twitches violently*",
                    choices: [
                        { text: "Stay back! I can't help you.", next: 'reject' },
                        { text: "Is there anything that helps?", next: 'desperate_help' },
                        { text: "*Back away slowly*", next: 'flee' }
                    ]
                },
                reject: {
                    text: "*Sobs* I know... I know what I'm becoming. Just... if you find medicine... the hospital... there might be... *eyes flash black momentarily*",
                    choices: [
                        { text: "I'll look for a cure.", next: 'hope' },
                        { text: "I'm sorry.", next: 'end_sad' }
                    ]
                },
                desperate_help: {
                    text: "The fever... cold helps... but nothing stops it. They said there was something at Plymouth General... *grabs your arm suddenly*",
                    choices: [
                        { text: "*Pull away quickly*", next: 'contact', dangerCheck: true },
                        { text: "*Stay calm and listen*", next: 'info' }
                    ]
                },
                contact: {
                    text: "*You pull free but her nails scratched you* I'm sorry! I'm sorry! I can't control... you should run. RUN!",
                    choices: [
                        { text: "*Run away*", next: 'end_infected' }
                    ],
                    infectionRisk: 20
                },
                info: {
                    text: "*Manages to focus* Room 312... Dr. Chen's research... it's the only hope. But be careful... the hospital is... *loses focus, starts growling*",
                    choices: [
                        { text: "*Leave quickly*", next: 'end' }
                    ],
                    giveInfo: 'plymouth_hospital'
                },
                hope: {
                    text: "*A moment of clarity in her eyes* Thank you... even if it's a lie... thank you. Now go, before I... before...",
                    choices: [
                        { text: "*Leave*", next: 'end' }
                    ]
                },
                flee: {
                    text: "*She doesn't follow, just collapses to her knees, weeping*",
                    choices: [],
                    end: true
                },
                end_sad: {
                    text: "*Watches you go with hollow eyes*",
                    choices: [],
                    end: true
                },
                end: {
                    text: "*You leave as quickly as possible*",
                    choices: [],
                    end: true
                },
                end_infected: {
                    text: "*You flee, heart pounding. You check your arm - there's a small scratch. Was that enough to...*",
                    choices: [],
                    end: true,
                    infectionGain: 15
                }
            }
        }
    };
    
    let currentDialog = null;
    let currentNode = null;
    
    // Start a dialog
    function startDialog(dialogId) {
        currentDialog = dialogTrees[dialogId];
        if (!currentDialog) {
            console.error(`Dialog not found: ${dialogId}`);
            return null;
        }
        currentNode = currentDialog.nodes.start;
        return {
            speaker: currentDialog.name,
            portrait: currentDialog.portrait,
            text: currentNode.text,
            choices: currentNode.choices
        };
    }
    
    // Choose a dialog option
    function chooseOption(choiceIndex) {
        if (!currentNode || !currentNode.choices[choiceIndex]) {
            return null;
        }
        
        const choice = currentNode.choices[choiceIndex];
        const nextNodeId = choice.next;
        currentNode = currentDialog.nodes[nextNodeId];
        
        if (!currentNode) {
            console.error(`Node not found: ${nextNodeId}`);
            return null;
        }
        
        const result = {
            speaker: currentDialog.name,
            portrait: currentDialog.portrait,
            text: currentNode.text,
            choices: currentNode.choices,
            end: currentNode.end || false
        };
        
        // Handle special effects
        if (currentNode.giveItem) {
            result.giveItem = currentNode.giveItem;
        }
        if (currentNode.infectionRisk) {
            result.infectionRisk = currentNode.infectionRisk;
        }
        if (currentNode.infectionGain) {
            result.infectionGain = currentNode.infectionGain;
        }
        if (currentNode.relationshipChange) {
            result.relationshipChange = currentNode.relationshipChange;
        }
        if (currentNode.giveInfo) {
            result.giveInfo = currentNode.giveInfo;
        }
        
        return result;
    }
    
    // End current dialog
    function endDialog() {
        currentDialog = null;
        currentNode = null;
    }
    
    // Get available dialogs for a scene
    function getAvailableDialogs(sceneId, gameState) {
        // This would return NPCs available in the current scene
        // For now, return test dialog
        if (sceneId === 'harbor') {
            return ['survivor_harbor'];
        }
        return [];
    }
    
    // Render dialog UI
    function renderDialog(dialogData) {
        const modal = document.getElementById('dialog-modal');
        const textEl = document.getElementById('dialog-text');
        const choicesEl = document.getElementById('dialog-choices');
        
        if (!dialogData) {
            modal.classList.add('hidden');
            return;
        }
        
        modal.classList.remove('hidden');
        textEl.innerHTML = `<strong>${dialogData.portrait} ${dialogData.speaker}:</strong><br>${dialogData.text}`;
        
        choicesEl.innerHTML = '';
        dialogData.choices.forEach((choice, index) => {
            const btn = document.createElement('button');
            btn.className = 'dialog-choice';
            btn.textContent = choice.text;
            btn.dataset.choiceIndex = index;
            choicesEl.appendChild(btn);
        });
        
        // Add close button if dialog ended
        if (dialogData.end) {
            const closeBtn = document.createElement('button');
            closeBtn.className = 'dialog-choice';
            closeBtn.textContent = '[End conversation]';
            closeBtn.dataset.endDialog = 'true';
            choicesEl.appendChild(closeBtn);
        }
    }
    
    return {
        startDialog,
        chooseOption,
        endDialog,
        getAvailableDialogs,
        renderDialog
    };
})();
