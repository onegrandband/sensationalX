// js/patterns.js

/**
 * Pre-defined Kandi bracelet patterns that users can load instantly
 */
export const PRESET_PATTERNS = [
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
    }
];
