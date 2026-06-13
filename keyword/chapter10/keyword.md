위의 영상을 보고 **`useCallabck`과 `memo`에**대해 정리해주세요!

또한 아래 공식문서 또한 읽어보시면서 부족한 내용을 보충해서 정리해주세요!

https://react.dev/reference/react/useCallback

https://react.dev/reference/react/memo

- **`useCallabck`** 에 대하여 정리해주세요! 🍠
    
    # **`useCallabck`** 에 대하여 정리해주세요! 🍠
    
    ---
    
    - **`useCallabck`** 이 무엇인지? 🍠
        
        # **`useCallabck`** 이 무엇인지?
        
        ---
        
        - 함수(콜백)를 “메모이제이션” 한다는 게 무슨 뜻인지?
            
            js에서 함수는 객체이다. 리엑트에서 컴포넌트가 리렌더링 될때 선언된 함수들은 새로운 메모리를 할당 받는다.
            이때 함수를 메모이제이션 한다는 것은 처음 할당 받은 메모리 값을 가상 dom에 저장하여 재사용 하므로서 새로운 메모리 할당을 방지한다 라는 의미이다
            하지만 값이 변한다면 새로운 메모리를 할당 받아 리렌더링 해야한다
            
        - 언제 새 함수를 만들고, 언제 기존 함수를 재사용하는지?
            
            컴포넌트가 리렌더링될 때 의존성 배열이나 prop이 동일하다면 저장하였던 기존 메모리 주소의 객체를 꺼내어 사용 하고 전달 받은 데이터의 값이 달라졌거나 주소값이 달라졌다면 새로운 함수를 만들어 업데이트 해야한다 
            
    - 왜 **`useCallabck`**을 사용하는지? 🍠
        
        # 왜 **`useCallabck`**을 사용하는지?
        
        ---
        
        - **불필요한 리렌더링 방지**와 어떤 관련이 있는지
            
            애초에 주소값만 바뀌는것으로는 리렌더링이 일어나지 않는다 하지만 주소값이 바뀌었다면 리엑트는 값이 바뀌었을지 모르니 비교를 위해 가상 DOM을 생성하게 된다 
            이때 useCallback은 자식 컴포넌트에게 전달하는 주소값을 고정하여 이 가상 DOM 생성을 억제하여 불필요한 자식 컴포넌트 함수 실행을 방지해 연산을 줄인다
            
        - 성능 최적화 관점에서 얻는 이득 vs 남용했을 때의 오버헤드
            
            만약 자식 노드의 연산 비용이 크다면 useCallback을 사용해 스킵한 가상 dom 생성만큼 큰 이득을 얻을 수 있다
            
            하지만 usecallback을 선언한것 자체가 이 함수를 호출하는 비용과 가상 dom에 메모한 값을 저장하는 비용을 포함하고 있기에 가벼운 컴포넌트에서 사용하는건 오히려 낭비가 될 수 있다
            
    - **`useCallabck`** 기본 사용법 🍠
        
        # **`useCallabck`** 기본 사용법
        
        ---
        
        - **`useCallabck`**은 어떻게 사용하나요? (코드)
            
            ```tsx
            // 코드를 작성해주세요.
            import { useState, useCallback } from 'react';
            
            export function Counter() {
              const [count, setCount] = useState<number>(0);
              const [text, setText] = useState<string>("");
            
              // 규칙: 함수 내부에서 참조하는 모든 상태(state)와 props는 deps 배열에 명시해야 함
              const handleIncrease = useCallback(() => {
                setCount((prev) => prev + 1); // 함수형 업데이트를 쓰면 count 상태에 대한 의존성을 제거할 수 있음
              }, []); // 의존성이 없으므로 이 함수는 마운트 시 최초 1회만 생성되고 주소 고정
            
              const handlePrintLog = useCallback(() => {
                console.log(`현재 텍스트: ${text}`);
              }, [text]); // text가 바뀔 때만 이 함수는 새 주소값을 가짐
            }
            ```
            
        - `deps` 배열에 무엇을 넣어야 하는지 규칙
            
            함수 내부에서 참조하는 모든 상태(state)와 props는 deps 배열에 명시해야 함
            
        - 의존성 변경 시 콜백이 어떻게 다시 만들어지는지
            
            `text` 변수가 `"A"`에서 `"AB"`로 변경되면, 리액트는 렌더 단계에서 `[ "A" ] === [ "AB" ]` 비교 결과가 `false`임을 감지한다. 즉시 저장소의 주소를 새로 생성된 함수의 주소로 교체하므로, 최신 상태인 `"AB"`를 안전하게 참조할 수 있게 된다
            
    - **`useCallabck`**에서 중요한 개념 🍠
        
        # **`useCallabck`**에서 중요한 개념
        
        ---
        
        - **참조 동일성(reference equality)** 이 왜 중요한지 (=== 비교)
            
            리액트는 JavaScript의 얕은 비교(`Object.is`)를 기반으로 작동합니다. `props`로 전달된 객체나 함수가 내용물이 같아도 주소값(`===`)이 다르면 리액트 시스템은 다른 데이터로 인지한다. `useCallback`은 자식의 `===` 를 깨뜨리지 않기 위해 존재한다
            ****
            
        - 클로저와 상태: 콜백 안에서 state, props를 사용할 때 주의할 점
            
            `useCallback`은 자바스크립트의 **클로저(Closure)** 특성을 이용한다. 함수가 선언될 당시 주변의 환경(변수, 상태 등)을 기억(캡처)하는 성질이다. 따라서 콜백 내부에서 state와 props를 사용하더라도 외부값을 참조하지 않는다면 선언 할 때의 값만 가지고 있기에 실제 값과 불일치 하는 현상이 발생 가능하다
            
        - **stale closure(낡은 값 캡처)** 문제는 언제 생기는지, 어떻게 피하는지
            - **발생 원인:** 만약 함수 내부에서 외부 상태인 `count`를 사용하는데, `useCallback`의 의존성 배열을 `[]`로 비워두었다
            - **현상:** 이 함수는 컴포넌트가 처음 만들어졌을 때의 `count` 값(즉, `0`)만을 기억한다. 아무리 버튼을 눌러 상태를 올려도 함수를 실행하면 계속 `0`만 출력하거나 상태를 `0 + 1`로만 고정시키는 버그가 발생하게 된다. 이를 Stale Closure(낡은 클로저)라고 부른다.
            - **해결책:** 함수 내부에 사용된 외부 스코프의 변수를 `deps` 배열에 빼놓지 않고 정직하게 적어주거나, `setCount(prev => prev + 1)` 같은 함수형 업데이트를 활용해 외부 상태에 대한 참조 자체를 차단해야 한다.
    - **`useCallabck`**을 사용한 콜백 메모이제이션 예시 🍠
        
        # **`useCallabck`**을 사용한 콜백 메모이제이션 예시
        
        ---
        
        - 부모에서 자식으로 콜백을 내려줄 때, `onClick`, `onChange` 같은 핸들러를 **`useCallabck`** 없이 넘겼을 때와 **`useCallabck`**으로 감싸서 넘겼을 때 차이
            
            ```jsx
            // 1. useCallback이 없을 때
            function Parent() {
            const [state, setState] = useState(0);
            // 부모가 리렌더링될 때마다 매번 새 주소 생성 ➡️ 자식의 React.memo 무력화
            const handleClick = () => console.log("click");
            return <HeavyChild onClick={handleClick} />;
            }
            ```
            
            ```jsx
            // 2. useCallback으로 보호할 때
            function Parent() {
            const [state, setState] = useState(0);
            // 부모가 리렌더링되어도 주소값 영구 고정 ➡️ 자식은 리렌더링(함수 실행) 단계를 통째로 스킵
            const handleClick = useCallback(() => console.log("click"), []);
            return <HeavyChild onClick={handleClick} />;
            }
            ```
            
        
    - 이벤트 핸들러 / 비동기 로직에서 **`useCallabck`** 예시 🍠
        
        # 이벤트 핸들러 / 비동기 로직에서 **`useCallabck`** 예시
        
        ---
        
        - 버튼 클릭 시 API 호출하는 핸들러를 `useCallback`으로 감싸는 패턴
            
            ```jsx
            const fetchData = useCallback(async () => {
            const res = await fetch(/api/data);
            return res.json();
            }, []); // 주소 고정
            ```
            
        - `useEffect` 안에서 의존성으로 콜백을 넣을 때 패턴
            
            ```jsx
            useEffect(() => {
            fetchData().then(data => console.log(data));
            }, [fetchData]); // fetchData의 주소가 고정되어 있으므로 useEffect가 최초 1회만 실행됨
            ```
            
        - 폼 제출 핸들러, 디바운스/스로틀 함수와 함께 사용할 때
            
            
            디바운스 함수는 내부적으로 타이머 주소 상태를 유지해야 하므로, 리렌더링 시 함수가 재생성되면 타이머가 매번 초기화되어 디바운스가 먹통이 됨. `useCallback`과의 결합이 필수적
            
            ```jsx
            const handleSearch = useCallback(
            _.debounce((query: string) => {
            console.log("API 요청 보냄:", query);
            }, 500),
            [] // 디바운스 함수 자체의 주소값을 고정하여 타이머 메커니즘을 보존
            );
            ```
            
