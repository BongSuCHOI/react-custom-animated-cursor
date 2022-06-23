import React from "react";

// cursor component
function Cursor() {
    return (
        <div className="cursor_wrap">
            <div className="cursor_default"></div>
            <div className="cursor_dot"></div>
        </div>
    );
}

// render
function CustomAnimatedCursor() {
    return <Cursor />;
}

export default CustomAnimatedCursor;
