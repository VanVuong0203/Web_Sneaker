import classNames from 'classnames/bind';
import styles from './sidebar.module.scss';
import { useState, useEffect, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { fetchAllBrand } from '~/service/api';
import { Brand } from '~/models/Brand';

const cx = classNames.bind(styles);

interface SidebarProps {
    children: ReactNode;
}

const Sidebar = ({ children }: SidebarProps) => {
    const [brandData, setBrandData] = useState<Brand[]>([]);

    const getBrand = async () => {
        try {
            await fetchAllBrand()
                .then((res) => {
                    return res.data.result;

                }).then((data) => setBrandData(data))
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        getBrand()
    }, []);


    return (
        <div className={cx('row', 'app_content')}>
            <div className={cx('col', 'l-3')}>
                <div className={cx('category')}>
                    {brandData ? (
                        <ul className={cx('category-list')}>
                            <li className={cx('category-item')}>
                                <Link to={`/sneaker`} className={cx('category-item__link')}>
                                    Sneaker
                                </Link>
                            </li>
                            {brandData.map((brand) => (
                                <li className={cx('category-item')} key={brand.idBrand}>
                                    <Link
                                        to={`/sneaker/${brand.brandName.toLowerCase()}`}
                                        className={cx('category-item__link')}
                                    >
                                        {brand.brandName.toUpperCase()}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <></>
                    )}
                </div>
            </div>
            <div className={cx('col', 'l-9')}>
                {children}
            </div>
        </div>
    );
};

export default Sidebar;
