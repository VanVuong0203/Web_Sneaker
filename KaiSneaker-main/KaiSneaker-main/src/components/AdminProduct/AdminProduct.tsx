import classNames from 'classnames/bind';
import styles from './adminProduct.module.scss';
import Button from '~/components/Button/Button';
import { useEffect, useState } from 'react';
import { NumericFormat } from 'react-number-format';
import Image from '~/components/Image/Image';
import { deleteProduct, fetchAllProduct } from '~/service/api';
import { Product } from '~/models/Product';
import { UUID } from 'crypto';
import { toast } from 'react-toastify';
import { useAuth } from '~/context/AuthContext';

const cx = classNames.bind(styles);

const AdminProduct = () => {

    const { fetchUserShoppingCart } = useAuth();

    const [productData, setProductData] = useState<Product[]>([]);

    useEffect(() => {
        document.title = `Sản phẩm`; // cập nhật tiêu đề
    }, []);

    useEffect(() => {
        getCourses();
    }, []);

    const getCourses = async () => {
        try {
            await fetchAllProduct()
                .then((res) => {
                    if (res.data?.success) {
                        setProductData(res.data.result)
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteProduct = async (idProduct: UUID) => {
        try {
            if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này không?')) {
                await deleteProduct(idProduct)
                    .then((res) => {
                        if (res?.data?.success) {
                            toast.success(res.data.message);
                            fetchUserShoppingCart();
                            getCourses();
                        }
                    });
            }
        } catch (error: any) {
            toast.error(error.response.data.message);

        }
    };

    return (
        <>
            {/* <!-- Begin adminProductTable --> */}
            <div className={cx('account-header')}>
                <h2 className={cx('account-heading')}>Danh sách sản phẩm</h2>
                <Button to={`/admin/products/new-item`} className={cx('account-create-btn')}>
                    Thêm mới
                </Button>
            </div>
            <table className={cx('details-table')}>
                <thead className={cx('details-thead')}>
                    <tr className={cx('details-title-list')}>
                        <td className={cx('details-title-item')}>Ảnh</td>
                        <td className={cx('details-title-item')}>Brand</td>
                        <td className={cx('details-title-item')}>Tên sản phẩm</td>
                        <td className={cx('details-title-item')}>Giá</td>
                    </tr>
                </thead>
                <tbody className={cx('details-tbody')} >

                    {productData.length > 0 ?
                        productData.map((product) => {
                            return (
                                <tr className={cx('details-content-list')} key={product.shoesId}>
                                    <td className={cx('details-content-item')}>
                                        <Image
                                            src={product.shoesImg.length > 0 ? product.shoesImg[0] : ''}
                                            alt={product.shoesName}
                                            className={cx('details-content-item-img')}
                                        />
                                    </td>
                                    <td className={cx('details-content-item')}>{product.brand?.brandName}</td>
                                    <td className={cx('details-content-item', 'justify_item')}>{product.shoesName}</td>
                                    <td className={cx('details-content-item')}>
                                        <NumericFormat
                                            value={product.shoesPrice}
                                            displayType={'text'}
                                            thousandSeparator={true}
                                            suffix={'đ'}
                                        />
                                    </td>

                                    <td className={cx('details-content-item')}>
                                        <Button
                                            to={`/admin/products/${product.shoesId}`}
                                            state={{ data: product, brandName: product.brand.brandName }}
                                            className={cx('details-content-item-btn')}
                                        >
                                            Sửa
                                        </Button>
                                    </td>
                                    <td className={cx('details-content-item')}>
                                        <Button
                                            className={cx('details-content-item-btn')}
                                            onClick={() => handleDeleteProduct(product.shoesId)}
                                        >
                                            Xóa
                                        </Button>
                                    </td>
                                </tr>
                            )
                        }) :
                        (
                            <tr className={cx('details-content-list')}>
                                <td className={cx('details-content-item')} colSpan={4}>
                                    <h3>Không có dữ liệu</h3>
                                </td>
                            </tr>
                        )
                    }
                </tbody>
            </table >

            {/* <!-- End adminProductTable --> */}
        </>
    );
}

export default AdminProduct;
