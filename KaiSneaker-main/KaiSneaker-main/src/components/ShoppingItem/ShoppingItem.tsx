import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames/bind';
import styles from './shoppingItem.module.scss';
import { NumericFormat } from 'react-number-format';
import Image from '../Image/Image';
import { ShoppingCart } from '~/models/ShoppingCart';
import { CartDTO, deleteCart, updateCart } from '~/service/api';
import { toast } from 'react-toastify';

const cx = classNames.bind(styles);

interface ShoppingItemProps {
    itemCart: ShoppingCart;
    getShoppingCart: () => Promise<void>;
    fetchUserShoppingCart: () => Promise<void>;
}

const ShoppingItem: React.FC<ShoppingItemProps> = ({ itemCart, getShoppingCart, fetchUserShoppingCart }) => {

    const deleteItem = async () => {
        try {
            if (window.confirm('Bạn có chắc chắc muốn xóa sản phẩm khỏi giỏ hàng không ?')) {
                const res = await deleteCart(itemCart.idCartItem);
                console.log(res);

                if (res.data.success) {
                    getShoppingCart();
                    fetchUserShoppingCart();
                    toast.success(res.data?.message);
                }
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message);
        }
    };

    const quantityUp = async () => {
        if (itemCart.quantity < itemCart.size.quantityInStock) {
            // Kiểm tra số lượng có vượt quá số lượng tồn kho không
            try {
                const cartDTO: CartDTO = {
                    idAccount: itemCart.idAccount,
                    idSize: itemCart.size.idSize,
                    shoesId: itemCart.product.shoesId,
                    quantity: itemCart.quantity + 1,
                };

                const res = await updateCart(itemCart.idCartItem, cartDTO);

                if (res.data.success) {
                    console.log(res.data?.message);
                    getShoppingCart();
                    fetchUserShoppingCart();
                }
            } catch (error: any) {
                console.log(error.response?.data?.message);
            }
        } else {
            toast.warning("Không thể tăng số lượng, đã đạt giới hạn số lượng trong kho");
        }
    };

    const quantityDown = async () => {

        if (itemCart.quantity > 1) { // Kiểm tra giảm số lượng không nhỏ hơn 1
            try {
                const cartDTO: CartDTO = {
                    idAccount: itemCart.idAccount,
                    idSize: itemCart.size.idSize,
                    shoesId: itemCart.product.shoesId,
                    quantity: itemCart.quantity - 1,
                };

                const res = await updateCart(itemCart.idCartItem, cartDTO);

                if (res.data.success) {
                    console.log(res.data?.message);
                    getShoppingCart();
                    fetchUserShoppingCart();
                }
            } catch (error: any) {
                console.log(error.response?.data?.message);
            }
        } else {
            toast.warning("Không thể giảm số lượng, số lượng phải lớn hơn 1");
        }
    }

    return (
        <div className={cx('row', 'item')}>
            <div className={cx('col', 'l-3', 'item_box')}>
                <Image className={cx('item_img')}
                    src={itemCart?.product?.shoesImg} alt={itemCart?.product?.shoesName}
                />
            </div>
            <div className={cx('col', 'l-9', 'info')}>
                <div className={cx('row')}>
                    <div className={cx('col', 'l-8')}>
                        <p className={cx('item_name')}>{itemCart?.product?.shoesName}</p>
                        <div className={cx('brand')}>{itemCart?.product?.brandName}</div>
                        <div className={cx('options')}>
                            <div className={cx('size')}>
                                <label className={cx('size_heading')}>Size</label>
                                <label className={cx('size_option')}>{itemCart?.size?.sizeVi}</label>
                            </div>
                            <div className={cx('info_quantity')}>
                                <span className={cx('minus')}
                                    onClick={quantityDown}
                                >
                                    -
                                </span>
                                <span className={cx('num')}>
                                    {itemCart.quantity < 10 ? '0' + itemCart.quantity : itemCart.quantity}
                                </span>
                                <span className={cx('plus')}
                                    onClick={quantityUp}
                                >
                                    +
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className={cx('col', 'l-4')}>
                        <p className={cx('item_money')}>
                            <span>Giá : </span>
                            <NumericFormat
                                value={itemCart.product.shoesPrice * itemCart.quantity}
                                displayType={'text'}
                                thousandSeparator={true}
                                suffix={'đ'}
                            />
                        </p>
                    </div>
                </div>
                <div className={cx('action')}>
                    <FontAwesomeIcon icon={faTrashAlt} className={cx('remove')}
                        onClick={deleteItem}
                    />
                </div>
            </div>
        </div>
    );
}

export default ShoppingItem;
