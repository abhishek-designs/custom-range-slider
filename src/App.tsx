import { useState, useEffect } from "react";
import RangeSlider from "./components/RangeSlider";
import "./App.css";

interface Color {
  red: number;
  green: number;
  blue: number;
}

function App() {
  const [rangeValue, setValue] = useState<number>(0);
  const [ledColor, setLedColor] = useState<Color>({
    red: 0,
    green: 255,
    blue: 0,
  });
  const sliders = [
    {
      id: 1,
      min: 0,
      max: 255,
      color: "red",
      marker: false,
      range: true,
    },
    {
      id: 2,
      min: 0,
      max: 255,
      color: "red",
      marker: false,
      range: true,
    },
    {
      id: 3,
      min: 0,
      max: 255,
      color: "red",
      marker: false,
      range: true,
    },
  ];

  // Function to set led colors
  const manipulateLED = (color: Color) => {
    setLedColor(color);
  };

  return (
    <div className="App">
      <div className="btn-grp">
        <button
          className="led-btn red"
          onClick={() => manipulateLED({ red: 255, green: 0, blue: 0 })}
        >
          Red
        </button>
        <button
          className="led-btn green"
          onClick={() => manipulateLED({ red: 0, green: 255, blue: 0 })}
        >
          Green
        </button>
        <button
          className="led-btn blue"
          onClick={() => manipulateLED({ red: 0, green: 0, blue: 255 })}
        >
          Blue
        </button>
      </div>
      {sliders.map(slider => (
        <>
          <RangeSlider
            key={slider.id}
            minRange={slider.min}
            maxRange={slider.max}
            onSliderChange={(value: number) => {
              slider.id === 1 && setLedColor({ ...ledColor, red: value });
              slider.id === 2 && setLedColor({ ...ledColor, green: value });
              slider.id === 3 && setLedColor({ ...ledColor, blue: value });
            }}
            showRange={slider.range}
            showMarker={slider.marker}
            sliderColor="red"
          />
          <br />
          <br />
        </>
      ))}
      <div
        className="output-led"
        style={{
          backgroundColor: `rgb(${ledColor.red},${ledColor.green},${ledColor.blue})`,
        }}
      ></div>
    </div>
  );
}

export default App;
