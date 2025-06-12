import Products from '~/components/Products/Products';
import { useEffect, useState } from 'react';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames/bind';
import styles from './brandSneaker.module.scss';
import { fetchAllProduct } from '~/service/api';
import { Product } from '~/models/Product';
const cx = classNames.bind(styles);

const BrandSneaker = (props: any) => {
    const [error, setError] = useState<boolean>(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [items, setItems] = useState<Product[]>([]);
    const brand = props.brandName;
    const [sort, setSort] = useState('');

    useEffect(() => {
        document.title = `Sneaker ${brand}`; // cập nhật tiêu đề
    }, []);

    const setSortPriceLowToHigh = () => {
        setSort('price_low_to_high');
    };

    const setSortPriceHighToLow = () => {
        setSort('price_high_to_low');
    };

    const getProducts = async () => {
        try {
            await fetchAllProduct()
                .then((res) => {
                    if (res.data?.success) {
                        setItems(res.data.result);
                        setIsLoaded(true);
                    }
                })
        } catch (error) {
            console.log(error);
            setIsLoaded(true);
            setError(true);
        }
    }

    useEffect(() => {
        getProducts();
    }, []);

    if (error) {
        return <div>Error: Lấy Dữ liệu bị lỗi</div>;
    } else if (!isLoaded) {
        return <div>Loading...</div>;
    } else {
        return (
            <>
                <div className={cx('filter')}>
                    <span className={cx('filter-label')}>Sắp xếp theo</span>

                    <div className={cx('select-input')}>
                        <span className={cx('select-input__label')}>Giá</span>
                        <FontAwesomeIcon icon={faAngleDown} className={cx('select-input__icon')} />

                        <ul className={cx('select-input__list')}>
                            <li className={cx('select-input__item')}>
                                <div className={cx('select-input__link')} onClick={setSortPriceLowToHigh}>
                                    Thấp đến cao
                                </div>
                            </li>
                            <li className={cx('select-input__item')}>
                                <div className={cx('select-input__link')} onClick={setSortPriceHighToLow}>
                                    Cao đến thấp
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className={cx('row')}>
                    {items ? (
                        sort === 'price_low_to_high' ? (
                            items
                                .sort((a, b) => a.shoesPrice - b.shoesPrice)
                                .map((item) => {
                                    if (item.brand.brandName.toLowerCase() === brand.toLowerCase()) {
                                        return (
                                            <div className={cx('col', 'l-3')} key={item.shoesId}>
                                                <Products
                                                    item={item}

                                                />
                                            </div>
                                        );
                                    }
                                })
                        ) : sort === 'price_high_to_low' ? (
                            items
                                .sort((a, b) => b.shoesPrice - a.shoesPrice)
                                .map((item) => {
                                    if (item.brand.brandName.toLowerCase() === brand.toLowerCase()) {
                                        return (
                                            <div className={cx('col', 'l-3')} key={item.shoesId}>
                                                <Products
                                                    item={item}
                                                />
                                            </div>
                                        );
                                    }
                                })
                        ) : (
                            items.map((item) => {
                                if (item.brand.brandName.toLowerCase() === brand.toLowerCase()) {
                                    return (
                                        <div className={cx('col', 'l-3')} key={item.shoesId}>
                                            <Products
                                                item={item}
                                            />
                                        </div>
                                    );
                                }
                            })
                        )
                    ) : (
                        <></>
                    )}
                </div>
            </>
        );
    }
}

export default BrandSneaker;