- **`memo`**에 대하여 정리해주세요!🍠
    
    # **`memo`**에 대하여 정리해주세요!🍠
    
    ---
    
    - **`memo`**가 무엇인지? 🍠
        
        # **`memo`**가 무엇인지?
        
        ---
        
        `React.memo`는 컴포넌트의 성능 최적화를 위한 고차 컴포넌트이다. 컴포넌트 함수를 이 장치로 감싸면, 리액트는 해당 컴포넌트를 호출하기 전에 전달된 `props`의 주소값들을 하나하나 비교한다.
        
    - 왜 **`memo`**를 사용하는지? 🍠
        
        # 왜 **`memo`**를 사용하는지?
        
        ---
        
        부모 컴포넌트가 변경될 때 자식 컴포넌트의 가상 DOM 뼈대 비교를 위해 자식 함수를 무조건 실행시키는 CPU 연산 낭비 과정 자체를 통째로 생략하기 위함. `props`가 안 바꼈다면 뒤쪽의 연산(가상 DOM 생성, 비교) 과정을 실행조차 하지 않고 메모리에 있던 이전 렌더링 결과(Vnode)를 그대로 재사용한다.
        
    - **`memo`** 기본 사용법 🍠
        
        # **`memo`** 기본 사용법
        
        ---
        
        ```jsx
        interface ChildProps {
        title: string;
        onShare: () => void;
        }
        // React.memo로 컴포넌트를 감싸서 보디가드를 세움.
        export const ChildComponent = React.memo(function ChildComponent({ title, onShare }: ChildProps) {
        console.log("자식 컴포넌트 함수가 실행되었습니다! (이 로그가 안 떠야 최적화 성공)");
        return (
        <div>
        <h3>{title}</h3>
        <button onClick={onShare}>공유하기</button>
        </div>
        );
        });
        ```
        
    - **`memo`**를 언제 쓰면 좋은지 / 안 좋은지 🍠
        
        # **`memo`**를 언제 쓰면 좋은지 / 안 좋은지
        
        ---
        
        ### 🟢 언제 쓰면 좋은가? (효과 만점)
        
        1. **순수 UI 컴포넌트:** `props`가 같다면 항상 100% 동일한 화면을 뱉어내는 순수 함수 형태의 컴포넌트일 때.
        2. **무거운 컴포넌트:** 내부에 무거운 루프 연산이 있거나, 하위에 수많은 자식 태그들을 품고 있어서 한 번 실행될 때 비용이 큰 컴포넌트일 때.
        3. **부모만 자주 바뀌는 구조:** 부모 컴포넌트는 타이머나 타이핑 상태 때문에 0.1초마다 리렌더링되는데, 자식 컴포넌트의 데이터는 고정되어 있을 때.
        
        ### ❌ 언제 쓰면 안 되는가? (성능 저하 및 무의미)
        
        1. **대부분의 가벼운 컴포넌트:** 컴포넌트 구조가 단순한 `<div>{text}</div>` 정도라면, 가상 DOM을 만들고 비교하는 속도가 리액트가 `props` 주소값들을 전수조사하는 속도와 별 차이가 없을 수 있다. 오히려 메모이제이션 비용 때문에 손해를 보게 된다.
        2. **`props`가 렌더링할 때마다 항상 바뀌는 컴포넌트:** 부모가 자식에게 매번 바뀌는 `count` 데이터나 최적화되지 않은 새 객체 주소를 넘겨준다면, `React.memo`는 매번 주소가 바뀐 것을 확인하고 결국 자식 함수를 실행하게 된다. 어차피 바뀔 것인데 값이 바뀌었나 확인을 하고 함수도 실행되니 큰 손해가 발생한다
        3. **컴포넌트 내부에 자체 state가 자주 바뀌는 경우:** `props`가 고정되어 있어도 컴포넌트 내부의 `useState`가 바뀌면 `React.memo` 를 했어도 함수 재실행은 발생한다.
        위의 영상을 보고 **`useMemo`**에 대해 정리해주세요!

