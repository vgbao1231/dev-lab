---
title: 'React Fiber & Reconciliation: React thực sự render UI như thế nào?'
date: 2026-10-22
type: concept
lab: react-lab
tags: ['react', 'internals', 'rendering']
cover: react-fiber
coverAlt: 'Sơ đồ Fiber tree với Root, Header và List, các nhánh current và work-in-progress cùng nhãn render → commit'
summary: 'Từ element tree đến Fiber tree, render phase và commit phase — vì sao key quyết định việc giữ hay mất state.'
draft: false
---

Khi viết React, ta quen với một câu ngắn: “UI là hàm của state”. Nhưng từ `setState` đến pixel trên màn hình là một chuỗi bước khá dài, và phần lớn lỗi khó hiểu — mất state khi đổi `key`, effect chạy sai thứ tự, component render hai lần — đều nằm ở chuỗi bước đó.

Bài này đi qua cơ chế: React biểu diễn UI bằng **element tree**, chuyển nó thành **Fiber tree**, rồi chia công việc thành **render phase** và **commit phase**. Hiểu ba thứ này thì các quy tắc về `key`, state và effect không còn là “luật học thuộc”.

> Đây là bài về internals, không phải API công khai. Tên hàm và trường trong Fiber có thể đổi giữa các phiên bản React. Phần khái niệm — double buffering, reconciliation, hai phase — thì ổn định.

## Element tree: mô tả, không phải trạng thái

JSX trả về một cây object bất biến. Mỗi lần render, React tạo một cây mới:

```tsx
const element = {
  type: 'button',
  key: null,
  props: {
    className: 'primary',
    children: 'Lưu',
  },
};
```

Element không có state, không có DOM, không có method. Nó chỉ là **mô tả** UI tại một thời điểm. Vì bất biến, React có thể tạo bao nhiêu cây element cũng được mà không sợ ai đó sửa vào.

Nhưng để cập nhật DOM, React cần một cấu trúc **có thể sửa được**, giữ được vị trí của từng component giữa hai lần render, và biết phần nào cần thay đổi. Đó là Fiber.

## Fiber: một đơn vị công việc

Mỗi node trong Fiber tree đại diện cho một component, một DOM node hoặc một fragment. Fiber là object thường, có các liên kết chính:

- `child`: node con đầu tiên.
- `sibling`: node anh em kế tiếp.
- `return`: node cha.
- `alternate`: bản đối diện trong cặp double buffer.
- `stateNode`: thứ gắn với node — DOM element, class instance, function component.
- `memoizedState`: hook state của component.
- `flags`: những việc cần làm khi commit.

Cấu trúc `child` / `sibling` / `return` biến cây thành một danh sách liên kết. Nhờ vậy React có thể dừng giữa chừng, nhớ mình đang ở đâu, rồi quay lại sau — điều kiện cần cho concurrent rendering.

### Double buffering

React giữ **hai** cây:

- `current`: cây đang phản ánh UI trên màn hình.
- `workInProgress` (WIP): cây đang được xây cho lần cập nhật tiếp theo.

Mỗi Fiber trong cây này trỏ tới Fiber tương ứng ở cây kia qua `alternate`. Khi render xong, React không sửa `current` tại chỗ. Nó hoán đổi vai trò: WIP trở thành `current`, cây cũ thành nguồn để tái sử dụng cho lần sau.

Cách làm này giống vẽ lên một khung hình mới rồi mới đưa ra màn hình. Nếu render bị huỷ giữa chừng, UI đang hiển thị vẫn nguyên vẹn.

## Render phase: tính toán, được phép gián đoạn

Render phase bắt đầu từ root và đi qua từng Fiber. Với mỗi node, React gọi `beginWork` để:

1. So sánh element mới với Fiber cũ.
2. Quyết định giữ, sửa, thêm hay xoá node.
3. Tạo Fiber con nếu cần.

Sau khi xử lý hết con, React gọi `completeWork` để chuẩn bị DOM thật và gom các thay đổi vào `flags`.

Điểm quan trọng: **render phase không được gây side effect**. Không ghi vào DOM, không gọi API, không set state của component khác. Vì React có thể:

- chạy render, rồi huỷ;
- chạy lại từ đầu;
- chạy một phần, nhường cho việc gấp hơn, rồi quay lại.

Nếu render có side effect, một lần render bị huỷ vẫn để lại dấu vết. Đó là lý do `StrictMode` cố tình gọi một số hàm hai lần trong môi trường dev: nó muốn phát hiện side effect không an toàn.

### Reconciliation: so sánh theo kiểu và key

Reconciliation là thuật toán quyết định node nào được giữ lại. React không so sánh cả cây một cách thông minh; nó dùng hai tín hiệu rẻ và đủ tốt:

