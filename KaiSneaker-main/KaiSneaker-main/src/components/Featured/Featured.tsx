import styles from './featured.module.scss';
import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import Products from '../Products/Products';
import { fetchTopSelling } from '~/service/api';
import { Product } from '~/models/Product';

const cx = classNames.bind(styles);

const Featured = () => {
    const [countProduct, setCountProduct] = useState<Product[]>([])

    const getTopSelling = async () => {
        try {
            const res = await fetchTopSelling();
            if (res.data.success) {
                setCountProduct(res.data.result);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getTopSelling()
    }, []);

    return (
        <div className={cx('row', 'features')}>
            {countProduct.length > 0 && <h1 className={cx('features_heading', 'col', 'l-12')}>Sản phẩm nổi bật</h1>}
            <div className={cx('row', 'item', 'l-12', 'col')}>
                {countProduct &&
                    countProduct
                        .map((product) => (
                            <div key={product.shoesId} className={cx('col', 'l-3')}>
                                <Products
                                    item={product}
                                    featured
                                />
                            </div>
                        ))
                }

            </div>
        </div>
    );
};

export default Featured;
