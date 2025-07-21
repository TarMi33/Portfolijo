# Portfolijo
3dportfolio
Prompt:

I’m a mechatronics engineer building a 3D interactive portfolio website. I want you to generate all the necessary files: index.html, style.css, and main.js (or modular JS if needed). I want the code to be clean, well-structured, and easily customizable so I can replace 3D placeholder objects later with ones I model in Blender.

🔧 3D Concept:
The center of the scene is Earth, a 3D sphere.

A satellite orbits around Earth, and I want the mouse scroll wheel to control the satellite’s rotation/orbit.

The satellite includes:

Two solar panels (wings)

An antenna

A screen

Each part should be clickable:

Screen → opens "Projects" window (or overlay)

Antenna → opens "Contact Me"

One Solar Panel → opens "About Me"

Other Solar Panel → opens "Clients" (or another section)

🌌 Scene & Interactions:
Background should be stars or space.

Clicking parts of the satellite opens modular HTML content windows or overlays.

Keep performance in mind (low-poly placeholder models).

Make all objects easily replaceable later with imported models (e.g., from Blender as .glb or .gltf).

Prefer use of Three.js (or another performant WebGL/3D library).

🧩 Customization Requirements:
Modular structure: separate 3D model logic, interaction logic, and UI logic.

Comment code clearly.

Easy to swap in Blender-exported models later.

No UI libraries—keep everything vanilla (HTML/CSS/JS only).

📁 Deliverables:
index.html

style.css

main.js

Optional: assets/ folder for placeholder 3D models or procedural objects.

Let me know if you need me to provide models, but for now just use primitives (spheres, boxes, etc.) as placeholders.
