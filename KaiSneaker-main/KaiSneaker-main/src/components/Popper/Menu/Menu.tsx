import { ReactNode, use, useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import Tippy from '@tippyjs/react/headless';
import { Wrapper as PopperWrapper } from '~/components/Popper/index';
import styles from './menu.module.scss';
import MenuItem from './MenuItem';

// Định nghĩa kiểu cho props của Menu
interface MenuProps {
    children: ReactNode;  // children có thể là bất kỳ phần tử React nào
    items?: Array<{ // Kiểu cho items
        label?: string;
        icon?: ReactNode;
        onClick?: () => void;
    }>;
}

const cx = classNames.bind(styles);

const Menu = ({ children, items = [] }: MenuProps) => {
    const [history, setHistory] = useState<{ data: typeof items }[]>([{ data: items }]);

    const renderItems = () => {
        return items.map((item, index) => {
            return item ? <MenuItem key={index} data={item} /> : null;
        });
    };

    return (
        <Tippy
            interactive
            delay={[0, 0]}
            offset={[12, 8]}
            placement="bottom-end"
            render={(attrs) => (
                <div className={cx('menu-list')} tabIndex={-1} {...attrs}>
                    <PopperWrapper className={cx('menu-popper')}>{renderItems()}</PopperWrapper>
                </div>
            )}
        >
            {children as React.ReactElement}

        </Tippy>
    );
}

export default Menu;
