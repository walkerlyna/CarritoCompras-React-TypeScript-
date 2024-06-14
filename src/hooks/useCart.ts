import { useState, useEffect, useMemo } from "react"
import { db } from '../data/guitars.js'
import type { GuitarType, CartItem } from "../types/index.js"

const useCart = () => {

    const initialCart = (): CartItem[] => {
        const localStorageCart = localStorage.getItem('cart');
        return localStorageCart ? JSON.parse(localStorageCart) : []
    }

    const [data] = useState(db)
    const [cart, setCart] = useState(initialCart)

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart))
    }, [cart])


    // Agregar items al carrito
    const addCart = (item: GuitarType) => {
        setCart(prevCart => {
            const itemExists = prevCart.some(guitar => guitar.id === item.id)
            if (itemExists) {
                return prevCart.map(guitar => guitar.id === item.id ? { ...guitar, cantidad: guitar.cantidad + 1 } : guitar)
            } else {
                return [...prevCart, { ...item, cantidad: 1 }]
            }
        })
    }

    // Eliminar items del carrito
    const removeFromCart = (id: GuitarType['id']) => {
        setCart(prevCart => prevCart.filter(guitar => guitar.id !== id))
    }

    // Agregar cantidad a cada item del carrito
    const moreGuitar = (id: GuitarType['id']) => {
        setCart(prevCart =>
            prevCart.map(guitar =>
                guitar.id === id
                    ? { ...guitar, cantidad: guitar.cantidad + 1 }
                    : guitar
            )
        )
    }

    // Disminuir cantidad a cada item del carrito
    const lessGuitar = (id: GuitarType['id']) => {
        setCart(prevCart =>
            prevCart
                .map(guitar =>
                    guitar.id === id && guitar.cantidad > 1
                        ? { ...guitar, cantidad: guitar.cantidad - 1 }
                        : guitar
                )
        )
    }

    const vaciarCart = () => {
        setCart([])
    }

    // Header functions    
    const isEmpty = useMemo(() => cart.length === 0, [cart])

    const totaly = useMemo(() => cart.reduce((total, item) => total + (item.cantidad * item.price), 0), [cart])


    return {
        data,
        cart,
        addCart,
        removeFromCart,
        moreGuitar,
        lessGuitar,
        vaciarCart,
        isEmpty,
        totaly
    }
}

export default useCart