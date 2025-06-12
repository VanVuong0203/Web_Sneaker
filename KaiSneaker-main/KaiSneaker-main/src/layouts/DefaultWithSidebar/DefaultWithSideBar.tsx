import Sidebar from '~/layouts/components/Sidebar/Sidebar';
import classNames from 'classnames/bind';
import styles from './DefaultWithSidebar.module.scss';
import { Outlet } from 'react-router';

const cx = classNames.bind(styles);

const DefaultWithSidebar = () => {
    return (
        <div className={cx('container', 'grid', 'wide')}>
            <Sidebar><Outlet /></Sidebar>
        </div>
    );
};

export default DefaultWithSidebar;
