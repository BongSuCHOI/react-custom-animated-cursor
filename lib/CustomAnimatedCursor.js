import React, { useRef, useEffect, useState, useCallback } from "react";
import { useEventListener } from "./hooks/useEventListener";

/**
 * @param {string} dotColor - 도트 색상
 * @param {number} dotSize - 도트 사이즈
 * @param {number} dotReductionRatio - 도트 축소비율
 * @param {string} lineColor - 라인 색상
 * @param {number} lineDelay - 라인 딜레이
 * @param {number} lineLength - 라인 길이
 * @param {number} lineWidth - 라인 사이즈
 */

/**
 * Todo
 * 전역 스타일 커서 none 처리
 * 인라인 스타일로 제어하는 부분 최대한 class제어로 변경
 */

function Cursor({
    dotColor = "#000", // rgb or hex
    dotSize = 8, // 6~12 권장
    dotReductionRatio = 0.25, // 0 ~ 1 제한
    lineColor = "#000", // rgb or hex
    lineDelay = 2, // 최소 2 제한, 최대 12 권장
    lineLength = 12, // 2~20 제힌
    lineWidth = 2, // 최소 1 제한, 최대 dotSize랑 동일 권장
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

    // remove global cursor
    document.body.style.cursor = "none";

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

    // eventListener
    useEventListener("mousemove", onMouseMoveHandler);
    useEventListener("mouseover", onMouseOverHandler);
    useEventListener("mouseout", onMouseOutHandler);
    useEventListener("mousedown", onMouseDownHandler);
    useEventListener("mouseup", onMouseUpHandler);

    useEffect(() => {
        const hoverBox = document.querySelector("#hover-box");
        hoverBox.addEventListener("mouseenter", () => {
            setIsHovered(true);
        });
        hoverBox.addEventListener("mouseleave", () => {
            setIsHovered(false);
        });

        return () => {
            hoverBox.removeEventListener("mouseenter", () => {
                setIsHovered(true);
            });
            hoverBox.removeEventListener("mouseleave", () => {
                setIsHovered(false);
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
            svgRef.current.style.opacity = 1;
        } else {
            svgRef.current.style.opacity = 0;
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
            circleRef.current.style.opacity = 0;
            polylineRef.current.style.opacity = 0;
            drawingCursorRef.current.style.mixBlendMode = "difference";
            markerRef.current.style.r = markerRadius;
            markerRef.current.style.opacity = 1;
        } else {
            circleRef.current.style.opacity = 1;
            polylineRef.current.style.opacity = 1;
            drawingCursorRef.current.style.mixBlendMode = "unset";
            markerRef.current.style.r = 0;
            markerRef.current.style.opacity = 0;
        }
    }, [isHovered]);

    // cursor style
    const styled = {
        drawingCursor: {
            position: "relative",
            zIndex: 1500,
            height: 0,
        },
        svg: {
            position: "fixed",
            left: 0,
            top: 0,
            width: "100%",
            height: "100%",
            zIndex: 1,
            pointerEvents: "none",
            transition: "opacity 0.5s",
        },
        circle: { fill: dotColor, transition: "opacity 0.2s" },
        polyline: {
            fill: "none",
            stroke: lineColor,
            strokeWidth: lineWidth,
            transition: "opacity 0.2s",
        },
        markerCircle: {
            zIndex: 5,
            r: "0px",
            fill: "#d2330f",
            transition: "opacity 0.2s, r 0.2s cubic-bezier(0.22, 0.61, 0.36, 1)",
        },
    };

    return (
        <div ref={drawingCursorRef} style={styled.drawingCursor}>
            <svg ref={svgRef} style={styled.svg}>
                <circle
                    ref={circleRef}
                    style={styled.circle}
                    cx="500"
                    cy="500"
                    r={dotSize}
                ></circle>
                <polyline ref={polylineRef} style={styled.polyline} points=""></polyline>
                <circle ref={markerRef} style={styled.markerCircle} cx="48" cy="48" r="48" />
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
        />
    );
}

export default React.memo(CustomAnimatedCursor);
