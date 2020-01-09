import React from 'react';

const Pagination = ({
  queryCur,
  sortType,
  users,
  actAttr,
  activePage,
  maxRowsPerPage,
  activeUser,
  setActivePage
}) => {
  const handlePrevPage = e => {
    setActivePage(activePage - 1);
  };

  const handleNextPage = e => {
    setActivePage(activePage * 1 + 1);
  };

  const handlePageChange = (e, page) => {
    setActivePage(page); 
  };

  const handleFirstPage = e => {
    setActivePage(1);
  };

  const handleLastPage = e => {
    setActivePage(
      parseInt(
        (activeUser(queryCur, sortType, users, actAttr).length - 1) /
          maxRowsPerPage
      ) + 1
    );
  };

  const setPagination = (pageLen, curPage) => {
    const neighborLen = 1;
    const actLen = 2 * neighborLen + 1; 
    console.log("pageLen:" + pageLen + " actLen:" + actLen);
    if (pageLen < actLen * 2) {
      return [...Array.from({ length: pageLen }, (v, k) => k + 1)];
    } else if (curPage < actLen + 1) {
      return [
        ...Array.from({ length: actLen }, (v, k) => k + 1),
        '...',
        pageLen
      ];
    } else if (curPage > pageLen - actLen) {
      return [
        1,
        '...',
        ...Array.from({ length: actLen }, (v, k) => k + pageLen - actLen + 1)
      ];
    } else {
      return [
        1,
        '...',
        ...Array.from(
          { length: actLen },
          (v, k) => k + curPage * 1 - neighborLen
        ),
        '...',
        pageLen
      ];
    }
  };

  return (
    <div className='page-bar'>
      <ul className='page-list'>
        <li>
          <button
            className='page-btn'
            onClick={e => handleFirstPage()}
            disabled={activePage < 2}
          >
            {'<<'}
          </button>
        </li>
        <li>
          <button
            className='page-btn'
            onClick={e => handlePrevPage()}
            disabled={activePage < 2}
          >
            {'<'}
          </button>
        </li>
        {setPagination(
          parseInt(
            (activeUser(queryCur, sortType, users, actAttr).length - 1) /
              maxRowsPerPage
          ) + 1,
          activePage
        ).map(page => {
          if (page === '...') {
            return (
              <li>
                <div>...</div>
              </li>
            );
          } else {
            return (
              <li key={page}>
                <button
                  className={
                    'page-btn ' +
                    (page.toString() === activePage.toString()
                      ? 'btn-active'
                      : 'btn-disactive')
                  }
                  onClick={e => handlePageChange(e, page)}
                >
                  {page}
                </button>
              </li>
            );
          }
        })}
        <li>
          <button
            className='page-btn'
            onClick={e => handleNextPage()}
            disabled={
              activePage >
              parseInt(
                (activeUser(queryCur, sortType, users, actAttr).length - 1) /
                  maxRowsPerPage
              )
            }
          >
            {'>'}
          </button>
        </li>
        <li>
          <button
            className='page-btn'
            onClick={e => handleLastPage()}
            disabled={
              activePage >
              parseInt(
                (activeUser(queryCur, sortType, users, actAttr).length - 1) /
                  maxRowsPerPage
              )
            }
          >
            {'>>'}
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Pagination;