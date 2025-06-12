import classNames from 'classnames/bind';
import Button from '~/components/Button/Button';
import styles from './ViewBill.module.scss';

import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { NumericFormat } from 'react-number-format';
import { fetchBillById } from '~/service/api';
import { Bill } from '~/models/Bill';

const cx = classNames.bind(styles);

const ViewBill = () => {
    const [billData, setBillData] = useState<Bill>();

    const location = useLocation();

    useEffect(() => {
        getCourses();
    }, []);

    const getCourses = async () => {
        try {
            const res = await fetchBillById(location.state.data.billId);
            if (res.data.success) {
                setBillData(res.data.result)
            }
        } catch (error: any) {
            console.log(error.data.response.message);

        }
    };

    return (
        <>
            {/* <!-- Begin adminProductTable --> */}
            <div className={cx('bill-header')}>
                <h2 className={cx('bill-heading')}>Mã hóa đơn: {location.state.data.billId}</h2>
                <h2 className={cx('bill-heading')}>
                    <span>Tổng hóa đơn : </span>
                    <NumericFormat
                        value={location.state.data.totalAmount}
                        displayType={'text'}
                        thousandSeparator={true}
                        suffix={'đ'}
                    />
                </h2>
            </div>


            {billData ? (
                <table className={cx('details-table')}>
                    <thead className={cx('details-thead')}>
                        <tr className={cx('details-title-list')}>
                            <td className={cx('details-title-item')}>Hình ảnh</td>
                            <td className={cx('details-title-item')}>Tên sản phẩm</td>
                            <td className={cx('details-title-item')}>SL sản phẩm</td>
                            <td className={cx('details-title-item')}>Thành tiền</td>
                        </tr>
                    </thead>
                    {billData.billDetail.map((product) => {
                        return (
                            <tbody className={cx('details-tbody')} key={product.shoesId + product.sizeId}>
                                <tr className={cx('details-content-list')}>
                                    <td className={cx('details-content-item')}>
                                        <img src={product.shoesImg} className={cx('product-img')} />
                                    </td>
                                    <td className={cx('details-content-item')}>{product.shoesName}</td>
                                    <td className={cx('details-content-item')}>{product.quantity}</td>
                                    <td className={cx('details-content-item')}>
                                        <NumericFormat
                                            value={product.totalPrice}
                                            displayType={'text'}
                                            thousandSeparator={true}
                                            suffix={'đ'}
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        );
                    })}
                </table>
            ) : (
                <h2>Bill không có sản phẩm</h2>
            )}

            <Button
                to={"/admin/bill"}
                className={cx('btn_back')}
                leftIcon={<FontAwesomeIcon icon={faArrowLeft} />}
            >
                Trở về
            </Button>
            {/* <!-- End adminProductTable --> */}
        </>
    );
}

export default ViewBill;
