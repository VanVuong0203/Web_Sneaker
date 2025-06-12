import classNames from 'classnames/bind';
import styles from './products.module.scss';
import { NumericFormat } from 'react-number-format';
import { Link } from 'react-router-dom';
import Image from '~/components/Image/Image';
import { Product } from '~/models/Product';

const cx = classNames.bind(styles);

// Định nghĩa type cho props
interface ProductsProps {
    featured?: boolean;
    item: Product;
}

const Products: React.FC<ProductsProps> = ({ featured, item }) => {

    return (
        <div className={cx('card', featured ? 'featured' : '')}>
            <Link
                to={`/sneaker/${item?.shoesId}`}
                state={{
                    data: {
                        item
                    },
                }}
            >
                <div className={cx('product')}>
                    <Image
                        src={item?.shoesImg[0]}
                        alt={item?.shoesName}
                        className={cx('product-img')}
                    />
                </div>
            </Link>
            <div className={cx('content')}>
                <h3 className={cx('name')}>{item?.shoesName}</h3>
                <p className={cx('price')}>
                    <span>Giá : </span>
                    <NumericFormat value={item?.shoesPrice} displayType="text" thousandSeparator suffix="đ" />
                </p>
                <Link
                    to={`/sneaker/${item?.shoesId}`}
                    state={{
                        data: {
                            item
                        },
                    }}
                    className={cx('buy')}
                >
                    Mua Ngay
                </Link>
            </div>
        </div>
    );
};

export default Products;
