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
      console.log(dbType, currentPage, searchTerm);
      if (dbType === 'searching') {
        onRoute({ dbKey: searchTerm, currentPage });
      } else {
        onRoute({ dbKey: dbType, currentPage });
      }
    } else {
      onRoute({ dbKey: 'trend', currentPage: 1 });
    }
  });
};

export { routerDispatcher, initRouter };
