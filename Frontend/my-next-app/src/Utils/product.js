export function getProductName(product) {
    return product?.productname || "Untitled Product"
}

export function getProductPrice(product) {
    return Number(product?.productPrice || 0)
}

export function getProductImage(product) {

    if (
        product?.productImages &&
        product.productImages.length > 0
    ) {
        return product.productImages[0]
    }

    return "/product-placeholder.svg"
}

export function getProductId(product) {
    return product?._id
}
