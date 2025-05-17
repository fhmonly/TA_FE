import { promise, z } from "zod"
import type { TPaginatedResponse } from "~/types/api-response/basicResponse"
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import type { TSupplierResponse } from "~/types/api-response/supplier";

export function useSupplierList() {
    const page = ref<number>(1)
    const limit = ref<number>(10)
    const { data, clear, refresh, status, error } = useFetchWithAutoReNew<TPaginatedResponse<TSupplierResponse>>(computed(() => `/suppliers?page=${page.value}&limit=${limit.value}`))
    return {
        page, limit, refresh, data, clear, status, error
    }
}

export function useAddSupplier() {
    const toast = useToast()
    const formState = reactive({
        supplier_name: undefined,
        address: undefined,
        contact: undefined
    })
    const internationalPhoneSchema = z.string().optional().refine((val) => {
        if (!val) return true
        const phone = parsePhoneNumberFromString(`+${val}`);
        return phone?.isValid() ?? false;
    }, {
        message: 'Invalid phone number format'
    });
    const supplierSchema = z.object({
        supplier_name: z.string().min(1, 'Supplier name is required'),
        address: z.string().optional(),
        contact: internationalPhoneSchema
    });

    const { execute, data, error, status } = use$fetchWithAutoReNew('/supplier', {
        method: 'post',
        body: formState,
        onResponse() {
            toast.add({
                color: 'green',
                title: 'Created',
                description: 'New supplier added successfully.'
            })
        }
    })

    watch(status, newVal => {
        if (newVal === 'success') {
            formState.address = undefined
            formState.supplier_name = undefined
            formState.contact = undefined
        }
    })
    return { formState, execute, data, error, status, supplierSchema }
}

export function useUpdateSupplier(supplierData: TSupplierResponse) {
    const toast = useToast()
    const formState = reactive<Partial<TSupplierResponse>>({
        supplier_name: supplierData.supplier_name,
        address: supplierData.address,
        contact: supplierData.contact || undefined
    })
    const internationalPhoneSchema = z.string().optional().refine((val) => {
        if (!val) return true
        const phone = parsePhoneNumberFromString(`+${val}`);
        return phone?.isValid() ?? false;
    }, {
        message: 'Invalid phone number format'
    });
    const supplierSchema = z.object({
        supplier_name: z.string().min(1, 'Supplier name is required'),
        address: z.string().optional(),
        contact: internationalPhoneSchema
    });

    const { execute, data, error, status } = use$fetchWithAutoReNew(`/supplier/${supplierData.id}`, {
        method: 'patch',
        body: formState,
        onResponse() {
            toast.add({
                color: 'green',
                title: 'Updated',
                description: 'Data supplier updated successfully.'
            })
        }
    })

    return { formState, execute, data, error, status, supplierSchema }
}

export function useDeleteSupplier(id: number) {
    const toast = useToast()
    const { execute, data, error, status } = use$fetchWithAutoReNew(`/supplier/${id}`, {
        method: 'delete',
        onResponse() {
            toast.add({
                color: 'green',
                title: 'Deleted',
                description: 'Supplier deleted successfully.'
            })
        }
    })

    return { execute, data, error, status }
}