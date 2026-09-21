/**
 * Escape from Duxbury - Canvas Renderer
 * Pixel art style rendering engine
 */

const Renderer = (function() {
    let canvas, ctx;
    let currentScene = null;
    
    // Color palette (retro/pixel art style)
    const PALETTE = {
        sky: '#4a6fa5',
        skyDark: '#2d4a6f',
        water: '#1a3a5c',
        waterLight: '#2d5a8c',
        sand: '#c9a959',
        sandDark: '#a08040',
        wood: '#6b4423',
        woodLight: '#8b5a2b',
        woodDark: '#4a2f17',
        grass: '#2d5a2d',
        grassLight: '#3d7a3d',
        stone: '#5a5a5a',
        stoneLight: '#7a7a7a',
        rust: '#8b4513',
        black: '#1a1a1a',
        white: '#f0f0f0',
        red: '#c94040',
        highlight: '#ffff00'
    };
    
    // Initialize the renderer
    function init() {
        canvas = document.getElementById('game-canvas');
        ctx = canvas.getContext('2d');
        
        // Disable anti-aliasing for pixel art look
        ctx.imageSmoothingEnabled = false;
    }
    
    // Clear the canvas
    function clear() {
        ctx.fillStyle = PALETTE.black;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    // Draw a filled rectangle
    function drawRect(x, y, width, height, color) {
        ctx.fillStyle = color;
        ctx.fillRect(Math.floor(x), Math.floor(y), Math.floor(width), Math.floor(height));
    }
    
    // Draw pixel art text
    function drawText(text, x, y, color = PALETTE.white, size = 12) {
        ctx.fillStyle = PALETTE.black;
        ctx.font = `${size}px "Courier New", monospace`;
        // Shadow for readability
        ctx.fillText(text, x + 1, y + 1);
        ctx.fillStyle = color;
        ctx.fillText(text, x, y);
    }
    
    // Draw a simple pixelated line
    function drawLine(x1, y1, x2, y2, color, thickness = 2) {
        ctx.strokeStyle = color;
        ctx.lineWidth = thickness;
        ctx.beginPath();
        ctx.moveTo(Math.floor(x1), Math.floor(y1));
        ctx.lineTo(Math.floor(x2), Math.floor(y2));
        ctx.stroke();
    }
    
    // Draw water with simple wave effect
    function drawWater(y, height, time) {
        const waveHeight = 3;
        for (let row = 0; row < height; row += 4) {
            const rowY = y + row;
            const shade = row / height;
            const color = shade > 0.5 ? PALETTE.water : PALETTE.waterLight;
            
            for (let x = 0; x < canvas.width; x += 8) {
                const waveOffset = Math.sin((x + time * 50) * 0.05) * waveHeight;
                drawRect(x, rowY + waveOffset, 8, 4, color);
            }
        }
    }
    
    // Draw sky with gradient effect
    function drawSky() {
        // Simple gradient using rectangles
        for (let y = 0; y < 200; y += 10) {
            const shade = y / 200;
            const r = Math.floor(74 + shade * 30);
            const g = Math.floor(111 + shade * 20);
            const b = Math.floor(165 - shade * 40);
            ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
            ctx.fillRect(0, y, canvas.width, 10);
        }
    }
    
    // Draw the harbor scene
    function drawHarborScene(state, time) {
        const hotspots = [];
        
        // Sky
        drawSky();
        
        // Sun (setting)
        ctx.fillStyle = '#ffaa44';
        ctx.beginPath();
        ctx.arc(550, 80, 40, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffcc66';
        ctx.beginPath();
        ctx.arc(550, 80, 30, 0, Math.PI * 2);
        ctx.fill();
        
        // Distant land/horizon
        drawRect(0, 180, canvas.width, 20, PALETTE.grassLight);
        
        // Water
        drawWater(200, 150, time);
        
        // Beach/shore
        drawRect(0, 340, canvas.width, 60, PALETTE.sand);
        drawRect(0, 340, canvas.width, 8, PALETTE.sandDark);
        
        // === DOCK ===
        // Main dock platform
        drawRect(50, 300, 200, 15, PALETTE.woodDark);
        drawRect(50, 300, 200, 8, PALETTE.wood);
        
        // Dock planks (detail)
        for (let x = 50; x < 250; x += 25) {
            drawLine(x, 300, x, 315, PALETTE.woodDark, 2);
        }
        
        // Dock supports
        drawRect(70, 315, 8, 40, PALETTE.woodDark);
        drawRect(130, 315, 8, 40, PALETTE.woodDark);
        drawRect(200, 315, 8, 40, PALETTE.woodDark);
        
        // Dock hotspot
        hotspots.push({
            id: 'dock',
            x: 50, y: 300,
            width: 200, height: 55,
            name: 'Wooden Dock',
            description: 'An old fishing dock. Most of the boats are gone or destroyed.'
        });
        
        // === WRECKED BOAT ===
        const boatState = state.sceneStates?.harbor?.hotspots?.boat_wreck || {};
        
        // Boat hull (tilted)
        ctx.save();
        ctx.translate(400, 320);
        ctx.rotate(-0.15);
        
        // Hull base
        drawRect(-60, -20, 120, 40, PALETTE.woodDark);
        drawRect(-55, -25, 110, 30, PALETTE.wood);
        
        // Damaged section
        drawRect(20, -20, 30, 35, PALETTE.black);
        
        // Mast (broken)
        drawRect(-5, -70, 8, 50, PALETTE.woodLight);
        drawLine(-1, -70, 20, -50, PALETTE.woodLight, 3);
        
        ctx.restore();
        
        // Items visible if not looted
        if (!boatState.looted) {
            // Rope coil visible
            ctx.fillStyle = '#8b7355';
            ctx.beginPath();
            ctx.arc(380, 310, 8, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#6b5335';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
        
        // Boat hotspot
        hotspots.push({
            id: 'boat_wreck',
            x: 330, y: 270,
            width: 140, height: 80,
            name: 'Wrecked Boat',
            description: boatState.looted 
                ? 'A wrecked fishing boat. You\'ve already searched it.'
                : 'A wrecked fishing boat. There might be useful supplies inside.'
        });
        
        // === STORAGE SHED ===
        const shedState = state.sceneStates?.harbor?.hotspots?.shed || {};
        
        // Shed structure
        drawRect(520, 280, 100, 70, PALETTE.woodDark);
        drawRect(525, 285, 90, 60, PALETTE.wood);
        
        // Roof
        ctx.fillStyle = PALETTE.rust;
        ctx.beginPath();
        ctx.moveTo(510, 280);
        ctx.lineTo(570, 250);
        ctx.lineTo(630, 280);
        ctx.closePath();
        ctx.fill();
        
        // Door
        const doorColor = shedState.unlocked ? PALETTE.woodDark : PALETTE.woodLight;
        drawRect(550, 305, 30, 40, doorColor);
        
        // Lock indicator
        if (!shedState.unlocked) {
            ctx.fillStyle = '#888';
            ctx.fillRect(572, 322, 6, 8);
        }
        
        // Shed hotspot
        hotspots.push({
            id: 'shed',
            x: 510, y: 250,
            width: 120, height: 100,
            name: 'Storage Shed',
            description: shedState.unlocked
                ? 'A rusty storage shed. The door is open.'
                : 'A rusty storage shed. The door is locked with a padlock.'
        });
        
        // === EXIT SIGNS ===
        // Exit signs live ABOVE the message-bar overlay zone (y>=340 is covered
        // by #message-box); hotspots match the visible sign positions.
        // Exit to downtown (left)
        drawText('← Downtown', 10, 330, PALETTE.white, 14);
        hotspots.push({
            id: 'exit_downtown',
            x: 0, y: 290,
            width: 50, height: 50,
            name: 'Path to Downtown',
            description: 'A path leading to downtown Duxbury.',
            isExit: true,
            destination: 'downtown'
        });
        
        // Exit to forest (right)
        drawText('Forest →', 560, 330, PALETTE.white, 14);
        hotspots.push({
            id: 'exit_forest',
            x: 590, y: 290,
            width: 50, height: 50,
            name: 'Path to Forest',
            description: 'A path leading into the forest.',
            isExit: true,
            destination: 'forest'
        });
        
        return hotspots;
    }
    
    // Draw hotspot highlights (when hovering)
    function drawHotspotHighlight(hotspot) {
        ctx.strokeStyle = PALETTE.highlight;
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.strokeRect(hotspot.x, hotspot.y, hotspot.width, hotspot.height);
        ctx.setLineDash([]);
    }
    
    // Main render function
    function render(state, time = 0, hoveredHotspot = null) {
        clear();
        
        let hotspots = [];
        
        // Render current scene
        switch (state.currentScene) {
            case 'harbor':
                hotspots = drawHarborScene(state, time);
                break;
            case 'downtown':
                // TODO: Implement downtown scene
                drawSky();
                drawText('Downtown Duxbury - Coming Soon', 200, 200, PALETTE.white, 16);
                break;
            case 'forest':
                // TODO: Implement forest scene
                drawSky();
                drawText('Duxbury Forest - Coming Soon', 220, 200, PALETTE.white, 16);
                break;
            default:
                drawText('Unknown location...', 250, 200, PALETTE.red, 16);
        }
        
        // Draw highlight for hovered hotspot
        if (hoveredHotspot) {
            drawHotspotHighlight(hoveredHotspot);
        }
        
        // Draw current action indicator
        const actionText = `Action: ${state.currentAction.toUpperCase()}`;
        drawText(actionText, 10, 20, PALETTE.white, 12);
        
        // Draw day counter
        drawText(`Day ${state.dayCount}`, 570, 20, PALETTE.white, 12);
        
        return hotspots;
    }
    
    return {
        init,
        render,
        clear,
        drawText,
        PALETTE
    };
})();
