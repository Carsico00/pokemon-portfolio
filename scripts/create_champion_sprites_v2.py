#!/usr/bin/env python3
"""
Recreate champion sprites faithful to NDS D/P overworld style.
Reference: dark hat/beret (round, puffy), long wavy brown hair past shoulders,
black crop top, khaki baggy pants, gray shoes.
NDS chibi proportions: big head (~45%), compact body.
Overworld: 16x32 canvas (visible ~16x22), Battle: 80x80
"""
from PIL import Image, ImageDraw

# ── Palette (matching the reference closely) ──
T = (0, 0, 0, 0)

# Outline
OL = (24, 20, 16, 255)
OL_SOFT = (40, 35, 28, 255)

# Hat (very dark gray, almost black, slightly warm)
H1 = (48, 44, 52, 255)     # darkest
H2 = (62, 56, 65, 255)     # mid
H3 = (72, 66, 75, 255)     # highlight
H_BUCKLE = (190, 150, 60, 255)  # gold buckle

# Hair (warm brown, wavy)
HR1 = (70, 40, 18, 255)    # darkest shadow
HR2 = (95, 55, 24, 255)    # dark
HR3 = (120, 70, 32, 255)   # mid
HR4 = (142, 85, 40, 255)   # light
HR5 = (160, 100, 52, 255)  # highlight

# Skin
SK1 = (255, 220, 185, 255)   # base
SK2 = (240, 200, 165, 255)   # shadow
SK3 = (225, 185, 148, 255)   # dark shadow

# Eyes
EY = (45, 30, 20, 255)       # dark
EW = (255, 255, 255, 255)    # white/highlight

# Mouth
MO = (210, 145, 125, 255)

# Top (black)
TP1 = (28, 26, 34, 255)    # darkest
TP2 = (40, 38, 46, 255)    # mid
TP3 = (55, 50, 58, 255)    # highlight/fold

# Pants (khaki/baggy)
PA1 = (175, 155, 115, 255)  # shadow
PA2 = (195, 175, 132, 255)  # base
PA3 = (212, 192, 148, 255)  # highlight

# Shoes
SH1 = (60, 58, 68, 255)    # dark
SH2 = (78, 75, 85, 255)    # mid
SH3 = (55, 52, 58, 255)    # sole


