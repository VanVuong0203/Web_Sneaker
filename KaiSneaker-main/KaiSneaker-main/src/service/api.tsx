import { UUID } from "crypto";
import axios from "./axios.customize";
// BRAND
interface BrandDTO {
    brandName: string,
    descriptionBrand: string,
    imageBrand: string
}

const fetchAllBrand = () => {
    const URL_BACKEND = "/brand"
    return axios.get(URL_BACKEND)
}

const updateBrand = (idBrand: UUID, data: BrandDTO) => {
    const URL_BACKEND = `/brand/${idBrand}`
    return axios.put(URL_BACKEND, data)
}

const createBrand = (data: BrandDTO) => {
    const URL_BACKEND = `/brand`
    return axios.post(URL_BACKEND, data)
}

const deleteBrand = (idBrand: UUID) => {
    const URL_BACKEND = `/brand/${idBrand}`
    return axios.delete(URL_BACKEND)
}
// Exit BRAND

// SLIDE


export interface SliderDTO {
    imageUrl: string;
    description: string;
    slideOrder: number;
}

const fetchAllSlide = () => {
    const URL_BACKEND = "/slider"
    return axios.get(URL_BACKEND)
}

const createSlide = (data: SliderDTO) => {
    const URL_BACKEND = "/slider"
    return axios.post(URL_BACKEND, data)
}

const deleteSlide = (id: UUID) => {
    const URL_BACKEND = `/slider/${id}`
    return axios.delete(URL_BACKEND)
}

// Exit Slide

// Product

export interface ProductDTO {
    shoesName: string,
    shoesPrice: number,
    shoesDescription: string,
    shoesImg: string[],
    brand: {
        idBrand: UUID
    }
}

const fetchAllProduct = () => {
    const URL_BACKEND = "/products"
    return axios.get(URL_BACKEND)
}

const fetchProductByName = (keySearch: string) => {
    const URL_BACKEND = `/products/search/${keySearch}`
    return axios.get(URL_BACKEND)
}

const deleteProduct = (idProduct: UUID) => {
    const URL_BACKEND = `products/${idProduct}`;
    return axios.delete(URL_BACKEND)
}

const createProduct = (data: ProductDTO) => {
    const URL_BACKEND = `/products`
    return axios.post(URL_BACKEND, data)
}

const updateProduct = (idProduct: UUID, data: ProductDTO) => {
    const URL_BACKEND = `/products/${idProduct}`
    return axios.put(URL_BACKEND, data)
}

const fetchTopSelling = () => {
    const URL_BACKEND = `/products/top-selling`
    return axios.get(URL_BACKEND);
}

// END Product


// SIZE
const fetchAllSize = () => {
    const URL_BACKEND = "/size"
    return axios.get(URL_BACKEND)
}

// END SIZE


//STOCK


export interface StockDTO {
    productId: UUID;
    idSize: UUID;
    quantityInStock: number;
}

const fetchAllStock = () => {
    const URL_BACKEND = "/stock"
    return axios.get(URL_BACKEND)
}

const fetchStockByProduct = (idProduct: UUID) => {
    const URL_BACKEND = `/stock/product/${idProduct}`
    return axios.get(URL_BACKEND)
}


const createStock = (data: StockDTO) => {
    const URL_BACKEND = "/stock"
    return axios.post(URL_BACKEND, data)
}

const deleteStock = (idStock: UUID) => {
    const URL_BACKEND = `/stock/${idStock}`
    return axios.delete(URL_BACKEND)
}

const updateStock = (idStock: UUID, data: StockDTO) => {
    const URL_BACKEND = `/stock/${idStock}`;
    return axios.put(URL_BACKEND, data)
}

// END STOCK


// USER

export interface UserDTO {
    username: string,
    password?: string,
    fullName: string,
    gender: string,
    cccd: string,
    email: string,
    numberPhone: string,
    dateOfBirth: string,
    imageUser: string,
    roleName: string
}

const fetchAllUser = () => {
    const URL_BACKEND = "/users"
    return axios.get(URL_BACKEND)
}

const fetchUserById = (idUser: UUID) => {
    const URL_BACKEND = `/users/${idUser}`
    return axios.get(URL_BACKEND)
}

const updateUser = (idUser: UUID, data: UserDTO) => {
    const URL_BACKEND = `/users/${idUser}`
    return axios.put(URL_BACKEND, data)
}

const deleteUser = (idUser: UUID) => {
    const URL_BACKEND = `/users/${idUser}`
    return axios.delete(URL_BACKEND)
}

