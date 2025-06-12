import classNames from 'classnames/bind';
import styles from './ItemStock.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import Image from '~/components/Image/Image';
import { Stock } from '~/models/Stock';
import { Product } from '~/models/Product';
import { Size } from '~/models/Size';
import { deleteStock, StockDTO, updateStock } from '~/service/api';
import { UUID } from 'crypto';
import { toast } from 'react-toastify';

const cx = classNames.bind(styles);
interface ItemStockProps {
    stockItem: Stock;
    productData: Product[];
    sizeData: Size[];
    getStock: () => Promise<void>;
}
const ItemStock: React.FC<ItemStockProps> = ({ stockItem, productData, sizeData, getStock }) => {

    const [statusModal, setStatusModal] = useState(false);
    const [stateStock, setStateStock] = useState<StockDTO>({
        productId: stockItem?.product?.shoesId || '',
        idSize: stockItem?.size?.idSize || '',
        quantityInStock: stockItem?.quantityInStock || 0,
    });

    const showBuyTickets = () => {
        setStatusModal(true);
    };
    const hideBuyTickets = () => {
        setStatusModal(false);
    };

    const deleteProduct = async () => {
        try {
            if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm khỏi kho không?')) {
                await deleteStock(stockItem.idInventory)
                    .then((res) => {
                        if (res.data.success) {
                            toast.success('Xóa sản phẩm khỏi kho thành công');
                            getStock();
                        }
                    });
            }
        } catch (error) {
            console.log(error);
            toast.error('Xóa sản phẩm khỏi kho thất bại');

        }
    };

    const updateProduct = async (e: React.FormEvent<HTMLFormElement>) => {
        try {
            e.preventDefault();
            await updateStock(stockItem.idInventory, stateStock)
                .then((res) => {
                    if (res.data.success) {
                        toast.success('Cập nhật sản phẩm trong kho thành công');
                        hideBuyTickets();
                        getStock();
                    }
                });
        } catch (error) {
            console.log(error);
            toast.error('Cập nhật sản phẩm trong kho thất bại');
        }
    };

    return (
        <>
            {/* <!-- item 1 --> */}
            <tbody className={cx('details-tbody')}>
                <tr className={cx('details-content-list')}>
                    <td className={cx('details-content-item')}>
                        <Image className={cx('stock-img')}
                            src={stockItem?.product?.shoesImg[0]}
                            alt={stockItem?.product?.shoesName}
                        />
                    </td>
                    <td className={cx('details-content-item')}>
                        {stockItem?.product?.shoesName}
                    </td>
                    <td className={cx('details-content-item')}>
                        {stockItem?.size?.sizeVi}
                    </td>
                    <td className={cx('details-content-item')}>
                        {stockItem?.quantityInStock}
                    </td>
                    <td className={cx('details-content-item')}>
                        <button className={cx('details-content-item-btn')} onClick={showBuyTickets}>
                            Sửa
                        </button>
                    </td>
                    <td className={cx('details-content-item')}>
                        <button className={cx('details-content-item-btn')}
                            onClick={deleteProduct}
                        >
                            Xóa
                        </button>
                    </td>
                </tr>
            </tbody>

            <div className={cx('modal', statusModal ? 'open' : '')} onClick={hideBuyTickets}>
                <div
                    className={cx('modal-detail')}
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                >
                    <div className={cx('modal-header')}>
                        <h2 className={cx('modal-heading')}>Cập nhật kho</h2>
                        <FontAwesomeIcon className={cx('modal--close')} icon={faXmark} onClick={hideBuyTickets} />
                    </div>

                    <form
                        onSubmit={updateProduct}
                    >
                        <div className={cx('stock-list')}>
                            <div className={cx('info')}>
                                <label htmlFor="" className={cx('input-label', 'mt-10')}>
                                    Tên sản phẩm
                                </label>
                                <select
                                    className={cx('stock-select')}
                                    value={stockItem?.product?.shoesId}
                                    onChange={(e) => { setStateStock({ ...stateStock, productId: e.target.value as UUID }) }}
                                >
                                    {productData.length > 0 ? (
                                        productData.map((product) => {
                                            return (
                                                <option key={product.shoesId} value={product.shoesId}>
                                                    {product.shoesName}
                                                </option>
                                            );
                                        })
                                    ) : (
                                        <></>
                                    )}
                                </select>
                            </div>

                            <div className={cx('info')}>
                                <label htmlFor="" className={cx('input-label', 'mt-10')}>
                                    Chọn Size
                                </label>
                                <select
                                    className={cx('stock-select')}
                                    value={stateStock.idSize}
                                    onChange={(e) => { setStateStock({ ...stateStock, idSize: e.target.value as UUID }) }}
                                >
                                    {sizeData.length > 0 ? (
                                        sizeData.map((size) => {
                                            return (
                                                <option key={size.idSize} value={size.idSize}>
                                                    {size.sizeVi}
                                                </option>
                                            );
                                        })
                                    ) : (
                                        <></>
                                    )}
                                </select>
                            </div>

                            <div className={cx('info')}>
                                <label htmlFor="" className={cx('input-label')}>
                                    Số lượng
                                </label>
                                <input
                                    className={cx('input-item')}
                                    type="text"
                                    value={stateStock.quantityInStock ? stateStock.quantityInStock : 0}
                                    placeholder="Số lượng"
                                    onKeyPress={(event) => {
                                        if (!/[0-9]/.test(event.key)) {
                                            event.preventDefault();
                                        }
                                    }}
                                    onChange={(e) => { setStateStock({ ...stateStock, quantityInStock: Number(e.target.value) }) }}
                                />
                            </div>
                        </div>
                        <button className={cx('btn')}>Save</button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default ItemStock;
