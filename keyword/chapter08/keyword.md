- **`Debounce`** 구글링 후 개념 정리 및 코드 작성해보기 🍠
    - **`Debounce`** 개념 정리 🍠
        
        **Debounce**는 연속적으로 발생하는 이벤트를 그룹화하여, 마지막 이벤트가 발생한 후 일정 시간이 지났을 때만 콜백 함수를 한 번 실행하는 기술
        
        ### 1. 작동 원리
        
        1. 이벤트가 발생하면 설정된 `delay` 타이머를 시작
        2. `delay`가 끝나기 전에 동일 이벤트가 또 발생하면, 기존 타이머를 취소(Clear)하고 다시 타이머를 시작
        3. 더 이상 이벤트가 발생하지 않고 `delay` 시간이 경과하면 비로소 함수를 실행
        
        **주요 용도:**
        
        - **입력값 검증 (ID 중복 체크 등):** 타이핑이 완전히 끝났을 때 API 호출.
        - **윈도우 리사이징:** 사용자가 창 크기 조절을 멈췄을 때 레이아웃 재계산.

    - **`Debounce`** 코드 작성 🍠
        
        ```tsx
        function debounce(fn, delay){
        let timer;
        return (...args) => {
            clearTimeout(timer); // 이전 요청 취소
            timer = setTimeout(() => fn(...args), delay); // 마지막 요청 예약
        };
        }
        ```
    
- **`Throttling`** 구글링 후 개념 정리 및 코드 작성해보기 🍠

    - **`Throttling`** 개념 정리 🍠
    이벤트가 아무리 많이 발생해도, 설정한 시간 간격(Tick) 내에는 최대 한 번만 실행하게 함-.
        - **동작:** 실행 중에는 타이머가 끝날 때까지 추가 요청을 무시(Ignore).
        - **핵심 코드:**
        - 주요 용도:
            *  스크롤 이벤트 (Infinite Scroll): 스크롤 중 계속해서 데이터를 불러오거나 위치를 계산해야 할 때.
            *  마우스 이동 (Drag & Drop): 좌표 계산 빈도를 제한하여 성능 확보.
    - **`Throttling`** 코드 작성 🍠
        
        ```tsx
        function throttle(fn, delay) {
        let timer = null;
        return (...args) => {
            if (timer) return; // 이미 타이머가 있다면 무시
        
            fn(...args); // 즉시 실행
            timer = setTimeout(() => {
            timer = null; // 설정 시간이 지나면 타이머 초기화
            }, delay);
        };
        }
        ```