const fetchUserByName = (username: string) => {
    const URL_BACKEND = `/users/username?username=${username}`
    return axios.get(URL_BACKEND)
}

const registerUser = (username: string, password: string) => {
    const data = {
        username: username,
        password: password
    }
    const URL_BACKEND = `/register`
    return axios.post(URL_BACKEND, data)
}

// END USER

// Address User

export interface ShippingInfoDTO {
    shoppingInfoName: string;
    shoppingInfoPhone: string;
    address: string;
    idAccount: UUID;
}

const fetchAllAddress = () => {

    const URL_BACKEND = "/shippinginfo"
    return axios.get(URL_BACKEND)
}

const fetchAddressByUserId = (idAccount: UUID) => {

    const URL_BACKEND = `/shippinginfo/user/${idAccount}`
    return axios.get(URL_BACKEND)
}

const createAddress = (data: ShippingInfoDTO) => {

    const URL_BACKEND = `/shippinginfo`
    return axios.post(URL_BACKEND, data)
}

const updateAddress = (idAddress: UUID, data: ShippingInfoDTO) => {

    const URL_BACKEND = `/shippinginfo/${idAddress}`
    return axios.put(URL_BACKEND, data)
}
const deleteAddress = (idAddress: UUID) => {

    const URL_BACKEND = `/shippinginfo/${idAddress}`
    return axios.delete(URL_BACKEND)
}

const fetchAddressById = (idAddress: UUID) => {
    const URL_BACKEND = `/shippinginfo/${idAddress}`
    return axios.get(URL_BACKEND)
}

// Cart( Giỏ hàng   )

export interface CartDTO {
    shoesId: UUID;
    idSize: UUID;
    quantity: number;
    idAccount: UUID;
}

const fetchAllCart = () => {
    const URL_BACKEND = "/cart"
    return axios.get(URL_BACKEND)
}

const fetchCartByUserId = (idAccount: UUID) => {
    const URL_BACKEND = `/cart/account/${idAccount}`
    return axios.get(URL_BACKEND)
}

const createCart = (data: CartDTO) => {
    const URL_BACKEND = "/cart"
    return axios.post(URL_BACKEND, data)
}

const updateCart = (idCart: UUID, data: CartDTO) => {
    const URL_BACKEND = `/cart/${idCart}`
    return axios.put(URL_BACKEND, data)
}

const deleteCart = (idCart: UUID) => {
    const URL_BACKEND = `/cart/${idCart}`
    return axios.delete(URL_BACKEND)
}

const clearCart = (idAccount: UUID) => {
    const URL_BACKEND = `/cart/account/${idAccount}`
    return axios.delete(URL_BACKEND)
}

// End Cart

// Bill

export interface BillDTO {
    idAccount: UUID,
    totalAmount: number,
    status: string,
    shoppingInfoId: UUID
}

const fetchAllBill = () => {
    const URL_BACKEND = `/bill`
    return axios.get(URL_BACKEND)
}

const fetchBillById = (billId: UUID) => {
    const URL_BACKEND = `/bill/${billId}`
    return axios.get(URL_BACKEND)
}

const fetchBillByAccountId = (idAccount: UUID) => {
    const URL_BACKEND = `/bill/account/${idAccount}`
    return axios.get(URL_BACKEND)
}

const createBill = (billDto: BillDTO) => {
    const URL_BACKEND = `/bill`
    return axios.post(URL_BACKEND, billDto)
}

const updateStatusBill = (idBill: UUID, status: String) => {
    const URL_BACKEND = `/bill/${idBill}/status?status=${status}`
    return axios.put(URL_BACKEND)
}

const deleteBillById = (idBill: UUID) => {
    const URL_BACKEND = `/bill/${idBill}`
    return axios.delete(URL_BACKEND)
}

export {
    fetchAllBrand, updateBrand, createBrand, deleteBrand,

    fetchAllSlide, createSlide, deleteSlide,

    fetchAllProduct, fetchProductByName, createProduct, deleteProduct, updateProduct, fetchTopSelling,

    fetchAllSize,

    fetchAllStock, createStock, updateStock, deleteStock, fetchStockByProduct,
    fetchAllUser, fetchUserById, updateUser, deleteUser, registerUser, fetchUserByName,
    fetchAllAddress, fetchAddressById, createAddress, updateAddress, deleteAddress, fetchAddressByUserId,
    fetchAllCart, fetchCartByUserId, createCart, updateCart, deleteCart, clearCart,
    fetchAllBill, fetchBillById, fetchBillByAccountId, createBill, updateStatusBill, deleteBillById


}