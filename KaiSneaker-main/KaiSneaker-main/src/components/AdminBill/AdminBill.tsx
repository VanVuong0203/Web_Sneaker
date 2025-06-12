import classNames from 'classnames/bind';
import styles from './adminBill.module.scss';

import { useEffect, useState } from 'react';
import { NumericFormat } from 'react-number-format';

import Button from '~/components/Button/Button';
import { deleteBillById, fetchAllBill, updateStatusBill } from '~/service/api';
import { Bill } from '~/models/Bill';
import { useAuth } from '~/context/AuthContext';
import { UUID } from 'crypto';
import { toast } from 'react-toastify';
const cx = classNames.bind(styles);

const AdminBill = () => {
    const [billData, setBillData] = useState<Bill[]>([]);
    const { userData } = useAuth();

    useEffect(() => {
        document.title = `Hóa đơn`; // cập nhật tiêu đề
    }, []);

    useEffect(() => {
        getCourses();
    }, []);

    const getCourses = async () => {
        try {
            const res = await fetchAllBill();
            if (res.data.success) {
                setBillData(res.data.result)
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleUpdate = async (idBill: UUID, status: string) => {
        try {
            const res = await updateStatusBill(idBill, status);
            if (res.data.success) {
                toast.success("Cập nhật trạng thái hóa đơn thành công");
                getCourses();

            }
        } catch (error: any) {
            toast.error("Cập nhật trạng thái hóa đơn thất bại");
            console.log(error);
        }
    };

    const handleDelete = async (idBill: UUID) => {
        try {
            if (window.confirm('Bạn có chắc chắn muốn hóa đơn này không?')) {
                const res = await deleteBillById(idBill);
                if (res.data.success) {
                    toast.success(res.data.message);
                    getCourses();

                }
            }
        } catch (error: any) {
            toast.error("Xóa trạng thái hóa đơn thất bại");
        }
    };

    return (
        <div className={cx('wrapper')}>
            {/* <!-- Begin adminProductTable --> */}
            <div className={cx('account-header')}>
                <h2 className={cx('account-heading')}>Hóa đơn sản phẩm</h2>
            </div>

            {billData.length ? (
                <table className={cx('details-table')}>
                    <thead className={cx('details-thead')}>
                        <tr className={cx('details-title-list')}>
                            <td className={cx('details-title-item')}>Tên khách hàng</td>
                            <td className={cx('details-title-item')}>Ngày lập</td>
                            <td className={cx('details-title-item')}>Thành tiền</td>
                            <td className={cx('details-title-item')}>Trạng thái</td>
                        </tr>
                    </thead>
                    {billData.map((bill: Bill) => {
                        var status = bill.status;
                        return (
                            <tbody className={cx('details-tbody')} key={bill.billId}>
                                <tr className={cx('details-content-list')}>
                                    <td className={cx('details-content-item')}>{userData?.fullName}</td>
                                    <td className={cx('details-content-item')}>{bill.billDate}</td>
                                    <td className={cx('details-content-item')}>
                                        <NumericFormat
                                            value={bill.totalAmount}
                                            displayType={'text'}
                                            thousandSeparator={true}
                                            suffix={'đ'}
                                        />
                                    </td>
                                    <td className={cx('details-content-item')}>
                                        <select
                                            className={cx('details-content-select')}
                                            onChange={(e) => {
                                                status = e.target.value;
                                            }}
                                        >
                                            <option value={bill.status}>{bill.status}</option>
                                            <option value="Trả về">Trả về</option>
                                            <option value="Đang giao hàng">Đang giao hàng</option>
                                            <option value="Đã giao">Đã giao</option>
                                        </select>
                                    </td>
                                    <td className={cx('details-content-item')}>
                                        <Button
                                            to={`/admin/bill/${bill.billId}`}
                                            state={{ data: { billId: bill.billId, totalAmount: bill.totalAmount } }}
                                            className={cx('details-content-item-btn')}
                                        >
                                            Xem
                                        </Button>
                                    </td>
                                    <td className={cx('details-content-item')}>
                                        <Button
                                            className={cx('details-content-item-btn')}
                                            onClick={() => handleUpdate(bill.billId, status)}
                                        >
                                            Cập nhật
                                        </Button>
                                    </td>
                                    <td className={cx('details-content-item')}>
                                        <Button
                                            className={cx('details-content-item-btn')}
                                            onClick={() => handleDelete(bill.billId)}
                                        >
                                            Xóa
                                        </Button>
                                    </td>
                                </tr>
                            </tbody>
                        );
                    })}
                </table>
            ) : (
                <h2>Không có hóa đơn</h2>
            )}
        </div>
    );
}

export default AdminBill;
