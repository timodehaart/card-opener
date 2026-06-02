Pack Opener - Setup Guide
This is a complete implementation of an interactive card pack opener inspired by Pokemon TCG Pocket. Below is exactly where each file should go and what it does.
File Structure
your-project/
├── app/
│   ├── components/
│   │   ├── CardReveal.tsx      (Card reveal animation component)
│   │   └── PackOpener.tsx      (Pack opening animation component)
│   ├── utils/
│   │   └── sounds.ts           (Sound effects using Web Audio API)
│   ├── globals.css             (Enhanced styles with animations)
│   ├── layout.tsx              (Root layout)
│   └── page.tsx                (Main pack selection page)
├── public/                      (Keep existing SVG files)
├── package.json                 (Already has Framer Motion)
├── next.config.ts              (No changes needed)
├── tsconfig.json               (No changes needed)
└── eslint.config.mjs           (No changes needed)
Installation Steps
1. Replace/Update Files
Copy the provided files to your project:

app/page.tsx - Main page with pack selection grid
app/layout.tsx - Root layout (update from provided)
app/globals.css - Enhanced global styles (replace existing)
app/components/PackOpener.tsx - NEW: Pack opening modal
app/components/CardReveal.tsx - NEW: Card reveal with animations
app/utils/sounds.ts - NEW: Sound effects utility

2. Verify Dependencies
Your package.json should already have:
json{
  "dependencies": {
    "framer-motion": "^12.40.0",
    "next": "16.2.7",
    "react": "19.2.4",
    "react-dom": "19.2.4"
  }
}
All required packages are already installed! ✅
3. Run the Development Server
bashnpm run dev
Then open http://localhost:3000 in your browser.
Features Implemented
🎴 Pack Selection

Beautiful gradient pack cards
Smooth hover animations
Different pack types (Fire, Water, Grass, Electric)
Sound effects on selection

📖 Pack Opening

Drag/swipe animation to open packs
Visual feedback during opening
Pack flips and scales during animation
Swoosh sound effect
Auto-progress to card reveals

✨ Card Reveals

Cards flip into view with 3D perspective
Rarity tiers:

Common - Gray with no glow
Uncommon - Green with gentle glow
Rare - Blue with pulsing animation
Holo - Purple with shimmer effect and continuous animation


Spark sound effects on reveal
Staggered reveal animations

🔊 Sound Effects

Select: Beep when clicking packs
Open: Swoosh sound when opening packs
Reveal: Sparkle sounds for each card
Success: Chime when finishing the pack

All sounds use Web Audio API (no external files needed!)
How to Use

Start: Click on any pack at the top level
Open: Drag the pack upward (or click to auto-open)
Reveal: Click through each card to see its rarity
Repeat: Go back and open another pack!

Customization Options
Add More Packs
Edit app/page.tsx and modify the PACKS array:
typescriptconst PACKS: Pack[] = [
  {
    id: 'new-pack',
    name: 'New Pack Name',
    color: 'bg-gradient-to-br from-[COLOR1] to-[COLOR2]',
    description: 'Description here',
    icon: '🎨', // Any emoji
  },
  // Add more...
];
Add More Card Names
Modify the CARD_NAMES array to include different card names:
typescriptconst CARD_NAMES = [
  'Card Name 1',
  'Card Name 2',
  // etc...
];
Change Rarity Probabilities
In generateCards() function, modify the thresholds:
typescriptif (rand > 0.9) {
  rarity = 'holo';      // 10% chance - increase to 0.95 for 5%
} else if (rand > 0.7) {
  rarity = 'rare';      // 20% chance
} else if (rand > 0.4) {
  rarity = 'uncommon';  // 30% chance
}
Customize Animations
All animations use Framer Motion. Edit these files to adjust:

PackOpener.tsx - Pack opening motion
CardReveal.tsx - Card flip animations
page.tsx - Pack grid animations

Example: Change card flip duration in CardReveal.tsx:
typescriptanimate={{ scale: 1, rotateY: 0 }}
transition={{ duration: 0.6, type: 'spring' }} // Change 0.6 to faster/slower
Adjust Sound Effects
Edit app/utils/sounds.ts to change frequencies, durations, or add new sounds.
Browser Compatibility

✅ Chrome/Edge (full support)
✅ Firefox (full support)
✅ Safari (full support)
✅ Mobile browsers (touch support)

Web Audio API is supported in all modern browsers.
Performance Tips

Animations are GPU-accelerated using transform-gpu class
Sound synthesis uses Web Audio API (no heavy audio files)
Framer Motion optimizes animations automatically
All components use 'use client' for client-side rendering

Troubleshooting
Sounds not working?

Check browser console for errors
Ensure browser allows Web Audio API (usually enabled by default)
Some browsers require user interaction before playing audio (this is handled)

Animations stuttering?

Update Framer Motion: npm install framer-motion@latest
Check browser hardware acceleration is enabled
Close other CPU-intensive apps

TypeScript errors?

Run npm run dev to regenerate types
Clear .next folder: rm -rf .next

Next Steps
Once this is working, you could enhance it with:

Database storage for collected cards
User accounts and card collections
Trading between users
Booster pack sets with different odds
Special events with exclusive cards
Leaderboards

Enjoy your pack opener! 🎉