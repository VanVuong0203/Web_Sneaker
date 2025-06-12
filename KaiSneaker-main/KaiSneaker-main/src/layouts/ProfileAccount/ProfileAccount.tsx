import Header from '~/layouts/components/Header/Header';
import Footer from '~/layouts/components/Footer/Footer';
import SidebarProfile from '~/layouts/components/SidebarProfile/SidebarProfile';
import styles from './profileAccount.module.scss';
import classNames from 'classnames/bind';
import { Outlet } from 'react-router';

const cx = classNames.bind(styles);

const ProfileAccount = () => {
    return (
        <>
            <Header />
            <div className={cx('container')}>
                <div className={cx('grid', 'wide')}>
                    <div className={cx('row')}>
                        <h2 className={cx('title', 'col', 'l-12')}>Thông tin tài khoản</h2>
                        <SidebarProfile />
                        <div className="col l-8">
                            <Outlet />
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default ProfileAccount;
