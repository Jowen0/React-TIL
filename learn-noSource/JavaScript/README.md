# JavaScript

## JQuery
기본문법   
(https://soft91.tistory.com/9)   

선택자   
(https://www.zerocho.com/category/jQuery/post/57a9a371e4bc011500624ba3)

## await vs return vs return await: 비동기 이해하기
#### https://ooeunz.tistory.com/47

## 옵셔널 체이닝(optional chaining) '?.'
#### https://ko.javascript.info/optional-chaining
?. - 앞의 평가 대상이 undefined나 null이면 평가를 멈추고 undefined를 반환 // ?.는 존재하지 않아도 괜찮은 대상에만 사용해야 합니다.   
**ES6부터 추가**

## IE에서도 사용 가능한 이미지 다운로드 - feat a Tag
#### https://gracefullight.dev/2017/01/16/javascript%EB%A1%9C-%EB%A1%9C%EC%BB%AC%EC%97%90-%EC%9D%B4%EB%AF%B8%EC%A7%80-%EB%8B%A4%EC%9A%B4%EB%A1%9C%EB%93%9C/
#### https://blog.naver.com/PostView.nhn?blogId=okskmk2&logNo=221546158662&categoryNo=148&parentCategoryNo=0&viewDate=&currentPage=1&postListTopCurrentPage=1&from=postView
P.S. 이미지 클릭하면 다운로드   
(https://alikong.tistory.com/12)

P.S. Blob 이해   
(https://heropy.blog/2019/02/28/blob/)   

a Tag download 속성 - IE, Edge, Safari, Opera 는 지원을 안한다   
(https://mine-it-record.tistory.com/445)

## a Tag rel 속성
#### http://www.tcpschool.com/html-tag-attrs/a-rel

## a Tag href="#", #none, javascript:void(0);
#### https://minimal-dev.tistory.com/28
a Tag 이동 기능 무력화

## ClassName()으로 Element요소를 가져올 때 유의점
#### https://moalgong.tistory.com/25

## 이미지 존재여부 확인
#### https://optionbox.tistory.com/175
#### https://www.fabiofranchino.com/log/load-an-image-with-javascript-using-await/

방법 1. new Image() && Promise
image 객체를 이용해서 onload, onerror에 따라 Promise 객체 반환
단점: 이미지를 로딩하기 때문에 많이 사용하면 성능 이슈 발생
보완: 썸네일 이미지 사용?
```
// 이미지 존재여부 확인
const findImage = (imageSrc) => {

    return new Promise(resolve => {
        const img = new Image();
        img.src = imageSrc;
        img.onload = () => {
            resolve({ useImage: true });
        }
        img.onerror = e => {
            resolve({ useImage: false });
        }
    });
};

// 이미지 사용가능 여부
const checkImage = async (calendarArr) => {

    // 이미지 존재여부 병렬 호출
    const responseArr = await Promise.all(calendarArr.map(item => DownloadService.findImage("/images/download/" + item.downloadFileDate + donwloadInfos[2].imgPath)));

    const calendarData = responseArr.map( (response, idx) => ({...calendarArr[idx], useImage: response.useImage}));
    setCalendar(prev => calendarData);
};
```

방법 2. Axios
```
// 이미지 존재여부 확인
const findImage = (imageSrc) => {

    return useAxios.get("/images/download2/" + imageSrc)
    .then(res => ({useImage: true}))
    .catch(e => ({useImage: false}));

};

// 이미지 존재여부 병렬 호출
const response = await Promise.all(calendarInfos.map(item => DownloadService.findImage(item.thumNailSrc)));
const calendarData = response.map( (resObj, idx) => ({...calendarInfos[idx], useImage:resObj.useImage}));  


```
방법 3. require - Only node  
※ Deprecated!! - require는 로컬을 확인하기 때문에 서버에 있는 이미지 존재 여부를 파악하는게 아니다.(서버에서 배포한다고 해도 배포 소스 내부에서 존재여부를 확인하는 것!)
[해결방법?: PUBLIC_URL](https://wonblog.tistory.com/22)
```
// 이미지 존재여부 확인
const findImage = (imageSrc) => {

    try {
        const test = require("../../public/images/download2/" + imageSrc);
        console.log(test);
        return {useImage: true};
    } catch (e) {
        console.log(e);
        return {useImage: false};
    };

};
```

## 이미지 lazy 로딩 - IntersectionObserver API
#### https://pks2974.medium.com/intersection-observer-%EA%B0%84%EB%8B%A8-%EC%A0%95%EB%A6%AC%ED%95%98%EA%B8%B0-fc24789799a3
#### https://been.tistory.com/25?category=517363
#### https://helloinyong.tistory.com/297
#### https://velog.io/@meganatc7/Intersection-Observer-%EB%9E%80#1-%ED%98%B8%EC%B6%9C-%EC%88%98-%EC%A0%9C%ED%95%9C-%EB%B0%A9%EB%B2%95%EC%9C%BC%EB%A1%9C-debounce-throttle%EC%9D%84-%EC%82%AC%EC%9A%A9%ED%95%98%EC%A7%80-%EC%95%8A%EC%95%84%EB%8F%84-%EB%90%9C%EB%8B%A4

IntersectionObserver API는 많은 브라우저에서 지원하지는 않기 때문에
Polyfill 라이브러리와 함께 사용해야한다.

커스텀 훅으로 IntersectionObserver 객체 생성해서 사용
```
// useIntersectionObserver.js
// 화면에 보이지 않는 컴포넌트 로딩 지연
const useIntersectionObserver = () => {
    
    // 컴포넌트가 20% 정도 화면에 보일때 로딩
    const options = { threshold: 0.1 };

    const callback = (entries, observer) => {

        entries.forEach(entry => {

            // 뷰 포트 안에 컴포넌트가 들어온 경우
            if (entry.isIntersecting) {

                // 이미지 data-src를 src로 변경
                entry.target.src = entry.target.dataset.src;

                // 로딩이 시작 됐으니 컴포넌트 관찰 제거
                observer.unobserve(entry.target);
            }
            else { };
        });
    };

    const observer = new IntersectionObserver(callback, options);

    return observer;

}

export default useIntersectionObserver;

// domain.js
// 이미지 지연로딩에 사용할 intersectionObserver 객체
const observer = useIntersectionObserver();
return (
    <Image imgSrc={"/images/download/" + item.thumNailSrc} observer={observer} index={index} />
);

// Image.js
// Image 컴포넌트에 observer 객체 전달해서 해당 컴포넌트 구독
const Image = ({imgSrc, observer, index}) => {

    const imgRef = useRef();
    const placeholderSrc = "https://ik.imagekit.io/demo/img/image5.jpeg?tr=w-1,h-1:w-400,h-300";
    const [src, setSrc] = useState(imgSrc);

    useEffect(() => {
        
        // 5개 이상 이미지는 placeholder 이미지 이용
        if(index > 3) {
            // imgTag 관찰 - 스크롤 내리면 이미지 로딩
            observer.observe(imgRef.current);
            setSrc(prev => placeholderSrc);
        };
    }, [index, imgSrc, observer]);

    return ( 
        <img src={src} data-src={imgSrc} ref={imgRef} alt="" />
     );
}
 
export default Image;

```
[P.S.커스텀훅으로 사용](https://ichi.pro/ko/reacteseo-jeomjinjeog-eulo-imijilodeu-18127722463610)
[P.S. 이미지 최적화 - IntersectionObserver API 예제](https://velog.io/@hustle-dev/%EC%9B%B9-%EC%84%B1%EB%8A%A5%EC%9D%84-%EC%9C%84%ED%95%9C-%EC%9D%B4%EB%AF%B8%EC%A7%80-%EC%B5%9C%EC%A0%81%ED%99%94#css-sprite)

## PC / 모바일 구분하는 법
#### https://studyhardgogo.tistory.com/139
지금까지 찾은 방법으로는 이 방법이 최선!! (단, Linux는 구분하지 못한다)

P.S. (모바일 기종으로 구분 - Nest Hub Max는 포함 X)[https://nm-it-diary.tistory.com/73]

## 구글 태그 매니저 && gtag
#### https://www.datachef.co.kr/post_ga_tip/?idx=7438407&bmode=view

글로벌 사이트 태그(gtag)는 방문자 데이터를 수집하기 위해 자바스크립트로 된 추적코드를 사용하는 방식이다.
구글 태그 매니저와는 다른 개념으로 구글 태그 매니저는 구글 애널리틱스 또는 다른 제품의 태그를 관리하기 위한 웹 소프트웨어이다.

의문점: 
회사에서 사용한 코드는 구글 태그 매니저를 이용해서 gtag를 사용한 것 처럼 보였다. >> GTM으로 gtag를 관리하는 방식이지 않을까 예상된다.
```
<!-- Global site tag (gtag.js) - Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=UA-{발급 받은 Key}"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag() { dataLayer.push(arguments); }
      gtag('js', new Date());

      gtag('config', {발급 받은 Key});
    </script>
```

결론 >> 구글 태그 매니저(GTM)은 관리 소프트웨어이고, gtag는 라이브러리이다.

## callback 함수 내부 값을 외부로 꺼내는 방법 - 제목을 어떻게 지을지 모르겠음
여러 가지 공부를 하다보니 callback 함수 내부에 있는 값을 꺼내는 방법을 생각하게 됐는데
아무리 해도 callback 함수 내부에서만 값을 사용할 수 있었다.
그러다가 이미지 파일 존재 여부 때 공부했던 Promise 반환 방법이 생각나서 활용해보았다.

ex) geolocation API 이용 시
```
const successGetPositon = async (positon) => {
    const positionObj = {lat: positon.coords.latitude, lng: positon.coords.longitude};
    return positionObj;
};

const getLocation = () => {

    return new Promise(resolve => {
        navigator.geolocation.getCurrentPosition( (posion) => resolve(successGetPositon(posion)));
    });
};

const testFn = async () => {
    const currentLocation = await getLocation();
    console.log(currentLocation);
};
```

이렇게 하면 callback 함수에 있는 값을 스코프 밖으로 빼내서 사용할 수 있다.   
단점: 보안에 취약해질 수 도 있다? // 보일러 플레이트가 발생한다.

## Closure
#### https://unikys.tistory.com/309