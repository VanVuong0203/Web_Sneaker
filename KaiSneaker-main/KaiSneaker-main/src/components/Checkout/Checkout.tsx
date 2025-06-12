import classNames from 'classnames/bind';
import styles from './Checkout.module.scss';
import AddressItem from '~/components/AddressItem/AddressItem';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { NumericFormat } from 'react-number-format';
import Button from '~/components/Button/Button';
import { useAuth } from '~/context/AuthContext';
import { BillDTO, createAddress, createBill, fetchAddressByUserId, fetchCartByUserId, ShippingInfoDTO } from '~/service/api';
import { ShoppingCart } from '~/models/ShoppingCart';
import { ShippingInfo } from '~/models/ShippingInfo';
import { toast } from 'react-toastify';
import { UUID } from 'crypto';

const cx = classNames.bind(styles);

const Checkout = () => {

    useEffect(() => {
        document.title = `Thanh toán`; // cập nhật tiêu đề
    }, []);
    const [statusModal, setStatusModal] = useState(false);

    const [addressData, setAddressData] = useState<ShippingInfo[]>([]);
    const [shoppingCartData, setShoppingCartData] = useState<ShoppingCart[]>([]);
    let location = useLocation();
    const { isAuthenticated, userData, fetchUserShoppingCart } = useAuth();

    let navigate = useNavigate();

    const [stateBill, setStateBill] = useState<BillDTO>({
        idAccount: userData?.idAccount ?? '-----',
        totalAmount: location.state.data.money + location.state.data.delivery,
        status: "Đang giao hàng",
        shoppingInfoId: "-----"
    });
    const [stateAddress, setStateAddress] = useState<ShippingInfoDTO>({
        idAccount: userData?.idAccount || '-----',
        shoppingInfoName: "",
        shoppingInfoPhone: "",
        address: "",
    });

    const [errors, setErrors] = useState({
        shoppingInfoName: "",
        shoppingInfoPhone: "",
        address: "",
    });


    const getAddress = async () => {
        if (isAuthenticated) {
            if (userData?.idAccount) {
                const res = await fetchAddressByUserId(userData.idAccount);
                if (res.data.success) {
                    setAddressData(res.data.result);
                }
            }
        } else {
            navigate("/login")
        }
    }

    const getShoppingCart = async () => {
        if (isAuthenticated) {
            if (userData?.idAccount) {

                setStateBill({ ...stateBill, idAccount: userData.idAccount })
                const res = await fetchCartByUserId(userData.idAccount);
                if (res.data.success) {
                    console.log(res.data);
                    setShoppingCartData(res.data.result);
                }
            }
        } else {
            navigate('/login');
        }
    }

    useEffect(() => {
        getShoppingCart();
        getAddress();
    }, [isAuthenticated, userData]);

    const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setStateAddress({ ...stateAddress, [name]: value });
    }

    const handleSubmitAddress = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const newErrors = validateForm();
            // Nếu có lỗi thì không submit
            if (Object.values(newErrors).some(error => error !== '')) {
                setErrors(newErrors);
                return;
            }
            const res = await createAddress(stateAddress);
            if (res.data.success) {
                toast.success(res.data.message);
                setStateAddress({
                    ...stateAddress,
                    shoppingInfoPhone: "",
                    shoppingInfoName: "",
                    address: ""
                });
                hideBuyTickets()
                getAddress();
            }

        } catch (error) {
            toast.error('Có lỗi xảy ra khi tạo địa chỉ. Vui lòng thử lại.');
        }

    };

    const validateForm = () => {
        const newErrors = {
            shoppingInfoName: "",
            shoppingInfoPhone: "",
            address: "",
        };

        if (!stateAddress.shoppingInfoName.trim()) {
            newErrors.shoppingInfoName = 'Tên người nhận không được để trống';
        }

        if (!stateAddress.address.trim()) {
            newErrors.address = 'Địa chỉ không được để trống';
        }

        if (!stateAddress.shoppingInfoPhone.trim()) {
            newErrors.shoppingInfoPhone = 'Số điện thoại không được để trống';
        } else if (stateAddress.shoppingInfoPhone.length > 10) {
            newErrors.shoppingInfoPhone = 'Số điện thoại không hợp lệ!! Vui lòng nhập 10 số';
        }

        return newErrors;
    };

    const addOrder = async () => {
        try {
            const res = await createBill(stateBill);
            if (res.data.success) {
                fetchUserShoppingCart();
                toast.success("Thanh toán hóa đơn thành công");
                navigate("/");
            }
        } catch (error) {
            toast.success("Thanh toán hóa đơn thất bại");
        }
    };

    const showBuyTickets = () => {
        setStatusModal(true);
    };
    const hideBuyTickets = () => {
        setStatusModal(false);
    };

    return (
        <>
            <div className={cx('grid wide')}>
                <div className={cx('wrapper', 'row')}>
                    <div className={cx('wrap', 'col', 'l-7')}>
                        <div className={cx('inner')}>
                            <h2 className={cx('heading')}>Địa chỉ giao hàng</h2>
                            <div className={cx('address')}>
                                {addressData ? (
                                    addressData.map((address: ShippingInfo) => {
                                        return (
                                            <div className={cx('item')} key={address.shoppingInfoId}>
                                                <input
                                                    type="radio"
                                                    name="address"
                                                    className={cx('rdo-address')}
                                                    value={address.shoppingInfoId}
                                                    id={address.shoppingInfoId}
                                                    checked={stateBill.shoppingInfoId === address.shoppingInfoId}
                                                    onChange={(e) => setStateBill({ ...stateBill, shoppingInfoId: e.target.value as UUID })}
                                                ></input>
                                                <label htmlFor={address.shoppingInfoId} className={cx('address_item')}>
                                                    <AddressItem
                                                        addressData={address}
                                                        getCourses={getAddress}
                                                    />
                                                </label>
                                            </div>
                                        )
                                    })
                                ) : (
                                    <></>
                                )}
                                <div className={cx('actions')}>
                                    <Button
                                        className={cx('btn_ctn')}
                                        disabled={stateBill.shoppingInfoId === "-----" ? true : false}
                                        onClick={addOrder}
                                    >
                                        Thanh toán
                                    </Button>
                                    <button className={cx('btn_add')} onClick={showBuyTickets}>
                                        Thêm địa chỉ
                                    </button>
                                </div>
                            </div>
                        </div>
                        {/* <div className={cx('payment')}>
                            <h2 className={cx('payment_title')}>Phương thức thanh toán</h2>
                            <div className={cx('payment_container')}>
                                <div className={cx('payment-item')}>
                                    <input type="radio" name="payment" value="PayPal" id="acc2" />
                                    <label htmlFor="acc2">
                                        <i className={cx('fa fa-heart')}></i> Tiền mặt
                                    </label>
                                </div>
                            </div>
                        </div> */}
                    </div>
                    <div className={cx('col', 'l-4', 'order')}>
                        <h2 className={cx('order_title')}>Sơ lược hóa đơn</h2>
                        <div className={cx('order_info')}>
                            <div className={cx('order_info-item')}>
                                <p className={cx('order_content')}>Thành tiền</p>
                                <p className={cx('order_content')}>
                                    <NumericFormat
                                        value={location.state.data.money}
                                        displayType={'text'}
                                        thousandSeparator={true}
                                        suffix={'đ'}
                                    />
                                </p>
                            </div>
                            <div className={cx('order_info-item')}>
                                <p className={cx('order_content')}>Vận chuyển</p>
                                <p className={cx('order_content')}>
                                    <NumericFormat
                                        value={location.state.data.delivery}
                                        displayType={'text'}
                                        thousandSeparator={true}
                                        suffix={'đ'}
                                    />
                                </p>
                            </div>
                        </div>
                        <div className={cx('order_total')}>
                            <div className={cx('order_info-item')}>
                                <p className={cx('order_content')}>Tổng tiền</p>
                                <p className={cx('order_content')}>
                                    <NumericFormat
                                        value={location.state.data.delivery + location.state.data.money}
                                        displayType={'text'}
                                        thousandSeparator={true}
                                        suffix={'đ'}
                                    />
                                </p>
                            </div>
                        </div>
                        <div className={cx('product_checkout')}>
                            {shoppingCartData ? (
                                shoppingCartData.map((product: ShoppingCart) => {
                                    return (
                                        <div className={cx('product_item')}
                                            key={`${product.product.shoesId}-${product.size.idSize}`}
                                        >
                                            <img
                                                src={product.product.shoesImg}
                                                alt={product.product.shoesName}
                                                className={cx('product_img')}
                                            />
                                            <div className={cx('product_content-box')}>
                                                <p className={cx('product_content')}>{product.product.shoesName}</p>
                                                <p className={cx('product_content')}>
                                                    <span>Số lượng : </span>
                                                    {product.quantity}
                                                </p>
                                                <p className={cx('product_content')}>
                                                    <span>Size : {product.size.sizeVi}</span>
                                                </p>
                                                <p className={cx('product_content')}>
                                                    <span>Thành tiền :</span>
                                                    <NumericFormat
                                                        value={product.product.shoesPrice * product.quantity}
                                                        displayType={'text'}
                                                        thousandSeparator={true}
                                                        suffix={'đ'}
                                                    />
                                                </p>
                                            </div>
                                        </div>
                                    );
                                }
                                )
                            ) : (
                                <h2>Không có sản phẩm</h2>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {/* Begin modal */}
            <div className={cx('modal', statusModal ? 'open' : '')} onClick={hideBuyTickets}>
                <div
                    className={cx('modal-detail')}
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                >
                    <div className={cx('modal-header')}>
                        <h2 className={cx('modal-heading')}>Thêm địa chỉ</h2>
                        <FontAwesomeIcon className={cx('modal--close')} icon={faXmark} onClick={hideBuyTickets} />
                    </div>
                    <form
                        onSubmit={handleSubmitAddress}
                    >
                        <div className={cx('stock-list')}>
                            <div className={cx('info')}>
                                <label htmlFor="" className={cx('input-label')}>
                                    Tên người nhận
                                </label>
                                <input
                                    className={cx('input-item')}
                                    type="text"
                                    placeholder="Tên người nhận"
                                    name='shoppingInfoName'
                                    value={stateAddress.shoppingInfoName}
                                    onChange={handleChangeInput}
                                />
                                {errors.shoppingInfoName && <div className={cx('error_message')}>{errors.shoppingInfoName}</div>}

                            </div>

                            <div className={cx('info')}>
                                <label htmlFor="" className={cx('input-label')}>
                                    Địa chỉ
                                </label>
                                <input
                                    className={cx('input-item')}
                                    type="text"
                                    placeholder="Địa chỉ"
                                    name='address'
                                    value={stateAddress.address}
                                    onChange={handleChangeInput}
                                />
                                {errors.address && <div className={cx('error_message')}>{errors.address}</div>}

                            </div>
                            <div className={cx('info')}>
                                <label htmlFor="" className={cx('input-label')}>
                                    Số điện thoại
                                </label>
                                <input
                                    className={cx('input-item')}
                                    type="text"
                                    placeholder="Số điện thoại"
                                    name='shoppingInfoPhone'
                                    value={stateAddress.shoppingInfoPhone}
                                    onChange={handleChangeInput}
                                    onKeyPress={(event) => {
                                        if (!/[0-9]/.test(event.key)) {
                                            event.preventDefault();
                                        }
                                    }}
                                />
                                {errors.shoppingInfoPhone && <div className={cx('error_message')}>{errors.shoppingInfoPhone}</div>}

                            </div>
                        </div>
                        <button className={cx('btn')} type='submit'>Save</button>
                    </form>
                </div>
            </div>
            {/* End modal */}
        </>
    );
}

export default Checkout;
