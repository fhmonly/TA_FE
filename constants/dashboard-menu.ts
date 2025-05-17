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
        label: 'Dataset',
        icon: 'i-heroicons-folder-20-solid',
        to: '/dashboard/dataset',
        //     children: [
        //         {
        //             label: 'Suppliers',
        //             to: '/dashboard/dataset/suppliers',
        //             icon: 'i-heroicons-building-storefront-20-solid',
        //         },
        //         {
        //             label: 'Products',
        //             to: '/dashboard/dataset/products',
        //             icon: 'i-heroicons-cube-20-solid',
        //         },
        //     ],
    },
]
