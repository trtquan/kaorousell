import React, {useReducer, useEffect } from "react";

import Alert from "@reach/alert";
import VisuallyHidden from "@reach/visually-hidden";
import { FaPlay, FaPause, FaForward, FaBackward } from "react-icons/fa";
import { config } from './config/config';
import slides from "./mocks/slides";
import Carousel from "./components/Carousel";
import Slides from "./components/Slides";
import Slide from "./components/Slide";
import SlideNavItem from "./components/SlideNavItem";
import SlideNav from "./components/SlideNav";
import Controls from "./components/Controls";
import IconButton from "./components/IconButton";
import ProgressBar from "./components/ProgressBar";
import SpacerGif from "./components/SpacerGif";

function App() {
  let [state, dispatch] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "PROGRESS":
        case "NEXT":
          return {
            ...state,
            takeFocus: false,
            isPlaying: action.type === "PROGRESS",
            currentIndex: (state.currentIndex + 1) % slides.length
          };
        case "PREV":
          return {
            ...state,
            takeFocus: false,
            isPlaying: false,
            currentIndex:
              (state.currentIndex - 1 + slides.length) % slides.length
          };
        case "PLAY":
          return {
            ...state,
            takeFocus: false,
            isPlaying: true
          };
        case "PAUSE":
          return {
            ...state,
            takeFocus: false,
            isPlaying: false
          };
        case "GOTO":
          return {
            ...state,
            takeFocus: true,
            currentIndex: action.index
          };
        default:
          return state;
      }
    },
    {
      currentIndex: 0,
      isPlaying: false,
      takeFocus: false
    }
  );

  useEffect(
    () => {
      if (state.isPlaying) {
        let timeout = setTimeout(() => {
          dispatch({ type: "PROGRESS" });
        }, config.slide_duration);
        return () => clearTimeout(timeout);
      }
    },
    [state.currentIndex, state.isPlaying]
  );
  return (
    <Carousel aria-label="Images from Space">
      <Slides>
        {slides.map((image, index) => (
          <Slide
            key={index}
            id={`image-${index}`}
            image={image.img}
            title={image.title}
            isCurrent={index === state.currentIndex}
            takeFocus={state.takeFocus}
            children={image.content}
          />
        ))}
      </Slides>

      <SlideNav>
        {slides.map((slide, index) => (
          <SlideNavItem
            key={index}
            isCurrent={index === state.currentIndex}
            aria-label={`Slide ${index + 1}`}
            onClick={() => {
              dispatch({ type: "GOTO", index });
            }}
          />
        ))}
      </SlideNav>

      <Controls>
        {state.isPlaying ? (
          <IconButton
            aria-label="Pause"
            onClick={() => {
              dispatch({ type: "PAUSE" });
            }}
            children={<FaPause />}
          />
        ) : (
          <IconButton
            aria-label="Play"
            onClick={() => {
              dispatch({ type: "PLAY" });
            }}
            children={<FaPlay />}
          />
        )}
        <SpacerGif width="10px" />
        <IconButton
          aria-label="Previous Slide"
          onClick={() => {
            dispatch({ type: "PREV" });
          }}
          children={<FaBackward />}
        />
        <IconButton
          aria-label="Next Slide"
          onClick={() => {
            dispatch({ type: "NEXT" });
          }}
          children={<FaForward />}
        />
      </Controls>

      <ProgressBar
        key={state.currentIndex + state.isPlaying}
        time={config.slide_duration}
        animate={state.isPlaying}
      />

      <VisuallyHidden>
        <Alert>
          Item {state.currentIndex + 1} of {slides.length}
        </Alert>
      </VisuallyHidden>
    </Carousel>
  );
}

export default App;
