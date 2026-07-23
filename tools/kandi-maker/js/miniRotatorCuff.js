// js/miniRotatorCuff.js

/**
 * Creates a compact mini rotator cuff model with a smaller default size (e.g., 12 beads).
 * Perfect for keychains or miniature multi-layer rotating designs.
 */
export function createMiniRotatorCuff(size = 12) {
    return {
        size: size,
        innerRing: Array(size).fill().map((_, i) => ({ index: i, beadId: 'p_op_black', color: '#ff007f' })),
        outerRing: Array(size).fill().map((_, i) => ({ index: i, beadId: 'p_op_white', color: '#39ff14' })),
        rotationOffset: 0,

        spinClockwise(steps = 1) {
            this.rotationOffset = (this.rotationOffset + steps) % this.size;
            return this.getMiniAlignment();
        },

        spinCounterClockwise(steps = 1) {
            this.rotationOffset = (this.rotationOffset - steps + this.size) % this.size;
            return this.getMiniAlignment();
        },

        getMiniAlignment() {
            // Shifts the outer ring relative to the inner ring for the mini spin effect
            const shiftedOuter = [
                ...this.outerRing.slice(this.rotationOffset),
                ...this.outerRing.slice(0, this.rotationOffset)
            ];
            
            return {
                size: this.size,
                inner: this.innerRing,
                outer: shiftedOuter,
                offset: this.rotationOffset
            };
        },

        updateInnerBead(index, beadId, color) {
            if (this.innerRing[index]) {
                this.innerRing[index].beadId = beadId;
                this.innerRing[index].color = color;
            }
        },

        updateOuterBead(index, beadId, color) {
            if (this.outerRing[index]) {
                this.outerRing[index].beadId = beadId;
                this.outerRing[index].color = color;
            }
        }
    };
}
