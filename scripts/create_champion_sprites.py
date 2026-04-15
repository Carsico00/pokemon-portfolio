#!/usr/bin/env python3
"""
Create champion overworld sprites (16x24) and battle sprite (64x80)
matching the asset: dark beret, long brown wavy hair, black crop top, khaki pants, gray shoes
"""
from PIL import Image, ImageDraw

# ── Color palette ──
TRANSP = (0, 0, 0, 0)
# Hat/beret
HAT_DARK = (40, 38, 45, 255)
HAT_MID = (55, 50, 60, 255)
HAT_LIGHT = (65, 60, 70, 255)
HAT_BUCKLE = (180, 140, 60, 255)
# Hair
HAIR_DARK = (80, 45, 20, 255)
HAIR_MID = (110, 65, 30, 255)
HAIR_LIGHT = (130, 78, 38, 255)
HAIR_HIGHLIGHT = (150, 95, 50, 255)
# Skin
SKIN = (255, 218, 180, 255)
SKIN_SHADOW = (235, 195, 155, 255)
SKIN_DARK = (220, 180, 140, 255)
# Eyes
EYE = (55, 35, 25, 255)
EYE_WHITE = (240, 240, 240, 255)
# Mouth
MOUTH = (210, 150, 130, 255)
# Top (black)
TOP_DARK = (25, 25, 32, 255)
TOP_MID = (35, 35, 42, 255)
TOP_LIGHT = (50, 48, 55, 255)
# Pants (khaki)
PANTS = (195, 175, 130, 255)
PANTS_SHADOW = (170, 150, 110, 255)
PANTS_LIGHT = (210, 190, 145, 255)
# Shoes
SHOE = (75, 75, 85, 255)
SHOE_DARK = (55, 55, 65, 255)
SHOE_SOLE = (45, 45, 50, 255)
# Outline
OUTLINE = (30, 25, 20, 255)

