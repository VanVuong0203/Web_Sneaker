import { useEffect, useState, useRef } from 'react';
import { faCircleXmark, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import HeadlessTippy from '@tippyjs/react/headless';
import { Wrapper as PopperWrapper } from '~/components/Popper';
import classNames from 'classnames/bind';
import styles from './search.module.scss';
import { useDebounce } from '~/hooks';
import { Product } from '~/models/Product';
import { fetchProductByName } from '~/service/api';
import ProductItem from '~/components/ProductItem/ProductItem';

const cx = classNames.bind(styles);

const Search = () => {
    const [searchValue, setSearchValue] = useState('');
    const [searchResult, setSearchResult] = useState<Product[]>([]);
    const [showResult, setShowResult] = useState(true);
    const [loading, setLoading] = useState(false);

    const debounced = useDebounce(searchValue, 500);

    const inputRef = useRef<HTMLInputElement>(null);

    const getDataSearch = async (debounced: string) => {
        try {
            await fetchProductByName(debounced)
                .then((res) => {
                    if (res.data?.success) {
                        setLoading(false);
                        setSearchResult(res.data.result);
                    } else {
                        setLoading(true);
                    }

                });
        } catch (error) {
            setLoading(false);

        }
    }

    useEffect(() => {

        if (!debounced.trim()) {
            setSearchResult([]);
            return;
        }
        setLoading(true);

        getDataSearch(debounced)
    }, [debounced]);


    const handleClear = () => {
        setSearchValue('');
        setSearchResult([]);
        inputRef.current?.focus();  // Sử dụng ref đúng cách
    };

    const handleHideResult = () => {
        setShowResult(false);
    };

    return (
        <HeadlessTippy
            interactive
            visible={showResult && searchResult.length > 0}
            render={(attrs) => (
                <div className={cx('search-result')} tabIndex={-1} {...attrs}>
                    <PopperWrapper>
                        {searchResult.length > 0 ? (
                            searchResult.map((result, index) => {
                                if (index < 5) {
                                    return (
                                        <ProductItem
                                            item={result}
                                        />
                                    );
                                }
                            })
                        ) : (
                            <></>
                        )}
                    </PopperWrapper>
                </div>
            )}
            onClickOutside={handleHideResult}
        >
            <div className={cx('search')}>
                <input
                    ref={inputRef}
                    value={searchValue}
                    placeholder="Tìm kiếm"
                    spellCheck={false}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onFocus={() => setShowResult(true)}
                    className={cx('search-txt')}
                />
                {
                    !!searchValue && (

                        <button className={cx('clear')} onClick={handleClear}>
                            <FontAwesomeIcon icon={faCircleXmark} />
                        </button>
                    )}

                <button className={cx('search-btn')} disabled>
                    <FontAwesomeIcon icon={faSearch} />
                </button>
            </div>
        </HeadlessTippy>
    );
};

export default Search;
