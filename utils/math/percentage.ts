// export function getPercentage(actual: number, min: number, max: number, allowOverflow: boolean = false) {
//     if (max === min)
//         throw new Error("max dan min tidak boleh sama (pembagian nol)");

//     if (min > max && !allowOverflow)
//         throw new Error("min tidak boleh lebih besar dari max");

//     return ((actual - min) / (max - min)) * 100;
// }

export function getPercentage(
    actual: number,
    min: number,
    max: number,
    allowOverflow: boolean = false
): number {
    if (max === min) {
        // Handle pembagian nol: anggap 100% kalau actual == max, 0% kalau tidak
        return actual === max ? 100 : 0;
    }

    if (min > max) {
        if (!allowOverflow) {
            // Swap min & max biar tetap logis
            [min, max] = [max, min];
        }
        // kalau allowOverflow true, biarin aja — lanjutkan perhitungan
    }

    const percentage = ((actual - min) / (max - min)) * 100;

    return percentage;
}