또한 아래 공식문서 또한 읽어보시면서 부족한 내용을 보충해서 정리해주세요!

https://react.dev/reference/react/useMemo

- **`useMemo`** 에 대하여 정리해주세요! 🍠
    
    # **`useMemo`** 에 대하여 정리해주세요! 🍠
    
    ---
    
    - **`useMemo`**가 무엇인지? 🍠
        
        # **`useMemo`**가 무엇인지? 🍠
        
        ---
        
        `useCallback`이 함수 자체의 메모리 주소를 고정하는 도구라면, `useMemo`는 함수가 실행되어 반환한 '결과값(객체, 배열, 원시 값 등)'을 리액트 내부 저장소(Fiber)에 박제하여 재사용하는 도구이다
        
        리액트 컴포넌트가 리렌더링될 때마다 내부의 모든 코드라인은 위에서 아래로 재실행된다. 만약 컴포넌트 내부에 변수를 선언하고 계산하는 로직이 있다면, 그 연산은 컴포넌트가 실행될 때마다 매번 다시 실행되게 된다. `useMemo`는 의존성 배열이 바뀌지 않았다면, 이 연산 함수를 다시 실행하지 말고 이전에 계산해서 저장해 둔 결과값을 그대로 내어주는 것이**다**
        
        ### 생성과 재사용의 타이밍
        
        - **기존 결과값 재사용:** 컴포넌트가 리렌더링될 때, `useMemo`에 넘겨준 **의존성 배열(deps)의 값들이 이전 렌더링과 동일하다면**, 내부 연산 팩토리 함수를 실행 하지 않고 기존 저장된 값을 그대로 반환한다.
        - **새 결과값 연산:** 의존성 배열에 넣은 값이 하나라도 변경되면, 리액트는 그제야 내부 연산 함수를 실행하여 **새로운 결과값을 도출하고, 그 값을 다시 저장소에 업데이트한다**.
    - 왜 **`useMemo`**를 사용하는지? 🍠
        
        # 왜 **`useMemo`**를 사용하는지? 🍠
        
        ---
        
        ### 🔴 이유 1: 무거운 CPU 연산 비용 절감 (Computational Cost)
        
        컴포넌트 내부에 만 개짜리 배열을 정렬(`sort`)하거나 필터링(`filter`)하는 로직이 있다고 가정해 봅시다. 최적화를 안 하면 UI에 텍스트 한 글자 타이핑할 때마다 컴포넌트가 재실행되며 이 만 개짜리 루프가 계속해서 돌아갑니다. `useMemo`는 데이터가 바뀔 때만 이 무거운 연산이 실행되도록 격리하여 **CPU 연산 비용을 아낍니다.**
        
        ### 🟢 이유 2: 자식 컴포넌트의 억울한 연산 차단 (Referential Equality 고정)
        
        함수 내부에서 인라인으로 선언된 객체(`{}`)나 배열(`[]`)은 값이 똑같아도 리렌더링 때마다 새로운 메모리 주소를 가진다. 이를 자식 컴포넌트에게 `prop`으로 내리게 되면, 자식이 `React.memo`를 쓰고 있더라도 주소값(`===`)이 깨져버려 DOM 비교를 위해 **자식 컴포넌트 함수가 강제로 재실행(Render Phase)된다**. `useMemo`로 객체의 참조 주소를 고정해 주면 자식의 === 비교를 지킬 수 있다.
        
        주의
        
        `useMemo`는 공짜가 아니다. 값을 저장할 **메모리(Fiber Node) 공간 확보 비용**, 렌더링 때마다 **의존성 배열을 전수조사(`Object.is`)하는 연산 비용**, 그리고 **가독성 저하**라는 비용을 동반한다. 1+1 같은 단순 연산이나, 자식에게 전달되지 않는 가벼운 값에 `useMemo`를 도배하는 것은 오히려 시스템을 더 무겁게 만드는 낭비이다.
        
    - **`useMemo`** 기본 사용법 🍠
        
        # **`useMemo`** 기본 사용법 🍠
        
        ---
        
        ```jsx
        import { useState, useMemo } from 'react';
        
        interface Item {
          id: number;
          name: string;
          price: number;
        }
        
        export function ProductList({ items }: { items: Item[] }) {
          const [filterPrice, setFilterPrice] = useState<number>(0);
          const [theme, setTheme] = useState<'light' | 'dark'>('light');
        
          // 규칙: 팩토리 함수 내부에서 참조하는 모든 상태와 props는 deps 배열에 명시해야 함
          const expensiveFilteredItems = useMemo(() => {
            console.log("🔥 무거운 필터링 연산 실행 중... (의존성이 바뀔 때만 호출됨)");
            return items.filter(item => item.price >= filterPrice);
          }, [items, filterPrice]); // items나 filterPrice가 바뀔 때만 재연산
        
          return (
            <div className={theme}>
              {/* theme 상태만 바뀔 때는 위의 expensiveFilteredItems 연산이 통째로 생략됨 */}
              <button onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}>테마 변경</button>
              <ul>
                {expensiveFilteredItems.map(item => <li key={item.id}>{item.name}</li>)}
              </ul>
            </div>
          );
        }
        ```
        
    - **`useMemo`**에서 중요한 개념 🍠
        
        # **`useMemo`**에서 중요한 개념 🍠
        
        ---
        
        ### 1) 가비지 컬렉터
        
        컴포넌트가 리렌더링될 때 `useMemo`가 쓰레기 값을 버리는 원리는 자바스크립트의 엔진 규칙을 따른다. 의존성이 바뀌어 `useMemo`가 새 객체나 배열을 생성하면, 기존에 쥐고 있던  메모리 주소 링크를 끊어 해당 값들은 자바스크립트 엔진의 가비지 컬렉터(GC)가 수거한다.
        
        ### 2) useCallback과의 명확한 경계선
        
        이 두 개는 완벽히 같은 메모이제이션 메커니즘(`Fiber` 저장소 활용)을 공유하지만, "무엇을 반환하느라 추상화되었는가"의 차이가 있다.
        
        - **`useMemo`:** 내부 함수의 **실행 결과값**을 메모이제이션.
        - **`useCallback`:** 내부 함수 자체(주소값)를 메모이제이션.
        
        실제로 리액트 내부 소스코드에서 `useCallback(fn, deps)`은 `useMemo(() => fn, deps)`와 동일하다. 즉, `useCallback`은 `useMemo`로 함수를 반환할 때 문법이 지저분해지는 것을 막기 위한 문법적 설탕(Syntactic Sugar)일 뿐입니다.
        문법적 설탕 → 동작은 동일하지만 구분을 위해 나눠 둔것
        
    - **`useMemo`** 실전 예시 🍠
        
        # **`useMemo`** 실전 예시 🍠
        
        ---
        
        ```jsx
        import React, { useState, useMemo } from 'react';
        
        const HeavyChild = React.memo(({ config }: { config: { active: boolean } }) => {
          console.log("자식 컴포넌트 실행");
          return <div>{config.active ? "활성화" : "비활성화"}</div>;
        });
        
        function Parent() {
          const [count, setCount] = useState(0);
        
          // ❌ useMemo가 없다면: 부모가 리렌더링될 때마다 새로운 주소 { active: true } 가 생성됨
          // ➡️ HeavyChild의 React.memo 방패가 뚫려 자식 함수가 매번 억울하게 실행됨
          // const config = { active: true };
        
          // ⭕ useMemo 사용: 부모가 아무리 리렌더링되어도 config의 메모리 주소가 영구 고정됨
          // ➡️ HeavyChild는 호출조차 되지 않고 스킵(Short-circuit)됨
          const config = useMemo(() => ({ active: true }), []);
        
          return (
            <div>
              <button onClick={() => setCount(c => c + 1)}>부모 상태 변경: {count}</button>
              <HeavyChild config={config} />
            </div>
          );
        }
        ```
        

