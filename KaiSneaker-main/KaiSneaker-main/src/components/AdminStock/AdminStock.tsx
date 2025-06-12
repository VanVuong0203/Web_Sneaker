import classNames from 'classnames/bind';
import styles from './AdminStock.module.scss';
import Button from '~/components/Button/Button';

import ItemStock from '~/components/ItemStock/ItemStock';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';
import { createStock, fetchAllProduct, fetchAllSize, fetchAllStock, StockDTO } from '~/service/api';
import { Stock } from '~/models/Stock';
import { Size } from '~/models/Size';
import { Product } from '~/models/Product';
import { UUID } from 'crypto';
import { toast } from 'react-toastify';

const cx = classNames.bind(styles);
const AdminStock = () => {

    useEffect(() => {
        document.title = `Tồn Kho`; // cập nhật tiêu đề
    }, []);

    const [statusModal, setStatusModal] = useState(false);
    const [sizeData, setSizeData] = useState<Size[]>([]);
    const [productData, setProductData] = useState<Product[]>([]);
    const [stockData, setStockData] = useState<Stock[]>([]);

    const [stateStock, setStateStock] = useState<StockDTO>({
        productId: productData[0]?.shoesId,
        idSize: sizeData[0]?.idSize,
        quantityInStock: 0,
    });
    useEffect(() => {
        getStock();
        getSize();
        getProducts();
    }, []);

    useEffect(() => {
        setStateStock({
            ...stateStock,
            productId: productData[0]?.shoesId,
            idSize: sizeData[0]?.idSize,
        });
    }, [productData, sizeData]);
    const getStock = async () => {
        try {
            await fetchAllStock()
                .then((res) => {
                    if (res.data?.success) {
                        setStockData(res.data.result);
                    }
                })


        } catch (error) {
            console.error(error);
        }
    };

    const getProducts = async () => {
        try {
            await fetchAllProduct()
                .then(async (res) => {
                    if (res.data?.success) {
                        setProductData(res.data.result);
                    }
                })

        } catch (error) {
            console.error(error);
        }
    };

    const getSize = async () => {
        try {
            await fetchAllSize()
                .then(async (res) => {
                    if (res.data?.success) {
                        setSizeData(res.data.result);
                    }
                })

        } catch (error) {
            console.error(error);
        }
    };

    const showBuyTickets = () => {
        setStatusModal(true);
    };
    const hideBuyTickets = () => {
        setStatusModal(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await handleSubmitStock(
            stateStock,
        );
    };

    const handleSubmitStock = (data: StockDTO) => {
        try {
            if (!data.productId || !data.idSize || !data.quantityInStock) {
                toast.error('Vui lòng nhập đầy đủ thông tin');
                return;
            }
            createStock(data)
                .then((res) => {
                    if (res.data?.success) {
                        toast.success('Thêm sản phẩm vào kho thành công!!!');
                        setStateStock({
                            productId: productData[0]?.shoesId,
                            idSize: sizeData[0]?.idSize,
                            quantityInStock: 0,
                        });
                        getStock();
                        setStatusModal(false);
                    }
                });
        } catch (error) {
            console.log(error);
            toast.error('Thêm sản phẩm vào kho thất bại!!!');

        }
    };

    return (
        <>
            {/* <!-- Begin adminStock --> */}
            <div className={cx('stock-header')}>
                <h2 className={cx('stock-heading')}>Danh sách các sản phẩm trong kho</h2>
                <Button onClick={showBuyTickets} className={cx('stock-create-btn')}>
                    Thêm mới
                </Button>
            </div>
            {/* <!-- End adminStock --> */}

            {stockData.length !== 0 ? (
                <table className={cx('details-table')}>
                    <thead className={cx('details-thead')}>
                        <tr className={cx('details-title-list')}>
                            <td className={cx('details-title-item')}>Hình ảnh</td>
                            <td className={cx('details-title-item')}>Tên sản phẩm</td>
                            <td className={cx('details-title-item')}>Size</td>
                            <td className={cx('details-title-item')}>Số lượng</td>
                        </tr>
                    </thead>
                    {
                        stockData.map((stock) => {
                            return (
                                <ItemStock
                                    key={stock.idInventory}
                                    stockItem={stock}
                                    productData={productData}
                                    sizeData={sizeData}
                                    getStock={getStock}
                                />
                            );
                        })
                    }
                </table>
            ) : (
                <h2>Không có dữ liệu</h2>
            )}
            {/* Begin modal */}
            <div className={cx('modal', statusModal ? 'open' : '')} onClick={hideBuyTickets}>
                <div
                    className={cx('modal-detail')}
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                >
                    <div className={cx('modal-header')}>
                        <h2 className={cx('modal-heading')}>Thêm kho</h2>
                        <FontAwesomeIcon className={cx('modal--close')} icon={faXmark} onClick={hideBuyTickets} />
                    </div>

                    <form
                        onSubmit={handleSubmit}
                    >
                        <div className={cx('stock-list')}>
                            <div className={cx('info')}>
                                <label htmlFor="" className={cx('input-label', 'mt-10')}>
                                    Tên sản phẩm
                                </label>
                                <select
                                    className={cx('stock-select')}
                                    value={stateStock.productId}
                                    onChange={(e) => setStateStock({ ...stateStock, productId: e.target.value as UUID })}
                                >
                                    {productData.length > 0 ? (
                                        productData.map((product: Product) => {
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
                                    onChange={(e) => setStateStock({ ...stateStock, idSize: e.target.value as UUID })}
                                >
                                    {sizeData.length > 0 ? (
                                        sizeData.map((size: Size) => {
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
                                    placeholder="Số lượng"
                                    value={stateStock.quantityInStock ? stateStock.quantityInStock : 0}
                                    onKeyPress={(event) => {
                                        if (!/[0-9]/.test(event.key)) {
                                            event.preventDefault();
                                        }
                                    }}
                                    onChange={(e) => setStateStock({ ...stateStock, quantityInStock: Number(e.target.value) })}
                                />
                            </div>
                        </div>
                        <button className={cx('btn')}>Save</button>
                    </form>
                </div>
            </div>
            {/* End modal */}
        </>
    );
}

export default AdminStock;
