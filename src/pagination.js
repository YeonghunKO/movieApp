import { $prevBtn, $pages, $nextBtn, $pageContainer } from './utils/doms.js';
import CreatePagination from './utils/createPagination.js';

export default function Pagination({ onPrev, onNext, onEllipsis, onNumber }) {
  // this.state = initialState;
  // this.setState = nextState => {
  //   this.state = nextState;
  //   // current + 5 이상이면  render
  // };

  this.render = (pages, page) => {
    $pageContainer.innerHTML = CreatePagination(pages, page);
  };

  $pageContainer.addEventListener('click', async e => {
    const { nodeName } = e.target;

    if (nodeName === 'A') {
      let buttonContent = e.target.textContent;
      if (isNaN(buttonContent)) {
        switch (buttonContent) {
          // 아래 함수들에 어떤 인자를 pass할 것인가..
          case 'Previous':
            onPrev();
            break;
          case 'Next':
            onNext();
            break;
          case '...':
            onEllipsis(e);
            break;
          default:
            console.log('invalid text');
            break;
        }
      } else {
        buttonContent = parseFloat(buttonContent);
        onNumber(buttonContent);
        // console.log(data);
      }
      // console.log('state.currentPage: ', state.currentPage);
    }
  });
}

/*
기능
 - 첫페이지는 prev 없음, 마지막 페이지는 next없음
 - 최대 20페이지까지만 랜더린
 - 한 번에 5개의 페이지만 랜더링
 - 클릭되면 chosen 클래스 추가되면서 색깔이 바뀜.

로직
 - currentpage:1 이라고 할때 +5되면 render함
 - prev누르면 currentpage-- / next누르면 ++
 - currentPage가 1이면 prev버튼 invisible
 - currentpage === totalpage면 next버튼 invisible
 - 
 
*/
