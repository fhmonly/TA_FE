export type TPredictionProductList = {
    product_code: string
    product_name: string
    total: number //total product at periode range. example: record_data.xlsx has 20 total item of masako_ayam
    actual_prediction?: number
    lower_bound?: number
    upper_bound?: number
    mape?: number
    rmse?: number
    model?: [number, number, number]
    status: 'unpredicted' | 'fetch-prediction' | 'loading' | 'predicted'
}[]