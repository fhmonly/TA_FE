export function getPercentage(actual: number, min: number, max: number, allowOverflow: boolean = false) {
    if (max === min)
        throw new Error("max dan min tidak boleh sama (pembagian nol)");

    if (min > max && !allowOverflow)
        throw new Error("min tidak boleh lebih besar dari max");

    return ((actual - min) / (max - min)) * 100;
}