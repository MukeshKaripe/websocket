import { useState, useEffect } from "react";

const AnimatedText = () => {
    // const inptText = "Hello Siri I ❤️ U"
    const inptText = "Hi Welcome"
    const [text, setText] = useState('');
    const [displayChar, setDisplayChar] = useState(0);

    useEffect(() => {
        if (displayChar < inptText.length) {
            const timeOut = setTimeout(() => {
                setText(prev => prev + inptText[displayChar])
                setDisplayChar(prev => prev + 1)

            }, 500);
            return () => clearTimeout(timeOut);

        }

    }, [text, displayChar]);
    return (<>
        <h2>
            {text}
            <span>|</span>
        </h2>
        <span> <bold>Enter Room Number:</bold> 143</span>
    </>)
}
export default AnimatedText;