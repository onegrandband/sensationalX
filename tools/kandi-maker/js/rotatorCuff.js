// js/rotatorCuff.js
export function createRotatorCuff(size = 30) {
    return {
        innerRing: Array(size).fill().map((_, i) => ({ index: i, beadId: 'p_op_black', color: '#ff007f' })),
        outerRing: Array(size).fill().map((_, i) => ({ index: i, beadId: 'p_op_white', color: '#00ffff' })),
        rotationOffset: 0,

        rotateClockwise(steps = 1) {
            this.rotationOffset = (this.rotationOffset + steps) % this.outerRing.length;
            return this.getAlignedRings();
        },

        rotateCounterClockwise(steps = 1) {
            this.rotationOffset = (this.rotationOffset - steps + this.outerRing.length) % this.outerRing.length;
            return this.getAlignedRings();
        },

        getAlignedRings() {
            // Shifts the outer ring representation relative to the inner ring
            const shiftedOuter = [
                ...this.outerRing.slice(this.rotationOffset),
                ...this.outerRing.slice(0, this.rotationOffset)
            ];
            return {
                inner: this.innerRing,
                outer: shiftedOuter,
                offset: this.rotationOffset
            };
        }
    };
}
