import { $prevBtn, $pages, $nextBtn, $pageContainer } from './utils/doms.js';

export default function Pagination({ initialState, onButton }) {
  this.state = initialState;
  this.setState = nextState => {
    this.state = nextState;
  };

  this.render = () => {};

  $pageContainer.addEventListener('click', e => {
    const { className } = e.target;
    const buttonNameArr = ['prev', 'next', 'button'];
    const isBtnClicked = buttonNameArr.some(name => className.includes(name));
    if (isBtnClicked) {
      console.log(className);
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
