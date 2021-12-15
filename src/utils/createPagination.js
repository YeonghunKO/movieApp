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
        str += `
          <li class="out-of-range backward">
            <a onclick="createPagination(${pages},${page - 2})">...</a>
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
            <a onclick="createPagination(${pages},${page + 2})">...</a>
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
