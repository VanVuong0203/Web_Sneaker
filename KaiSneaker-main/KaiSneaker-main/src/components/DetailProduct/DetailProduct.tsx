// import Breadcrumbs from '~/components/Breadcrumbs';
import { useState, useEffect } from 'react';
// import { useCookies } from 'react-cookie';
import { Fade } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';
import Image from '~/components/Image/Image';
import classNames from 'classnames/bind';
import styles from './DetailProduct.module.scss';
import { useNavigate, useLocation } from 'react-router-dom';
import { NumericFormat } from 'react-number-format';
import { Product } from '~/models/Product';
import { CartDTO, createCart, fetchStockByProduct } from '~/service/api';
import { UUID } from 'crypto';
import { useAuth } from '~/context/AuthContext';
import { toast } from 'react-toastify';
import { Size } from './../../models/Size';

const cx = classNames.bind(styles);

const DetailProduct = () => {
    const [sizeData, setSizeData] = useState<Size[]>([]);
    const { isAuthenticated, userData, fetchUserShoppingCart } = useAuth();
    let navigate = useNavigate();
    let location = useLocation();

    const [loadingSize, setLoadingSize] = useState(true);
    const [stateShopping, setStateShopping] = useState<CartDTO>({
        idAccount: userData?.idAccount || "00000-00000-00000-00000-00000",
        shoesId: location?.state?.data?.item?.shoesId,
        idSize: "00000-00000-00000-00000-00000",
        quantity: 1,
    });

    useEffect(() => {
        if (location.state.data) {
            document.title = `${location.state.data.shoesName}`; // cập nhật tiêu đề    
        }
    }, []);


    const [productData, setProductData] = useState<Product>({
        shoesId: "-----",
        shoesName: "string",
        shoesPrice: 0,
        shoesDescription: "",
        shoesImg: [],
        brand: {
            idBrand: "----",
            brandName: "",
            descriptionBrand: "",
            imageBrand: ""
        }
    });


    useEffect(() => {
        if (location.state?.data?.item) {
            setProductData(location.state?.data?.item)
            getSize(location.state?.data?.item?.shoesId);
            setStateShopping({
                ...stateShopping,
                shoesId: location.state?.data?.item?.shoesId
            });
        }
    }, [location.state?.data?.item])

    const getSize = async (shoesId: UUID) => {
        setLoadingSize(true);  // Bắt đầu loading
        await fetchStockByProduct(shoesId)
            .then((res) => {
                if (res.data?.success) {
                    setSizeData(res.data.result);
                    const firstAvailableSize = res.data.result.find((product: Size) => product.quantityInStock > 0);

                    if (firstAvailableSize) {
                        setStateShopping({
                            ...stateShopping,
                            idSize: firstAvailableSize.idSize,
                            quantity: 1,
                        });
                    }
                }
            });
        setLoadingSize(false); // Kết thúc loading

    };
    useEffect(() => {
        if (isAuthenticated) {
            setStateShopping({ ...stateShopping, idAccount: userData?.idAccount || "00000-00000-00000-00000-00000" });
        }
    }, [isAuthenticated, userData]);

    const quantityUp = () => {
        const currentSize = sizeData.find((product) => stateShopping.idSize === product.idSize);
        if (currentSize && stateShopping.quantity < currentSize.quantityInStock) {
            setStateShopping({ ...stateShopping, quantity: stateShopping.quantity + 1 });
        }
    };

    const quantityDown = () => {
        if (stateShopping.quantity > 1) {
            setStateShopping({ ...stateShopping, quantity: stateShopping.quantity - 1 });
        }
    };
    const createMarkup = () => {
        return {
            __html: productData?.shoesDescription
        };
    }

    const handleShoppingCart = async () => {
        try {
            if (isAuthenticated) {
                const res = await createCart(stateShopping)
                if (res.data.success) {
                    toast.success(res.data.message);
                    fetchUserShoppingCart();
                }
            } else {
                toast.warning("Vui lòng đăng nhập để thêm vào giỏ hàng!");
                navigate('/login');
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Có lỗi xảy ra khi thêm vào giỏ hàng!");
        }
    };

    const handleBuyNow = () => {
        if (isAuthenticated) {
            handleShoppingCart();
            navigate(`/@${userData?.idAccount}/shopping-cart`);
        } else {
            navigate('/login');
        }
    };


    return (
        <div className="grid wide">
            <div className="row">
                <div className={cx('slide-container', 'col', 'l-5')}>
                    <Fade>
                        {productData?.shoesImg
                            .map((img) => {
                                return (
                                    <div className="each-fade" key={productData?.shoesId}>
                                        <div className={cx('image-container')}>
                                            <Image
                                                className={cx('fill')}
                                                src={img}
                                                alt={productData.shoesName}
                                            />
                                        </div>
                                    </div>

                                );
                            })}
                    </Fade>
                </div>
                <div className={cx('col', 'l-7', 'info')}>
                    <h2 className={cx('info-heading')}>{productData?.shoesName}</h2>
                    <p className={cx('brand')}>{productData?.brand?.brandName}</p>
                    <p className={cx('info-money')}>
                        <span>Giá : </span>
                        <NumericFormat
                            value={productData?.shoesPrice}
                            displayType={'text'}
                            thousandSeparator={true}
                            suffix={'đ'}
                        />
                    </p>

                    <div className={cx('options')}>
                        <div className={cx('size')}>

                            {loadingSize ? (
                                <div className={cx('size_loading')}>Đang tải size...</div>
                            ) : sizeData.length > 0 ? (
                                <>
                                    <label className={cx('size_heading')}>Size</label>
                                    <select
                                        className={cx('size_option')}
                                        value={stateShopping.idSize}
                                        onChange={(e) => {
                                            setStateShopping({ ...stateShopping, idSize: e.target.value as UUID });
                                        }}
                                    >
                                        {sizeData.map((size: Size, index) => (
                                            <option
                                                value={size?.idSize}
                                                key={size?.idSize || index}
                                                disabled={size?.quantityInStock === 0}
                                            >
                                                {size?.sizeVi}
                                            </option>
                                        ))}
                                    </select>
                                </>
                            ) : (
                                <div className={cx('size_empty')}>Hết hàng</div>
                            )}
                        </div>
                        <div className={cx('info_quantity')}>
                            <span className={cx('minus')}
                                onClick={quantityDown}
                            >
                                -
                            </span>
                            <span className={cx('num')}>{stateShopping.quantity < 10 ? '0' + stateShopping.quantity : stateShopping.quantity}</span>
                            <span
                                className={cx('plus')}
                                onClick={quantityUp}
                            >
                                +
                            </span>
                        </div>
                    </div>

                    {sizeData.length > 0 && <div className={cx('info-btn')}>
                        <button className={cx('info-btn-bag')}
                            onClick={handleShoppingCart}
                            disabled={sizeData.every((size) => size.quantityInStock === 0)}
                        >
                            Thêm vào giỏ hàng
                        </button>

                        <button className={cx('info-btn-buy')}
                            onClick={handleBuyNow}
                            disabled={sizeData.every((size) => size.quantityInStock === 0)}
                        >
                            Mua ngay
                        </button>
                    </div>}

                </div>
            </div>
            <div className={cx('row', 'description')}>
                <div className={cx('col', 'l-12', 'describe')}>
                    <h2 className={cx('describe_heading')}>Mô tả sản phẩm</h2>
                    <div className={cx('describe_content')}>
                        <h3 className={cx('describe_content-name')}>{productData?.shoesName}</h3>
                        <div className={cx('describe_content-summary')}>
                            <h3 className={cx('describe_content-summary-heading')}>Sơ lược sản phẩm</h3>
                            <p
                                className={cx('describe_content-summary-content')}
                                dangerouslySetInnerHTML={createMarkup()}
                            ></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DetailProduct;
