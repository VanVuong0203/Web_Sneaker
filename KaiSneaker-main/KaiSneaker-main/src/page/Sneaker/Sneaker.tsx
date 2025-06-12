import Products from '~/components/Products/Products';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
// import axios from 'axios';
import classNames from 'classnames/bind';
import styles from './Sneaker.module.scss';
import { Product } from '~/models/Product';
import { fetchAllProduct } from '~/service/api';
const cx = classNames.bind(styles);

const Sneaker = () => {

    useEffect(() => {
        document.title = `Sneaker`; // cập nhật tiêu đề
    }, []);

    const [error, setError] = useState<boolean>(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [items, setItems] = useState<Product[]>([]);
    const [sort, setSort] = useState('');

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
            setError(true);
        }
    }

    useEffect(() => {
        getProducts();
    }, []);
    if (error) {
        return <div>Error:
            Lỗi rồi
        </div>;
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
                                .map((item) => (
                                    <div className={cx('col', 'l-3')} key={item.shoesId}>
                                        <Products
                                            item={item}
                                        />
                                    </div>
                                ))
                        ) : sort === 'price_high_to_low' ? (
                            items
                                .sort((a, b) => b.shoesPrice - a.shoesPrice)
                                .map((item) => (
                                    <div className={cx('col', 'l-3')} key={item.shoesId}>
                                        <Products
                                            item={item}

                                        />
                                    </div>
                                ))
                        ) : (
                            items.map((item) => (
                                <div className={cx('col', 'l-3')} key={item.shoesId}>
                                    <Products
                                        item={item}

                                    />
                                </div>
                            ))
                        )
                    ) : (
                        <></>
                    )}
                </div>
            </>
        );
    }
}
// }

export default Sneaker;
