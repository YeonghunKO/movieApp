export default function CreatePagination(pages, page) {
  page = parseInt(page);
  pages = parseInt(pages);

  let str = '<ul>';
  let active;
  let pageCutLow = page - 1;
  let pageCutHigh = page + 1;

  if (page > 1) {
    str += `
      <li class="page-item previous no">
        <i class="fas fa-chevron-left"></i>
        <a>Previous</a>
      </li>`;
  }

  if (pages < 6) {
    for (let p = 1; p <= pages; p++) {
      active = page == p ? 'active' : 'no';
      str += `<li class="${active}"><a>${p}</a></li>`;
    }
  } else {
    if (page > 2) {
      str += '<li class="no page-item"><a>1</a></li>';
      if (page > 3) {
        // inline 이벤트가 안먹힌다.. createPagination이 전역에 없어서 그런듯..
        // 결국 addEvent로 구현해야하나? 그래도 한번쯤은 inline으로 해보고 싶었는데...
        str += `
          <li class="out-of-range backward">
            <a>...</a>
          </li>`;
      }
    }

    if (page <= 2) {
      pageCutLow = 1;
      pageCutHigh = 4;
    }

    if (page >= pages - 1) {
      pageCutLow = pages - 3;
      pageCutHigh = pages;
    }

    for (let p = pageCutLow; p <= pageCutHigh; p++) {
      active = page == p ? 'active' : 'no';
      str += `
        <li class="${active}">
          <a>${p}</a>
        </li>`;
    }

    if (page < pages - 1) {
      if (page < pages - 2) {
        str += `
          <li class="out-of-range forward">
            <a>...</a>
          </li>`;
      }
      str += `
        <li class="page-item no">
          <a>${pages}</a>
        </li>`;
    }
  }

  if (page < pages) {
    str += `
      <li class="page-item next no">
        <a>Next</a>
        <i class="fas fa-chevron-right"></i>
      </li>`;
  }

  str += '</ul>';
  return str;
  // $pageContainer.innerHTML = str;
}
