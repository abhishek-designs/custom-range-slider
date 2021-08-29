import { useDrag } from "react-use-gesture";
import { useSpring, animated } from "react-spring";
import { useState, useEffect } from "react";

const RangeSlider = () => {
  const [sliderWidth] = useState<number>(320);
  const [thumbOffset] = useState<number>(30);
  const [thumbStyle, animThumb] = useSpring(() => ({
    x: 0,
    scale: 1,
    cursor: "grab",
  }));
  const [progress, setProgress] = useState<number>(0);
  const [min] = useState<number>(2);
  const [max] = useState<number>(20);
  const [outputRange, setOutput] = useState<number>(0);
  const [markerPos, setMarkerPos] = useState<number[]>([]);

  // Function to calculate offset range on the basis of min and max num
  const calcOffsetRange = (min: number, max: number) => {
    let total = 0;
    const markPos = [0];

    for (let i = min; i < max; i++) {
      total++;
    }
    const range = 100 / total;
    for (let j = 1; j <= total; j++) {
      markPos.push(range * j);
    }

    setMarkerPos(markPos);
    // console.log(1000 / total);
    return range;
  };

  // Function to calculate progress line width
  const calcProgressWidth = (offset: number) => {
    let percent = 0;
    percent = offset / sliderWidth;
    return Math.floor(percent * 100);
  };

  // Function to clamp num
  const clampNum = (initNum: number, startNum: number, finalNum: number) => {
    if (initNum < startNum) return startNum;
    else if (initNum > finalNum) return finalNum;
    return initNum;
  };

  // Function to carry out output range on given min max
  const calcOutputRange = (offsetRange: number) => {
    const outRange = min + progress / offsetRange;
    console.log(outRange);
    setOutput(outRange);
  };

  // Bind function to execute when user drags the thumb
  const bind = useDrag(({ down, active, offset: [x] }) => {
    let thumbPos = x; // Current thumb position
    let offsetPos = x + thumbOffset; // Thubm position offset by the total offset
    const progressWidth = calcProgressWidth(offsetPos);

    setProgress(clampNum(progressWidth, 0, 100)); // Setting the width of progress line according to thumb position
    if (progressWidth > 100 || progressWidth < 0) {
      thumbPos = clampNum(x, 0, sliderWidth - thumbOffset); // Clamp the position to make the thumb stay within the range
    }
    animThumb.start({
      x: thumbPos,
      scale: down ? 0.8 : 1,
      cursor: down ? "grabbing" : "grab",
      immediate: active,
    }); // Slide the thumb on drag
  });

  useEffect(() => {
    calcOutputRange(calcOffsetRange(min, max));
  }, [progress, outputRange]);

  return (
    <div className="slider-wrapper" style={{ width: sliderWidth }}>
      <div className="progress-bar">
        <div className="progress-line" style={{ width: `${progress}%` }}></div>
        <animated.div
          {...bind()}
          style={thumbStyle}
          className="thumb"
        ></animated.div>
      </div>
      <div className="progress-marker">
        {markerPos.map((pos, i) => (
          <div key={i} className="marker" style={{ left: `${pos}%` }}></div>
        ))}
      </div>
      <h3 className="output-txt">{Math.floor(outputRange)}</h3>
    </div>
  );
};

export default RangeSlider;