def down_stand():
    """Front-facing stand - NDS chibi (huge head, tiny body)."""
    img = Image.new('RGBA', (16, 32), T)
    p = img.load()

    # === HEAD (rows 4-15) ===

    # Row 4-5: Hat crown
    for x in (6,7,8,9): p[x,4] = H1
    for x in range(5,11): p[x,5] = H1
    p[6,5]=H2; p[7,5]=H2

    # Row 6: Hat wider
    for x in range(4,12): p[x,6] = H1
    p[5,6]=H2; p[6,6]=H2; p[7,6]=H3; p[8,6]=H2

    # Row 7: Hat brim
    for x in range(3,13): p[x,7] = H2
    p[7,7]=H_BUCKLE; p[8,7]=H_BUCKLE  # buckle

    # Row 8: Under hat + hair sides
    p[2,8]=HR2; p[3,8]=HR3
    for x in range(4,12): p[x,8] = H1
    p[12,8]=HR3; p[13,8]=HR2

    # Row 9: Upper face + hair
    p[2,9]=HR2; p[3,9]=HR3
    for x in range(4,12): p[x,9] = SK1
    p[4,9]=HR4; p[11,9]=HR4
    p[12,9]=HR3; p[13,9]=HR2

    # Row 10: Eyes row
    p[1,10]=HR1; p[2,10]=HR2; p[3,10]=HR3
    p[4,10]=SK1
    p[5,10]=EW; p[6,10]=EY  # left eye
    p[7,10]=SK1; p[8,10]=SK1
    p[9,10]=EW; p[10,10]=EY  # right eye
    p[11,10]=SK1
    p[12,10]=HR3; p[13,10]=HR2; p[14,10]=HR1

    # Row 11: Lower face (nose hint, mouth)
    p[1,11]=HR1; p[2,11]=HR2; p[3,11]=HR4
    for x in range(4,12): p[x,11] = SK1
    p[7,11]=MO; p[8,11]=MO
    p[12,11]=HR4; p[13,11]=HR2; p[14,11]=HR1

    # Row 12: Chin + hair
    p[1,12]=HR1; p[2,12]=HR2; p[3,12]=HR3
    for x in range(4,12): p[x,12] = SK2
    p[12,12]=HR3; p[13,12]=HR2; p[14,12]=HR1

    # Row 13: Neck + hair flowing
    p[1,13]=HR1; p[2,13]=HR2; p[3,13]=HR3
    p[4,13]=HR4
    for x in range(5,11): p[x,13] = SK3
    p[11,13]=HR4
    p[12,13]=HR3; p[13,13]=HR2; p[14,13]=HR1

    # === BODY (rows 14-27) ===

    # Row 14: Shoulders (black top) + hair
    p[1,14]=HR1; p[2,14]=HR2; p[3,14]=SK3  # arm
    for x in range(4,12): p[x,14] = TP1
    p[12,14]=SK3  # arm
    p[13,14]=HR2; p[14,14]=HR1

    # Row 15-16: Top + arms + hair
    for y in (15,16):
        p[1,y]=HR1; p[2,y]=HR2
        p[3,y]=SK2  # arm
        for x in range(4,12): p[x,y] = TP2
        p[5,y]=TP1; p[10,y]=TP1  # fold shadows
        p[12,y]=SK2  # arm
        p[13,y]=HR2; p[14,y]=HR1

    # Row 17: Midriff (skin showing)
    p[1,17]=HR1; p[2,17]=HR3
    p[3,17]=SK3
    for x in range(4,12): p[x,17] = SK3
    p[12,17]=SK3
    p[13,17]=HR3; p[14,17]=HR1

    # Row 18: Belt/waist
    p[2,18]=HR2
    for x in range(3,13): p[x,18] = PA3
    p[13,18]=HR2

    # Row 19-22: Khaki pants (baggy)
    for y in range(19,23):
        hair = y < 21
        if hair:
            p[2,y]=HR2; p[13,y]=HR2
        for x in range(3,13): p[x,y] = PA2
        p[7,y]=PA1; p[8,y]=PA1  # center seam
        p[3,y]=PA1; p[12,y]=PA1  # side shadow

    # Row 23: Lower pants (tapered)
    for x in range(4,7): p[x,23] = PA1
    for x in range(9,12): p[x,23] = PA1

    # Row 24-25: Ankles
    for y in (24,25):
        for x in range(4,7): p[x,y] = PA1
        for x in range(9,12): p[x,y] = PA1

    # Row 26-27: Shoes
    for y in (26,27):
        c = SH2 if y == 26 else SH3
        for x in range(3,7): p[x,y] = c
        for x in range(9,13): p[x,y] = c

    return img


def down_walk(foot='left'):
    """Front-facing walk frame."""
    img = down_stand()
    p = img.load()

    if foot == 'left':
        # Left foot forward
        for x in range(3,7): p[x,27] = T
        for x in range(3,7): p[x,28] = SH3
        # Shift left leg shoes down
        for x in range(3,7): p[x,26] = SH2
        for x in range(3,7): p[x,27] = SH3
        # Right foot slightly back
        p[9,27] = T; p[10,27] = T; p[11,27] = T; p[12,27] = T
    else:
        # Mirror
        for x in range(9,13): p[x,27] = T
        for x in range(9,13): p[x,28] = SH3
        for x in range(9,13): p[x,26] = SH2
        for x in range(9,13): p[x,27] = SH3
        p[3,27] = T; p[4,27] = T; p[5,27] = T; p[6,27] = T
    return img