---

# **추가로 본인이 학습한 내용에 대해서 정리해주세요** 🍠

---

## 1. Vercel 내부의 아키텍처: Serverless & Edge Network

우리가 Vercel에 코드를 밀어 넣으면, 내부적으로 AWS나 자체 데이터 센터 위에서 다음과 같은 인프라 조작이 일어난다

- **Serverless Functions:** Vercel은 전통적인 24시간 켜져 있는 서버(EC2 등)를 만들지 않는다. Next.js의 API 라우트나 SSR 로직을 구글 클라우드나 AWS의 Lambda 기반 '서버리스 함수'로 쪼갭니다. 요청이 들어올 때만 순간적으로 켜져서 연산하고 꺼지므로 인프라 비용이 극적으로 절감 한다.
- **Global Edge Network (CDN):** 빌드된 정적 파일(HTML, JS, 이미지)은 전 세계 수십 개의 거점(Edge) 서버에 즉시 동기화되게 된다. 한국 유저가 접속하면 미국 서버가 아니라 서울에 있는 Edge 노드에서 데이터를 바로 쏴주기 때문에 첫 페이지 로딩 속도가 밀리초(ms) 단위로 떨어진다.

## 2. CI/CD의 핵심 최적화: 빌드 캐싱 (Build Caching)