1. **Kiểu** (`type`): `div` khác `span`, `Button` khác `Link`.
2. **Key**: định danh ổn định giữa các lần render.

Nếu `type` và `key` giống nhau, React coi đó là cùng một node logic và tái sử dụng Fiber. Nếu khác, React unmount node cũ và mount node mới — state, effect, DOM đều bị tạo lại.

```tsx
function List({ items }: { items: string[] }) {
  return (
    <ul>
      {items.map((item, index) => (
        <Row key={index} label={item} />
      ))}
    </ul>
  );
}
```

Dùng `index` làm key nghe có vẻ ổn cho tới khi danh sách bị chèn hoặc xoá ở đầu. Lúc đó key `0` vẫn là key `0`, nhưng nội dung đã khác. React giữ Fiber cũ và chỉ đổi props. Nếu `Row` có state nội bộ — input đang gõ dở, trạng thái mở/đóng — state đó bám nhầm dữ liệu.

```tsx
// Key ổn định theo dữ liệu, không theo vị trí.
<Row key={item.id} label={item.label} />
```

Quy tắc thực dụng: key phải ổn định, duy nhất trong cùng một danh sách, và gắn với **danh tính dữ liệu**, không phải thứ tự hiển thị.

### Bailout: khi React bỏ qua

Nếu props và state không đổi, React có thể bỏ qua việc render lại một nhánh. Cơ chế này gọi là bailout. Nó giải thích vì sao `React.memo`, `useMemo` và cấu trúc state hợp lý lại quan trọng: chúng giúp React nhận ra “nhánh này không cần làm gì”.

Nhưng bailout không phải miễn phí. React vẫn phải đi qua cây để biết có gì thay đổi. Tối ưu quá mức — bọc `memo` mọi thứ, tạo object mới trong dependency — có thể làm code khó đọc mà lợi ích không đáng.

## Commit phase: chạm vào DOM, không được gián đoạn

Khi render xong, React bước vào commit phase. Đây là lúc những thay đổi đã tính toán được áp dụng:

1. **Mutation**: thêm, sửa, xoá DOM; cập nhật ref.
2. **Layout effects**: chạy `useLayoutEffect`, đo đạc layout trước khi trình duyệt paint.
3. **Paint**: trình duyệt vẽ khung hình.
4. **Passive effects**: chạy `useEffect` sau paint.

Commit phase chạy đồng bộ và không bị ngắt. Nếu đang thêm 1.000 DOM node, trình duyệt sẽ bận cho tới khi xong. Đây là lý do “concurrent rendering” không có nghĩa là mọi thứ đều song song: React có thể ngắt **render**, nhưng không ngắt **commit**.

Cũng vì thế, `useLayoutEffect` phải nhẹ. Nó chặn paint. Còn `useEffect` chạy sau paint, phù hợp cho việc không cần đồng bộ layout.

## Một vòng cập nhật đầy đủ

Ghép lại:

```text
setState
  → schedule
  → render phase (beginWork / completeWork trên WIP)
  → commit phase (mutation → layout effect → paint → passive effect)
  → current = WIP
```

Khi render bị gián đoạn, WIP bị bỏ. Lần sau React có thể bắt đầu lại từ một nhánh khác. Vì element bất biến và Fiber có `alternate`, việc bắt đầu lại không làm hỏng UI đang hiển thị.

## Vì sao hiểu chuyện này lại có ích?

Ba lỗi thường gặp trở nên dễ giải thích hơn:

- **Mất state khi đổi key**: key đổi → React coi là node mới → state cũ bị unmount.
- **Effect chạy sai thứ tự**: layout effect chạy trước paint, passive effect sau paint; cleanup chạy trước effect mới.
- **Component render hai lần**: render phase có thể chạy lại; đừng đặt side effect ở đó.

Fiber không phải thứ cần nhớ để viết một form. Nhưng khi debug một danh sách nhảy state, một effect đo layout sai, hay một animation giật vì commit quá nặng, biết mình đang ở phase nào giúp khoanh vùng nhanh hơn nhiều.

## Tóm lại

- Element là mô tả bất biến; Fiber là đơn vị công việc có thể sửa.
- React dùng hai cây `current` và `workInProgress` để render mà không phá UI hiện tại.
- Reconciliation dựa vào `type` và `key`; key sai làm state bám nhầm dữ liệu.
- Render phase được phép gián đoạn và không được có side effect.
- Commit phase chạm DOM, chạy layout effect rồi mới paint; nó không bị ngắt.

Bài tiếp theo đi sâu vào phần “được phép gián đoạn”: lanes, scheduler và cách React quyết định việc gì gấp hơn việc gì.
