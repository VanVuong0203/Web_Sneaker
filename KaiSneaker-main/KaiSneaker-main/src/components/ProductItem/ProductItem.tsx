import classNames from 'classnames/bind';
import styles from './productItem.module.scss';
import Image from '~/components/Image/Image';
import { Link } from 'react-router-dom';
import { NumericFormat } from 'react-number-format';
import { Product } from '~/models/Product';

const cx = classNames.bind(styles);
interface ProductItemProps {
    item: Product;
}
const ProductItem: React.FC<ProductItemProps> = ({ item }) => {
    return (
        <Link
            to={`/sneaker/${item?.shoesId}`}
            state={{
                data: {
                    item
                },
            }}
            className={cx('wrapper')}
        >
            <Image className={cx('avatar')} src={item?.shoesImg[0]} alt={item?.shoesName} />
            <div className={cx('info')}>
                <div className={cx('box_name')}>
                    <h4 className={cx('name')}>
                        <span>{item?.shoesName}</span>
                    </h4>
                    <span className={cx('brandname')}>{item?.brand.brandName}</span>
                </div>
                <div className={cx('box_price')}>
                    <span className={cx('price')}>
                        <NumericFormat value={item?.shoesPrice} displayType={'text'} thousandSeparator={true} suffix={'đ'} />
                    </span>
                </div>
            </div>
        </Link>
    );
};

export default ProductItem;
