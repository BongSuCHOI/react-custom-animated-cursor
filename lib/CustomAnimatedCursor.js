import React, { useRef, useEffect, useState } from "react";

// common eventListener
function commonEventListener(eventName, eventHandler) {
    // 이벤트 핸들러 저장
    const eventHandlerRef = useRef();

    // 파라미터로 받은 eventHandler ref에 업데이트
    useEffect(() => {
        eventHandlerRef.current = eventHandler;
    }, [eventHandler]);

    useEffect(() => {
        // window가 존재하고, 이벤트리스너를 지원하는지 체크
        const isSupported = window && window.addEventListener;
        if (!isSupported) return;

        // ref에 저장해논 eventHandler함수를 실행하는 이벤트리스너 함수 생성
        const eventListener = (event) => {
            return eventHandlerRef.current(event);
        };

        window.addEventListener(eventName, eventListener);

        return () => {
            window.removeEventListener(eventName, eventListener);
        };
    }, [eventName, window]);
}

// cursor component
function Cursor({
    DefaultWidth,
    DefaultHeight,
    DefaultColor,
    DefaultAlpha,
    DotWidth,
    DotHeight,
    DotColor,
    DotAlpha,
}) {
    const cursorDefaultRef = useRef();
    const cursorDotRef = useRef();
    const [cursorCoords, setCursorCoords] = useState({ x: 0, y: 0 });

    // init cursor
    function initCursorCoords() {
        cursorDefaultRef.current.style.top = `${cursorCoords.y}px`;
        cursorDefaultRef.current.style.left = `${cursorCoords.x}px`;
        cursorDotRef.current.style.top = `${cursorCoords.y}px`;
        cursorDotRef.current.style.left = `${cursorCoords.x}px`;
        document.body.style.cursor = "none";
    }

    // 실시간 커서 좌표 설정 이벤트
    function onMouseMove({ clientX, clientY }) {
        setCursorCoords({ x: clientX, y: clientY });
        initCursorCoords();
    }

    commonEventListener("mousemove", onMouseMove);

    // cursor style
    const cursorStyles = {
        cursorDefault: {
            zIndex: 999,
            position: "fixed",
            width: DefaultWidth,
            height: DefaultHeight,
            pointerEvents: "none",
            backgroundColor: DefaultColor,
            opacity: DefaultAlpha,
            borderRadius: "50%",
            transform: "translate(-50%, -50%)",
        },
        cursorDot: {
            zIndex: 998,
            position: "fixed",
            width: DotWidth,
            height: DotHeight,
            pointerEvents: "none",
            backgroundColor: DotColor,
            opacity: DotAlpha,
            borderRadius: "50%",
            transform: "translate(-50%, -50%)",
        },
    };

    return (
        <div className="cursor_wrap">
            <div ref={cursorDefaultRef} style={cursorStyles.cursorDefault}></div>
            <div ref={cursorDotRef} style={cursorStyles.cursorDot}></div>
        </div>
    );
}

// render
function CustomAnimatedCursor() {
    return (
        <Cursor
            DefaultWidth={10}
            DefaultHeight={10}
            DefaultColor={"#000"}
            DefaultAlpha={1}
            DotWidth={30}
            DotHeight={30}
            DotColor={"red"}
            DotAlpha={1}
        />
    );
}

export default CustomAnimatedCursor;
