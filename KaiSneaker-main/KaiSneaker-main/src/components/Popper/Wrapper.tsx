import classNames from 'classnames/bind';
import styles from './popper.module.scss';
import React from 'react';

const cx = classNames.bind(styles);

interface WrapperProps {
    children: React.ReactNode;
    className?: string;
}

const Wrapper: React.FC<WrapperProps> = ({ children, className }) => {
    return <div className={cx('wrapper', className)}>{children}</div>;
};

export default Wrapper;