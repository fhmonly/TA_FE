import { z } from "zod"
import type { TPaginatedResponse } from "~/types/api-response/basicResponse"
import type { TProductResponse } from "~/types/api-response/product"

export function useProductList() {
    const page = ref<number>(1)
    const limit = ref<number>(10)
    const { data, clear, refresh, status, error } = useFetchWithAutoReNew<TPaginatedResponse<TProductResponse>>(computed(() => `/products?page=${page.value}&limit=${limit.value}`))
    return {
        page, limit, refresh, data, clear, status, error
    }
}

export function useAddProduct() {
    const toast = useToast()
    const formState = reactive<Partial<{
        product_code: string,
        product_name: string,
        stock: number,
        buying_price: number,
        selling_price: number,
        product_category_id: number,
    }>>({
        product_code: undefined,
        product_name: undefined,
        stock: undefined,
        buying_price: undefined,
        selling_price: undefined,
        product_category_id: undefined,
    })
    const productSchema = z.object({
        product_code: z.string().min(1, 'Product name is required'),
        product_name: z.string().min(1, 'Product name is required'),
        stock: z.number().optional(),
        buying_price: z.number().optional(),
        selling_price: z.number().optional(),
        product_category_id: z.number().optional(),
    });

    const { execute, data, error, status } = use$fetchWithAutoReNew('/product', {
        method: 'post',
        body: formState,
        onResponse() {
            toast.add({
                color: 'green',
                title: 'Created',
                description: 'New product added successfully.'
            })
        }
    })

    watch(status, newVal => {
        if (newVal === 'success') {
            formState.product_code = undefined
            formState.buying_price = undefined
            formState.product_category_id = undefined
            formState.product_name = undefined
            formState.selling_price = undefined
            formState.stock = undefined
        }
    })
    return { formState, execute, data, error, status, productSchema }
}

export function useUpdateProduct(productData: TProductResponse) {
    const toast = useToast()
    const formState = reactive<Partial<TProductResponse>>({
        product_code: productData.product_code,
        product_name: productData.product_name,
        product_category_id: productData.product_category_id || undefined,
        buying_price: productData.buying_price || undefined,
        selling_price: productData.selling_price || undefined,
        stock: productData.stock || undefined,
    })
    const productSchema = z.object({
        product_code: z.string().min(1, 'Product name is required'),
        product_name: z.string().min(1, 'Product name is required'),
        stock: z.number().optional(),
        buying_price: z.number().optional(),
        selling_price: z.number().optional(),
        product_category_id: z.number().optional(),
    });

    const { execute, data, error, status } = use$fetchWithAutoReNew(`/product/${productData.id}`, {
        method: 'patch',
        body: formState,
        onResponse() {
            toast.add({
                color: 'green',
                title: 'Updated',
                description: 'Data product updated successfully.'
            })
        }
    })

    return { formState, execute, data, error, status, productSchema }
}

export function useDeleteProduct(id: number) {
    const toast = useToast()
    const { execute, data, error, status } = use$fetchWithAutoReNew(`/product/${id}`, {
        method: 'delete',
        onResponse() {
            toast.add({
                color: 'green',
                title: 'Deleted',
                description: 'Product deleted successfully.'
            })
        }
    })

    return { execute, data, error, status }
}