// js/shop.js
import { spendMoney } from './economy.js';
import { addToBeadStock } from './inventory.js';

export const craftStoreBoxes = [
    { id: 'box_neon_pack', name: 'Neon Pony Bead Box', price: 40, contents: { 'p_ne_pink': 80, 'p_ne_green': 80 } },
    { id: 'box_pastel_pack', name: 'Pastel Dream Box', price: 60, contents: { 'p_tr_pink': 80, 's_heart_pink': 40 } },
    { id: 'box_letter_pack', name: 'Alphabet Letter Box', price: 90, contents: { 'l_cube_wb': 100, 'l_cube_bw': 100 } },
    { id: 'box_star_pack', name: 'Magic Star Box', price: 110, contents: { 's_star_yel': 50, 's_star_glow': 50 } }
];

export function buyBeadBox(boxId) {
    const box = craftStoreBoxes.find(b => b.id === boxId);
    if (!box) return { success: false, message: 'Box not found!' };

    if (spendMoney(box.price)) {
        for (const [beadId, qty] of Object.entries(box.contents)) {
            addToBeadStock(beadId, qty);
        }
        return { success: true, message: `Opened ${box.name}! Stock added.` };
    } else {
        return { success: false, message: 'Not enough money! Create and finish more bracelets to earn cash.' };
    }
}
