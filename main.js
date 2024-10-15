const canvas = document.getElementById('floorplanCanvas');
const ctx = canvas.getContext('2d');
const equipmentNameDiv = document.getElementById('equipment-name');

// Scale and translation for zoom/pan functionality
let scale = 1;
let offsetX = 0, offsetY = 0;
let isDragging = false;
let lastMouseX, lastMouseY;
let hoveredFurniture = null;

canvas.width = 800;
canvas.height = 600;

// Render the floorplan
function renderFloorplan() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(offsetX, offsetY);
    ctx.scale(scale, scale);

    // Draw regions (walls)
    floorplanData.regions.forEach(region => {
        ctx.beginPath();
        ctx.moveTo(region.start.x, region.start.y);
        ctx.lineTo(region.end.x, region.end.y);
        ctx.strokeStyle = "#333";
        ctx.lineWidth = 3;
        ctx.stroke();
    });

    // Draw doors
    floorplanData.doors.forEach(door => {
        ctx.save();
        ctx.translate(door.location.x, door.location.y);
        ctx.rotate(door.rotation);
        ctx.fillStyle = "#8B4513";
        ctx.fillRect(-door.width / 2, -5, door.width, 10);
        ctx.restore();
    });

    // Draw furnitures
    floorplanData.furnitures.forEach(furniture => {
        const { minBound, maxBound, rotation } = furniture;
        const centerX = (minBound.x + maxBound.x) / 2;
        const centerY = (minBound.y + maxBound.y) / 2;

        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(rotation);

        // Highlight hovered furniture
        if (hoveredFurniture === furniture) {
            ctx.strokeStyle = "#00bfff";
            ctx.lineWidth = 3;
            ctx.strokeRect(minBound.x - centerX, minBound.y - centerY, maxBound.x - minBound.x, maxBound.y - minBound.y);
            ctx.fillStyle = "rgba(0, 191, 255, 0.3)";
        } else {
            ctx.fillStyle = "lightblue";
        }

        ctx.fillRect(minBound.x - centerX, minBound.y - centerY, maxBound.x - minBound.x, maxBound.y - minBound.y);
        ctx.restore();
    });

    ctx.restore();
}

// Zoom functionality
canvas.addEventListener('wheel', event => {
    event.preventDefault();
    const zoomFactor = 0.1;
    scale += event.deltaY < 0 ? zoomFactor : -zoomFactor;
    scale = Math.max(0.1, Math.min(5, scale));
    renderFloorplan();
});

// Drag functionality
canvas.addEventListener('mousedown', event => {
    isDragging = true;
    lastMouseX = event.clientX;
    lastMouseY = event.clientY;
});

canvas.addEventListener('mousemove', event => {
    if (isDragging) {
        const dx = event.clientX - lastMouseX;
        const dy = event.clientY - lastMouseY;
        offsetX += dx;
        offsetY += dy;
        lastMouseX = event.clientX;
        lastMouseY = event.clientY;
        renderFloorplan();
    } else {
        // Check if hovering over furniture
        const mouseX = (event.offsetX - offsetX) / scale;
        const mouseY = (event.offsetY - offsetY) / scale;
        let newHoveredFurniture = null;

        // Find if the mouse is within any furniture's bounds
        floorplanData.furnitures.forEach(furniture => {
            const { minBound, maxBound } = furniture;
            if (mouseX >= minBound.x && mouseX <= maxBound.x &&
                mouseY >= minBound.y && mouseY <= maxBound.y) {
                newHoveredFurniture = furniture;
            }
        });

        // Update hover state
        if (newHoveredFurniture !== hoveredFurniture) {
            hoveredFurniture = newHoveredFurniture;
            if (hoveredFurniture) {
                equipmentNameDiv.textContent = `Equipment: ${hoveredFurniture.equipName}`;
                equipmentNameDiv.classList.add("visible");
                equipmentNameDiv.classList.remove("hidden");
                equipmentNameDiv.style.display = "block";
            } else {
                equipmentNameDiv.classList.add("hidden");
                equipmentNameDiv.classList.remove("visible");
                setTimeout(() => {
                    equipmentNameDiv.style.display = "none";
                }, 300);
            }
            renderFloorplan();
        }
    }
});

canvas.addEventListener('mouseup', () => {
    isDragging = false;
});

// Initial render
renderFloorplan();