def create_overworld_down_stand():
    """Front-facing standing pose (16x24)"""
    img = Image.new('RGBA', (16, 24), TRANSP)
    p = img.load()
    
    # Row 0: Hat top
    for x in range(5, 11): p[x, 0] = HAT_DARK
    # Row 1: Hat wider
    for x in range(4, 12): p[x, 1] = HAT_DARK
    p[5, 1] = HAT_MID; p[6, 1] = HAT_MID; p[7, 1] = HAT_MID
    # Row 2: Hat brim
    for x in range(3, 13): p[x, 2] = HAT_MID
    p[7, 2] = HAT_BUCKLE; p[8, 2] = HAT_BUCKLE  # buckle
    # Row 3: Hat bottom + hair starts
    for x in range(3, 13): p[x, 3] = HAT_DARK
    p[2, 3] = HAIR_MID; p[13, 3] = HAIR_MID
    
    # Row 4: Forehead + hair
    p[2, 4] = HAIR_MID; p[3, 4] = HAIR_LIGHT
    for x in range(4, 12): p[x, 4] = SKIN
    p[12, 4] = HAIR_LIGHT; p[13, 4] = HAIR_MID
    
    # Row 5: Eyes
    p[2, 5] = HAIR_MID; p[3, 5] = HAIR_LIGHT
    p[4, 5] = SKIN; p[5, 5] = EYE_WHITE; p[6, 5] = EYE
    p[7, 5] = SKIN; p[8, 5] = SKIN
    p[9, 5] = EYE_WHITE; p[10, 5] = EYE; p[11, 5] = SKIN
    p[12, 5] = HAIR_LIGHT; p[13, 5] = HAIR_MID
    
    # Row 6: Nose/mouth + hair
    p[2, 6] = HAIR_MID; p[3, 6] = HAIR_LIGHT
    for x in range(4, 12): p[x, 6] = SKIN
    p[7, 6] = MOUTH; p[8, 6] = MOUTH
    p[12, 6] = HAIR_LIGHT; p[13, 6] = HAIR_MID
    
    # Row 7: Chin + hair flowing
    p[1, 7] = HAIR_DARK; p[2, 7] = HAIR_MID; p[3, 7] = HAIR_LIGHT
    for x in range(4, 12): p[x, 7] = SKIN_SHADOW
    p[12, 7] = HAIR_LIGHT; p[13, 7] = HAIR_MID; p[14, 7] = HAIR_DARK
    
    # Row 8: Neck + hair
    p[1, 8] = HAIR_DARK; p[2, 8] = HAIR_MID; p[3, 8] = HAIR_LIGHT
    p[4, 8] = HAIR_MID
    for x in range(5, 11): p[x, 8] = SKIN_SHADOW
    p[11, 8] = HAIR_MID; p[12, 8] = HAIR_LIGHT
    p[13, 8] = HAIR_MID; p[14, 8] = HAIR_DARK
    
    # Row 9: Shoulders (black top) + hair
    p[1, 9] = HAIR_DARK; p[2, 9] = HAIR_MID
    for x in range(3, 13): p[x, 9] = TOP_DARK
    p[3, 9] = SKIN_DARK  # arms
    p[12, 9] = SKIN_DARK
    p[13, 9] = HAIR_MID; p[14, 9] = HAIR_DARK
    
    # Row 10-11: Black top body + hair sides
    for y in range(10, 12):
        p[1, y] = HAIR_DARK; p[2, y] = HAIR_MID
        p[3, y] = SKIN_DARK  # arm
        for x in range(4, 12): p[x, y] = TOP_MID
        p[12, y] = SKIN_DARK  # arm
        p[13, y] = HAIR_MID; p[14, y] = HAIR_DARK
    
    # Row 12: Midriff / waist
    p[1, 12] = HAIR_DARK; p[2, 12] = HAIR_MID
    p[3, 12] = SKIN_DARK
    for x in range(4, 12): p[x, 12] = PANTS_LIGHT
    p[12, 12] = SKIN_DARK
    p[13, 12] = HAIR_MID; p[14, 12] = HAIR_DARK
    
    # Row 13-16: Khaki pants + hair ends
    for y in range(13, 17):
        hair_fade = HAIR_MID if y < 15 else HAIR_DARK
        if y < 16:
            p[2, y] = hair_fade; p[13, y] = hair_fade
        for x in range(4, 12):
            p[x, y] = PANTS if x not in (7, 8) else PANTS_SHADOW
        # Slight wide at top
        if y < 15:
            p[3, y] = PANTS_SHADOW; p[12, y] = PANTS_SHADOW
    
    # Row 17: Lower pants
    for x in range(4, 7): p[x, 17] = PANTS_SHADOW
    for x in range(9, 12): p[x, 17] = PANTS_SHADOW
    
    # Row 18-19: Ankles
    for y in range(18, 20):
        for x in range(4, 7): p[x, y] = PANTS_SHADOW
        for x in range(9, 12): p[x, y] = PANTS_SHADOW
    
    # Row 20-22: Shoes
    for y in range(20, 23):
        for x in range(3, 7): p[x, y] = SHOE if y < 22 else SHOE_SOLE
        for x in range(9, 13): p[x, y] = SHOE if y < 22 else SHOE_SOLE
    
    return img


def create_overworld_down_walk(foot='left'):
    """Front-facing walking pose"""
    img = create_overworld_down_stand()
    p = img.load()
    
    if foot == 'left':
        # Left foot forward: shift left leg down 1px, right leg back
        for y in range(20, 23):
            for x in range(3, 7):
                p[x, y] = TRANSP
        for y in range(21, 24):
            for x in range(3, 7):
                p[x, y] = SHOE if y < 23 else SHOE_SOLE
        # Right leg up slightly
        for x in range(9, 13):
            p[x, 22] = TRANSP
    else:
        # Right foot forward
        for y in range(20, 23):
            for x in range(9, 13):
                p[x, y] = TRANSP
        for y in range(21, 24):
            for x in range(9, 13):
                p[x, y] = SHOE if y < 23 else SHOE_SOLE
        for x in range(3, 7):
            p[x, 22] = TRANSP
    
    return img


