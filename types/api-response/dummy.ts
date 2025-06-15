import type { TAPIResponse } from "./basicResponse";

export type TDummyResponse = TAPIResponse<{
    product_id: number;
    product_name: string;
    dummy_id: number
    fake_json: number[];
}[]>