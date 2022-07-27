import React from "react";
import CustomAnimatedCursor from "../../lib";

export default function App() {
    return (
        <div className="App">
            <CustomAnimatedCursor
            // dotColor={}
            // polyLineColor={}
            // dotSize={8}
            // dotSpeed={2}
            />
            <div>
                <p>TEXT TEST</p>
                <a href="#">LINK TEST</a>
                <br />
                <br />
                <button type="button">BUTTON TEST</button>
                <br />
                <br />
                <button type="submit">SUBMIT TEST</button>
                <br />
                <br />
                <input type="text" placeholder="INPUT TEXT TEST" />
                <br />
                <br />
                <input type="password" placeholder="INPUT PASSWORD TEST" />
                <br />
                <br />
                <input type="number" placeholder="INPUT NUMBER TEST" />
                <br />
                <br />
                <input type="checkbox" placeholder="INPUT CHECKBOX TEST" />
                <br />
                <br />
                <input type="radio" placeholder="INPUT RADIO TEST" />
                <br />
                <br />
                <select>
                    <option>SELECTBOX TEST 1</option>
                    <option>SELECTBOX TEST 2</option>
                </select>
                <div
                    id="hover-box"
                    style={{
                        color: "#fff",
                        padding: "30px",
                        background: "blue",
                    }}
                >
                    Hover Box
                </div>
            </div>
        </div>
    );
}
