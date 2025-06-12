import SidebarAdmin from '~/layouts/components/SidebarAdmin/SidebarAdmin';
import classNames from 'classnames/bind';
import styles from './admin.module.scss';
import { Outlet } from 'react-router';

const cx = classNames.bind(styles);

const Admin = () => {
    return (
        <div className={cx('container')}>
            <div className={cx('grid')}>
                <div className={cx('row')}>
                    <SidebarAdmin>
                        <Outlet />
                    </SidebarAdmin>
                </div>
            </div>
        </div>
    );
}

export default Admin;