실무에서 CI/CD 파이프라인을 구축해 두면, 코드 수정 후 배포까지 2~3분이 걸릴 수 있다. 하지만 대규모 프로젝트에서는 이 빌드 시간이 10분, 20분으로 늘어나며 오히려 생산성을 갉아먹는 병목이 되기도 한다. 이를 해결하는 기술이 캐싱(Caching)이다.

- **의존성 캐싱 (Dependency Caching):** 코드가 바뀔 때마다 수백 메가바이트에 달하는 `node_modules` 패키지들을 매번 새로 다운로드(`npm install`)하지 않도록, `package-lock.json` 파일의 해시값을 체크하여 변경 사항이 없다면 이전 빌드에서 썼던 폴더를 통째로 복사해 와 실행 시간을 분 단위로 단축한다.
- **Next.js 빌드 캐시:** Next.js 같은 프레임워크는 Vercel이나 GitHub Actions 환경에서 이전 빌드 시 생성된 컴포넌트 결과물(`.next/cache`)을 기억한다. 바뀐 파일만 골라서 컴파일하는 증분 빌드(Incremental Build)를 수행하기 때문에, 전체 코드를 매번 다시 빌드하는 무식한 연산을 하지 않는다.

## 3. 실전 배포 전략: 무중단 배포와 Preview Deployment

