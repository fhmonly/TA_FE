import { defineStore } from 'pinia'

type cartItem = {
    id: number
    product_code: string
    product_name: string
    price: number
    amount: number
}

export const useStoreSalesCart = defineStore('sales-cart', {
    state: () => {
        const cart: cartItem[] = []
        return { cart }
    },
    getters: {
        productCodeList: (state) => state.cart.map(v => v.product_code),
        totalPrice: (state) =>
            state.cart.reduce((total, item) => total + item.amount * item.price, 0),
        totalItem: (state) => state.cart.reduce((total, item) => total + item.amount, 0)
    },
    actions: {
        addItem(item: cartItem) {
            this.cart.push(item)
        },
        clearCart() {
            this.cart = []
        }
    }
})
