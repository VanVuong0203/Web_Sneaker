import classNames from 'classnames/bind';
import styles from './Dashboard.module.scss';
import Button from '~/components/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBoxesStacked, faCartShopping, faMoneyCheckDollar } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import Image from '~/components/Image/Image';
import { NumericFormat } from 'react-number-format';
import { fetchAllBill, fetchAllStock } from '~/service/api';
import { Bill } from '~/models/Bill';
import { UUID } from 'crypto';
import { Product } from '~/models/Product';

const cx = classNames.bind(styles);

interface StockDTO {
    id: UUID,
    product: Product,
    quantityInStock: number,
    size: {
        idSize: UUID,
        sizeEur: string,
        sizeVi: string
    }
}

const Dashboard = () => {

    useEffect(() => {
        document.title = `Dashboard`; // cập nhật tiêu đề
    }, []);
    const [billData, setBillData] = useState<Bill[]>([]);
    const [stockData, setStockData] = useState<StockDTO[]>([]);
    let money = 0;
    let quantitystock = 0;
    useEffect(() => {
        getBill()
        getStock()
    }, []);

    const getBill = async () => {
        try {
            const res = await fetchAllBill();
            if (res.data.success) {
                setBillData(res.data.result)
            }
        } catch (error) {
            console.log(error);

        }
    }

    const getStock = async () => {
        try {
            const res = await fetchAllStock();
            if (res.data.success) {
                setStockData(res.data.result)
            }
        } catch (error) {
            console.log(error);

        }
    }

    if (billData) {
        billData.forEach((data) => {
            money = money + data.totalAmount * 1;
        });
    }

    if (stockData) {
        stockData.forEach((data) => {
            quantitystock = quantitystock + data.quantityInStock * 1;
        });
    }

    return (
        <>
            <div className={cx('card__box')}>
                <div className={cx('card')}>
                    <div>
                        <div className={cx('card-numbers')}>
                            <NumericFormat value={billData ? billData.length : '0'} displayType={'text'} thousandSeparator={true} />
                        </div>
                        <div className={cx('card-name')}>Số hóa đơn</div>
                    </div>
                    <div className={cx('card-icon')}>
                        <FontAwesomeIcon icon={faCartShopping} />
                    </div>
                </div>

                <div className={cx('card')}>
                    <div>
                        <div className={cx('card-numbers')}>
                            <NumericFormat value={stockData ? quantitystock : '0'} displayType={'text'} thousandSeparator={true} />
                        </div>
                        <div className={cx('card-name')}>Số sản phẩm có trong kho</div>
                    </div>
                    <div className={cx('card-icon')}>
                        <FontAwesomeIcon icon={faBoxesStacked} />
                    </div>
                </div>

                <div className={cx('card')}>
                    <div>
                        <div className={cx('card-numbers')}>
                            <NumericFormat value={money} displayType={'text'} thousandSeparator={true} suffix={'đ'} />
                        </div>
                        <div className={cx('card-name')}>Doanh thu</div>
                    </div>
                    <div className={cx('card-icon')}>
                        <FontAwesomeIcon icon={faMoneyCheckDollar} />
                    </div>
                </div>
            </div>
            {/* <!-- End report --> */}
            <div className={cx('details')}>
                {/* <!-- Begin order details list --> */}
                <div className={cx('details-orders')}>
                    <div className={cx('details-header')}>
                        <h2 className={cx('details-header-heading')}>Đơn hàng gần đây</h2>
                        <Button to='/admin/bill' className={cx('details-header-btn')}>View All</Button>
                    </div>
                    {billData.length !== 0 ? (
                        <table className={cx('details-table')}>
                            <thead className={cx('details-table-thead')}>
                                <tr className={cx('details-table-thead-list')}>
                                    <td>Tên</td>
                                    <td>Giá</td>
                                    <td>Thanh toán</td>
                                    <td>Trạng thái</td>
                                </tr>
                            </thead>
                            {billData
                                .sort((a, b) => {
                                    if (typeof b.billId === 'number' && typeof a.billId === 'number') {
                                        return b.billId - a.billId;
                                    }
                                    return String(b.billId).localeCompare(String(a.billId));
                                })
                                .map((bill) => {
                                    return (
                                        <tbody className={cx('details-table-tbody')}
                                            key={bill.billId}
                                        >
                                            <tr>
                                                <td>
                                                    {bill.fullName}
                                                </td>
                                                <td>
                                                    <NumericFormat
                                                        value={bill.totalAmount}
                                                        displayType={'text'}
                                                        thousandSeparator={true}
                                                        suffix={'đ'}
                                                    />
                                                </td>
                                                <td>Tiền mặt</td>
                                                <td>
                                                    <span
                                                        className={cx(
                                                            'status'
                                                            ,
                                                            bill.status === 'Chờ duyệt'
                                                                ? 'pending'
                                                                : bill.status === 'Trả về'
                                                                    ? 'return'
                                                                    : bill.status === 'Đang giao hàng'
                                                                        ? 'ingrogress'
                                                                        : 'delivered',
                                                        )}
                                                    >
                                                        {bill.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        </tbody>
                                    );
                                })}
                        </table>
                    ) : (
                        <h2> không có đơn hàng</h2>
                    )}
                </div>
                {/* <!-- End order details list -->*/}
                {/* <!-- Begin New Customers--> */}
                <div className={cx('recent__customers')}>
                    <div className={cx('details-header')}>
                        <h2 className={cx('details-header-heading')}>Khách hàng gần đây</h2>
                    </div>

                    {billData.length !== 0 ? (
                        <table className={cx('recent__customers-table')}>
                            {billData
                                .sort((a, b) => {
                                    if (typeof b.billId === 'number' && typeof a.billId === 'number') {
                                        return b.billId - a.billId;
                                    }
                                    return String(b.billId).localeCompare(String(a.billId));
                                })
                                .map((bill) => {
                                    return (
                                        <tbody
                                            key={bill.billId + bill.idAccount}
                                        >
                                            <tr>
                                                <td width="60px">
                                                    <div className={cx('customers-img')}>
                                                        <Image
                                                            src={bill.imageUser}
                                                            alt={bill.fullName}
                                                        />
                                                    </div>
                                                </td>
                                                <td>
                                                    <h4>
                                                        {bill.fullName}
                                                        <br />
                                                        <span> {bill.gender}</span>
                                                    </h4>
                                                </td>
                                            </tr>
                                        </tbody>
                                    );
                                })}
                        </table>
                    ) : (
                        <h2> Chưa có khách hàng</h2>
                    )}
                </div>
                {/* <!-- End New Customers--> */}
            </div>
        </>
    );
}

export default Dashboard;