과거 아날로그 방식의 배포는 서버를 잠시 끄고 새 코드를 올린 뒤 다시 켰습니다. 그동안 유저는 서버 점검 중 화면을 봐야 했었다. 현대 CI/CD와 Vercel은 이를 소프트웨어적으로 완전히 해결한다.

- **Blue-Green 배포 & Atomic 변경:** Vercel은 새 코드가 완벽히 빌드되어 정상 작동하기 전까지는 기존에 잘 돌아가고 있던 옛날 버전(Blue)으로 유저 트래픽을 보낸다. 새 버전(Green)이 100% 준비되는 순간, 라우터 스위치를 전환한다. 따라서 유저는 서비스 중단을 체감 하지 못한다.
- **Preview Deployments (고유 불변 URL):** 메인 브랜치에 합치기 전, 풀 리퀘스트(PR)를 날릴 때마다 Vercel은 해당 코드 상태의 **독립된 임시 배포 링크**를 생성한다. 개발자는 실제 프로덕션 서버를 더럽히지 않고도, 완벽하게 격리된 환경에서 기획자나 투자자에게 진행 상황을 보여주고 피드백을 받을 수 있다.

## 4. 파이프라인의 보이지 않는 방패: 환경 변수(ENV)와 보안

실전 프로젝트를 GitHub public 레포지토리에 올릴 때, 데이터베이스 비밀번호나 API 키 같은 민감 정보가 코드에 노출되면 시스템 전체가 해킹당한다.

- **Secret Management:** CI/CD 툴(GitHub Actions)이나 Vercel 설정 창에는 코드가 아닌 **인프라 자체에 암호화된 환경 변수**를 저장하는 칸이 따로 있다.
- **런타임 주입:** 코드가 빌드되거나 가상 서버가 돌아가는 그 순간에만 메모리 상에 변수를 슬쩍 주입(Inject)하고 사라진다. 개발자의 로컬 환경 컴퓨터와 실제 배포 서버의 환경 변수를 철저히 분리하여, 코드 변경 없이 서버 주소나 개발 모드/운영 모드 세팅을 자유롭게 스위칭할 수 있는 유연성을 제공한다.