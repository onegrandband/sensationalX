// js/ladderCuff.js
export class LadderCuffGrid {
    constructor(tiers = 3, columns = 20) {
        this.tiers = tiers;
        this.columns = columns;
        this.grid = this.initializeGrid();
    }

    initializeGrid() {
        let layers = [];
        for (let t = 0; t < this.tiers; t++) {
            let row = [];
            for (let c = 0; c < this.columns; c++) {
                row.push({
                    tier: t,
                    index: c,
                    beadId: 'p_op_black',
                    color: '#ffffff',
                    stitchedTo: t > 0 ? { tier: t - 1, index: c } : null
                });
            }
            layers.push(row);
        }
        return layers;
    }

    updateBead(tier, index, beadId, color) {
        if (this.grid[tier] && this.grid[tier][index]) {
            this.grid[tier][index].beadId = beadId;
            this.grid[tier][index].color = color;
        }
    }

    exportJSON() {
        return JSON.stringify(this.grid, null, 2);
    }
}
