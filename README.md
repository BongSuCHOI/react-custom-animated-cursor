# React Custom Animated Cursor

기본 커서를 커스텀 가능한 애니메이션 커서로 변경해주는 React Component입니다.
해당 Component는 함수형으로 제작되었습니다.

<br/>

## Contents

1. [Features](#-features)
2. [Demo](#-demo)
3. [Start](#-start)
4. [Options](#-options)
5. [Notes](#-notes)

<br/>

## Features

-   기본 커서 대체 `circle`
-   `circle`가 이동했던 경로를 선을 그리며 따라오는 `polyline`
-   클릭시 `circle` scale 축소 효과
-   호버시 `marker` 노출 효과

그 외에 `circle`, `polyline`, `marker`의 색상, 사이즈, 딜레이, 길이, 블랜드 모드 등 다양한 커스텀이 가능합니다.

<br/>

## Demo

[Live Demo](https://bongsuchoi.github.io/react-custom-animated-cursor/)

<br/>

## Start

아직 npm 패키지 등록을 안해서 lib에 있는 파일/폴더들을 다운 혹은 카피 후 본인 프로젝트에 적용해서 사용해야 합니다.

### 프로젝트에 적용

전역 위치에 추가(`App.js`)

```
import React from "react";
import CustomAnimatedCursor from "user project dir path";

export default function App() {
  return (
    <div className="App">
      <CustomAnimatedCursor />
    </div>
  );
}
```

### 사용 예시

```
import React from "react";
import CustomAnimatedCursor from "user project dir path";

export default function App() {
  return (
    <div className="App">
      <CustomAnimatedCursor
            dotColor={"#2AFADF"}
            dotSize={8}
            dotReductionRatio={0.25}
            lineColor={"#2AFADF"}
            lineDelay={2}
            lineLength={12}
            lineWidth={2}
            markerColor={"#2AFADF"}
            addRemoveCursor={".ex-video"}
            markerBlendMode={true}
        />
        ...component
    </div>
  );
}
```

<br/>

## Options

| Option              | Type    | Description                                                                                        | Default                                                   |
| ------------------- | ------- | -------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| `dotColor`          | string  | circle(dot) color - rgb or hex value                                                               | `#000`                                                    |
| `dotSize`           | number  | circle(dot) size - 6~12 recommended                                                                | `8`                                                       |
| `dotReductionRatio` | number  | circle(dot) reduction ratio - 0~1 limit                                                            | `0.25`                                                    |
| `lineColor`         | string  | polyline(line) color - rgb or hex value                                                            | `#000`                                                    |
| `lineDelay`         | number  | polyline(line) delay to follow - minimum 2 limit, maximum 12 recommended                           | `2`                                                       |
| `lineLength`        | number  | polyline(line) stretched length - 2~20 limit                                                       | `12`                                                      |
| `lineWidth`         | number  | polyline(line) width - Minimum 1 limit, maximum equal to "dotSize"                                 | `2`                                                       |
| `markerColor`       | string  | circle(marker) color - rgb or hex value                                                            | `#000`                                                    |
| `addRemoveCursor`   | array   | element from which you want to remove the default cursor - tag name or class or id (typeof string) | `['a', 'input', 'label', 'select', 'textarea', 'button']` |
| `markerBlendMode`   | boolean | whether the marker's blend mode - true or false                                                    | `true`                                                    |

<br/>

## Notes

-   [DFY](https://www.dfy.co.kr/)의 커서를 React 버전으로 만들어보고 싶어서 [react-animated-cursor](https://github.com/stephenscaff/react-animated-cursor)와 [DFY](https://www.dfy.co.kr/)를 참고하여 제작하였습니다.
-   공부 겸 지속적인 유지보수 및 개선을 해보고 싶어서 오픈소스의 형태로 제작하였습니다.
-   버그, 이슈, 리팩토링 등 다양한 피드백 환영합니다.

<br/>

## Etc

소스를 참고해서 만든 것을 공개 리포지토리로 공유해도 되냐고 물어본 메일은 답이 한달이 넘도록 없기도 하고,
저장소에 따로 수정/배포에 관한 내용은 안 써있어서 올렸습니다.
문제가 된다면 알려주세요. 바로 조치를 취하겠습니다.
