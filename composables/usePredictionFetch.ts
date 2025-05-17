import type { AsyncDataRequestStatus } from 'nuxt/app';
import type { TDurationType, TPredictionMode } from '~/types/landing-page/demo/modalMakePrediction';
import { z } from 'zod';
import type { TPyPrediction } from '~/types/api-response/py-prediction';

export function usePredictionFetch() {
    const config = useRuntimeConfig();

    const recordPeriodOptions: TDurationType[] = ['daily', 'weekly', 'monthly']
    const predictionModeOptions: {
        value: TPredictionMode,
        label: string
    }[] = [
            { value: 'optimal', label: 'Optimal (2,1,2)' },
            { value: 'auto', label: 'Auto (Flexible)' },
            { value: 'custom', label: 'Custom' },
        ]
    const predictionPeriodOptions = computed(() => {
        switch (formData.recordPeriod) {
            case 'daily':
            case 'weekly':
                return ['weekly', 'monthly']
            case 'monthly':
                return ['monthly']
            default:
                break;
        }
    })

    const ARIMASchema = z.object({
        modelAR: z.string().min(1, { message: 'Model AR wajib diisi' }).regex(/^\d+$/, { message: 'Model AR harus angka' }),
        differencing: z.string().min(1, { message: 'Differencing wajib diisi' }).regex(/^\d+$/, { message: 'Differencing harus angka' }).max(2),
        modelMA: z.string().min(1, { message: 'Model MA wajib diisi' }).regex(/^\d+$/, { message: 'Model MA harus angka' }),
    })

    const formData = reactive<{
        sheet: File | null
        recordPeriod: TDurationType,
        predictionPeriod: 'weekly' | 'monthly'
        predictionMode: TPredictionMode,
        modelAR: number,
        differencing: 0 | 1,
        modelMA: number,
    }>({
        sheet: null,
        recordPeriod: 'daily',
        predictionPeriod: 'weekly',
        predictionMode: 'optimal',
        modelAR: 2,
        differencing: 1,
        modelMA: 2,
    })

    const ARIMAModel = computed(() => {
        switch (formData.predictionMode) {
            case 'auto':
                return []
            case 'optimal':
                return [2, 1, 2]
            case 'custom':
                return [
                    formData.modelAR,
                    formData.differencing,
                    formData.modelMA
                ]
            default:
                return [2, 1, 2]
        }
    })

    const result = ref<TPyPrediction>();
    const status = ref<AsyncDataRequestStatus>('idle');
    const error = ref<Error | null>(null);
    async function execute() {
        status.value = 'pending';
        error.value = null;
        const fd = new FormData()
        try {
            if (!formData.sheet) throw new Error('Sheet not found!')
            fd.append('sheet', formData.sheet)
            fd.append('recordPeriod', formData.recordPeriod)
            fd.append('predictionPeriod', formData.predictionPeriod)
            fd.append('predictionMode', formData.predictionMode)
            fd.append('arimaModel', ARIMAModel.value.join(','))
            await $fetch('/predict-file', {
                method: 'post',
                baseURL: config.public.PYTHON_API_HOST,
                onResponse: async (ctx) => {
                    result.value = ctx.response._data;
                    if (ctx.response.ok) {
                        status.value = 'success';
                    }
                },
                onResponseError: async (ctx) => {
                    error.value = ctx?.error ?? ctx.response._data ?? null;
                    const statusCode = ctx.response?.status;
                    status.value = 'error';
                },
                body: fd
            });
        } catch (err) {
            error.value = err as Error;
            status.value = 'error';
            console.error('❌ Fetch failed:', err);
        }
    }

    return {
        result, status, error, execute, formData, ARIMASchema,
        recordPeriodOptions, predictionPeriodOptions, predictionModeOptions
    };
}
