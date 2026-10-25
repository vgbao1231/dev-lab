---
title: 'Tearing, Stale Snapshots và useSyncExternalStore'
date: 2026-10-24
type: concept
lab: react-lab
tags: ['react', 'state-management', 'concurrency']
cover: react-tearing
coverAlt: 'Sơ đồ render snapshot v1 và external store v2, đường tear ở giữa'
summary: 'Vì sao state bên ngoài React có thể bị “rách” giữa hai lần render, và cách useSyncExternalStore buộc mọi thứ đồng bộ.'
draft: false
---

Concurrent rendering cho phép React tạm dừng render. Điều đó tốt cho input, nhưng tạo ra một vấn đề mới: nếu dữ liệu không nằm trong React, nó có thể thay đổi **trong lúc** React đang render dở.

Kết quả là hai component trên cùng một màn hình đọc hai phiên bản dữ liệu khác nhau. UI bị “rách” — tearing.

`useSyncExternalStore` là hook React dùng để đọc state bên ngoài một cách nhất quán. Bài này giải thích cơ chế, cách dùng đúng, và những lỗi thường gặp.

## Tearing xảy ra thế nào?

Giả sử có một store ngoài React:

```ts
type State = { count: number };

let state: State = { count: 0 };
const listeners = new Set<() => void>();

export const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const getSnapshot = () => state;

export const increment = () => {
  state = { count: state.count + 1 };
  listeners.forEach((listener) => listener());
};
```

Hai component cùng đọc `getSnapshot()`:

```tsx
function Header() {
  const { count } = useStore();
  return <h1>{count}</h1>;
}

function Counter() {
  const { count } = useStore();
  return <p>{count}</p>;
}
```

Trong chế độ concurrent, React có thể:

1. Render `Header`, đọc `count = 1`.
2. Tạm dừng để nhường cho input.
3. Store tăng lên `count = 2`.
4. Render tiếp `Counter`, đọc `count = 2`.
5. Commit cả hai.

Kết quả: header hiện `1`, counter hiện `2`. Không có lỗi JavaScript nào. Chỉ là UI không nhất quán.

Với state trong React, chuyện này không xảy ra: mỗi lần render dùng một snapshot state cố định. Store ngoài React không tự có snapshot đó.

## `useSyncExternalStore` làm gì?

Hook có ba tham số:

```ts
const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot?);
```

- `subscribe`: đăng ký listener, trả về hàm huỷ đăng ký.
- `getSnapshot`: trả về snapshot hiện tại.
- `getServerSnapshot`: snapshot dùng khi render trên server và trong lần hydrate đầu tiên.

React sẽ:

1. Gọi `getSnapshot()` trong render để lấy dữ liệu.
2. Đăng ký `subscribe` sau khi mount.
3. Khi listener báo thay đổi, kiểm tra snapshot mới.
4. Nếu snapshot khác, lên lịch render.
5. Trong commit, kiểm tra lại snapshot; nếu store đã đổi trong lúc render, buộc render lại đồng bộ trước khi paint.

Điểm cuối là phần chống tearing. React không cho commit một UI trộn hai phiên bản dữ liệu.

## Hợp đồng của `getSnapshot`

Đây là chỗ nhiều người sai nhất: **`getSnapshot` phải trả về cùng một tham chiếu nếu dữ liệu không đổi**.

Sai:

```ts
// Mỗi lần gọi tạo object mới → React thấy "đã đổi" mãi mãi.
const getSnapshot = () => ({ count: state.count });
```

React so sánh bằng `Object.is`. Object mới mỗi lần gọi nghĩa là snapshot luôn khác, dẫn tới render lặp hoặc cảnh báo:

```text
The result of getSnapshot should be cached to avoid an infinite loop
```

Đúng:

```ts
// Chỉ tạo object mới khi dữ liệu thực sự đổi.
let state: State = { count: 0 };

export const getSnapshot = () => state;

export const increment = () => {
  state = { count: state.count + 1 };
  listeners.forEach((listener) => listener());
};
```

Nếu store trả về mảng hoặc object phái sinh, hãy cache nó:

```ts
let cachedItems: Item[] | undefined;
let cachedSource: Item[] | undefined;

const getItems = () => {
  if (cachedSource !== source) {
    cachedSource = source;
    cachedItems = source.filter((item) => item.visible);
  }
  return cachedItems ?? [];
};
```

## `subscribe` phải ổn định

