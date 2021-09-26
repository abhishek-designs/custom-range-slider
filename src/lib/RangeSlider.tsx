import { useDrag } from "react-use-gesture";
import { useSpring, animated } from "react-spring";
import { useState, useEffect, useRef, FC } from "react";

type Color = "red" | "green" | "blue" | "purple";

interface Props {
  minRange: number;
  maxRange: number;
  showMarker?: boolean;
  showRange?: boolean;
  sliderColor?: Color;
  thumb?: any;
  onSliderChange: Function;
}

interface SliderTheme {
  mainColor: string;
  remainColor: string;
}

const RangeSlider: FC<Props> = ({
  minRange,
  maxRange,
  showMarker,
  showRange,
  thumb,
  sliderColor,
  onSliderChange,
}) => {
  const [sliderWidth] = useState<number>(320);
  const [thumbOffset] = useState<number>(30);
  const [progress, setProgress] = useState<number>(0);
  const [min, setMinRange] = useState<number>(minRange);
  const [max, setMaxRange] = useState<number>(maxRange);
  const [outputRange, setOutput] = useState<number>(0);
  const [markerPos, setMarkerPos] = useState<number[]>([]);
  const [initPos, setPos] = useState<number>(0);
  const [sliderTheme, setTheme] = useState<SliderTheme>({
    mainColor: "hsl(0,100%,50%)",
    remainColor: "hsl(0,30%,40%)",
  });
  const [thumbStyle, animThumb] = useSpring(() => ({
    x: 0,
    scale: 1,
    cursor: "grab",
  }));
  const [posStyle, animPos] = useSpring(() => ({ scale: 0, x: "-50%" }));

  const sliderRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);

  const showSlider = (selectedPos: number) => {
    const distance = selectedPos - initPos;
    setPos(initPos + distance);
  };

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
    setOutput(outRange);
  };

  // Bind function to execute when user drags the thumb
  const bind = useDrag(({ down, active, offset: [x] }) => {
    let thumbPos = x; // Current thumb position
    let offsetPos = x + thumbOffset; // Thumb position offset by the total offset
    const progressWidth = calcProgressWidth(offsetPos);

    setProgress(clampNum(progressWidth, 0, 100)); // Setting the width of progress line according to thumb position
    if (progressWidth > 100 || progressWidth < 0) {
      thumbPos = clampNum(x, 0, sliderWidth - thumbOffset); // Clamp the position to make the thumb stay within the range
    }

    // Slide the thumb on drag
    animThumb.start({
      x: thumbPos,
      scale: down ? 0.8 : 1,
      cursor: down ? "grabbing" : "grab",
      immediate: active,
    });

    // Show the position num on drag
    animPos.start({
      scale: down ? 1 : 0,
    });
  });

  // Function to give the value of the output range
  const sliderChange = (val: number) => {
    onSliderChange(val);
  };

  // Function to set theme
  const setColorTheme = (color: number) => {
    const newColor: SliderTheme = {
      mainColor: `hsl(${color},100%,50%)`,
      remainColor: `hsl(${color},30%,40%)`,
    };

    setTheme(newColor);
  };

  // Function to set slider range
  const setSliderRange = () => {
    setMinRange(minRange);
    setMaxRange(maxRange);
  };

  // Function to switch colors
  const switchColors = () => {
    switch (sliderColor) {
      case "green":
        setColorTheme(120);
        break;
      case "red":
        setColorTheme(0);
        break;
      case "blue":
        setColorTheme(210);
        break;
      case "purple":
        setColorTheme(275);
        break;
    }
  };

  useEffect(() => {
    calcOutputRange(calcOffsetRange(min, max));
    sliderChange(Math.floor(outputRange));
    // eslint-disable-next-line
  }, [progress, outputRange, min, max]);

  useEffect(() => {
    setSliderRange();
  }, [minRange, maxRange]);

  useEffect(() => {
    switchColors();
    // eslint-disable-next-line
  }, [sliderColor]);

  return (
    <div className="slider-wrapper" style={{ width: sliderWidth }}>
      <div
        ref={sliderRef}
        className="progress-bar"
        style={{ background: sliderTheme.remainColor }}
        onClick={e => {
          showSlider(e.nativeEvent.offsetX);
          console.log("progress clicked");
        }}
      >
        <div
          className="progress-line"
          style={{ width: `${progress}%`, background: sliderTheme.mainColor }}
        ></div>
        <animated.div
          ref={thumbRef}
          {...bind()}
          style={
            thumb
              ? { ...thumbStyle, ...thumb, background: sliderTheme.mainColor }
              : { ...thumbStyle, background: sliderTheme.mainColor }
          }
          className="thumb"
        >
          {showRange && (
            <animated.div style={posStyle} className="range-box">
              {Math.floor(outputRange)}
            </animated.div>
          )}
        </animated.div>
      </div>
      {showMarker && (
        <div className="progress-marker">
          {markerPos.map((pos, i) => (
            <div key={i} className="marker" style={{ left: `${pos}%` }}></div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RangeSlider;
