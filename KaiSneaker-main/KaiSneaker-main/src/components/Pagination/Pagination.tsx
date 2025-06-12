import React from 'react';
import styles from './pagination.module.scss';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAnglesLeft, faAnglesRight, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const cx = classNames.bind(styles);

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const handlePageChange = (page: number) => {
    if (page !== currentPage) {
      onPageChange(page);
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    const halfRange = Math.floor(maxPagesToShow / 2);

    let startPage = Math.max(1, currentPage - halfRange);
    let endPage = Math.min(totalPages, currentPage + halfRange);

    if (currentPage <= halfRange) {
      endPage = Math.min(totalPages, maxPagesToShow);
    } else if (currentPage + halfRange >= totalPages) {
      startPage = Math.max(1, totalPages - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          className={cx('btn', 'btn-page', { active: currentPage === i })}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }

    return pageNumbers;
  };

  return (
    <div className={cx('pagination')}>
      {/* firs page */}
      <button
        className={cx('btn', 'btn-page')}
        onClick={() => handlePageChange(1)}
        disabled={currentPage === 1}
      >
        <FontAwesomeIcon icon={faAnglesLeft} />
      </button>
      <button
        className={cx('btn', 'btn-page')}
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
       <FontAwesomeIcon icon={faChevronLeft} />
      </button>
      {renderPageNumbers()}
      <button
        className={cx('btn', 'btn-page')}
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <FontAwesomeIcon icon={faChevronRight} />
      </button>
      {/* last page */}
      <button
        className={cx('btn', 'btn-page')}
        onClick={() => handlePageChange(totalPages)}
        disabled={currentPage === totalPages}
      >
       <FontAwesomeIcon icon={faAnglesRight} />
      </button>
    </div>
  );
};

export default Pagination;