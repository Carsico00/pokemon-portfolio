#!/usr/bin/env python3
"""
Create champion room tile PNGs matching the D/P tileset.
Each tile is 16x16 pixels, designed to be scaled up with image-rendering: pixelated.
"""
from PIL import Image, ImageDraw
import os

OUT = os.path.join(os.path.dirname(__file__), '..', 'public', 'tiles')
os.makedirs(OUT, exist_ok=True)

def save(name, img):
    img.save(os.path.join(OUT, name))
    print(f'  Created {name}')

# === FLOOR — Silver/white metallic panels ===
def make_floor():
    img = Image.new('RGBA', (16, 16))
    d = ImageDraw.Draw(img)
    # Base silver
    d.rectangle([0, 0, 15, 15], fill=(208, 216, 224))
    # Panel lines (subtle)
    d.line([(0, 0), (15, 0)], fill=(190, 198, 206))
    d.line([(0, 0), (0, 15)], fill=(190, 198, 206))
    d.line([(15, 0), (15, 15)], fill=(180, 188, 196))
    d.line([(0, 15), (15, 15)], fill=(180, 188, 196))
    # Highlight
    d.line([(1, 1), (14, 1)], fill=(220, 228, 236))
    d.line([(1, 1), (1, 14)], fill=(220, 228, 236))
    # Subtle panel detail
    d.rectangle([3, 3, 12, 12], fill=(200, 208, 216))
    d.line([(3, 3), (12, 3)], fill=(215, 223, 231))
    save('floor.png', img)

# === WALL — Dark charcoal ===
def make_wall():
    img = Image.new('RGBA', (16, 16))
    d = ImageDraw.Draw(img)
    d.rectangle([0, 0, 15, 15], fill=(52, 60, 68))
    d.line([(0, 0), (15, 0)], fill=(60, 68, 76))
    d.line([(0, 15), (15, 15)], fill=(40, 48, 56))
    # Subtle brick-like texture
    d.line([(0, 4), (15, 4)], fill=(46, 54, 62))
    d.line([(0, 8), (15, 8)], fill=(46, 54, 62))
    d.line([(0, 12), (15, 12)], fill=(46, 54, 62))
    d.line([(4, 0), (4, 4)], fill=(46, 54, 62))
    d.line([(12, 4), (12, 8)], fill=(46, 54, 62))
    d.line([(4, 8), (4, 12)], fill=(46, 54, 62))
    d.line([(12, 12), (12, 15)], fill=(46, 54, 62))
    save('wall.png', img)

# === WALL-TOP — Dark with amber gem ===
def make_wall_top():
    img = Image.new('RGBA', (16, 16))
    d = ImageDraw.Draw(img)
    d.rectangle([0, 0, 15, 15], fill=(48, 56, 64))
    # Dark border
    d.line([(0, 0), (15, 0)], fill=(56, 64, 72))
    d.line([(0, 15), (15, 15)], fill=(36, 44, 52))
    # Amber gem in center
    d.ellipse([5, 5, 10, 10], fill=(216, 160, 48))
    d.ellipse([6, 6, 9, 8], fill=(240, 192, 80))  # highlight
    save('wall-top.png', img)

# === ENTRANCE — Very dark ===
def make_entrance():
    img = Image.new('RGBA', (16, 16))
    d = ImageDraw.Draw(img)
    d.rectangle([0, 0, 15, 15], fill=(20, 28, 40))
    d.line([(0, 0), (15, 0)], fill=(28, 36, 48))
    save('entrance.png', img)

# === ENTRANCE-TOP — Blue door with gold stripe ===
def make_entrance_top():
    img = Image.new('RGBA', (16, 16))
    d = ImageDraw.Draw(img)
    # Silver frame
    d.rectangle([0, 0, 15, 15], fill=(180, 188, 196))
    # Blue panel
    d.rectangle([1, 1, 14, 14], fill=(48, 96, 168))
    d.rectangle([2, 2, 13, 13], fill=(40, 80, 152))
    # Gold center stripe
    d.rectangle([6, 1, 9, 14], fill=(232, 184, 48))
    d.rectangle([7, 2, 8, 13], fill=(248, 208, 80))
    # Dark frame edges
    d.line([(0, 0), (15, 0)], fill=(160, 168, 176))
    d.line([(0, 15), (15, 15)], fill=(140, 148, 156))
    save('entrance-top.png', img)