def create_overworld_up_stand():
    """Back-facing standing pose"""
    img = Image.new('RGBA', (16, 24), TRANSP)
    p = img.load()
    
    # Row 0: Hat top
    for x in range(5, 11): p[x, 0] = HAT_DARK
    # Row 1: Hat wider
    for x in range(4, 12): p[x, 1] = HAT_DARK
    p[5, 1] = HAT_MID; p[6, 1] = HAT_MID
    # Row 2: Hat brim (back, no buckle visible)
    for x in range(3, 13): p[x, 2] = HAT_DARK
    # Row 3: Hair starts below hat
    for x in range(3, 13): p[x, 3] = HAIR_MID
    p[2, 3] = HAIR_DARK; p[13, 3] = HAIR_DARK
    
    # Row 4-7: Back of hair
    for y in range(4, 8):
        p[1, y] = HAIR_DARK; p[2, y] = HAIR_MID
        for x in range(3, 13): p[x, y] = HAIR_MID if (x + y) % 3 != 0 else HAIR_LIGHT
        p[13, y] = HAIR_MID; p[14, y] = HAIR_DARK
    
    # Row 8: Neck visible through hair
    p[1, 8] = HAIR_DARK; p[2, 8] = HAIR_MID; p[3, 8] = HAIR_LIGHT
    for x in range(4, 12): p[x, 8] = HAIR_MID
    # Small neck gap
    p[7, 8] = SKIN_SHADOW; p[8, 8] = SKIN_SHADOW
    p[12, 8] = HAIR_LIGHT; p[13, 8] = HAIR_MID; p[14, 8] = HAIR_DARK
    
    # Row 9: Shoulders (black top) + hair
    p[1, 9] = HAIR_DARK; p[2, 9] = HAIR_MID
    p[3, 9] = SKIN_DARK  # arm
    for x in range(4, 12): p[x, 9] = TOP_DARK
    p[12, 9] = SKIN_DARK
    p[13, 9] = HAIR_MID; p[14, 9] = HAIR_DARK
    
    # Row 10-11: Back of top + hair
    for y in range(10, 12):
        p[1, y] = HAIR_DARK; p[2, y] = HAIR_MID
        p[3, y] = SKIN_DARK
        for x in range(4, 12): p[x, y] = TOP_DARK
        p[12, y] = SKIN_DARK
        p[13, y] = HAIR_MID; p[14, y] = HAIR_DARK
    
    # Row 12: Waist
    p[1, 12] = HAIR_DARK; p[2, 12] = HAIR_MID
    p[3, 12] = SKIN_DARK
    for x in range(4, 12): p[x, 12] = PANTS_LIGHT
    p[12, 12] = SKIN_DARK
    p[13, 12] = HAIR_MID; p[14, 12] = HAIR_DARK
    
    # Row 13-16: Pants + hair ends
    for y in range(13, 17):
        if y < 15:
            p[2, y] = HAIR_MID; p[13, y] = HAIR_MID
        for x in range(4, 12):
            p[x, y] = PANTS if x not in (7, 8) else PANTS_SHADOW
        if y < 15:
            p[3, y] = PANTS_SHADOW; p[12, y] = PANTS_SHADOW
    
    # Row 17-19: Lower legs
    for y in range(17, 20):
        for x in range(4, 7): p[x, y] = PANTS_SHADOW
        for x in range(9, 12): p[x, y] = PANTS_SHADOW
    
    # Row 20-22: Shoes
    for y in range(20, 23):
        for x in range(3, 7): p[x, y] = SHOE if y < 22 else SHOE_SOLE
        for x in range(9, 13): p[x, y] = SHOE if y < 22 else SHOE_SOLE
    
    return img


