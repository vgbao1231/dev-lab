---
title: 'React Concurrent Rendering: Lanes, Scheduling và Interruptible Rendering'
date: 2026-10-23
type: concept
lab: react-lab
tags: ['react', 'concurrency', 'performance']
cover: react-scheduler
coverAlt: 'Sơ đồ các lane Sync, Input, Default, Transition, Idle trên trục thời gian, với điểm yield'
summary: 'Lanes là gì, vì sao render có thể bị ngắt giữa chừng, và điều gì không thể ngắt trong commit phase.'
draft: false
---

“Concurrent rendering” là một trong những cụm từ bị hiểu sai nhiều nhất trong React. Nó không có nghĩa React chạy đa luồng. JavaScript vẫn single-threaded. Thứ React thay đổi là **quyền được tạm dừng công việc render**, để việc gấp hơn chen lên trước.

Bài trước đã nói render phase có thể bị gián đoạn. Bài này trả lời hai câu hỏi còn lại:

1. React quyết định việc nào gấp hơn việc nào bằng cách nào?
2. Khi bị ngắt, React nhớ gì và bắt đầu lại từ đâu?

Câu trả lời nằm ở **lanes** và **scheduler**.

## Vấn đề: một cây render quá lâu

Giả sử người dùng gõ vào ô search. Mỗi ký tự tạo một update. Nếu render danh sách 10.000 kết quả mất 80ms, trình duyệt không thể vẽ phản hồi cho phím vừa gõ trong 80ms đó. Input giật, con trỏ nhấp nháy chậm.

Cách cũ là debounce: chờ người dùng ngừng gõ rồi mới render. Cách đó hiệu quả nhưng thô. Nó trì hoãn **mọi** update, kể cả update quan trọng. Concurrent rendering cho phép nói: “Update này quan trọng, làm ngay; update kia ít gấp, làm khi rảnh, và có thể bỏ nếu có việc gấp hơn”.

## Lane: một bit đại diện cho mức ưu tiên

React 18 thay mô hình `expirationTime` bằng **lanes**. Mỗi lane là một bit trong số nguyên 31 bit. Một update được gán vào một lane; nhiều update có thể nằm ở nhiều lane cùng lúc.

```ts
// Ví dụ minh hoạ, không phải API công khai.
const SyncLane = 0b0000000000000000000000000000001;
const InputContinuousLane = 0b0000000000000000000000000000100;
const DefaultLane = 0b0000000000000000000000000010000;
const TransitionLanes = 0b0000000000000000000001110000000;
```

Tên chính xác và giá trị bit có thể đổi. Điều cần nhớ là **mỗi lane là một mức ưu tiên**, và React có thể gộp nhiều update cùng lane để render một lần.

Khi có update, React gọi `requestUpdateLane` để chọn lane dựa trên ngữ cảnh:

- **Sync lane**: update từ event rời rạc như click, keydown; cần phản hồi ngay.
- **Input continuous lane**: event liên tục như `mousemove`, `scroll`; ưu tiên cao nhưng có thể gộp.
- **Default lane**: update thông thường từ `setState`.
- **Transition lanes**: update được đánh dấu bởi `startTransition` hoặc `useTransition`.
- **Retry lanes**: render lại sau khi Suspense được giải quyết.
- **Idle lane**: việc có thể chờ.

Trong một lần render, React tính `renderLanes` — một bitmask gồm các lane cần xử lý. Nếu một component có update ở lane thấp hơn `renderLanes`, nó có thể được render với state cũ; update đó để lần sau. Đây là nguồn gốc của khái niệm “stale render” trong concurrent mode.

## Scheduler: nhường quyền cho trình duyệt

React không tự quyết định thời điểm chạy. Nó dùng một scheduler nội bộ, thường dựa trên `MessageChannel`, để chia công việc thành các task nhỏ.

Mỗi task có priority:

| Priority     | Dùng cho                              |
| ------------ | ------------------------------------- |
| Immediate    | việc phải xong ngay, thường là commit |
| UserBlocking | input, click                          |
| Normal       | update thông thường                   |
| Low          | transition                            |
| Idle         | việc có thể chờ                       |

Trong render phase, React gọi `shouldYield()` sau mỗi đơn vị công việc. Nếu đã chạy quá khoảng 5ms, nó nhường cho trình duyệt xử lý paint và input, rồi quay lại sau.

```ts
// Ý tưởng, không phải code React thật.
while (workInProgress !== null && !shouldYield()) {
  workInProgress = performUnitOfWork(workInProgress);
}
```

Điểm mấu chốt: React không dùng `requestIdleCallback`. Độ ưu tiên và thời điểm nhường do scheduler tự quản lý để có hành vi nhất quán giữa các trình duyệt.

## Khi bị ngắt, React giữ gì?

Fiber tree có `child` / `sibling` / `return`, nên React luôn biết node tiếp theo. Khi nhường, nó giữ `workInProgress` hiện tại và `renderLanes`. Lần chạy tiếp theo bắt đầu từ node đó, không phải từ root.

