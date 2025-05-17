import type { TAPIResponse } from "~/types/api-response/basicResponse"
import type { TProductCategoryResponse } from "~/types/api-response/product_category"

export function useShowProductCategory() {
    const { data, clear, refresh, status, error } = useFetchWithAutoReNew<TAPIResponse<TProductCategoryResponse[]>>(computed(() => `/product-categories`))
    return {
        refresh, data, clear, status, error
    }
}

export function useAddProductCategory() {
    const toast = useToast()
    const status = ref<'idle' | 'success' | 'error' | 'loading'>('idle')
    const formState = reactive<{
        category_name?: string
    }>({
        category_name: undefined
    })
    async function createNow() {
        status.value = 'loading'
        let id = undefined
        const { execute, data } = use$fetchWithAutoReNew<TAPIResponse<{
            productCategoryId: number
        }>>(`/product-category`, {
            method: 'post',
            body: formState,
            onResponse() {
                status.value = 'success'
                formState.category_name = undefined
                toast.add({
                    color: 'green',
                    title: 'Created',
                    description: 'Product category created successfully.'
                })
            },
            onResponseError() {
                status.value = 'error'
            }
        })
        await execute()
        return data.value?.data?.productCategoryId
    }
    return { formState, createNow, status }
}

export function useUpdateProductCategory(id: number) {
    const productCategoryId = ref<number>()
    const toast = useToast()
    const { execute, data, error, status } = use$fetchWithAutoReNew(`/product-category/${id}`, {
        method: 'patch',
        onResponse() {
            toast.add({
                color: 'green',
                title: 'Deleted',
                description: 'Product category deleted successfully.'
            })
        }
    })

    return { productCategoryId, execute, data, error, status }
}

export function useDeleteProductCategory() {
    const productCategoryId = ref<number>()
    const toast = useToast()
    const { execute, data, error, status } = use$fetchWithAutoReNew(computed(() => `/product-category/${productCategoryId.value}`), {
        method: 'delete',
        onResponse() {
            toast.add({
                color: 'green',
                title: 'Deleted',
                description: 'Product category deleted successfully.'
            })
        }
    })

    return { productCategoryId, execute, data, error, status }
}

export function useProductCategoryListOptions() {
    const { data, refresh, status } = useShowProductCategory()
    const options = ref<TProductCategoryResponse[]>()

    watch(status, newVal => {
        if (newVal === 'success')
            options.value = data.value?.data
    })
    const selectedReal = ref<number>()

    const selected = computed({
        get: () => selectedReal.value,
        set: async (newVal) => {
            if (Number(newVal) >= 0) {
                selectedReal.value = newVal
                return newVal
            }
            const {
                createNow, formState
            } = useAddProductCategory()
            formState.category_name = newVal?.toString()
            const id = await createNow()
            selectedReal.value = id
            refresh()
            return id
        }
    })

    return { selected, options, status }
}