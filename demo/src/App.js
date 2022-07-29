import React from "react";
import CustomAnimatedCursor from "../../lib";
import DemoContent from "./DemoContent";

export default function App() {
    return (
        <div className="App">
            <CustomAnimatedCursor
                dotColor={"#2AFADF"}
                lineColor={"#2AFADF"}
                markerColor={"#2AFADF"}
            />
            <DemoContent />
        </div>
    );
}
