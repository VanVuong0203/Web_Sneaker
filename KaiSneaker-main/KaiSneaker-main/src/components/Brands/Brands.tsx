import classNames from 'classnames/bind';
import styles from './brands.module.scss';
import Image from '~/components/Image/Image';
import { useBrand } from '~/context/BrandContext';

const cx = classNames.bind(styles);

const Brands = () => {
    const { brandData } = useBrand();

    return (
        <>
            {
                brandData.length > 0 && <div className={cx('brand', 'row')} >
                    <div className={cx('col', 'l-12', 'brand_item')}>
                        {brandData && brandData.map((brand) => (
                            <Image
                                src={brand.imageBrand}
                                alt={brand.brandName}
                                key={brand.idBrand}
                                className={cx('brand_item-logo')}
                            />
                        ))}
                        {brandData && brandData.map((brand) => (
                            <Image
                                src={brand.imageBrand}
                                alt={brand.brandName}
                                key={brand.idBrand}
                                className={cx('brand_item-logo')}
                            />
                        ))}

                    </div>
                </div >
            }

        </>

    );
};

export default Brands;
