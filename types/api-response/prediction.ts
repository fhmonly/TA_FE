import type { TAPIResponse, TDynamicResponse, TSuccessResponse } from "./basicResponse"

type TBasePredictionResponse = {
    upper: number[]
    lower: number[]
    prediction: number[]
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
export type TFilePredictionResponse = TAPIResponse<TBasePredictionResponse>

type StockPrediction = {
    id: number;
    product_name: string;
    buying_price: number;
    stock: number;
    low_stock_limit: number;
    prediction: number | null;
    lower_bound: number | null;
    upper_bound: number | null;
    rmse: number | null;
    mape: number | null;
    // fake_json: string
}
export type TStockPredictionResponse = TDynamicResponse<StockPrediction>
export type TStockPredictionListResponse = TDynamicResponse<StockPrediction[]>
export type TLatestPredictionListResponse = TDynamicResponse<{
    product_name: string;
    mape: number;
    prediction: number;
    category_name: string;
}[]>