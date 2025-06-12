import classNames from 'classnames/bind';
import Button from '~/components/Button/Button';
import styles from './Menu.module.scss';
import React from 'react';

const cx = classNames.bind(styles);

interface MenuItemProps {
    data: {
        icon?: React.ReactNode; // Optional icon (React node)
        title?: string;
        to?: string; // Optional 'to' prop for navigation
        onClick?: () => void; // Optional click handler
        separate?: boolean; // Optional flag for separation styling
    };
}

const MenuItem: React.FC<MenuItemProps> = ({ data }) => {
    const classes = cx('menu-item', {
        separate: data.separate,
    });

    return (
        <Button
            className={classes}
            leftIcon={data.icon}
            to={data.to}
            onClick={data.onClick}
        >
            {data.title}
        </Button>
    );
};

export default MenuItem;