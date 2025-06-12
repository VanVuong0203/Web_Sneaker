import classNames from 'classnames/bind';
import Button from '~/components/Button/Button';
import styles from './shopping.module.scss';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NumericFormat } from 'react-number-format';
import ShoppingItem from '~/components/ShoppingItem/ShoppingItem';
import { useAuth } from '~/context/AuthContext';
import { fetchCartByUserId } from '~/service/api';
import { ShoppingCart } from '~/models/ShoppingCart';

const cx = classNames.bind(styles);
const Shopping = () => {
    const [shoppingCart, setShoppingCart] = useState<ShoppingCart[]>([]);
    const { isAuthenticated, userData, fetchUserShoppingCart } = useAuth();
    let money: number = 0;
    const delivery: number = 30000;
    let navigate = useNavigate();
    useEffect(() => {
        document.title = `Giỏ hàng`; // cập nhật tiêu đề

    }, []);
    const getShoppingCart = async () => {
        try {
            if (isAuthenticated) {
                if (userData?.idAccount) {
                    const res = await fetchCartByUserId(userData.idAccount);
                    if (res.data.success) {
                        setShoppingCart(res.data.result);
                    }
                }
            } else {
                navigate('/login');
            }
        } catch (error: any) {
            setShoppingCart([]);
        }
    }

    useEffect(() => {
        getShoppingCart();
    }, [userData]);

    const countMoney = (e: number) => {
        money += e;
    };

    return (
        <div className={cx('grid', 'wide')}>
            <div className={cx('row', 'bag')}>
                <div className={cx('col', 'l-8', 'detail')}>
                    <h2 className={cx('detail_heading')}>Giỏ hàng</h2>
                    {shoppingCart ? (
                        shoppingCart.map((itemCart: ShoppingCart) => {
                            const count = itemCart.product.shoesPrice * itemCart.quantity;
                            countMoney(count);
                            return (
                                <ShoppingItem
                                    key={itemCart.idCartItem}
                                    itemCart={itemCart}
                                    getShoppingCart={getShoppingCart}
                                    fetchUserShoppingCart={fetchUserShoppingCart}
                                />
                            );
                        })
                    ) : (
                        <h2>Không có sản phẩm</h2>
                    )}
                </div>
                <div className={cx('col', 'l-4', 'summary')}>
                    <h2 className={cx('summary-heading')}>Sơ lược</h2>
                    <div className={cx('subtotal', 'row')}>
                        <p className={cx('subtotal-title', 'col', 'l-8')}>Giá tiền</p>
                        <p className={cx('subtotal-money', 'col', 'l-4')}>
                            <NumericFormat value={money} displayType={'text'} thousandSeparator={true} suffix={'đ'} />
                        </p>
                    </div>
                    <div className={cx('shipping', 'row')}>
                        <p className={cx('shipping-title', 'col', 'l-8')}>Vận chuyển</p>
                        <div className={cx('shipping-money', 'col', 'l-4')}>
                            <NumericFormat value={delivery} displayType={'text'} thousandSeparator={true} suffix={'đ'} />
                        </div>
                    </div>
                    <div className={cx('total', 'row')}>
                        <p className={cx('total-title', 'col', 'l-8')}>Tổng tiền</p>
                        <div className={cx('total-money', 'col', 'l-4')}>
                            <NumericFormat
                                value={delivery + money}
                                displayType={'text'}
                                thousandSeparator={true}
                                suffix={'đ'}
                            />
                        </div>
                    </div>

                    <Button
                        to={`/@${userData?.idAccount}/checkout`}
                        disabled={shoppingCart.length === 0 ? true : false}
                        state={{ data: { money: money, delivery: delivery } }}
                        className={cx('checkout')}
                    >
                        Thanh toán
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default Shopping;