Nếu có update mới chen vào với lane cao hơn, React có thể:

- huỷ WIP hiện tại;
- bắt đầu một render mới với `renderLanes` mới;
- tái sử dụng những phần đã render nếu vẫn hợp lệ.

Vì element bất biến và mỗi Fiber có `alternate`, việc huỷ không làm hỏng cây `current` đang hiển thị. UI vẫn là phiên bản cũ cho tới khi commit.

## Commit phase: nơi concurrency dừng lại

Đây là giới hạn quan trọng: **React không ngắt commit phase**. Một khi bắt đầu mutation DOM, React chạy hết:

1. mutation;
2. layout effects;
3. chuyển sang cây mới;
4. passive effects sau paint.

Vì vậy, nếu commit quá nặng — thêm hàng nghìn node, chạy `useLayoutEffect` đo đạc phức tạp — concurrent rendering không cứu được. Nó chỉ giúp phần tính toán phía trước.

Muốn commit nhẹ hơn, phải giảm số DOM node thay đổi trong một lần, hoặc chia nhỏ công việc bằng virtualization, pagination, hoặc chuyển bớt việc sang sau paint.

## `startTransition`: đánh dấu, không trì hoãn

`startTransition` không đặt một timeout. Nó đánh dấu update là transition lane:

```tsx
const [query, setQuery] = useState('');
const [isPending, startTransition] = useTransition();

const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const value = event.target.value;

  // Update input ở lane ưu tiên cao: gõ phải mượt.
  setQuery(value);

  // Update danh sách kết quả ở lane thấp hơn.
  startTransition(() => {
    setResults(search(value));
  });
};
```

Nếu người dùng gõ tiếp trong lúc danh sách đang render, React có thể bỏ render danh sách cũ và bắt đầu lại với query mới. Input vẫn phản hồi vì nó ở lane cao hơn.

`isPending` cho biết transition đang chạy. Nó hữu ích để làm mờ danh sách cũ thay vì hiện loading toàn trang.

### `useDeferredValue` khác gì?

`useDeferredValue` giữ một phiên bản “chậm” của value:

```tsx
const deferredQuery = useDeferredValue(query);
const results = useMemo(() => search(deferredQuery), [deferredQuery]);
```

Nó không đánh dấu update; nó trì hoãn **giá trị đầu vào** của một phép tính. Khi `query` đổi nhanh, `deferredQuery` bám theo sau. React vẫn render component với giá trị cũ trước, rồi render lại với giá trị mới khi rảnh.

`startTransition` phù hợp khi bạn kiểm soát được hàm set state. `useDeferredValue` phù hợp khi value đến từ props hoặc từ nguồn bên ngoài.

## Starvation: lane thấp không được chờ mãi

Nếu transition liên tục bị update ưu tiên cao chen ngang, nó có thể không bao giờ chạy. React xử lý bằng cách cho lane “hết hạn” sau một khoảng thời gian. Khi hết hạn, lane được xử lý như việc gấp, dù priority thấp.

Đây là lý do concurrent rendering không biến mọi thứ thành “chạy khi rảnh mãi mãi”. Nó vẫn đảm bảo tiến độ.

## Những hiểu sai thường gặp

- **“Concurrent là đa luồng.”** Không. Vẫn một thread; React chỉ chia nhỏ và nhường.
- **“Bật concurrent là mọi render đều bị ngắt.”** Không. Sync update vẫn chạy đồng bộ; commit luôn đồng bộ.
- **“`startTransition` làm state đổi chậm.”** Không. State đổi ngay; chỉ việc render được ưu tiên thấp hơn.
- **“Dùng transition là hết giật.”** Không. Nếu commit quá nặng hoặc component render quá tốn, vẫn giật.
- **“Lane là API public.”** Không. Lane là chi tiết nội bộ; API public là `startTransition`, `useTransition`, `useDeferredValue`, Suspense.

## Cách quan sát trong thực tế

- React DevTools Profiler: xem commit nào chạy, component nào render lại.
- `useTransition` + `isPending`: xem transition có đang chạy.
- Performance panel: tìm long task; nếu long task nằm trong commit, tối ưu render không giải quyết được.
- Thêm `console.time` quanh phép tính nặng để biết chi phí thật, đừng đoán.

## Tóm lại

- Lane là bitmask biểu diễn mức ưu tiên của update.
- Scheduler chia render thành task nhỏ và nhường sau khoảng 5ms.
- Render phase có thể bị ngắt; commit phase thì không.
- `startTransition` đánh dấu update ưu tiên thấp, không trì hoãn state.
- Concurrent rendering giúp UI phản hồi, nhưng không miễn nhiễm với commit quá nặng.

Bài cuối đi vào một hệ quả khó thấy hơn của concurrent rendering: khi state nằm ngoài React, hai component có thể đọc hai phiên bản dữ liệu khác nhau trong cùng một lần render. Đó là tearing.
