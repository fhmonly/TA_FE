// SidebarItems.js
export const sidebarItems = [
    {
        label: 'Dashboard',
        to: '/dashboard/home',
        icon: 'i-heroicons-chart-bar-20-solid',
    },
    {
        label: 'Cashier',
        to: '/dashboard/cashier',
        icon: 'i-heroicons-shopping-bag-20-solid',
    },
    {
        label: 'Restock',
        to: '/dashboard/restock',
        icon: 'i-heroicons-arrow-path-20-solid',
    },
    {
        label: 'Prediction',
        to: '/dashboard/prediction',
        icon: 'i-heroicons-chart-bar-20-solid',
    },
    {
        label: 'Dataset',
        icon: 'i-heroicons-folder-20-solid',
        to: '/dashboard/dataset',
        children: [
            {
                label: 'Suppliers',
                to: '/dashboard/dataset/suppliers',
                icon: 'i-heroicons-building-storefront-20-solid',
            },
            {
                label: 'Products',
                to: '/dashboard/dataset/products',
                icon: 'i-heroicons-cube-20-solid',
            },
        ],
    },
    {
        label: 'Logs',
        to: '/dashboard/history',
        icon: 'i-heroicons-clipboard-document-list-20-solid',
        children: [
            {
                label: 'Restock History',
                to: '/dashboard/history/restock-history',
                icon: 'i-heroicons-truck-20-solid',
            },
            {
                label: 'Sales History',
                to: '/dashboard/history/sales-history',
                icon: 'i-heroicons-banknotes-20-solid',
            },
        ],
    },
    {
        label: 'File Operation',
        to: '/dashboard/file-operation',
        icon: 'i-heroicons-arrow-up-tray-20-solid',
    }
]
