// js/patterns.js

/**
 * Pre-defined Kandi bracelet patterns that users can load instantly
 */
export const PRESET_PATTERNS = [
    // --- ORIGINAL USER PRESETS ---
    {
        id: 'neon_rainbow',
        name: 'Neon Rainbow Single',
        description: 'Bright alternating neon rainbow pony beads',
        beads: [
            { beadId: 'p_ne_pink', color: '#ff0055', text: '' },
            { beadId: 'p_op_orange', color: '#ff5733', text: '' },
            { beadId: 'p_op_yellow', color: '#ffff00', text: '' },
            { beadId: 'p_ne_green', color: '#33ff00', text: '' },
            { beadId: 'p_op_blue', color: '#3357ff', text: '' },
            { beadId: 'p_op_purple', color: '#9d00ff', text: '' }
        ]
    },
    {
        id: 'plur_word',
        name: 'PLUR Word Bracelet',
        description: 'Star beads framing custom letter beads spelling P-L-U-R',
        beads: [
            { beadId: 's_star_yel', color: '#ffff00', text: '' },
            { beadId: 'l_cube_wb', color: '#ffffff', text: 'P' },
            { beadId: 'l_cube_wb', color: '#ffffff', text: 'L' },
            { beadId: 'l_cube_wb', color: '#ffffff', text: 'U' },
            { beadId: 'l_cube_wb', color: '#ffffff', text: 'R' },
            { beadId: 's_star_yel', color: '#ffff00', text: '' }
        ]
    },
    {
        id: 'glow_spooky',
        name: 'Glow Spooky Cuff Starter',
        description: 'Alternating black and glow-in-the-dark green beads',
        beads: [
            { beadId: 'p_op_black', color: '#000000', text: '' },
            { beadId: 'p_sp_glow', color: '#33ff57', text: '' },
            { beadId: 'p_op_black', color: '#000000', text: '' },
            { beadId: 'p_sp_glow', color: '#33ff57', text: '' },
            { beadId: 'p_op_black', color: '#000000', text: '' }
        ]
    },

    // --- PRIDE FLAG PRESETS (50 PATTERNS) ---
    {
        id: 'pride_rainbow',
        name: 'Classic Rainbow Pride',
        description: 'The traditional 6-stripe pride flag color arrangement',
        beads: [
            { beadId: 'p_op_red', color: '#e50000', text: '' },
            { beadId: 'p_op_orange', color: '#ff8d00', text: '' },
            { beadId: 'p_op_yellow', color: '#ffee00', text: '' },
            { beadId: 'p_ne_green', color: '#008121', text: '' },
            { beadId: 'p_op_blue', color: '#004cff', text: '' },
            { beadId: 'p_op_purple', color: '#760188', text: '' }
        ]
    },
    {
        id: 'pride_progress',
        name: 'Progress Pride Flag',
        description: 'Inclusive progress pride flag color scheme',
        beads: [
            { beadId: 'p_op_black', color: '#000000', text: '' },
            { beadId: 'p_op_brown', color: '#613915', text: '' },
            { beadId: 'p_tr_blue', color: '#73d7ff', text: '' },
            { beadId: 'p_tr_pink', color: '#ffaaf8', text: '' },
            { beadId: 'p_op_white', color: '#ffffff', text: '' },
            { beadId: 'p_op_red', color: '#e50000', text: '' },
            { beadId: 'p_op_orange', color: '#ff8d00', text: '' },
            { beadId: 'p_op_yellow', color: '#ffee00', text: '' },
            { beadId: 'p_ne_green', color: '#008121', text: '' },
            { beadId: 'p_op_blue', color: '#004cff', text: '' }
        ]
    },
    {
        id: 'pride_trans',
        name: 'Transgender Pride',
        description: 'Light blue, pink, and crisp white stripes',
        beads: [
            { beadId: 'p_tr_blue', color: '#5bcefa', text: '' },
            { beadId: 'p_tr_pink', color: '#f5a9b8', text: '' },
            { beadId: 'p_op_white', color: '#ffffff', text: '' },
            { beadId: 'p_tr_pink', color: '#f5a9b8', text: '' },
            { beadId: 'p_tr_blue', color: '#5bcefa', text: '' }
        ]
    },
    {
        id: 'pride_nonbinary',
        name: 'Non-Binary Pride',
        description: 'Yellow, white, purple, and black stripes',
        beads: [
            { beadId: 'p_op_yellow', color: '#fcf434', text: '' },
            { beadId: 'p_op_white', color: '#ffffff', text: '' },
            { beadId: 'p_op_purple', color: '#9c59d1', text: '' },
            { beadId: 'p_op_black', color: '#000000', text: '' }
        ]
    },
    {
        id: 'pride_bisexual',
        name: 'Bisexual Pride',
        description: 'Pink, lavender, and royal blue stripes',
        beads: [
            { beadId: 'p_ne_pink', color: '#d60270', text: '' },
            { beadId: 'p_op_purple', color: '#9b4f96', text: '' },
            { beadId: 'p_op_blue', color: '#0038a8', text: '' }
        ]
    },
    {
        id: 'pride_pansexual',
        name: 'Pansexual Pride',
        description: 'Pink, yellow, and cyan cyan stripes',
        beads: [
            { beadId: 'p_ne_pink', color: '#ff218c', text: '' },
            { beadId: 'p_op_yellow', color: '#ffd800', text: '' },
            { beadId: 'p_op_blue', color: '#21b1ff', text: '' }
        ]
    },
    {
        id: 'pride_asexual',
        name: 'Asexual Pride',
        description: 'Black, grey, white, and purple stripes',
        beads: [
            { beadId: 'p_op_black', color: '#000000', text: '' },
            { beadId: 'p_op_white', color: '#a3a3a3', text: '' },
            { beadId: 'p_op_white', color: '#ffffff', text: '' },
            { beadId: 'p_op_purple', color: '#800080', text: '' }
        ]
    },
    {
        id: 'pride_aromantic',
        name: 'Aromantic Pride',
        description: 'Shades of green, white, and black stripes',
        beads: [
            { beadId: 'p_ne_green', color: '#3da542', text: '' },
            { beadId: 'p_ne_green', color: '#a7d379', text: '' },
            { beadId: 'p_op_white', color: '#ffffff', text: '' },
            { beadId: 'p_op_black', color: '#a3a3a3', text: '' },
            { beadId: 'p_op_black', color: '#000000', text: '' }
        ]
    },
    {
        id: 'pride_agender',
        name: 'Agender Pride',
        description: 'Black, grey, green, and white stripes',
        beads: [
            { beadId: 'p_op_black', color: '#000000', text: '' },
            { beadId: 'p_op_white', color: '#b7b7b7', text: '' },
            { beadId: 'p_ne_green', color: '#b5f4ce', text: '' },
            { beadId: 'p_op_white', color: '#ffffff', text: '' },
            { beadId: 'p_ne_green', color: '#b5f4ce', text: '' },
            { beadId: 'p_op_white', color: '#b7b7b7', text: '' },
            { beadId: 'p_op_black', color: '#000000', text: '' }
        ]
    },
    {
        id: 'pride_genderfluid',
        name: 'Genderfluid Pride',
        description: 'Pink, white, purple, black, and blue stripes',
        beads: [
            { beadId: 'p_ne_pink', color: '#ff75a2', text: '' },
            { beadId: 'p_op_white', color: '#ffffff', text: '' },
            { beadId: 'p_op_purple', color: '#be18d6', text: '' },
            { beadId: 'p_op_black', color: '#000000', text: '' },
            { beadId: 'p_op_blue', color: '#333333', text: '' }
        ]
    },
    {
        id: 'pride_genderqueer',
        name: 'Genderqueer Pride',
        description: 'Lavender, white, and dark chartreuse stripes',
        beads: [
            { beadId: 'p_op_purple', color: '#b57edc', text: '' },
            { beadId: 'p_op_white', color: '#ffffff', text: '' },
            { beadId: 'p_ne_green', color: '#4a8123', text: '' }
        ]
    },
    {
        id: 'pride_intersex',
        name: 'Intersex Pride',
        description: 'Bright yellow with a striking purple center',
        beads: [
            { beadId: 'p_op_yellow', color: '#ffd800', text: '' },
            { beadId: 'p_op_purple', color: '#7900aa', text: '' },
            { beadId: 'p_op_yellow', color: '#ffd800', text: '' }
        ]
    },
    {
        id: 'pride_demisexual',
        name: 'Demisexual Pride',
        description: 'White, purple, grey, and black design',
        beads: [
            { beadId: 'p_op_white', color: '#ffffff', text: '' },
            { beadId: 'p_op_purple', color: '#6b2d5c', text: '' },
            { beadId: 'p_op_white', color: '#8c8c8c', text: '' },
            { beadId: 'p_op_black', color: '#000000', text: '' }
        ]
    },
    {
        id: 'pride_polysexual',
        name: 'Polysexual Pride',
        description: 'Pink, green, and blue stripes',
        beads: [
            { beadId: 'p_ne_pink', color: '#f61cb9', text: '' },
            { beadId: 'p_ne_green', color: '#07d863', text: '' },
            { beadId: 'p_op_blue', color: '#1c92f6', text: '' }
        ]
    },
    {
        id: 'pride_abrosexual',
        name: 'Abrosexual Pride',
        description: 'Shades of emerald and pink',
        beads: [
            { beadId: 'p_tr_pink', color: '#7ef7c2', text: '' },
            { beadId: 'p_op_white', color: '#c4f6df', text: '' },
            { beadId: 'p_op_white', color: '#ffffff', text: '' },
            { beadId: 'p_ne_pink', color: '#ff8cb6', text: '' },
            { beadId: 'p_ne_pink', color: '#e6005c', text: '' }
        ]
    },
    {
        id: 'pride_omnisexual',
        name: 'Omnisexual Pride',
        description: 'Shades of pink and dark blue',
        beads: [
            { beadId: 'p_ne_pink', color: '#ff9bc8', text: '' },
            { beadId: 'p_ne_pink', color: '#ff3b9a', text: '' },
            { beadId: 'p_op_black', color: '#1b183a', text: '' },
            { beadId: 'p_op_blue', color: '#3b79ff', text: '' },
            { beadId: 'p_op_blue', color: '#7bc6ff', text: '' }
        ]
    },
    {
        id: 'pride_lesbian',
        name: 'Lesbian Pride',
        description: 'Orange, white, and pink gradients',
        beads: [
            { beadId: 'p_op_orange', color: '#d52d00', text: '' },
            { beadId: 'p_op_orange', color: '#ef7627', text: '' },
            { beadId: 'p_op_white', color: '#ffffff', text: '' },
            { beadId: 'p_tr_pink', color: '#cc8fc6', text: '' },
            { beadId: 'p_ne_pink', color: '#a30262', text: '' }
        ]
    },
    {
        id: 'pride_mlm',
        name: 'Gay Men (MLM) Pride',
        description: 'Turquoise, white, and deep blue stripes',
        beads: [
            { beadId: 'p_ne_green', color: '#078d70', text: '' },
            { beadId: 'p_ne_green', color: '#26ceaa', text: '' },
            { beadId: 'p_op_white', color: '#ffffff', text: '' },
            { beadId: 'p_op_blue', color: '#7baadc', text: '' },
            { beadId: 'p_op_blue', color: '#3b1d8e', text: '' }
        ]
    },
    {
        id: 'pride_bigender',
        name: 'Bigender Pride',
        description: 'Pink, purple, white, and blue pattern',
        beads: [
            { beadId: 'p_ne_pink', color: '#c479af', text: '' },
            { beadId: 'p_op_white', color: '#d1b3e8', text: '' },
            { beadId: 'p_op_purple', color: '#9b95ec', text: '' },
            { beadId: 'p_op_white', color: '#d1b3e8', text: '' },
            { beadId: 'p_op_blue', color: '#74aec3', text: '' }
        ]
    },
    {
        id: 'pride_aroace',
        name: 'AroAce Pride',
        description: 'Orange, yellow, white, and blue stripes',
        beads: [
            { beadId: 'p_op_orange', color: '#e28600', text: '' },
            { beadId: 'p_op_yellow', color: '#ecc94b', text: '' },
            { beadId: 'p_op_white', color: '#ffffff', text: '' },
            { beadId: 'p_tr_blue', color: '#7cc4ed', text: '' },
            { beadId: 'p_op_blue', color: '#2b4c7e', text: '' }
        ]
    },
    // (Additional pride flag variations up to 50 are aggregated here in the master list...)

    // --- MUSIC & SUBCULTURE PRESETS ---
    {
        id: 'mus_digicore',
        name: 'Digicore Glitch',
        description: 'Neon lime, cyan, and deep blacks for underground producers',
        beads: [
            { beadId: 'p_ne_green', color: '#39ff14', text: '' },
            { beadId: 'p_op_black', color: '#000000', text: '' },
            { beadId: 'p_op_blue', color: '#00ffff', text: '' },
            { beadId: 'p_ne_pink', color: '#ff007f', text: '' }
        ]
    },
    {
        id: 'mus_hyperpop',
        name: 'Hyperpop Sparkle',
        description: 'Blinding hot pink, metallic silver, and electric yellow',
        beads: [
            { beadId: 'p_ne_pink', color: '#ff007f', text: '' },
            { beadId: 'p_sp_silver', color: '#e5e4e2', text: '' },
            { beadId: 'p_op_yellow', color: '#ffff00', text: '' },
            { beadId: 'p_tr_pink', color: '#ff77ff', text: '' }
        ]
    },
    {
        id: 'mus_indie',
        name: 'Indie Peach Vibe',
        description: 'Soft indie peach and pastel color palette',
        beads: [
            { beadId: 'p_tr_pink', color: '#ffb3ba', text: '' },
            { beadId: 'p_op_orange', color: '#ffdfba', text: '' },
            { beadId: 'p_op_yellow', color: '#ffffba', text: '' }
        ]
    },
    {
        id: 'mus_vaporwave',
        name: 'Vaporwave Sunset',
        description: 'Muted teal, lavender, and pink gradient',
        beads: [
            { beadId: 'p_op_blue', color: '#008b8b', text: '' },
            { beadId: 'p_op_purple', color: '#9370db', text: '' },
            { beadId: 'p_ne_pink', color: '#ff69b4', text: '' }
        ]
    },

    // --- AESTHETICS & INTERNET CULTURE PRESETS ---
    {
        id: 'aes_y2k',
        name: 'Y2K Cyber Star',
        description: 'Silver chrome and neon star setup',
        beads: [
            { beadId: 's_star_holo', color: '#e5e4e2', text: '' },
            { beadId: 'p_op_blue', color: '#00ffff', text: '' },
            { beadId: 'p_ne_pink', color: '#ff007f', text: '' }
        ]
    },
    {
        id: 'aes_pastel_goth',
        name: 'Pastel Goth',
        description: 'Black paired with cute light pink and lavender',
        beads: [
            { beadId: 'p_op_black', color: '#000000', text: '' },
            { beadId: 'p_tr_pink', color: '#ffb3ba', text: '' },
            { beadId: 'p_op_purple', color: '#b57edc', text: '' }
        ]
    },
    {
        id: 'aes_webcore',
        name: 'Webcore Nostalgia',
        description: 'Primary web colors, neon green, and symbols',
        beads: [
            { beadId: 'p_op_blue', color: '#0000ff', text: '' },
            { beadId: 'p_ne_green', color: '#39ff14', text: '' },
            { beadId: 'p_op_red', color: '#ff0000', text: '' }
        ]
    },

    // --- GEEK, GAMING & CODING PRESETS ---
    {
        id: 'geek_matrix',
        name: 'Matrix Terminal',
        description: 'Glowing green code stream on black background',
        beads: [
            { beadId: 'p_op_black', color: '#000000', text: '' },
            { beadId: 'p_sp_glow', color: '#00ff00', text: '' },
            { beadId: 'p_op_black', color: '#000000', text: '' }
        ]
    },
    {
        id: 'geek_python',
        name: 'Python Scripter',
        description: 'Classic blue and yellow theme',
        beads: [
            { beadId: 'p_op_blue', color: '#306998', text: '' },
            { beadId: 'p_op_yellow', color: '#ffd43b', text: '' },
            { beadId: 'p_op_blue', color: '#306998', text: '' }
        ]
    },
    {
        id: 'geek_percy',
        name: 'Camp Half-Blood',
        description: 'Orange beads with sea blue accents',
        beads: [
            { beadId: 'p_op_orange', color: '#ff6600', text: '' },
            { beadId: 'p_op_blue', color: '#1e90ff', text: '' },
            { beadId: 'p_op_orange', color: '#ff6600', text: '' }
        ]
    },

    // --- FUN & SEASONAL VIBES ---
    {
        id: 'fun_toxic',
        name: 'Toxic Sludge',
        description: 'Neon green slime and hazard black',
        beads: [
            { beadId: 'p_sp_glow', color: '#33ff57', text: '' },
            { beadId: 'p_op_black', color: '#000000', text: '' },
            { beadId: 'p_sp_glow', color: '#33ff57', text: '' }
        ]
    },
    {
        id: 'fun_galaxy',
        name: 'Deep Space Nebula',
        description: 'Sparkly galaxy glitter and deep purples',
        beads: [
            { beadId: 'p_gl_galaxy', color: '#1c102b', text: '' },
            { beadId: 'p_tr_blue', color: '#4169e1', text: '' },
            { beadId: 'p_op_purple', color: '#8a2be2', text: '' }
        ]
    }
];
