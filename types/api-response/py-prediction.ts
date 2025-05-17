export type TPyPrediction = {
    status: "success" | 'error',
    data: {
        predictionPeriod: "weekly" | "monthly",
        product: string,
        order: string,
        phase1: number,
        phase2: number,
        phase3: number
    }[]
}