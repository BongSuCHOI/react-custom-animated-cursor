import React, { useRef, useEffect, useState } from "react";

/**
 * dotColor = 도트 색상
 * dotSize = 도트 사이즈
 * dotReductionRatio = 도트 축소비율
 * lineColor = 라인 색상
 * lineDelay = 라인 딜레이
 * lineLength = 라인 길이
 * lineWidth = 라인 사이즈
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
    const circleRef = useRef();
    const polylineRef = useRef();
    const requestRef = useRef();
    const debounceRef = useRef();
    const pointsRef = useRef([]);
    const coordsRef = useRef({
        px: 0,
        py: 0,
        dist: 0,
        scale: 1,
    });

    const [cursorXY, setCursorXY] = useState({
        x: 0,
        y: 0,
    });

    const speed = lineDelay;
    const circleRadius = dotSize;
    const totalPoints = lineLength;

    // remove global cursor
    document.body.style.cursor = "none";

    // cursorXY update
    function onMouseMoveHandler({ clientX, clientY }) {
        setCursorXY((prevState) => {
            return {
                ...prevState,
                x: clientX,
                y: clientY,
            };
        });
    }

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

    // eventListener
    useEffect(() => {
        window.addEventListener("mousemove", onMouseMoveHandler);
        return () => window.removeEventListener("mousemove", onMouseMoveHandler);
    }, []);

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
        },
        circle: { fill: dotColor },
        polyline: {
            fill: "none",
            stroke: lineColor,
            strokeWidth: lineWidth,
        },
        markerCircle: {
            r: "0px",
            fill: "#d2330f",
            transition: "r 200ms cubic-bezier(0.22, 0.61, 0.36, 1)",
        },
    };

    return (
        <div id="drawing-cursor" style={styled.drawingCursor}>
            <svg style={styled.svg}>
                <circle
                    id="pointer-circle"
                    ref={circleRef}
                    style={styled.circle}
                    cx="500"
                    cy="500"
                    r={dotSize}
                ></circle>
                <polyline
                    id="drawing-polyline"
                    ref={polylineRef}
                    style={styled.polyline}
                    points=""
                ></polyline>
                <svg className="marker-circs">
                    <circle
                        style={styled.markerCircle}
                        className="bg-circs__fill"
                        cx="48"
                        cy="48"
                        r="48"
                    />
                </svg>
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
