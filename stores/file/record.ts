import { defineStore } from 'pinia'
import type { TPredictionProductList } from '~/types/prediction/product-list'
import type { TRecordJSONResult } from '~/types/table/prediction-input'

export const useStoreFileRecord = defineStore('file-record', {
    state: () => {
        const record: TRecordJSONResult = []
        const products: TPredictionProductList = []
        return {
            record, products
        }
    },
    actions: {
        saveAll(
            records: TRecordJSONResult,
            products: TPredictionProductList
        ) {
            this.record = records
            this.products = products
        },
        forecastAllProduct() {
            this.products.forEach(p => {
                if (p.total >= 10 && p.status === 'unpredicted')
                    p.status = 'fetch-prediction'
            })
        }
    }
})