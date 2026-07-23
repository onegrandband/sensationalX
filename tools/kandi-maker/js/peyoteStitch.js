// js/peyoteStitch.js
import { braceletData } from './state.js';

export function calculatePeyoteGrid(rows, baseColumns, stitchType = 'even') {
    let grid = [];
    const isOdd = stitchType === 'odd';

    for (let r = 0; r < rows; r++) {
        let rowBeads = [];
        // Odd peyote alternates row lengths or offset logic
        let colsInRow = (isOdd && r % 2 !== 0) ? baseColumns - 1 : baseColumns;
        
        for (let c = 0; c < colsInRow; c++) {
            rowBeads.push({
                row: r,
                col: c,
                // Offset alternative rows by half a bead width for the classic brick/peyote look
                offsetX: (r % 2 === 0) ? 0 : 0.5, 
                beadId: braceletData.selectedBeadId,
                color: braceletData.selectedColor
            });
        }
        grid.push(rowBeads);
    }
    return grid;
}

export function renderPeyoteHTML(grid) {
    return grid.map((row, rIdx) => `
        <div class="peyote-row" style="display: flex; gap: 4px; margin-left: ${rIdx % 2 !== 0 ? '12px' : '0'};">
            ${row.map(bead => `
                <div class="peyote-bead" data-row="${bead.row}" data-col="${bead.col}" style="width: 22px; height: 22px; background-color: ${bead.color}; border-radius: 50%; border: 1px solid rgba(0,0,0,0.3);"></div>
            `).join('')}
        </div>
    `).join('');
}
