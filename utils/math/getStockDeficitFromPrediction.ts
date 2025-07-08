export function getStockDeficitFromPrediction(
    predictionArray: number[],
    stock: number
) {
    if (!Array.isArray(predictionArray)) throw new Error("predictionArray harus berupa array");
    if (+stock < 1) stock = 0

    const totalPrediction = predictionArray.reduce((sum, value) => {
        const num = typeof value === 'number' ? value : Number(value);
        return sum + (isNaN(num) ? 0 : Math.max(0, num));
    }, 0);

    const shortage = totalPrediction - stock;

    return Math.max(0, shortage);
}