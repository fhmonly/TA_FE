export type TRecordJSONResult = {
    date: string
    product_code?: string
    product_name: string
    amount: number,
    [key: string]: any
}[]