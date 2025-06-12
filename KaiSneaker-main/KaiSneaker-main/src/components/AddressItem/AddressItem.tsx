import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import Button from '~/components/Button/Button';
import classNames from 'classnames/bind';
import styles from './AddressItem.module.scss';
import { ShippingInfo } from '~/models/ShippingInfo';
import { deleteAddress, ShippingInfoDTO, updateAddress } from '~/service/api';
import { toast } from 'react-toastify';
import { UUID } from 'crypto';

const cx = classNames.bind(styles);

interface AddressItemProps {
    addressData: ShippingInfo
    getCourses: () => void;
}

const AddressItem: React.FC<AddressItemProps> = ({ addressData, getCourses }) => {

    const [statusModal, setStatusModal] = useState(false)

    const [stateAddress, setStateAddress] = useState<ShippingInfoDTO>({
        idAccount: addressData?.idAccount,
        shoppingInfoName: addressData?.shoppingInfoName,
        shoppingInfoPhone: addressData?.shoppingInfoPhone,
        address: addressData?.address,
    });

    const [errors, setErrors] = useState({
        shoppingInfoName: "",
        shoppingInfoPhone: "",
        address: "",
    });

    const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setStateAddress({ ...stateAddress, [name]: value });
    }

    const showBuyTickets = () => {
        setStatusModal(true);
    };
    const hideBuyTickets = () => {
        setStatusModal(false);
    };

    const handleSubmitUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const newErrors = validateForm();
            setErrors(newErrors);

            // Nếu có lỗi thì không submit
            if (Object.values(newErrors).some(error => error !== '')) {
                return;
            }
            const idShoppingInfoId: UUID = addressData.shoppingInfoId;
            // Gọi API để cập nhật địa chỉ
            if (idShoppingInfoId) {
                const res = await updateAddress(idShoppingInfoId, stateAddress);
                if (res.data.success) {
                    toast.success("Cập nhật địa chỉ thành công");
                    hideBuyTickets();

                    getCourses();
                }
            }

        } catch (error) {
            console.error('Error updating address:', error);
            toast.error("Cập nhật địa chỉ thất bại");
        }
    };

    const handleDeleteAddress = async () => {
        try {
            if (window.confirm('Bạn có chắc chắn muốn xóa địa chỉ này ? ')) {
                const idShoppingInfoId: UUID = addressData.shoppingInfoId;
                if (idShoppingInfoId) {
                    const res = await deleteAddress(idShoppingInfoId);
                    if (res.data.success) {
                        toast.success("Xóa địa chỉ thành công");
                        hideBuyTickets();
                        setErrors({
                            shoppingInfoName: "",
                            shoppingInfoPhone: "",
                            address: "",
                        })
                        getCourses();
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
    }


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


    return (
        <div className={cx('wrapper')} >
            <div className={cx('inner')}>
                <div className={cx('name')}>{addressData?.shoppingInfoName}</div>
                <div className={cx('address')}>{addressData?.address}</div>
                <div className={cx('phone')}>{addressData?.shoppingInfoPhone}</div>

                <div className={cx('action')}>
                    <Button className={cx('update_btn')} onClick={showBuyTickets}>
                        Cập nhật
                    </Button>
                    <Button className={cx('delete_btn')} onClick={handleDeleteAddress}>
                        Xóa
                    </Button>
                </div>
            </div>
            {/* Begin modal */}
            <div className={cx('modal', statusModal ? 'open' : '')} onClick={hideBuyTickets} >
                <div
                    className={cx('modal-detail')}
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                >
                    <div className={cx('modal-header')}>
                        <h2 className={cx('modal-heading')}>Cập nhật địa chỉ</h2>
                        <FontAwesomeIcon className={cx('modal--close')} icon={faXmark} onClick={hideBuyTickets} />
                    </div>

                    <form onSubmit={handleSubmitUpdate}>
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
                                    value={stateAddress?.shoppingInfoName}
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
                                    value={stateAddress?.address}
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
                                    name='shoppingInfoPhone'
                                    maxLength={10}
                                    value={stateAddress?.shoppingInfoPhone}
                                    onChange={handleChangeInput}
                                    placeholder="Số điện thoại"
                                />
                                {errors.shoppingInfoPhone && <div className={cx('error_message')}>{errors.shoppingInfoPhone}</div>}

                            </div>
                        </div>
                        <button className={cx('btn')}>Save</button>
                    </form>
                </div>
            </div >
            {/* End modal */}
        </div >
    );
}

export default AddressItem;
