export type TDurationType = 'daily' | 'weekly' | 'monthly'
export type TModalMakePredictionModel = {
    recordPeriod?: TDurationType,
    selectedProduct?: string,
    predictionPeriod?: TDurationType,
}
export type TProduct = {
    product_code: string,
    product_name: string
}
export type TModalMakePredictionProps = {
    products?: TProduct[]
}