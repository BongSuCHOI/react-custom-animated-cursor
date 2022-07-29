import { useRef, useEffect } from "react";
export function useEventListener(eventName, handler, element = window) {
    // 이벤트 핸들러 저장
    const eventHandlerRef = useRef();

    // 파라미터로 받은 eventHandler ref에 업데이트
    useEffect(() => {
        eventHandlerRef.current = handler;
    }, [handler]);

    useEffect(() => {
        // window가 존재하고, 이벤트리스너를 지원하는지 체크
        const isSupported = element && element.addEventListener;
        if (!isSupported) return;

        // ref에 저장해논 eventHandler함수를 실행하는 이벤트리스너 함수 생성
        const eventListener = (event) => eventHandlerRef.current(event);

        // 이벤트리스너 추가
        element.addEventListener(eventName, eventListener);

        // cleanup
        return () => {
            element.removeEventListener(eventName, eventListener);
        };
    }, [eventName, element]);
}
