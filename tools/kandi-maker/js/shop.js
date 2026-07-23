// js/shop.js
import { spendMoney } from './economy.js';
import { addToBeadStock } from './inventory.js';

export const craftStoreBoxes = [
    // --- Original Boxes ---
    { id: 'box_neon_pack', name: 'Neon Pony Bead Box', price: 40, contents: { 'p_ne_pink': 80, 'p_ne_green': 80 } },
    { id: 'box_pastel_pack', name: 'Pastel Dream Box', price: 60, contents: { 'p_tr_pink': 80, 's_heart_pink': 40 } },
    { id: 'box_letter_pack', name: 'Alphabet Letter Box', price: 90, contents: { 'l_cube_wb': 100, 'l_cube_bw': 100 } },
    { id: 'box_star_pack', name: 'Magic Star Box', price: 110, contents: { 's_star_yel': 50, 's_star_glow': 50 } },

    // --- Mega Bead Bags ---
    { id: 'bag_bulk_rainbow', name: 'Mega Rainbow Pony Bag (300pcs)', price: 150, contents: { 'p_op_red': 50, 'p_op_orange': 50, 'p_op_yellow': 50, 'p_op_green': 50, 'p_op_blue': 50, 'p_op_purple': 50 } },
    { id: 'bag_translucent_clear', name: 'Crystal Clear Bag', price: 75, contents: { 'p_tr_clear': 150, 's_heart_clear': 50 } },
    { id: 'bag_monochrome', name: 'Goth Mono Bag (B&W)', price: 80, contents: { 'p_op_black': 100, 'p_op_white': 100, 'l_cube_bw': 50 } },
    { id: 'bag_glitter_sparkle', name: 'Galaxy Glitter Bag', price: 130, contents: { 'p_gl_silver': 75, 'p_gl_gold': 75, 'p_gl_galaxy': 75 } },

    // --- Pride Packs 🏳️‍🌈 ---
    { id: 'pack_rainbow_pride', name: 'Rainbow Pride Pack 🏳️‍🌈', price: 120, contents: { 'p_op_red': 40, 'p_op_orange': 40, 'p_op_yellow': 40, 'p_op_green': 40, 'p_op_blue': 40, 'p_op_purple': 40, 's_heart_red': 20 } },
    { id: 'pack_trans_pride', name: 'Trans Pride Pack 🏳️‍⚧️', price: 100, contents: { 'p_tr_blue': 60, 'p_tr_pink': 60, 'p_op_white': 80, 's_heart_pink': 30 } },
    { id: 'pack_nb_pride', name: 'Non-Binary Pride Pack 💛💜', price: 100, contents: { 'p_op_yellow': 60, 'p_op_white': 60, 'p_op_purple': 60, 'p_op_black': 60 } },
    { id: 'pack_bi_pride', name: 'Bisexual Pride Pack 💖💜💙', price: 100, contents: { 'p_ne_pink': 80, 'p_tr_purple': 80, 'p_tr_blue': 80 } },

    // --- Pride Charms, Flowers & Fun ---
    { id: 'pack_pride_charms', name: 'Holographic Star & Charm Bag', price: 140, contents: { 's_star_holo': 40, 's_butt_purp': 40, 's_flow_neon': 40 } },
    { id: 'pack_smiley_faces', name: 'Happy Face Bead Bag 😊', price: 85, contents: { 'p_op_yellow': 100, 'l_coin_wb': 50 } },
    { id: 'pack_mushroom_forest', name: 'Flower & Nature Pack 🌸', price: 125, contents: { 's_flow_pink': 50, 's_flow_neon': 50, 'p_op_red': 50 } },

    // --- More Letters & Numbers ---
    { id: 'pack_vowel_mega', name: 'Mega Vowel Letter Bag', price: 95, contents: { 'l_cube_wb': 150, 'l_cube_color': 100 } },
    { id: 'pack_neon_letters', name: 'Neon Letter Bead Box', price: 110, contents: { 'l_cube_color': 150, 'l_coin_multi': 100 } },
    { id: 'pack_glow_letters', name: 'Glow-in-the-Dark Letters', price: 130, contents: { 'l_cube_glow': 120, 'l_cube_clear': 80 } },

    // --- Ultimate Kandi Maker Essentials (<3) ---
    { id: 'kit_3d_cuff', name: 'Epic 3D Kandi Cuff Starter Kit 💫', price: 250, contents: { 'p_op_black': 100, 'p_ne_pink': 100, 'p_ne_green': 100, 's_star_glow': 50, 'l_cube_bw': 100 } },
    { id: 'item_stretch_string', name: 'Heavy-Duty Elastic Cord Spool 🧵', price: 50, contents: { 'p_tr_clear': 50 } },
    { id: 'box_rave_mystery', name: 'Secret Rave Mystery Bag ✨', price: 200, contents: { 'p_sp_glow': 100, 's_star_holo': 50, 'l_cube_glow': 100, 's_butt_blue': 50 } }
];

export function buyBeadBox(boxId) {
    const box = craftStoreBoxes.find(b => b.id === boxId);
    if (!box) return { success: false, message: 'Box not found!' };

    if (spendMoney(box.price)) {
        for (const [beadId, qty] of Object.entries(box.contents)) {
            addToBeadStock(beadId, qty);
        }
        return { success: true, message: `Opened ${box.name}! Stock added. <3` };
    } else {
        return { success: false, message: 'Not enough money! Create and finish more bracelets to earn cash.' };
    }
}
