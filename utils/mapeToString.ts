export function classifyMAPE(mape: number): {
    label: 'Very Good' | 'Good' | 'Acceptable' | 'Not Relevant';
    class: string;
} {
    mape = Number(mape);

    if (mape < 10) {
        return {
            label: 'Very Good',
            class: 'text-green-600 dark:text-green-400'
        };
    }
    if (mape < 20) {
        return {
            label: 'Good',
            class: 'text-emerald-600 dark:text-emerald-400'
        };
    }
    if (mape < 50) {
        return {
            label: 'Acceptable',
            class: 'text-yellow-600 dark:text-yellow-400'
        };
    }
    return {
        label: 'Not Relevant',
        class: 'text-red-600 dark:text-red-400'
    };
}