# === MACHINE — Silver body, green orb, red/black stripes ===
def make_machine():
    img = Image.new('RGBA', (16, 16))
    d = ImageDraw.Draw(img)
    # Silver body
    d.rectangle([0, 0, 15, 15], fill=(192, 200, 208))
    d.line([(0, 0), (15, 0)], fill=(208, 216, 224))
    d.line([(0, 15), (15, 15)], fill=(160, 168, 176))
    d.line([(0, 0), (0, 15)], fill=(176, 184, 192))
    d.line([(15, 0), (15, 15)], fill=(168, 176, 184))
    # Green orb (top)
    d.ellipse([4, 1, 11, 8], fill=(64, 200, 96))
    d.ellipse([5, 2, 10, 6], fill=(80, 232, 120))
    d.ellipse([6, 3, 8, 5], fill=(160, 255, 180))  # highlight
    # Dark ring around orb
    for px in [(4,4),(4,5),(3,3),(3,4),(3,5),(3,6),(4,2),(4,7),(11,4),(11,5),(12,3),(12,4),(12,5),(12,6),(11,2),(11,7)]:
        pass  # Orb border handled by ellipse
    # Red/black stripes at bottom
    d.rectangle([2, 10, 13, 10], fill=(200, 48, 48))
    d.rectangle([2, 11, 13, 11], fill=(40, 40, 40))
    d.rectangle([2, 12, 13, 12], fill=(200, 48, 48))
    d.rectangle([2, 13, 13, 13], fill=(40, 40, 40))
    # Orb border (dark teal ring)
    pixels = img.load()
    # Simple circular border
    border_color = (72, 104, 88)
    for pos in [(4,1),(5,1),(6,1),(9,1),(10,1),(11,1),
                (3,2),(3,3),(3,4),(3,5),(3,6),(3,7),
                (12,2),(12,3),(12,4),(12,5),(12,6),(12,7),
                (4,8),(5,8),(6,8),(9,8),(10,8),(11,8)]:
        if 0 <= pos[0] < 16 and 0 <= pos[1] < 16:
            pixels[pos[0], pos[1]] = border_color
    save('machine.png', img)

# === RING — Dark base with bright cyan segment ===
def make_ring():
    img = Image.new('RGBA', (16, 16))
    d = ImageDraw.Draw(img)
    # Dark base
    d.rectangle([0, 0, 15, 15], fill=(42, 48, 64))
    # Cyan glowing segment in center
    d.rectangle([3, 3, 12, 12], fill=(64, 224, 240))
    # Brighter inner
    d.rectangle([4, 4, 11, 11], fill=(80, 240, 248))
    # White highlight
    d.rectangle([5, 5, 10, 7], fill=(160, 248, 255))
    # Dark border
    d.rectangle([3, 3, 12, 3], fill=(32, 144, 160))
    d.rectangle([3, 12, 12, 12], fill=(32, 144, 160))
    d.rectangle([3, 3, 3, 12], fill=(32, 144, 160))
    d.rectangle([12, 3, 12, 12], fill=(32, 144, 160))
    # Outer dark border
    d.line([(0, 0), (15, 0)], fill=(34, 40, 52))
    d.line([(0, 15), (15, 15)], fill=(34, 40, 52))
    d.line([(0, 0), (0, 15)], fill=(34, 40, 52))
    d.line([(15, 0), (15, 15)], fill=(34, 40, 52))
    save('ring.png', img)

# === ARENA — Deep red with spotted/mottled texture ===
def make_arena():
    img = Image.new('RGBA', (16, 16))
    d = ImageDraw.Draw(img)
    # Base crimson red
    d.rectangle([0, 0, 15, 15], fill=(200, 56, 56))
    # Mottled spots (darker)
    pixels = img.load()
    import random
    random.seed(42)  # Deterministic
    for _ in range(25):
        x, y = random.randint(0, 15), random.randint(0, 15)
        r, g, b, a = pixels[x, y]
        pixels[x, y] = (max(0, r - 20), max(0, g - 8), max(0, b - 8), 255)
    for _ in range(15):
        x, y = random.randint(0, 15), random.randint(0, 15)
        r, g, b, a = pixels[x, y]
        pixels[x, y] = (min(255, r + 15), min(255, g + 5), min(255, b + 5), 255)
    # Subtle border
    d.line([(0, 0), (15, 0)], fill=(176, 48, 48))
    d.line([(0, 15), (15, 15)], fill=(168, 40, 40))
    save('arena.png', img)

# === ARENA with cyan corner pieces (ring-arena transition) ===
# Not needed since we have separate ring/arena tiles

print('Creating champion room tiles...')
make_floor()
make_wall()
make_wall_top()
make_entrance()
make_entrance_top()
make_machine()
make_ring()
make_arena()
print('Done! All tiles saved to public/tiles/')