def create_overworld_up_walk():
    """Back-facing walk"""
    img = create_overworld_up_stand()
    p = img.load()
    # Left foot forward
    for y in range(20, 23):
        for x in range(3, 7): p[x, y] = TRANSP
    for y in range(21, 24):
        for x in range(3, 7): p[x, y] = SHOE if y < 23 else SHOE_SOLE
    for x in range(9, 13): p[x, 22] = TRANSP
    return img


def create_overworld_left_stand():
    """Left-facing standing pose"""
    img = Image.new('RGBA', (16, 24), TRANSP)
    p = img.load()
    
    # Row 0: Hat top (shifted left slightly)
    for x in range(4, 10): p[x, 0] = HAT_DARK
    # Row 1
    for x in range(3, 11): p[x, 1] = HAT_DARK
    p[4, 1] = HAT_MID; p[5, 1] = HAT_MID
    # Row 2: Brim (extends left)
    for x in range(2, 11): p[x, 2] = HAT_MID
    # Row 3: Under hat
    for x in range(3, 11): p[x, 3] = HAT_DARK
    p[11, 3] = HAIR_MID
    
    # Row 4: Side of face + hair behind
    p[3, 4] = HAIR_LIGHT
    for x in range(4, 10): p[x, 4] = SKIN
    p[10, 4] = HAIR_LIGHT; p[11, 4] = HAIR_MID; p[12, 4] = HAIR_DARK
    
    # Row 5: Eye (side view - one eye)
    p[3, 5] = HAIR_LIGHT
    p[4, 5] = SKIN; p[5, 5] = EYE_WHITE; p[6, 5] = EYE
    for x in range(7, 10): p[x, 5] = SKIN
    p[10, 5] = HAIR_LIGHT; p[11, 5] = HAIR_MID; p[12, 5] = HAIR_DARK
    
    # Row 6: Nose/mouth
    p[3, 6] = SKIN  # nose protrudes
    for x in range(4, 10): p[x, 6] = SKIN
    p[6, 6] = MOUTH
    p[10, 6] = HAIR_LIGHT; p[11, 6] = HAIR_MID; p[12, 6] = HAIR_DARK
    
    # Row 7: Chin + hair
    for x in range(4, 10): p[x, 7] = SKIN_SHADOW
    p[10, 7] = HAIR_LIGHT; p[11, 7] = HAIR_MID; p[12, 7] = HAIR_DARK
    
    # Row 8: Neck + hair behind
    for x in range(5, 9): p[x, 8] = SKIN_SHADOW
    p[9, 8] = HAIR_MID; p[10, 8] = HAIR_LIGHT; p[11, 8] = HAIR_MID; p[12, 8] = HAIR_DARK
    
    # Row 9: Shoulder + arm + hair
    p[4, 9] = SKIN_DARK
    for x in range(5, 11): p[x, 9] = TOP_DARK
    p[11, 9] = HAIR_MID; p[12, 9] = HAIR_DARK
    
    # Row 10-11: Top body
    for y in range(10, 12):
        p[4, y] = SKIN_DARK
        for x in range(5, 11): p[x, y] = TOP_MID
        p[11, y] = HAIR_MID; p[12, y] = HAIR_DARK
    
    # Row 12: Waist
    p[4, 12] = SKIN_DARK
    for x in range(5, 11): p[x, 12] = PANTS_LIGHT
    p[11, 12] = HAIR_MID; p[12, 12] = HAIR_DARK
    
    # Row 13-16: Pants + hair ends
    for y in range(13, 17):
        for x in range(5, 11): p[x, y] = PANTS
        p[7, y] = PANTS_SHADOW
        if y < 15:
            p[11, y] = HAIR_MID; p[12, y] = HAIR_DARK
    
    # Row 17-19: Lower legs
    for y in range(17, 20):
        for x in range(5, 8): p[x, y] = PANTS_SHADOW
        for x in range(8, 11): p[x, y] = PANTS_SHADOW
    
    # Row 20-22: Shoes
    for y in range(20, 23):
        for x in range(4, 8): p[x, y] = SHOE if y < 22 else SHOE_SOLE
        for x in range(8, 12): p[x, y] = SHOE if y < 22 else SHOE_SOLE
    
    return img


