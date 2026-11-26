import { API_URL } from "../config/api"

const GUEST_CART_KEY = "yocana_guest_cart"

const readRawGuestItems = () => {
  try {
    const raw = localStorage.getItem(GUEST_CART_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

const writeRawGuestItems = (items) => {
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items))
  window.dispatchEvent(new Event("yocana-cart-updated"))
}

export const getGuestCart = () => {
  const rawItems = readRawGuestItems()

  const items = rawItems.map((item) => {
    const price = Number(item.price || 0)
    const quantity = Number(item.quantity || 1)
    return {
      cart_item_id: item.product_id,
      product_id: Number(item.product_id),
      name: item.name || "YOCANA Fragrance",
      category: item.category || "",
      size_ml: item.size_ml || 50,
      price,
      current_stock: Number(item.current_stock ?? 99),
      quantity,
      item_subtotal: price * quantity,
    }
  })

  const total_items = items.reduce((sum, i) => sum + i.quantity, 0)
  const subtotal = items
    .reduce((sum, i) => sum + i.item_subtotal, 0)
    .toFixed(2)

  return {
    items,
    total_items,
    subtotal,
  }
}

export const addToGuestCart = (product, quantity = 1) => {
  if (!product?.id) return

  const productId = Number(product.id)
  const maxStock = Number(product.current_stock ?? 99)
  const items = readRawGuestItems()

  const existingIndex = items.findIndex(
    (item) => Number(item.product_id) === productId
  )

  if (existingIndex >= 0) {
    const currentQty = Number(items[existingIndex].quantity || 0)
    const nextQty = Math.min(currentQty + Number(quantity || 1), maxStock)
    items[existingIndex] = {
      ...items[existingIndex],
      name: product.name || items[existingIndex].name,
      category: product.category || items[existingIndex].category,
      size_ml: product.size_ml || items[existingIndex].size_ml,
      price: Number(product.price ?? items[existingIndex].price),
      current_stock: maxStock,
      quantity: Math.max(1, nextQty),
    }
  } else {
    items.push({
      product_id: productId,
      name: product.name,
      category: product.category,
      size_ml: product.size_ml || 50,
      price: Number(product.price || 0),
      current_stock: maxStock,
      quantity: Math.min(Math.max(1, Number(quantity || 1)), maxStock),
    })
  }

  writeRawGuestItems(items)
}

export const updateGuestCartItem = (productId, newQuantity) => {
  const id = Number(productId)
  const items = readRawGuestItems()

  const updated = items.map((item) => {
    if (Number(item.product_id) !== id) return item
    const maxStock = Number(item.current_stock ?? 99)
    const clamped = Math.min(Math.max(1, Number(newQuantity || 1)), maxStock)
    return {
      ...item,
      quantity: clamped,
    }
  })

  writeRawGuestItems(updated)
}

export const removeGuestCartItem = (productId) => {
  const id = Number(productId)
  const items = readRawGuestItems().filter(
    (item) => Number(item.product_id) !== id
  )
  writeRawGuestItems(items)
}

export const clearGuestCart = () => {
  localStorage.removeItem(GUEST_CART_KEY)
  window.dispatchEvent(new Event("yocana-cart-updated"))
}

export const syncGuestCartToAccount = async (token) => {
  if (!token) return
  const rawItems = readRawGuestItems()
  if (!rawItems.length) return

  for (const item of rawItems) {
    try {
      await fetch(`${API_URL}/api/cart/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_id: Number(item.product_id),
          quantity: Number(item.quantity || 1),
        }),
      })
    } catch {
      // Ignore individual item sync failure so login still succeeds
    }
  }

  clearGuestCart()
}
