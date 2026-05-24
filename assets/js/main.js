// Creating a custom "header" title to go underneath

document.addEventListener("DOMContentLoaded", () => {
    const typewriter = document.getElementById("typewriter");
    const texts = ["Software Engineer", "Tech Enthusiast!", "Builder"];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentText = texts[textIndex];
        // If condition statement for displayText
        const displayText = isDeleting 
                ? currentText.substring(0, charIndex--)
                : currentText.substring(0, charIndex++);

        typewriter.textContent = displayText;

        if (!isDeleting && charIndex === currentText.length) {
            // Pausing text before deleting text
            setTimeout(() => (isDeleting = true), 2000)
        } else if (isDeleting && charIndex === 0){
            // Moving onto the next text on list
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length; // Cycling through texts
        }

        // Adjusting typing speed
        const typingSpeed = isDeleting ? 50 : 100; // Faster when deleting
        setTimeout(type, typingSpeed);
    }

    type(); // Starting the effect
});

document.addEventListener("DOMContentLoaded", () => {
    // --- BACKGROUND INTERACTIVE WAVES ---
    const canvas = document.getElementById("waveCanvas");
    const ctx = canvas.getContext("2d");
    
    let width, height;
    let points = [];
    let time = 0;
  
    // Track the mouse position
    let mouse = { x: -1000, y: -1000 };
    
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });
  
    // If the mouse leaves the window, move the "force field" off-screen
    window.addEventListener('mouseout', () => {
      mouse.x = -1000;
      mouse.y = -1000;
    });
  
    function init() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      points = [];
  
      // Configuration for the mesh
      const rows = 12; // Number of horizontal lines
      const cols = 60; // Resolution of the lines
      const spacingY = height / rows;
      const spacingX = width / cols;
  
      for (let i = 0; i < rows + 2; i++) {
        let row = [];
        for (let j = 0; j < cols + 2; j++) {
          row.push({
            x: j * spacingX,
            y: (i - 1) * spacingY,
            baseX: j * spacingX,
            baseY: (i - 1) * spacingY,
            colIndex: j
          });
        }
        points.push(row);
      }
    }
  
    window.addEventListener("resize", init);
    init();
  
    function animate() {
      ctx.clearRect(0, 0, width, height);
      
      // Update all points with physics
      for (let i = 0; i < points.length; i++) {
        for (let j = 0; j < points[i].length; j++) {
          let p = points[i][j];
          
          // 1. Natural Wave Motion
          // We multiply by (p.baseX / width) so it's flat on the left, wavy on the right!
          let waveIntensity = (p.baseX / width); 
          let targetY = p.baseY + Math.sin(time + p.colIndex * 0.1 + i) * (80 * waveIntensity);
          let targetX = p.baseX;
  
          // 2. Mouse Repulsion (The Force Field)
          let dx = mouse.x - p.x;
          let dy = mouse.y - p.y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          let maxDist = 250; // Size of the force field
  
          if (distance < maxDist) {
            let force = (maxDist - distance) / maxDist;
            // Push points away from the cursor
            targetX -= (dx / distance) * force * 100;
            targetY -= (dy / distance) * force * 100;
          }
  
          // 3. Smooth Easing (Springs back into place)
          p.x += (targetX - p.x) * 0.08;
          p.y += (targetY - p.y) * 0.08;
        }
      }
  
      // Draw the lines
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(204, 204, 204, 0.15)"; // Light grey with low opacity
  
      for (let i = 0; i < points.length; i++) {
        ctx.beginPath();
        for (let j = 0; j < points[i].length; j++) {
          let p = points[i][j];
          if (j === 0) {
            ctx.moveTo(p.x, p.y);
          } else {
            // Draw a curved line to the next point
            let prevP = points[i][j - 1];
            let cx = (p.x + prevP.x) / 2;
            let cy = (p.y + prevP.y) / 2;
            ctx.quadraticCurveTo(prevP.x, prevP.y, cx, cy);
          }
        }
        ctx.stroke();
      }
  
      time += 0.015; // Speed of the natural wave
      requestAnimationFrame(animate);
    }
  
    animate(); // Start the loop
  });