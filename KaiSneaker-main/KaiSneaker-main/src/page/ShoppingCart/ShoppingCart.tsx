import { Outlet } from 'react-router'
import Footer from '~/layouts/components/Footer/Footer'
import Header from '~/layouts/components/Header/Header'
import classNames from 'classnames/bind'
import styles from './ShoppingCart.module.scss'

const cx = classNames.bind(styles)

const ShoppingCart = () => {

    return (
        <>
            <Header />
            <div className={cx('container')}>
                <div className={cx('grid', 'wide')}>
                    <div className={cx('row')}>
                        <Outlet />
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default ShoppingCart