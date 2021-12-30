const routerDispatcher = ({ dbType, searchTerm, currentPage }) => {
  window.dispatchEvent(
    new CustomEvent('router-change', {
      detail: {
        dbType,
        searchTerm,
        currentPage,
      },
    })
  );
};

const initRouter = onRoute => {
  window.addEventListener('router-change', event => {
    const { dbType, searchTerm, currentPage } = event.detail;
    const pushData = {
      dbType,
      searchTerm,
      currentPage,
    };
    window.history.pushState(
      pushData,
      null,
      `?${dbType}${searchTerm ? `?query=${searchTerm}` : ''}${
        currentPage ? `?page=${currentPage}` : ''
      }`
    );
  });

  window.addEventListener('popstate', event => {
    if (event.state) {
      const { dbType, currentPage, searchTerm } = event.state;
      // console.log(
      //   'dbType:',
      //   dbType,
      //   '\ncurrentPage:',
      //   currentPage,
      //   '\nsearchTerm:',
      //   searchTerm
      // );
      if (dbType === 'searching') {
        onRoute({ dbKey: searchTerm, currentPage, dbType });
      } else {
        onRoute({ dbKey: dbType, currentPage, dbType });
      }
    } else {
      onRoute({ dbKey: 'trend', currentPage: 1, dbType: 'trend' });
    }
  });
};

export { routerDispatcher, initRouter };
