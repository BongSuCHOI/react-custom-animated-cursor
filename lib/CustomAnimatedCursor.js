import React from "react";

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
            <div style={cursorStyles.cursorDefault}></div>
            <div style={cursorStyles.cursorDot}></div>
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
