import React, { useRef, useEffect, useState, useCallback } from "react";
import { useEventListener } from "./hooks/useEventListener";
import styled from "./CustomAnimatedCursor.module.css";

/**
 * @param {string} dotColor - 도트 색상
 * @param {number} dotSize - 도트 사이즈
 * @param {number} dotReductionRatio - 도트 축소비율
 * @param {string} lineColor - 라인 색상
 * @param {number} lineDelay - 라인 딜레이
 * @param {number} lineLength - 라인 길이
 * @param {number} lineWidth - 라인 사이즈
 * @param {string} markerColor - 마커 색상
 * @param {array} addRemoveCursor - 커서 지울 요소
 * @param {boolean} markerBlendMode - 마커 블랜드 모드 활성화 여부
 */

/**
 * Todo
 * propTypes 추가
 */

function Cursor({
    dotColor = "#000", // rgb or hex
    dotSize = 8, // 6~12 권장
    dotReductionRatio = 0.25, // 0 ~ 1 제한
    lineColor = "#000", // rgb or hex
    lineDelay = 2, // 최소 2 제한, 최대 12 권장
    lineLength = 12, // 2~20 제힌
    lineWidth = 2, // 최소 1 제한, 최대 dotSize랑 동일 권장
    markerColor = "#fff", // rgb or hex
    addRemoveCursor = [], // 문자열 array
    markerBlendMode = true, // marker mix-blend-mode
}) {
    const drawingCursorRef = useRef();
    const svgRef = useRef();
    const circleRef = useRef();
    const polylineRef = useRef();
    const markerRef = useRef();
    const requestRef = useRef();
    const debounceRef = useRef();
    const pointsRef = useRef([]);
    const coordsRef = useRef({
        px: 0,
        py: 0,
        dist: 0,
        scale: 1,
    });

    const [cursorXY, setCursorXY] = useState({ x: 0, y: 0 });
    const [isVisible, setIsVisible] = useState(false);
    const [isClicked, setIsClicked] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const speed = lineDelay;
    const circleRadius = dotSize;
    const markerRadius = dotSize * 3;
    const totalPoints = lineLength;
    const removedCursor = [
        ...addRemoveCursor,
        "a",
        "input",
        "label",
        "select",
        "textarea",
        "button",
    ];

    // cursorXY coords update
    const onMouseMoveHandler = useCallback(({ clientX, clientY }) => {
        setCursorXY((prevState) => {
            return {
                ...prevState,
                x: clientX,
                y: clientY,
            };
        });
    }, []);

    // mouse state update
    const onMouseOverHandler = useCallback(() => setIsVisible(true), []);
    const onMouseOutHandler = useCallback(() => setIsVisible(false), []);
    const onMouseDownHandler = useCallback(() => setIsClicked(true), []);
    const onMouseUpHandler = useCallback(() => setIsClicked(false), []);

    // remove cursor
    useEffect(() => {
        const removedCursorElems = document.querySelectorAll(removedCursor.join(","));
        removedCursorElems.forEach((elem) => (elem.style.cursor = "none"));
        document.body.style.cursor = "none";
    }, []);

    // eventListener
    useEventListener("mousemove", onMouseMoveHandler);
    useEventListener("mouseover", onMouseOverHandler);
    useEventListener("mouseout", onMouseOutHandler);
    useEventListener("mousedown", onMouseDownHandler);
    useEventListener("mouseup", onMouseUpHandler);

    useEffect(() => {
        const hoverElems = document.querySelectorAll(".c-cursor-hover");
        hoverElems.forEach((elem) => {
            elem.addEventListener("mouseenter", () => {
                setIsHovered(true);
            });
            elem.addEventListener("mouseleave", () => {
                setIsHovered(false);
            });
        });

        return () => {
            hoverElems.forEach((elem) => {
                elem.removeEventListener("mouseenter", () => {
                    setIsHovered(true);
                });
                elem.removeEventListener("mouseleave", () => {
                    setIsHovered(false);
                });
            });
        };
    }, []);

    // pointer coords update
    function updateCoords() {
        const coords = coordsRef.current;
        coordsRef.current = {
            ...coordsRef.current,
            px: (coords.px += (cursorXY.x - coords.px) / speed),
            py: (coords.py += (cursorXY.y - coords.py) / speed),
            dist: (coords.dist = Math.abs(cursorXY.x - coords.px + (cursorXY.y - coords.py))),
            scale: (coords.scale = Math.max(
                coords.scale + ((100 - coords.dist * 8) * 0.01 - coords.scale) * 0.1,
                dotReductionRatio
            )),
        };
    }

    // animate cursor
    function drawCursor() {
        const coords = coordsRef.current;
        const points = pointsRef.current;

        updateCoords();

        // polyLine
        points.push({ x: coords.px, y: coords.py });
        while (points.length > totalPoints) {
            points.shift();
        }

        const pointsArr = points.map((point) => `${point.x},${point.y}`).join(" ");
        polylineRef.current.setAttribute("points", pointsArr);

        // circle
        circleRef.current.setAttribute("cx", cursorXY.x);
        circleRef.current.setAttribute("cy", cursorXY.y);
        circleRef.current.setAttribute("r", coords.scale * circleRadius);

        // marker
        if (isHovered) {
            markerRef.current.setAttribute("cx", cursorXY.x);
            markerRef.current.setAttribute("cy", cursorXY.y);
        }

        requestRef.current = requestAnimationFrame(drawCursor);
    }

    // rAF for drawCursor
    useEffect(() => {
        requestRef.current = requestAnimationFrame(drawCursor);

        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            cancelAnimationFrame(requestRef.current);
        }, ((speed + totalPoints) / 2) * 100);

        return () => cancelAnimationFrame(requestRef.current);
    }, [drawCursor]);

    // cursor visibility
    useEffect(() => {
        if (isVisible) {
            svgRef.current.classList.add(styled["visibled"]);
        } else {
            svgRef.current.classList.remove(styled["visibled"]);
        }
    }, [isVisible]);

    // cursor clicked
    useEffect(() => {
        if (isClicked) {
            cancelAnimationFrame(requestRef.current);
            circleRef.current.setAttribute("r", circleRadius - 2);
        } else {
            circleRef.current.setAttribute("r", circleRadius);
        }
    }, [isClicked]);

    // cursor hovered
    useEffect(() => {
        if (isHovered) {
            drawingCursorRef.current.classList.add(
                styled["hovered"],
                markerBlendMode && styled["blend"]
            );
            markerRef.current.style.r = markerRadius;
        } else {
            drawingCursorRef.current.classList.remove(
                styled["hovered"],
                markerBlendMode && styled["blend"]
            );
            markerRef.current.style.r = 0;
        }
    }, [isHovered]);

    // cursor style
    const cusStyle = {
        circle: { fill: dotColor },
        polyline: {
            stroke: lineColor,
            strokeWidth: lineWidth,
        },
        markerCircle: {
            fill: markerColor,
        },
    };

    return (
        <div ref={drawingCursorRef} className={styled["custom-cursor-wrap"]}>
            <svg ref={svgRef} className={styled["cursor-svg"]}>
                <circle
                    ref={circleRef}
                    className={styled["cursor-circle"]}
                    style={cusStyle.circle}
                    cx="500"
                    cy="500"
                    r={dotSize}
                ></circle>
                <polyline
                    ref={polylineRef}
                    className={styled["cursor-polyline"]}
                    style={cusStyle.polyline}
                    points=""
                ></polyline>
                <circle
                    ref={markerRef}
                    className={styled["cursor-marker"]}
                    style={cusStyle.markerCircle}
                    cx="48"
                    cy="48"
                    r="48"
                />
            </svg>
        </div>
    );
}

// render
function CustomAnimatedCursor({
    dotColor,
    dotSize,
    dotReductionRatio,
    lineColor,
    lineDelay,
    lineLength,
    lineWidth,
    markerColor,
    addRemoveCursor,
    markerBlendMode,
}) {
    return (
        <Cursor
            dotColor={dotColor}
            dotSize={dotSize}
            dotReductionRatio={dotReductionRatio}
            lineColor={lineColor}
            lineDelay={lineDelay}
            lineLength={lineLength}
            lineWidth={lineWidth}
            markerColor={markerColor}
            addRemoveCursor={addRemoveCursor}
            markerBlendMode={markerBlendMode}
        />
    );
}

export default React.memo(CustomAnimatedCursor);