def up_stand():
    """Back-facing stand."""
    img = Image.new('RGBA', (16, 32), T)
    p = img.load()

    # Row 4-5: Hat back
    for x in (6,7,8,9): p[x,4] = H1
    for x in range(5,11): p[x,5] = H1
    p[6,5]=H2

    # Row 6: Hat wider
    for x in range(4,12): p[x,6] = H1

    # Row 7: Hat back brim
    for x in range(3,13): p[x,7] = H1

    # Row 8-12: Back of head — all hair
    for y in range(8,13):
        p[1,y]=HR1; p[2,y]=HR2
        for x in range(3,13):
            p[x,y] = HR3 if (x+y)%3 else HR4  # wavy texture
        p[13,y]=HR2; p[14,y]=HR1

    # Row 13: Neck glimpse through hair
    p[1,13]=HR1; p[2,13]=HR2; p[3,13]=HR3
    for x in range(4,12): p[x,13] = HR3
    p[7,13]=SK3; p[8,13]=SK3  # tiny neck showing
    p[12,13]=HR3; p[13,13]=HR2; p[14,13]=HR1

    # Row 14: Shoulders + hair
    p[1,14]=HR1; p[2,14]=HR2
    p[3,14]=SK3
    for x in range(4,12): p[x,14] = TP1
    p[12,14]=SK3
    p[13,14]=HR2; p[14,14]=HR1

    # Row 15-16: Top + hair
    for y in (15,16):
        p[1,y]=HR1; p[2,y]=HR2
        p[3,y]=SK2
        for x in range(4,12): p[x,y] = TP1
        p[7,y]=TP2; p[8,y]=TP2  # slight highlight
        p[12,y]=SK2
        p[13,y]=HR2; p[14,y]=HR1

    # Row 17: Midriff
    p[1,17]=HR1; p[2,17]=HR3
    p[3,17]=SK3
    for x in range(4,12): p[x,17] = SK3
    p[12,17]=SK3
    p[13,17]=HR3; p[14,17]=HR1

    # Row 18: Belt
    p[2,18]=HR2
    for x in range(3,13): p[x,18] = PA3
    p[13,18]=HR2

    # Row 19-22: Pants
    for y in range(19,23):
        hair = y < 21
        if hair:
            p[2,y]=HR2; p[13,y]=HR2
        for x in range(3,13): p[x,y] = PA2
        p[7,y]=PA1; p[8,y]=PA1
        p[3,y]=PA1; p[12,y]=PA1

    # Row 23-25
    for y in range(23,26):
        for x in range(4,7): p[x,y] = PA1
        for x in range(9,12): p[x,y] = PA1

    # Row 26-27: Shoes
    for y in (26,27):
        c = SH2 if y == 26 else SH3
        for x in range(3,7): p[x,y] = c
        for x in range(9,13): p[x,y] = c

    return img


def up_walk():
    img = up_stand()
    p = img.load()
    # Left foot forward
    for x in range(3,7): p[x,27]=T
    for x in range(3,7): p[x,28]=SH3
    for x in range(3,7): p[x,26]=SH2; p[x,27]=SH3
    for x in range(9,13): p[x,27]=T
    return img


def left_stand():
    """Left-facing stand (side profile)."""
    img = Image.new('RGBA', (16, 32), T)
    p = img.load()

    # Row 4-5: Hat (shifted left)
    for x in (5,6,7,8): p[x,4] = H1
    for x in range(4,10): p[x,5] = H1
    p[5,5]=H2; p[6,5]=H2

    # Row 6: Hat wider
    for x in range(3,11): p[x,6] = H1
    p[4,6]=H2; p[5,6]=H3

    # Row 7: Hat brim (extends forward=left)
    for x in range(2,11): p[x,7] = H2

    # Row 8: Under hat
    for x in range(3,10): p[x,8] = H1
    p[10,8]=HR3; p[11,8]=HR2

    # Row 9: Face side + hair back
    for x in range(3,10): p[x,9] = SK1
    p[3,9]=HR4
    p[10,9]=HR3; p[11,9]=HR2; p[12,9]=HR1

    # Row 10: Eye (one visible, side view)
    p[3,10]=HR4; p[4,10]=SK1
    p[5,10]=EW; p[6,10]=EY
    for x in range(7,10): p[x,10]=SK1
    p[10,10]=HR3; p[11,10]=HR2; p[12,10]=HR1

    # Row 11: nose/mouth
    p[2,11]=SK1  # nose protrudes
    for x in range(3,10): p[x,11]=SK1
    p[5,11]=MO
    p[10,11]=HR3; p[11,11]=HR2; p[12,11]=HR1

    # Row 12: Chin
    for x in range(3,10): p[x,12]=SK2
    p[10,12]=HR3; p[11,12]=HR2; p[12,12]=HR1

    # Row 13: Neck + hair
    for x in range(4,9): p[x,13]=SK3
    p[9,13]=HR4; p[10,13]=HR3; p[11,13]=HR2; p[12,13]=HR1

    # Row 14: Shoulder
    p[3,14]=SK3
    for x in range(4,10): p[x,14]=TP1
    p[10,14]=HR3; p[11,14]=HR2; p[12,14]=HR1

    # Row 15-16: Top
    for y in (15,16):
        p[3,y]=SK2
        for x in range(4,10): p[x,y]=TP2
        p[6,y]=TP1  # fold
        p[10,y]=HR3; p[11,y]=HR2; p[12,y]=HR1

    # Row 17: Midriff
    p[3,17]=SK3
    for x in range(4,10): p[x,17]=SK3
    p[10,17]=HR3; p[11,17]=HR2

    # Row 18: Belt
    for x in range(3,11): p[x,18]=PA3
    p[11,18]=HR2

    # Row 19-22: Pants
    for y in range(19,23):
        for x in range(3,11): p[x,y]=PA2
        p[6,y]=PA1  # seam
        p[3,y]=PA1; p[10,y]=PA1
        if y < 21:
            p[11,y]=HR2

    # Row 23-25: Lower legs
    for y in range(23,26):
        for x in range(4,7): p[x,y]=PA1
        for x in range(8,11): p[x,y]=PA1

    # Row 26-27: Shoes
    for y in (26,27):
        c = SH2 if y==26 else SH3
        for x in range(3,7): p[x,y]=c
        for x in range(8,12): p[x,y]=c

    return img


