import Tippy from '@tippyjs/react';

import styles from './header.module.scss';
import classNames from 'classnames/bind';
import { Link, useNavigate } from 'react-router-dom';
import images from '~/assets/images';
import Image from '~/components/Image/Image';
import Menu from '~/components/Popper/Menu/Menu';
import Button from '~/components/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBagShopping, faSignIn, faSignOut, faUser } from '@fortawesome/free-solid-svg-icons';
import Search from '../Search/Search';
import Navbar from '../Navbar/Navbar';
import { useAuth } from '~/context/AuthContext';
import { toast } from 'react-toastify';

const cx = classNames.bind(styles);

const MENU_ITEMS = [
    {
        icon: <FontAwesomeIcon icon={faSignIn} />,
        title: 'Đăng nhập',
        to: '/login',
    },
];
const Header = () => {
    const { logout, userData, shoppingCartLength } = useAuth();
    const navigate = useNavigate();

    const removeCookie = () => {
        logout();
        toast.success('Đăng xuất thành công!');
        navigate('/');
    };

    const userMenu = [
        {
            icon: <FontAwesomeIcon icon={faUser} />,
            title: userData?.role?.roleName === "ADMIN"
                && 'Thông tin tài khoản',
            to: userData?.role?.roleName === "ADMIN"
                && `/@${userData?.idAccount}/profile`,

        },
        {
            icon: <FontAwesomeIcon icon={faUser} />,
            title: userData?.role?.roleName === "ADMIN"
                ? 'Đi tới trang Admin'
                : 'Thông tin tài khoản',
            to: userData?.role?.roleName === "ADMIN"
                ? `/admin/dashboard`
                : `/@${userData?.idAccount}/profile`,

        },
        {
            icon: <FontAwesomeIcon icon={faSignOut} />,
            title: 'Đăng xuất',
            separate: true,
            to: '/',
            onClick: removeCookie,
        },
    ];

    return (
        <header className={cx('wrapper')}>
            <Link to="/" className={cx('logo_box')}>
                <Image src={images.logo} className={cx('logo')} />
            </Link>
            <Navbar />
            <div className={cx('actions')}>
                <Search />
                {userData ? (
                    <Tippy content="Giỏ hàng" placement="bottom-start">
                        <Link
                            to={userData ? `/@${userData.idAccount}/shopping-cart` : ''}
                            className={cx('action-btn')}
                        >
                            <FontAwesomeIcon icon={faBagShopping} />
                            <span className={cx('badge')}>{shoppingCartLength}</span>
                        </Link>
                    </Tippy>
                ) : (
                    <></>
                )}
                <Menu
                    items={userData ? userMenu : MENU_ITEMS}
                >
                    {userData ? (
                        <Image
                            className={cx('user-avatar')}
                            src={userData.imageUser || ""}
                            alt={userData.fullName}
                        />
                    ) : (
                        <Button className={cx('account-btn')}>
                            <FontAwesomeIcon icon={faUser} />
                        </Button>
                    )}
                </Menu>
            </div>
        </header>
    )
}

export default Header