def create_overworld_left_walk():
    """Left-facing walk"""
    img = create_overworld_left_stand()
    p = img.load()
    # Left leg forward
    for y in range(20, 23):
        for x in range(4, 8): p[x, y] = TRANSP
    for y in range(21, 24):
        for x in range(3, 7): p[x, y] = SHOE if y < 23 else SHOE_SOLE
    for x in range(8, 12): p[x, 22] = TRANSP
    return img


def create_overworld_right_stand():
    """Right-facing = mirror of left"""
    left = create_overworld_left_stand()
    return left.transpose(Image.FLIP_LEFT_RIGHT)


def create_overworld_right_walk():
    """Right walk = mirror of left walk"""
    left = create_overworld_left_walk()
    return left.transpose(Image.FLIP_LEFT_RIGHT)


def create_battle_sprite():
    """
    Larger battle sprite (64x80) - frontal anime-style:
    Dark beret, long brown hair, black crop top, holding pokéball, khaki pants
    """
    img = Image.new('RGBA', (64, 80), TRANSP)
    draw = ImageDraw.Draw(img)
    
    # Hat
    draw.ellipse([18, 0, 46, 10], fill=HAT_DARK)
    draw.rectangle([16, 6, 48, 14], fill=HAT_DARK)
    draw.rectangle([14, 12, 50, 16], fill=HAT_MID)  # brim
    # Buckle
    draw.rectangle([29, 12, 35, 15], fill=HAT_BUCKLE)
    
    # Hair frame around face
    draw.rectangle([12, 14, 17, 40], fill=HAIR_MID)  # left hair
    draw.rectangle([47, 14, 52, 40], fill=HAIR_MID)  # right hair
    draw.rectangle([14, 14, 50, 18], fill=HAIR_MID)  # top hair under hat
    
    # Face
    draw.rectangle([18, 18, 46, 36], fill=SKIN)
    draw.rectangle([16, 16, 48, 20], fill=SKIN)  # forehead
    
    # Eyes (larger, anime-style)
    # Left eye
    draw.rectangle([21, 23, 28, 29], fill=EYE_WHITE)
    draw.rectangle([24, 24, 28, 28], fill=(100, 60, 40, 255))  # iris
    draw.rectangle([25, 25, 27, 27], fill=EYE)  # pupil
    draw.point((25, 24), fill=(255, 255, 255, 255))  # highlight
    # Right eye
    draw.rectangle([36, 23, 43, 29], fill=EYE_WHITE)
    draw.rectangle([36, 24, 40, 28], fill=(100, 60, 40, 255))
    draw.rectangle([37, 25, 39, 27], fill=EYE)
    draw.point((38, 24), fill=(255, 255, 255, 255))
    
    # Eyebrows
    draw.line([(21, 22), (28, 22)], fill=(80, 50, 30, 255), width=1)
    draw.line([(36, 22), (43, 22)], fill=(80, 50, 30, 255), width=1)
    
    # Nose & mouth
    draw.point((32, 30), fill=SKIN_SHADOW)
    draw.point((33, 30), fill=SKIN_SHADOW)
    draw.line([(30, 33), (34, 33)], fill=MOUTH, width=1)
    
    # Chin
    draw.rectangle([20, 34, 44, 38], fill=SKIN_SHADOW)
    
    # Hair flowing down sides
    draw.rectangle([10, 16, 16, 55], fill=HAIR_MID)
    draw.rectangle([48, 16, 54, 55], fill=HAIR_MID)
    # Hair highlights
    draw.line([(12, 20), (12, 50)], fill=HAIR_HIGHLIGHT, width=1)
    draw.line([(14, 22), (14, 48)], fill=HAIR_LIGHT, width=1)
    draw.line([(50, 20), (50, 50)], fill=HAIR_HIGHLIGHT, width=1)
    draw.line([(52, 22), (52, 48)], fill=HAIR_LIGHT, width=1)
    # Hair under hat darker
    draw.rectangle([11, 14, 15, 18], fill=HAIR_DARK)
    draw.rectangle([49, 14, 53, 18], fill=HAIR_DARK)
    
    # Neck
    draw.rectangle([28, 36, 36, 42], fill=SKIN_SHADOW)
    
    # Black crop top
    draw.rectangle([16, 40, 48, 52], fill=TOP_DARK)
    # Slight V-neck
    draw.line([(30, 40), (32, 43)], fill=SKIN_SHADOW, width=1)
    draw.line([(34, 40), (32, 43)], fill=SKIN_SHADOW, width=1)
    
    # Arms
    draw.rectangle([8, 42, 16, 54], fill=SKIN)  # left arm
    draw.rectangle([48, 42, 56, 54], fill=SKIN)  # right arm
    # Left arm sleeve
    draw.rectangle([12, 40, 18, 44], fill=TOP_DARK)
    # Right arm sleeve
    draw.rectangle([46, 40, 52, 44], fill=TOP_DARK)
    
    # Pokéball in right hand
    draw.ellipse([52, 50, 62, 60], fill=(220, 50, 50, 255))  # top red
    draw.rectangle([52, 54, 62, 56], fill=(30, 30, 30, 255))  # line
    draw.ellipse([52, 54, 62, 60], fill=(240, 240, 240, 255))  # bottom white
    draw.rectangle([52, 54, 62, 56], fill=(30, 30, 30, 255))  # center line
    draw.ellipse([55, 53, 59, 57], fill=(240, 240, 240, 255))  # button
    draw.ellipse([56, 54, 58, 56], fill=(30, 30, 30, 255))  # button center
    
    # Midriff (skin showing between top and pants)
    draw.rectangle([18, 52, 46, 55], fill=SKIN_SHADOW)
    
    # Khaki pants
    draw.rectangle([16, 55, 46, 72], fill=PANTS)
    # Center seam
    draw.line([(31, 55), (31, 72)], fill=PANTS_SHADOW, width=2)
    # Folds/shadows
    draw.line([(22, 58), (22, 70)], fill=PANTS_SHADOW, width=1)
    draw.line([(40, 58), (40, 70)], fill=PANTS_SHADOW, width=1)
    # Pants slightly wider at hips
    draw.rectangle([14, 55, 18, 60], fill=PANTS_SHADOW)
    draw.rectangle([44, 55, 48, 60], fill=PANTS_SHADOW)
    
    # Lower legs / pants legs separated
    draw.rectangle([16, 68, 28, 72], fill=PANTS_SHADOW)
    draw.rectangle([34, 68, 46, 72], fill=PANTS_SHADOW)
    
    # Shoes
    draw.rectangle([14, 72, 28, 78], fill=SHOE)
    draw.rectangle([34, 72, 48, 78], fill=SHOE)
    draw.rectangle([14, 76, 28, 80], fill=SHOE_SOLE)
    draw.rectangle([34, 76, 48, 80], fill=SHOE_SOLE)
    
    return img


# ── Generate all sprites ──
import os
out = 'public/sprites'
os.makedirs(out, exist_ok=True)

sprites = {
    'champion-down-stand.png': create_overworld_down_stand(),
    'champion-down-walk1.png': create_overworld_down_walk('left'),
    'champion-up-stand.png': create_overworld_up_stand(),
    'champion-up-walk1.png': create_overworld_up_walk(),
    'champion-left-stand.png': create_overworld_left_stand(),
    'champion-left-walk1.png': create_overworld_left_walk(),
    'champion-right-stand.png': create_overworld_right_stand(),
    'champion-right-walk1.png': create_overworld_right_walk(),
    'champion-battle.png': create_battle_sprite(),
}

for name, sprite in sprites.items():
    path = os.path.join(out, name)
    sprite.save(path)
    print(f'  ✓ {name} ({sprite.size[0]}x{sprite.size[1]})')

print(f'\nAll {len(sprites)} champion sprites created!')