def left_walk():
    img = left_stand()
    p = img.load()
    # Shift front leg
    for x in range(3,7): p[x,27]=T
    for x in range(2,6): p[x,28]=SH3
    for x in range(8,12): p[x,27]=T
    return img


def right_stand():
    return left_stand().transpose(Image.FLIP_LEFT_RIGHT)

def right_walk():
    return left_walk().transpose(Image.FLIP_LEFT_RIGHT)


def battle_sprite():
    """
    Battle sprite ~80x80, 3/4 view, anime-style:
    Standing in battle pose, holding pokéball up in right hand.
    More detailed than overworld.
    """
    img = Image.new('RGBA', (80, 80), T)
    d = ImageDraw.Draw(img)

    # --- HAT ---
    d.ellipse([24, 2, 52, 14], fill=H1)
    d.rectangle([22, 8, 54, 16], fill=H1)
    d.rectangle([20, 14, 56, 18], fill=H2)  # brim
    d.ellipse([22, 4, 50, 12], fill=H2)  # top highlight
    # Buckle
    d.rectangle([35, 14, 41, 17], fill=H_BUCKLE)

    # --- HAIR (flowing down both sides) ---
    # Left side hair
    d.rectangle([14, 16, 22, 56], fill=HR3)
    d.rectangle([16, 14, 22, 18], fill=HR2)  # under hat
    # Right side hair
    d.rectangle([54, 16, 62, 56], fill=HR3)
    d.rectangle([54, 14, 60, 18], fill=HR2)
    # Hair wave highlights
    for y in range(20, 55, 6):
        d.line([(16, y), (16, y+3)], fill=HR5, width=1)
        d.line([(19, y+2), (19, y+5)], fill=HR4, width=1)
        d.line([(58, y), (58, y+3)], fill=HR5, width=1)
        d.line([(56, y+2), (56, y+5)], fill=HR4, width=1)
    # Hair tips (wavy ends)
    d.polygon([(14, 54), (18, 58), (22, 54)], fill=HR2)
    d.polygon([(54, 54), (58, 58), (62, 54)], fill=HR2)
    # Top hair under hat
    d.rectangle([20, 16, 56, 20], fill=HR2)

    # --- FACE ---
    d.rectangle([24, 20, 52, 38], fill=SK1)
    d.rectangle([22, 18, 54, 22], fill=SK1)  # forehead

    # Left eye (larger, anime)
    d.rectangle([27, 25, 35, 32], fill=EW)
    d.rectangle([30, 26, 35, 31], fill=(110, 65, 40, 255))  # iris
    d.rectangle([31, 27, 34, 30], fill=EY)  # pupil
    d.point((31, 26), fill=EW)  # highlight
    d.point((32, 26), fill=EW)
    # Eyebrow
    d.line([(27, 24), (35, 24)], fill=(75, 45, 25, 255), width=1)

    # Right eye
    d.rectangle([41, 25, 49, 32], fill=EW)
    d.rectangle([41, 26, 46, 31], fill=(110, 65, 40, 255))
    d.rectangle([42, 27, 45, 30], fill=EY)
    d.point((43, 26), fill=EW)
    d.point((44, 26), fill=EW)
    d.line([(41, 24), (49, 24)], fill=(75, 45, 25, 255), width=1)

    # Nose hint
    d.point((38, 32), fill=SK2)
    d.point((39, 32), fill=SK2)

    # Mouth
    d.line([(36, 35), (40, 35)], fill=MO, width=1)

    # Chin
    d.rectangle([26, 36, 50, 40], fill=SK2)

    # --- NECK ---
    d.rectangle([34, 38, 42, 44], fill=SK2)

    # --- BLACK CROP TOP ---
    d.rectangle([20, 42, 56, 54], fill=TP1)
    # V-neck
    d.line([(36, 42), (38, 46)], fill=SK2, width=1)
    d.line([(40, 42), (38, 46)], fill=SK2, width=1)
    # Sleeves
    d.rectangle([16, 42, 24, 48], fill=TP1)  # left
    d.rectangle([52, 42, 60, 48], fill=TP1)  # right
    # Highlight fold on top
    d.line([(30, 48), (30, 52)], fill=TP3, width=1)
    d.line([(46, 48), (46, 52)], fill=TP3, width=1)

    # --- ARMS ---
    # Left arm (slightly bent, hand at side)
    d.rectangle([12, 46, 20, 58], fill=SK1)
    d.rectangle([14, 56, 18, 60], fill=SK2)  # hand

    # Right arm (extended up holding pokéball)
    d.rectangle([56, 42, 64, 46], fill=SK1)  # upper arm
    d.rectangle([60, 34, 66, 44], fill=SK1)  # forearm up
    d.rectangle([62, 32, 66, 36], fill=SK2)  # hand

    # Pokéball in right hand
    # Top half (red)
    d.ellipse([60, 24, 72, 36], fill=(220, 50, 40, 255))
    # Bottom half (white)
    d.pieslice([60, 24, 72, 36], 0, 180, fill=(240, 240, 240, 255))
    # Center line
    d.line([(60, 30), (72, 30)], fill=(30, 30, 30, 255), width=1)
    # Button
    d.ellipse([64, 28, 68, 32], fill=(240, 240, 240, 255))
    d.ellipse([65, 29, 67, 31], fill=(30, 30, 30, 255))

    # --- MIDRIFF (skin gap) ---
    d.rectangle([24, 54, 52, 58], fill=SK3)

    # --- KHAKI PANTS (baggy) ---
    d.rectangle([18, 58, 58, 72], fill=PA2)
    # Center seam
    d.line([(38, 58), (38, 72)], fill=PA1, width=2)
    # Side shadows
    d.line([(24, 60), (24, 70)], fill=PA1, width=1)
    d.line([(52, 60), (52, 70)], fill=PA1, width=1)
    # Wider at hips
    d.rectangle([16, 58, 22, 62], fill=PA1)
    d.rectangle([54, 58, 60, 62], fill=PA1)
    # Pants legs separated
    d.rectangle([20, 68, 34, 72], fill=PA1)
    d.rectangle([42, 68, 56, 72], fill=PA1)

    # --- SHOES ---
    d.rectangle([18, 72, 34, 78], fill=SH2)
    d.rectangle([42, 72, 58, 78], fill=SH2)
    d.rectangle([18, 76, 34, 80], fill=SH3)
    d.rectangle([42, 76, 58, 80], fill=SH3)

    return img


# ── MAIN: Generate all sprites ──
import os
out = 'public/sprites'
os.makedirs(out, exist_ok=True)

sprites = {
    'champion-down-stand.png': down_stand(),
    'champion-down-walk1.png': down_walk('left'),
    'champion-up-stand.png': up_stand(),
    'champion-up-walk1.png': up_walk(),
    'champion-left-stand.png': left_stand(),
    'champion-left-walk1.png': left_walk(),
    'champion-right-stand.png': right_stand(),
    'champion-right-walk1.png': right_walk(),
    'champion-battle.png': battle_sprite(),
}

for name, spr in sprites.items():
    path = os.path.join(out, name)
    spr.save(path)
    print(f'  ✓ {name} ({spr.size[0]}x{spr.size[1]})')

print(f'\n✅ All {len(sprites)} champion sprites created!')
