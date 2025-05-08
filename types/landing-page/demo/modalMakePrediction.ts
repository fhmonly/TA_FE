export type TPredictionMode = 'auto' | 'optimal' | 'custom'
export type TDurationType = 'daily' | 'weekly' | 'monthly'
export type TModalMakePredictionModel = {
    recordPeriod?: TDurationType,
    selectedProduct?: string,
    predictionPeriod?: TDurationType,
    predictionMode?: TPredictionMode,
    arimaModel?: number[]
}
export type TProduct = {
    product_code: string,
    product_name: string
}
export type TModalMakePredictionProps = {
    products?: TProduct[],
    disabled?: boolean,
    [key: string]: any;
}