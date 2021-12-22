import { $pageContainer } from './utils/doms.js';
import { CreatePagination } from './utils/template.js';

export default function Pagination({ onPage }) {
  this.state = {
    total: null,
    current: 1,
  };

  this.setState = nextState => {
    this.state = nextState;
    this.render();
  };

  this.render = () => {
    const { total, current } = this.state;
    $pageContainer.innerHTML = CreatePagination(total, current);
  };

  $pageContainer.addEventListener('click', async e => {
    const { nodeName } = e.target;

    if (nodeName === 'A') {
      let buttonContent = e.target.textContent;
      if (isNaN(buttonContent)) {
        switch (buttonContent) {
          // 아래 함수들에 어떤 인자를 pass할 것인가..
          case 'Previous':
            this.setState({ ...this.state, current: --this.state.current });
            break;
          case 'Next':
            this.setState({ ...this.state, current: ++this.state.current });
            break;
          case '...':
            const { classList } = e.target.parentElement;
            if (classList.value.includes('forward')) {
              this.setState({ ...this.state, current: this.state.current + 2 });
            } else {
              this.setState({ ...this.state, current: this.state.current - 2 });
            }
            break;
          default:
            console.log('invalid content');
            break;
        }
      } else {
        buttonContent = parseFloat(buttonContent);
        this.setState({ ...this.state, current: buttonContent });
      }
      onPage(this.state.current);
    }
  });
}
