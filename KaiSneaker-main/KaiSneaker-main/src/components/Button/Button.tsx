import React, { ReactNode, forwardRef } from 'react';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import styles from './Button.module.scss';

const cx = classNames.bind(styles);

// Định nghĩa kiểu cho props của Button
interface ButtonProps extends React.HTMLAttributes<HTMLElement> {
    to?: string
    state?: Record<string, unknown>;  // <-- cho phép object
    href?: string;            // Để sử dụng với thẻ <a>
    primary?: boolean;        // Để kiểm tra kiểu primary button
    outline?: boolean;        // Để kiểm tra kiểu outline button
    text?: boolean;           // Để kiểm tra kiểu text button
    rounded?: boolean;        // Để kiểm tra kiểu rounded button
    disabled?: boolean;       // Để kiểm tra kiểu disabled
    small?: boolean;          // Để kiểm tra kiểu nhỏ
    large?: boolean;          // Để kiểm tra kiểu lớn
    children: ReactNode;      // Nội dung của button
    className?: string;       // Lớp CSS tùy chỉnh
    leftIcon?: ReactNode;     // Icon bên trái
    rightIcon?: ReactNode;    // Icon bên phải
    onClick?: () => void;     // Hàm xử lý sự kiện click
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
    to,
    href,
    primary = false,
    outline = false,
    text = false,
    rounded = false,
    disabled = false,
    small = false,
    large = false,
    children,
    className,
    leftIcon,
    rightIcon,
    onClick,
    ...passProps
}: ButtonProps, ref) => {
    let Comp: React.ElementType = 'button'; // Mặc định là button
    const props: Record<string, unknown> = {
        onClick,
        ref,
        ...passProps,
    };

    if (disabled) {
        Object.keys(props).forEach((key) => {
            if (key.startsWith('on') && typeof props[key] === 'function') {
                delete props[key];
            }
        });
    }

    if (to) {
        props.to = to;
        Comp = Link;  // Nếu có prop `to`, sử dụng Link từ react-router-dom
    } else if (href) {
        props.href = href;
        Comp = 'a';  // Nếu có prop `href`, sử dụng thẻ <a>
    }

    const classes = cx('wrapper', className, {
        primary,
        outline,
        text,
        disabled,
        rounded,
        small,
        large,
    });

    return (
        <Comp className={classes} {...props}>
            {leftIcon && <span className={cx('icon')}>{leftIcon}</span>}
            <span className={cx('title')}>{children}</span>
            {rightIcon && <span className={cx('icon')}>{rightIcon}</span>}
        </Comp>
    );
});

export default Button;
