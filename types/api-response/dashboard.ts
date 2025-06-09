export interface IDashboardStatsResponse {
    total_product: number;
    total_low_stock: number;
    total_last_month_restock: number | null;
    total_monthly_restock: number | null;
    restock_growth: number | null;
    total_last_month_sales: number | null;
    total_monthly_sales: number | null;
    salesGrowth: number;
}
