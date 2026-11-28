import React from "react";
import PropTypes from "prop-types";

const DEFAULT_PAGE_SIZE = 10;
const VISIBLE_PAGE_COUNT = 10;

const AdminPagination = ({ total, page, onChange, pageSize = DEFAULT_PAGE_SIZE }) => {
    const pageCount = Math.ceil(total / pageSize);
    if (pageCount <= 1) return null;
    // 페이지가 많아도 버튼이 넘치지 않게 현재 페이지가 속한 10개 묶음만 보여 준다
    const firstPage = Math.floor(page / VISIBLE_PAGE_COUNT) * VISIBLE_PAGE_COUNT;
    const lastPage = Math.min(firstPage + VISIBLE_PAGE_COUNT, pageCount);
    const pages = Array.from({ length: lastPage - firstPage }, (_, idx) => firstPage + idx);
    return (
        <nav className="d-flex justify-content-center my-3">
            <ul className="pagination mb-0">
                <li className={`page-item${page === 0 ? ' disabled' : ''}`}>
                    <button className="page-link" onClick={() => onChange(page - 1)} disabled={page === 0}>이전</button>
                </li>
                {pages.map((p) => (
                    <li key={p} className={`page-item${page === p ? ' active' : ''}`}>
                        <button className="page-link" onClick={() => onChange(p)}>{p + 1}</button>
                    </li>
                ))}
                <li className={`page-item${page === pageCount - 1 ? ' disabled' : ''}`}>
                    <button className="page-link" onClick={() => onChange(page + 1)} disabled={page === pageCount - 1}>다음</button>
                </li>
            </ul>
        </nav>
    );
};

AdminPagination.propTypes = {
    total: PropTypes.number.isRequired,
    page: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
    pageSize: PropTypes.number,
};

export default AdminPagination;