Nếu truyền một hàm `subscribe` mới mỗi lần render, React sẽ huỷ đăng ký rồi đăng ký lại liên tục. Hàm nên được khai báo ngoài component hoặc bọc trong `useCallback` với dependency ổn định.

```tsx
// Tốt: hàm ngoài component.
function useCount() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
```

## `getServerSnapshot` và hydration

Khi render trên server, không có DOM, không có subscription. `getServerSnapshot` cung cấp giá trị ban đầu.

Nó phải trả về **cùng giá trị** mà client dùng trong lần render đầu tiên. Nếu server trả `false` cho `isOnline` còn client đọc `true` ngay lập tức, React sẽ báo hydration mismatch.

```tsx
const getServerSnapshot = () => false;

function useOnlineStatus() {
  return useSyncExternalStore(
    (callback) => {
      window.addEventListener('online', callback);
      window.addEventListener('offline', callback);
      return () => {
        window.removeEventListener('online', callback);
        window.removeEventListener('offline', callback);
      };
    },
    () => navigator.onLine,
    getServerSnapshot,
  );
}
```

Với API chỉ có trên client, giá trị server thường là một mặc định an toàn. Sau hydrate, React cập nhật theo giá trị thật.

## Ví dụ đầy đủ: store nhỏ

```ts
// store.ts
type State = { count: number };

let state: State = { count: 0 };
const listeners = new Set<() => void>();

export const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export const getSnapshot = () => state;

export const increment = () => {
  state = { count: state.count + 1 };
  for (const listener of listeners) listener();
};
```

```tsx
// useCount.ts
import { useSyncExternalStore } from 'react';
import { getSnapshot, subscribe } from './store';

export const useCount = () => useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
```

`getServerSnapshot` dùng luôn `getSnapshot` ở đây vì store là module-level và có giá trị khởi tạo xác định. Trong ứng dụng thật, hãy kiểm tra xem store có phụ thuộc `window` hay không.

## Khi nào nên dùng?

Nên dùng khi:

- Đọc API trình duyệt: `online/offline`, `matchMedia`, `visibilitychange`.
- Dùng state library bên ngoài: Redux, Zustand, Jotai (các thư viện này đã bọc sẵn).
- Có store riêng cần chia sẻ giữa nhiều component.
- Cần đọc dữ liệu bên ngoài mà không muốn copy vào React state.

Không cần dùng khi:

- State chỉ thuộc một component → `useState`.
- State chia sẻ trong cây → context hoặc state library.
- Chỉ cần đọc một lần khi mount → `useEffect` + `useState` có thể đủ, nhưng cẩn thận tearing nếu dữ liệu thay đổi.

## Vì sao không dùng `useEffect` + `useState`?

Cách cũ:

```tsx
const [online, setOnline] = useState(false);

useEffect(() => {
  const update = () => setOnline(navigator.onLine);
  update();
  window.addEventListener('online', update);
  window.addEventListener('offline', update);
  return () => {
    window.removeEventListener('online', update);
    window.removeEventListener('offline', update);
  };
}, []);
```

Cách này có hai vấn đề:

1. Lần render đầu dùng giá trị mặc định, sau đó effect mới cập nhật → thêm một vòng render.
2. Giữa lúc render và effect, giá trị có thể đã cũ. Trong concurrent mode, khoảng cách đó có thể dài hơn.

`useSyncExternalStore` đọc snapshot ngay trong render và kiểm tra lại khi commit, nên nhất quán hơn.

## Tóm lại

- Tearing là hai component đọc hai phiên bản khác nhau của cùng một store trong một lần render.
- `useSyncExternalStore` đọc snapshot trong render, subscribe sau mount, và kiểm tra lại trước khi commit.
- `getSnapshot` phải trả về tham chiếu ổn định khi dữ liệu không đổi.
- `subscribe` phải ổn định để tránh đăng ký lại liên tục.
- `getServerSnapshot` phải khớp giá trị client dùng trong lần render đầu.
- Không phải state nào cũng cần hook này; chỉ dùng khi dữ liệu thật sự nằm ngoài React.

Ba bài vừa rồi là một chuỗi: Fiber giải thích **React tính toán gì**, lanes giải thích **khi nào React được phép tạm dừng**, và tearing giải thích **điều gì phải đồng bộ khi React tạm dừng**. Ba khái niệm này giải thích phần lớn hành vi khó hiểu của React hiện đại.
