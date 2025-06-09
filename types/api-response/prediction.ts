type TBasePredictionResponse = {
    upper: number
    lower: number
    prediction: number
    success: boolean
    arima_order: [number, number, number]
    rmse: number
    mape: number
}

type TBasePredictionRequestBody = {
    csv_string: string;
    record_period: 'daily' | 'weekly' | 'monthly';
    prediction_period: 'weekly' | 'monthly';
    value_column?: string;
    date_column?: string;
}

export type TFilePredictionRequestBody = TBasePredictionRequestBody
export type TFilePredictionResponse = TBasePredictionResponse