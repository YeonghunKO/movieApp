# movieApp
[![Netlify Status](https://api.netlify.com/api/v1/badges/808c7331-83de-4e2f-82e1-490f7d0fcb3b/deploy-status)](https://app.netlify.com/sites/nostalgic-davinci-958000/deploys)

https://developers.themoviedb.org/4/getting-started/authorization 의 api를 이용해 영화 검색 서비스를 만들어봄.

pagination 같은 경우 컴포넌트로 따로 빼서 구현하고 싶었음.

[DEMO는 여기로!](https://movie-app-vanila-js.netlify.app)

# 기능
- 검색
- 스켈레톤
- 페이지네이션
- 정렬
- 라우터를 통한 앞,뒤로가기 버튼


# 배운점

## CSS

1. flex center 적용되어있는 형제중에 한쪽만 위치 조정하려면 조정하려는 쪽 margin-top을 변경하면 됨.(title margin-top 변경 참고)

2. A를 hover 했을 때 변경하고 싶은 element가 있다면 아래처럼 하면 됨.

```css
.A:hover element {
    blah
    blah
}
```

3. movie의 overflow를 hidden으로 바꾸었기 때문에 overview가 올라오는 효과를 나타낼 수 있는것.

   - score를 movie 최상단에 위치하려고 했으나 hidden 때문에 score 상단이 가려졌다. 구글링 해본 결과 부모의 overflow를 override하는 방법은 없는 것으로 밝혀졌다. 그래서 결국 info 오른쪽 중간에 위치하게 했다.

4. 자식이 absolute이면 바로 직속 부모가 relative인지 확인하고 아니면 그 위의 부모로 올라간다.

5. `.movie .score.animated-bg`가 `.score.animated-bg` 보다 더 점수가 높아서 우선순위가 높다. 고로 `.movie .score.animated-bg`라고 해주고 property를 적용해보자.

6. `.poster`에다가 `height:10%` 라고 아무리 해봤자 반응이 없었다. 그이유는 `.poster`부모 태그에 height가 명확하게 px,em,rem etc로 지정되어있지 않아서이다. (반면 width는 부모의 width가 없으면 viewport의 width를 따른다) 그래서 `.movie`에다가 height를 지정해주던가 아님 `.poster`에다가 height를 지정해줘야한다.

`https://stackoverflow.com/questions/5657964/css-why-doesn-t-percentage-height-work` 참고!

7. pagination에서 prev를 클릭했는데 계속 자식의 span아니면 fas아이콘이 클릭이 되더라.. 원래 부모인 prev가 클릭이 되야하는데! 그래서 구글링 해본 결과 아래 코드를 입력하면 자식 요소의 클릭이벤트가 무효화 되면서 부모만 클릭되게 할 수 있다

```css
.prev *,
.next * {
  pointer-events: none;
}
/* 별표는 모든 자식을 뜻함 */
```

8. `[blahblah]{}`는 `blahblah` 라는 attribute를 가지고 있는 태그를 의미(pagination 구현하다가 알게 된것) JS에선 `document.querySelectorAll('[href]')` 라고 표현가능(href attribute를 갖고 있는 node를 선택)

9. 버튼을 눌렀을때 색깔바뀌는 거 JS말고 css에서 focus선택자로 구현가능.

10. 기본적으로 개발자 도구에서는 hover된 상태에서의 스타일을 보여주지 않고 있다. hover되었을 때 적용되는 스타일을 볼려면 개발자 도구 오른쪽 상단에 '필터' 옆에 ':hov' 를 누르면 된다.

    - 보니깐 pagination의 hover가 상속되어서 nav까지 opaciity가 적용되었다. 따라서 아래의 코드를 적용시켜줌

    ```css
    ul li:hover:not(nav .dropdown) {
      opacity: 0.7;
    }
    ```

11. 드랍다운 [링크](https://codepen.io/codypearce/pen/PdBXpj?editors=0100) 참고

12. a태그가 아닌 .movie 에다가 scale을 적용해줘야함. 왜냐면 sort이후에 a 태그는 인라인 스타일이 적용되어 scale이 덮어씌어져 효력을 잃어버림.

그리고 transition같은 경우 호환성을 위해 아래 코드와 같이 적용 시켜 줄 것.

```css
transition: transform 0.35s;
-o-transition: transform 0.35s;
-moz-transition: transform 0.35s;
-webkit-transition: transform 0.35s;
```

## JS

1. API 사용법을 알고 싶으면 `https://developers.themoviedb.org/3/getting-started/introduction` 에 들어가서 검색란에 내용을 검색하면 된다.

2. closest는 오로지 내 조상들에게만 적용, 조상들의 형제 자매에겐 적용안됨.

3. mix에서 `Uncaught (in promise) TypeError: Cannot read properties of null (reading 'removeChild')` 에러가 뜨는 이유는 mix안에 target이 ajax call 하기 전의 target의 데이터를 가지고 ajax call하고 난뒤의 target에 적용하려고 하기 때문에 그렇다.

예를 들면, ajax call하기 전의 main의 콘텐츠가 `dbType:trend ,page:1`이라고 가정하자. 그러나 두번째 페이지를 누르거나 카테고리를 바꾸면 target도 그에 따라서 바뀌어야 하는 데 mix에 저장되어있는 target은 여전히 `dbType:trend ,page:1` 이다. 따라서 trend안에 있는 target들을 하나하나 main에서 찾고 옮겨야하는 mixitup에서 오류가 발생하는 것이다. 찾을 수 없으니 null이라고 뜨는 것 같다.

따라서, 그전의 mix instance를 없애고 새로 mix를 만들고 target을 설정해줘야한다. 그때 필요한 메소드가 `.destroy()` 이다! (mixitup api 문서에 나와 있다.) 그래서 페이지, 카테고리가 바뀔때마다 destroy를 해주어 instance를 새로 갱신해주었다.

[참고문서](https://www.sitepoint.com/animated-filtering-sorting-mixitup/)

4. mixitup에서 `o.tolowercase is not a function.` 라는 에러가 뜨면 data attribute에서 뭐가 빠졌다는 뜻. 나같은 경우, date가 없는 경우 이 에러가 떴다. 따라서, template에서 `$anchor.dataset.date = release_date ? release_date : 0;` 해줌으로써 버그를 해결 할 수 있었다.

5. New Custome, Dispatcher , history API 를 이용한 라우팅. 아티클로 정리함. [요기]()

6. `cannot destructure total_pages of movieData as it is undefined(main.js 100줄 쯤)` 라는 오류가 떴다. 이번에는 movieData를 로그하거나 showMoviesByDb에 있는 movieData를 로그하지 않고 차근차근 말로 설명하면서 거슬러 올라갔다. 그러니깐, showMoviesByDb에서 movieData에 값이 할당 안되었다는 사실을 추측할 수 있었다.

자세히 살펴보니 if에 dbKey가 있으면 그냥 db에 있는 걸 꺼내서 showMoviesByObj를 통해서 보여주기만 하고 movieData에 아무것도 할당하지 않았기 때문에 undefined가 리턴된다는 것을 알 수 있었다!!

이전엔, 그냥 `차분하게` 문제의 원인을 파악하려 하지 않고 무조건 로그만 찍어보면서 주먹구구식으로 버그를 찾아내려고 했는데 차분하게 거슬러 올라가보니 생각보다 쉽게 버그를 찾아냈다!! 요런식으로 문제 원인을 생각하는 연습을 해보자!!

7. 검색하고 나서(검색어가 'well'이라고 하자) 앞뒤로 가기를 누른다음에 다시 page를 누르면 url에 query가 빠지고 dbType에 query가 들어간다.(well?page=2 요런식으로) 그리고 ` Cannot destructure property 'results' of 'movieData' as it is undefined.` 가 뜬다.(dbType:well 이기 때문에 getDataByCurrentDbType함수에서 switch에 걸리지 않는 것임. 그래서 undefined가 리턴 됨.)

onPage에서 dispatch를 잘못하고 있는거 같다.

onPage에서 dbType이 searching이 되어야 하는데 'well'이 되어있다. 즉 setState를 잘못 해줬다는 말이된다.

그럼 onRoute에서 오류가 발생한다는 것! 보니깐 `dbKey === 'searching'`이 아니라 `dbType === 'searching'` 이 되어야 한다. 따라서 dbType을 router.js - popstate할때 넘겨주었다.

요런식으로, 현재 현상을 차분히 생각해보면 그 현상에 영향을 끼치는 함수, 변수를 찾아가게 된다. 그럼 실마리가 잡히기 시작하게 될것이다.Qqoyo
