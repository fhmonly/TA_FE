import type { TProductCategoryResponse } from "./product_category"

export type TProductResponse = {
    id: number
    product_name: string
    product_code: string
    stock: number
    selling_price: number
    buying_price: number
    user_id: number
    product_category_id?: number
    category_name: string
}

export type TLowStockProductResponse = {
    id: number;
    product_name: string;
    stock: number;
    low_stock_limit: number;
};