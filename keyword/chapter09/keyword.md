- **`Redux Toolkit`** 사용법을 공식문서를 보며 직접 정리해보기 🍠
    
    [Getting Started | Redux Toolkit](https://redux-toolkit.js.org/introduction/getting-started)
    
    - Provider
    Redux는 앱 외부에 존재하는 독립적인 저장소. React 컴포넌트가 이 저장소에 연결되려면, 앱의 최상위 계층에서 저장소와 연결이 필요. `Provider`가 해당 역할을 수행.
        - 역할: `store` 객체를 Props로 받아 하위 모든 컴포넌트가 Redux 상태에 접근할 수 있도록 컨텍스트를 제공
        - 사용법: 리엑트 기준 (주로 main.tsx 혹은 App.tsx에서 사용)
    
            ```tsx
            import { Provider } from 'react-redux';
            import { store } from './app/store'; // 생성한 store import
            
            root.render(
              <Provider store={store}>
                <App />
              </Provider> // 기존 사용하던 Provider와 크게 다르지 않
            );
            ```
            
    - configureStore
        
        애플리케이션의 모든 상태를 관리하는 중앙 저장소를 생성하는 역할.
        리덕스는 엄격한 상태관리를 위해 동기 작업 기반 → 비동기 작업을 위한 미들웨어redux-thunk를 제공
        (액션이 리듀서에 도착하기 전 Api 호출을 대신 수행 해서 데이터를 받아 리듀서에게 전달하는 역할)
        
        - **역할**:
            1. 여러 개의 Reducer(상태 변경 로직)를 하나의 객체로 병합
            2. 비동기 작업 처리를 위한 미들웨어(`redux-thunk`) 제공.
            3. 개발 도구(`Redux DevTools`)를 통해 상태변화 추적을 도움.
            
            **사용법**:
            
            ```tsx
            import { configureStore } from '@reduxjs/toolkit';
            import counterReducer from '../features/counterSlice';
            // 저장소 생성 및 각 도메인의 리듀서 등록
            export const store = configureStore({
              reducer: {
              //상태 이름과 : 상태 관리 리듀서(여기서는 counter로 임시로 지정)
                counter: counterReducer, 
              },
            });
            ```
            
    - createSlice
        
        상태 이름, 초기 값 그리고 상태를 변경하는 로직(reducers)을 한 번에 정의 하는 역할
        기존에는 Action과 Reducer를 따로 구현해야 했지만 이를 하나로 통합함
        리덕스는 상태의 변화를 확인하기 위해 주소값을 사용하는데, 상태를 직접 수정 했을때 주소값이 변하지 않아 반응하지 못하는것을 내부적으로 Immer(데이터 변경시 새로운 메모리 주소 할당)을 통해 해결
        액션 타입과 액션 생성 함수를 작성 할 필요없이 리듀서에 함수 등록만 하면 액션으로 자동 등록
        
        - **역할**:
            1. 내부적으로 `Immer`를 사용하여 상태를 직접 변경해도 불변성 규칙을 자동으로 지켜줍니다.
            2. 정의한 리듀서 함수 이름에 맞춰 액션 객체를 자동으로 생성합니다.
        
        **사용법**:
        
        ```tsx
        const counterSlice = createSlice({
          name: 'counter',
          initialState: { value: 0 },
          reducers: {
            increment: (state) => { state.value += 1; },
            incrementByAmount: (state, action) => { state.value += action.payload; },
          },
        });
        
        export const { increment, incrementByAmount } = counterSlice.actions;
        export default counterSlice.reducer;
        ```
        
    - useSelector
        
         저장된 전체 상태 중 특정 컴포넌트가 필요로 하는 데이터만 추출하는 역할
        
        - **역할**: 컴포넌트에서 필요한 데이터를 조회 후 해당 데이터가 변경될 때만 컴포넌트를 리렌더링
        - **사용법**:
            
            ```tsx
            import { useSelector } from 'react-redux';
            
            // state.counter는 configureStore에서 등록한 이름
            const count = useSelector((state) => state.counter.value);
            ```
            
    - useDispatch
        
        상태를 변경하기 위한 액션을 저장소로 전달하여 저장소의 상태를 업데이트 하는 역할
        
        - **역할**: 특정 이벤트(클릭 등)가 발생했을 때, `createSlice`에서 만든 액션 함수를 실행하여 저장소의 상태를 업데이트.
        - **사용법**:
            
            ```tsx
            import { useDispatch } from 'react-redux';
            import { increment } from '../features/counterSlice';
            
            const dispatch = useDispatch();
            // 버튼 클릭 시 저장소에 increment 액션 전달
            <button onClick={() => dispatch(increment())}>증가</button>
            ```
            
    - 기타 **`Redux Toolkit`** 사용 방법을 상세하게 정리해 보세요
        1. **createAsyncThunk**: 서버에서 데이터를 가져오는 비동기 API 통신을 수행할 때 사용. 작업의 시작(`pending`), 성공(`fulfilled`), 실패(`rejected`) 상태를 처리하는 액션을 내부에서 자동 생성.
            
            **사용법:**
            
            ```tsx
            export const fetchUser = createAsyncThunk('user/fetchById', async (userId, { rejectWithValue }) => {
              try {
                const response = await fetch(`/api/user/${userId}`);
                if (!response.ok) throw new Error("서버 응답 실패");
                return await response.json(); //성공시 반환 값
              } catch (err) {
                return rejectWithValue(err.message); //실패시 반환 값
              }
            });
            ```
            
        2. **extraReducers**: `createAsyncThunk`와 같이 `createSlice` 내부의 `reducers`가 아닌, 외부에서 정의된 액션(비동기 작업 결과 등)에 따라 상태를 변경해야 할 때 사용 .addcase로 각 상태별 행동을 조절 가능
            
            ```tsx
            const userSlice = createSlice({
              name: 'user',
              initialState: { data: null, error: null, loading: false },
              reducers: {},
              extraReducers: (builder) => {
                builder
                  // 1. 시작 (pending): 로딩 상태를 true로 설정
                  .addCase(fetchUser.pending, (state) => {
                    state.loading = true;
                    state.error = null;
                  })
                  // 2. 성공 (fulfilled): 데이터 저장 및 로딩 종료
                  .addCase(fetchUser.fulfilled, (state, action) => {
                    state.loading = false;
                    state.data = action.payload; 
                  })
                  // 3. 실패 (rejected): 에러 메시지 저장 및 로딩 종료
                  .addCase(fetchUser.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload; // rejectWithValue로 전달한 에러가 여기에 담김
                  });
              },
            });
            ```
            
        3. **RTK Query (`createApi`)**: 서버와 통신하는 모든 로직을 자동화하는 최상위 도구 엔드포인트만 정의하면 데이터 페칭, 캐싱, 에러 처리, 로딩 상태 관리를 별도의 리듀서 없이 스스로 수행.
        createAsyncThunk로 주로 작성하던 로직을 이미 작성해둔 라이브러리와 비슷함
        pending, fulfilled, rejected를 자동으로 처리하여 data를 캐시에 저장하거나 error를 저장하며 네트워크 요청은 직접 설정한 쿼리를 사용
        
    
            ```tsx
            import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
            
            // API 엔드포인트만 정의
            export const userApi = createApi({
              reducerPath: 'userApi',
              baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
              endpoints: (builder) => ({
                getUser: builder.query({ query: (id) => `user/${id}` }), // 자동 생성될 훅의 이름 결정
              }),
            });
            
            // 자동으로 생성된 훅 사용 (로딩, 데이터가 자동으로 처리됨)
            const { data, isLoading } = userApi.useGetUserQuery(1);
            ```
            
        4. **타입 정의(TypeScript)**: `RootState`와 `AppDispatch` 타입 추출 후 `useSelector`와 `useDispatch`에 적용시, 컴포넌트 내에서 상태값과 액션에 대한 타입 안정성을 보장.

            
            ```tsx
            // store.ts에서 타입 추출
            export type RootState = ReturnType<typeof store.getState>;
            export type AppDispatch = typeof store.dispatch;
            
            // 사용 컴포넌트에서 타입 적용된 훅 사용
            import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
            export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
            export const useAppDispatch = () => useDispatch<AppDispatch>();
            
            // 사용 시: state.counter 뒤에 자동 완성이 뜸
            const count = useAppSelector((state) => state.counter.value);
            ```
- Zustand 🍠            
    - **Zustand**란 무엇인가요? 🍠
        
        # **Zustand**란 무엇인가요?
        
        ---
        
        Zustand는 단일 스토어(Single Store)를 기반으로 하는 경량 전역 상태 관리 라이브러리. 내부적으로 발행-구독(Pub/Sub) 모델을 사용하여 상태 변화를 감지하며, **라이브러리 자체가 TypeScript로 작성되어 있어타입 추론과 인터페이스 제공**을 보장.
        
    - 왜 **Zustand**를 사용할까요? 🍠
        
        # 왜 Zustand를 사용할까요?
        
        ---
        
        - **강력한 타입 추론:** Redux에서 요구하는 복잡한 타입 정의(`ActionTypes`, `PayloadAction` 등) 없이, 스토어의 `interface` 하나만으로 상태와 액션의 타입을 통제가
        - **보일러플레이트 :** Context API에서 강제되는 `<Provider>` 래핑이나 `createContext`의 초기 `null` 타입 처리 문제에서 자유로움
        - **독립적 동작:** React의 렌더링 사이클 외부(일반 TS/JS 함수)에서도 상태를 읽고 쓸 수 있어 시스템 분리가 용이
    - **Zustand** 기본 사용법 🍠
        
        # **Zustand** 기본 사용법
        
        ---
        
        ### 1) Store 만들기
        
        스토어가 가질 상태(State)와 행동(Action)을 `interface`로 명확히 규정하고, `create<T>()` 형태로 제네릭을 주입.
        
        TypeScript
        
        ```tsx
        import { create } from 'zustand';
        
        // 1. 상태와 액션의 타입 정의
        interface CounterState {
        count: number;
        increase: () => void;
        increaseByAmount: (amount: number) => void;
        }
        
        // 2. 타입이 적용된 스토어 생성
        export const useCounterStore = create<CounterState>()((set) => ({
        count: 0,
        increase: () => set((state) => ({ count: state.count + 1 })),
        increaseByAmount: (amount) => set((state) => ({ count: state.count + amount })),
        }));
        ```
        
        ### 2) 컴포넌트에서 사용하기
        
        타입스크립트는 반환값을 정확히 추론하므로, 사용 시 자동 완성이 지원.
        
        ```tsx
        import { useCounterStore } from './store';
        
        function Counter() {
        const { count, increaseByAmount } = useCounterStore();
        
        return (
            <button onClick={() => increaseByAmount(5)}>
            Count: {count}
            </button>
        );
        }
        ```
        
    - **Zustand**에서 중요한 개념 🍠
        
        # **Zustand**에서 중요한 개념
        
        ---
        
        ### 1) set 함수
        
        상태를 병합(Merge) 방식으로 업데이트. TS 환경에서는 `Partial<T>` 타입으로 작동하여, 정의되지 않은 속성을 실수로 추가하는 것을 컴파일 단계에서 차단.
        
        ### 2) get 함수
        
        현재 상태를 조회합니다. 액션 함수 내부에서 다른 상태값을 참조하거나 계산해야 할 때 유용
        
        ### 3) 선택적 구독 (selector)
        
        스토어에서 필요한 데이터만 추출합니다. 렌더링 최적화를 위한 핵심 기술.
        
        ```tsx
        // TS 환경에서는 state의 타입이 자동으로 CounterState로 추론됨
        const count = useCounterStore((state) => state.count);
        ```
        
    - **Zustand** 객체 상태 관리 예시 🍠
        
        # **Zustand** 객체 상태 관리 예시
        
        깊은 객체(Nested Object)를 다룰 때의 타입 정의와 전개 연산자(`...`) 활용
        
        ---
        
        ```tsx
        interface User {
        id: string;
        name: string;
        age: number;
        }
        
        interface UserStore {
        user: User | null;
        updateName: (newName: string) => void;
        }
        
        const useUserStore = create<UserStore>()((set) => ({
        user: { id: '1', name: '철수', age: 23 },
        updateName: (newName) => set((state) => ({
            // 기존 user가 존재하는지 확인 후 업데이트 (TS Null 체크)
            user: state.user ? { ...state.user, name: newName } : null 
        })),
        }));
        ```
        
    - **Zustand** 비동기 로직 예시 🍠
        
        # **Zustand** 비동기 로직 예시
        
        Redux의 `createAsyncThunk` 없이, 일반적인 비동기 함수 구조 안에서 `set`을 호출
        
        ---
        
        **Zustand**에서는 비동기 API 호출도 간단하게 store 안에서 사용할 수 있어요.
        
        ```tsx
        interface FetchStore {
        data: string[] | null;
        isLoading: boolean;
        error: string | null;
        fetchData: () => Promise<void>;
        }
        
        const useFetchStore = create<FetchStore>()((set) => ({
        data: null,
        isLoading: false,
        error: null,
        fetchData: async () => {
            set({ isLoading: true, error: null }); // 로딩 시작
            try {
            const response = await fetch('/api/data');
            if (!response.ok) throw new Error('서버 응답 오류');
            const result: string[] = await response.json();
            set({ data: result, isLoading: false }); // 성공 처리
            } catch (err: any) {
            set({ error: err.message, isLoading: false }); // 에러 처리
            }
        },
        }));
        ```
        
    - **Zustand** + Persist 미들웨어 🍠
        
        # **Zustand** + Persist 미들웨어
        
        상태를 `localStorage` 등에 저장하여 유지합니다. TS에서는 미들웨어 사용 시 타입 추론이 깨지는 것을 막기 위해 작성 규칙을 엄격히 지켜야 함.
        
        ---
        
        **Zustand**는 미들웨어를 활용해 로컬스토리지 등에 상태를 저장할 수 있어요.
        
        ```tsx
        import { create } from 'zustand';
        import { persist, createJSONStorage } from 'zustand/middleware';
        
        interface AuthStore {
        token: string | null;
        setToken: (token: string) => void;
        }
        
        export const useAuthStore = create<AuthStore>()(
        persist(
            (set) => ({
            token: null,
            setToken: (token) => set({ token }),
            }),
            {
            name: 'auth-storage', // localStorage에 저장될 키 이름
            storage: createJSONStorage(() => localStorage), 
            }
        )
        );
        ```
        
    - **Zustand** + Immer 함께 쓰기 🍠
        
        # **Zustand** + Immer 함께 쓰기
        
        객체 깊이가 깊어질 때 불변성 유지를 위한 전개 연산자 작성을 피하기 위해 `Immer`를 적용. TS 환경에서 배열의 `.push()` 등을 직접 사용하여 상태를 직관적으로 조작 가능
        
        ---
        
        불변성 관리를 쉽게 하고 싶다면 Immer 미들웨어도 사용 가능해요.
        
        ```tsx
        import { create } from 'zustand';
        import { immer } from 'zustand/middleware/immer';
        
        interface Todo {
        id: string;
        text: string;
        done: boolean;
        }
        
        interface TodoStore {
        todos: Todo[];
        addTodo: (text: string) => void;
        toggleTodo: (id: string) => void;
        }
        
        export const useTodoStore = create<TodoStore>()(
        immer((set) => ({
            todos: [],
            addTodo: (text) => set((state) => {
            // 불변성 걱정 없이 배열에 직접 push
            state.todos.push({ id: Date.now().toString(), text, done: false });
            }),
            toggleTodo: (id) => set((state) => {
            // 객체의 속성 직접 변경
            const todo = state.todos.find(t => t.id === id);
            if (todo) todo.done = !todo.done;
            }),
        }))
        );
        ```
        
    - **Zustand** vs Context API 🍠
        
        # **Zustand** vs Context API
        
        ---
        
        | **구분** | **Context API + TS** | **Zustand + TS** |
        | --- | --- | --- |
        | **타입 정의 방식** | `createContext<T | null>(null)` 후 널 체크 강제됨 | `create<T>()`로 즉시 완벽한 인터페이스 보장 |
        | **렌더링 통제** | Provider 하위 전체 리렌더링 발생 가능성 높음 | Selector(`(state) => state.x`)로 리렌더링 컴포넌트 격리 |
        | **Provider 의존성** | 컴포넌트 트리 내부에 Provider를 배치해야 함 | Provider 없이 전역 독립 모듈로 즉시 import 사용 |
        | **비동기 처리** | 자체 기능 없음, 커스텀 훅으로 별도 구현 필요 | Store 내부의 Action 메서드로 즉각적인 비동기 제어 가능 |


- **React 전역 상태 관리 완벽 가이드 블로그** 읽고 개념 정리하기 🍠
    
    # **React 전역 상태 관리 완벽 가이드 블로그** 읽고 개념 정리하기  **🍠**
    
    ---
    
    [개발자 매튜 | React 전역 상태 관리 완벽 가이드: Context API vs Zustand vs Jotai](https://www.yolog.co.kr/post/global-state/)
    
    - **`Context API`**의 **`value 전체 구독 메커니즘`**과 **`Zustand`**의 **`selector 기반 구독`**의 성능 차이를 설명해보세요.
        
        ### Context API: 상단에서 하단 전파
        
        Context API는 상태 관리 도구 보단 데이터 주입 도구에 가까움. React의 Fiber 트리 구조에 의존.
        
        - **메커니즘:** Context Provider의 `value` 객체(예: `{{ a, b }}`) 중 `b`만 변경되더라도, React는 조상 컴포넌트에서 하향식으로 전파되는 갱신 과정 시작.
        - **렌더링 유발:** `useContext(MyContext)`를 호출한 모든 하위 컴포넌트는 자신이 `a`만 참조하고 있더라도 객체가 갱신되어 새로운 객체는 새로운 메모리에 할당 되기에 참조하는 **`value`**  주소값이 변경되어 리렌더링 발생.
        - **비용:** 이를 막으려면 Context를 원자 단위(단일 객체)로 잘게 쪼개거나, 하위 컴포넌트를 `React.memo`로 감싸는 불필요한 보일러플레이트(중복 반복 코드)가 강요됨.
        
        ### Zustand: 외부 발행-구독(Pub/Sub)을 이용한 상태관리
        
        Zustand는 React Fiber 트리 외부(클로저 영역)에 독립적인 단일 저장소(클라이언트 스토어)를 구축.
        
        - **메커니즘:** 컴포넌트가 `useStore(state => state.a)`와 같이 Selector를 선언하면, Zustand는 해당 컴포넌트를 전체 상태가 아닌 **`state.a`라는 특정 노드의 구독자 명부**에만 등록합니다.
        - **렌더링 유발:** 내부적으로 `useSyncExternalStore`를 활용해 스토어의 값이 바뀔 때마다 Selector 함수를 실행, 이때 반환된 이전 값과 현재 값을 비교(`Object.is`을 기반으로 엄격한 비교).
        - **비용:** `b`가 바뀌어도, `state.a`를 가리키는 Selector의 결과값은 동일 ⇒ 컴포넌트의 리렌더링 함수가 호출 되지않음.
    - **`Jotai`**의 **`atom`** 조합 방식이 파생 상태 관리에서 Zustand 대비 갖는 장점을 의존성 추적 관점에서 설명해보세요.
        
        파생 상태(Derived State, 계산된 상태)를 관리할 때, Jotai의 원자적(최소단위) 조합 방식은 Zustand의 중앙집중식 방식보다 의존성 추적 및 메모리 해제 관점에서 유연성이 높음
        
        ### Zustand: 수동적 계산 및 탑다운 평가
        
        Zustand에서 파생 상태를 만들 기 위해선 Selector 함수 내부에 연산 로직을 넣거나, 상태가 바뀔 때마다 다른 상태를 변경하는 액션을 수동으로 결합해야 함
        
        - **한계:** 스토어 내의 어떤 값이라도 변경되면 관련된 Selector가 재실행되며 파생 상태를 매번 다시 계산. 
        만약 파생 데이터가 배열이나 객체 형태라면 매번 새로운 참조를 생성하므로, 이를 방지하기 위해 `shallow` 같은 비교 함수를 매번 신경 써서 붙여야 하는 문제가 발생.
        
        ### Jotai: 런타임 추적 기반의 유기적 의존성 그래프 (DAG)
        
        Jotai는 상태를 가장 작은 단위인 `atom`으로 쪼개고, 이들을 결합하여 파생 상태(`computed atom`)를 선언.
        
        - **자동 의존성 추적 (Graph-based):**
            
            ```tsx
            const priceAtom = atom(1000);
            const quantityAtom = atom(3);
            // 런타임에 priceAtom과 quantityAtom을 자동으로 감지하여 의존성 그래프 형성
            const totalAtom = atom((get) => get(priceAtom) * get(quantityAtom));
            ```
            
        - **동적 의존성(Dynamic Dependency):** `get` 함수가 실행되는 순간에만 해당 값에 대한 의존성을 가짐. 
        조건에 따라 `atomA`를 읽다가 `atomB`를 읽도록 로직이 바뀌면, Jotai는 의존성 지도를 수정.
        - **장점:** `priceAtom`이 바뀔 때 전체 스토어를 훑는 것이 아니라, 오직 `totalAtom`으로 이어지는 화살표 그래프만 추적하여 필요한 원자만 갱신.
        또한 컴포넌트가 언마운트되면 해당 원자와 파생 원자가 차지하던 메모리가 가비지 컬렉션(GC) 대상이 되므로 대규모 시스템에서 메모리 누수를 차단.
    - 서버 상태를 **`useEffect`**로 관리할 때 발생하는 캐싱/중복 요청/불일치 문제를 설명해보세요.
        
        데이터의 소유권이 클라이언트가 아닌 서버에 있는 데이터를 `useEffect`라는 클라이언트 생명주기 훅으로 통제하려 할 때, 여러 문제가 발생 가능.
        
        ### 캐싱(Caching) 메커니즘의 부재
        
        - **문제점:** `useEffect` 내부에서 수행되는 `fetch`나 `axios` 요청은 메모리 저장소와 연결되어 있지 않음.
        - **현상:** 컴포넌트가 언마운트되는 순간 `useState`에 담겼던 데이터는 소멸.
        사용자가 다른 페이지로 이동했다가 되돌아와도 UI는 텅 빈 화면과 함께 스피너를 보여주며 네트워크 요청을 다시 수행해야 함(데이터가 소멸하였기 떄문).
        글로벌 캐시 키(`QueryKey`) 레이어가 없기 때문에 발생하는 자원 낭비.
        
        ### 중복 요청 (Network Waterfalls & Race Conditions)
        
        - **문제점:** 동일한 페이지 내의 컴포넌트 A, B, C가 모두 같은 대시보드 데이터를 필요로 할 때, 각각의 `useEffect`가 네트워크 요청 시도.
        동일한 API 엔드포인트로 3번의 중복 호출이 동시에 발생합니다.
        - **경쟁 상태 (Race Condition):** 사용자가 검색창에 A를 입력한 후 빠르게 AB를 입력했을 때, A에 대한 요청 패킷이 순간 네트워크 정체로 인해 AB 요청보다 늦게 도착할 수 있음.
        결과적으로 화면에는 AB를 검색했음에도 최종적으로 늦게 도착한 A의 결과 데이터가 덮어씌워지는 치명적인 정합성 오류가 발생 가능.
         (`useEffect` 내부의 cleanup 함수로 이전 요청을 무효화하는 처리를 수동 짜야함.)
        
        ### 데이터 불일치 및 데이터 부패 (Stale / Inconsistency)
        
        - **문제점:** 서버의 원본 데이터는 끊임없이 변하지만, `useEffect`로 불러온 데이터는 컴포넌트가 마운트된 그 시점의 **과거 스냅샷**.
        - **현상:** 다른 사용자가 서버의 데이터를 수정하거나 브라우저의 다른 탭에서 데이터를 변경해도 현재 컴포넌트는 인지 불가능.
        윈도우 포커스 감지 시 재요청(`refetchOnWindowFocus`), 주기적 폴링(`polling`), 혹은 데이터 변경 시 관련 상태를  만료시키는(`Invalidation`)을 순수 React만으로는 정교하게 구현할 수 없으므로 클라이언트 화면은 과거(Stale) 상태에 존재.