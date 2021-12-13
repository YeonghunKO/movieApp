# movieApp
https://developers.themoviedb.org/4/getting-started/authorization 의 api를 이용해 영화 검색 서비스를 만들어봄.

# 기능
- 검색
- 스켈레톤
- 페이지네이션
- 정렬


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

## JS

1. API 사용법을 알고 싶으면 `https://developers.themoviedb.org/3/getting-started/introduction` 에 들어가서 검색란에 내용을 검색하면 된다.
