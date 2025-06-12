import classNames from 'classnames/bind';
import styles from './AddressProfile.module.scss';
import AddressItem from '~/components/AddressItem/AddressItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';
import { createAddress, fetchAddressByUserId, ShippingInfoDTO } from '~/service/api';
import { useAuth } from '~/context/AuthContext';
import { ShippingInfo } from '~/models/ShippingInfo';
import { toast } from 'react-toastify';
const cx = classNames.bind(styles);

const AddressProfile = () => {

    useEffect(() => {
        document.title = `Thông tin tài khoản`; // cập nhật tiêu đề
    }, []);

    const [statusModal, setStatusModal] = useState(false);
    const [addressData, setAddressData] = useState<ShippingInfo[]>([]);
    const { userData } = useAuth();

    // Khởi tạo với giá trị mặc định}
    const [stateAddress, setStateAddress] = useState<ShippingInfoDTO>(
        {
            shoppingInfoName: "",
            shoppingInfoPhone: "",
            address: "",
            idAccount: "00000-00000-00000-00000-00000"
        }
    );

    // State Lỗi
    const [errors, setErrors] = useState({
        shoppingInfoName: "",
        shoppingInfoPhone: "",
        address: "",
    });

    useEffect(() => {
        getCourses();
        setStateAddress({ ...stateAddress, idAccount: userData?.idAccount || "00000-00000-00000-00000-00000" });
    }, [userData]);

    const getCourses = async () => {

        try {
            if (userData?.idAccount) {
                const res = await fetchAddressByUserId(userData.idAccount);
                if (res.data.success) {
                    setAddressData(res.data.result);
                }
            }
        } catch (error) {
            console.error('Lỗi lấy dữ liệu', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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

                getCourses();
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


    const showBuyTickets = () => {
        setStatusModal(true);
    };
    const hideBuyTickets = () => {
        setStatusModal(false);
        setErrors({
            shoppingInfoName: "",
            shoppingInfoPhone: "",
            address: "",
        })
    };

    return (
        <>
            <h2 className={cx('title')}>Địa chỉ giao hàng</h2>

            {addressData ? (
                addressData.map((address: ShippingInfo) => {
                    return (
                        <AddressItem
                            key={address.shoppingInfoId}
                            addressData={address}
                            getCourses={getCourses}
                        />
                    );
                })
            ) : (
                <></>
            )}
            <div className={cx('action')}>
                <button className={cx('add_btn')} onClick={showBuyTickets}>
                    Thêm địa chỉ
                </button>
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

                    <form onSubmit={handleSubmit}>
                        <div className={cx('stock-list')}>
                            <div className={cx('info')}>
                                <label htmlFor="" className={cx('input-label')}>
                                    Tên người nhận
                                </label>
                                <input
                                    className={cx('input-item')}
                                    type="text"
                                    placeholder="Tên người nhận"
                                    value={stateAddress.shoppingInfoName}
                                    onChange={(e) => setStateAddress({ ...stateAddress, shoppingInfoName: e.target.value })}
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
                                    value={stateAddress.address}
                                    onChange={(e) => setStateAddress({ ...stateAddress, address: e.target.value })}
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
                                    value={stateAddress.shoppingInfoPhone}
                                    onKeyPress={(event) => {
                                        if (!/[0-9]/.test(event.key)) {
                                            event.preventDefault();
                                        }
                                    }}
                                    onChange={(e) => setStateAddress({ ...stateAddress, shoppingInfoPhone: e.target.value })}
                                />
                                {errors.shoppingInfoPhone && <div className={cx('error_message')}>{errors.shoppingInfoPhone}</div>}
                            </div>
                        </div>
                        <button type='submit' className={cx('btn')}>Save</button>
                    </form>
                </div>
            </div >
            {/* End modal */}
        </>
    );
}

export default AddressProfile;
