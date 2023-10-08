import type { RefObject } from "react";
import React, { forwardRef, useEffect, useRef } from "react";
import styled from "styled-components";

import ResizeObserver from "resize-observer-polyfill";

interface StickyCanvasArenaProps {
  showCanvas: boolean;
  canvasId: string;
  id: string;
  canvasPadding: number;
  snapRows: number;
  snapColSpace: number;
  snapRowSpace: number;
  getRelativeScrollingParent: (child: HTMLDivElement) => Element | null;
  canExtend: boolean;
  ref: StickyCanvasArenaRef;
  shouldObserveIntersection: boolean;
}

interface StickyCanvasArenaRef {
  stickyCanvasRef: RefObject<HTMLCanvasElement>;
  slidingArenaRef: RefObject<HTMLDivElement>;
}

const StyledCanvasSlider = styled.div<{ paddingBottom: number }>`
  position: absolute;
  top: 0px;
  left: 0px;
  height: calc(100% + ${(props) => props.paddingBottom}px);
  width: 100%;
  image-rendering: -moz-crisp-edges;
  image-rendering: -webkit-crisp-edges;
  image-rendering: pixelated;
  image-rendering: crisp-edges;
  overflow-y: auto;
`;

export const StickyCanvasArena = forwardRef(
  (props: StickyCanvasArenaProps, ref: any) => {
    const {
      canExtend,
      canvasId,
      canvasPadding,
      getRelativeScrollingParent,
      id,
      shouldObserveIntersection,
      showCanvas,
      snapColSpace,
      snapRows,
      snapRowSpace,
    } = props;
    const { slidingArenaRef, stickyCanvasRef } = ref.current;

    const interSectionObserver = useRef(
      new IntersectionObserver((entries) => {
        entries.forEach(updateCanvasStylesIntersection);
      }),
    );

    const resizeObserver = useRef(
      new ResizeObserver(() => {
        observeSlider();
      }),
    );

    const { devicePixelRatio: scale = 1 } = window;

    const repositionSliderCanvas = (entry: IntersectionObserverEntry) => {
      stickyCanvasRef.current.style.width = entry.intersectionRect.width + "px";
      stickyCanvasRef.current.style.position = "absolute";
      const calculatedLeftOffset =
        entry.intersectionRect.left - entry.boundingClientRect.left;
      const calculatedTopOffset =
        entry.intersectionRect.top - entry.boundingClientRect.top;
      stickyCanvasRef.current.style.top = calculatedTopOffset + "px";
      stickyCanvasRef.current.style.left = calculatedLeftOffset + "px";
      stickyCanvasRef.current.style.height =
        entry.intersectionRect.height + "px";
    };

    const rescaleSliderCanvas = (entry: IntersectionObserverEntry) => {
      const canvasCtx: CanvasRenderingContext2D =
        stickyCanvasRef.current.getContext("2d");
      stickyCanvasRef.current.height = entry.intersectionRect.height * scale;
      stickyCanvasRef.current.width = entry.intersectionRect.width * scale;
      canvasCtx.scale(scale, scale);
    };

    const updateCanvasStylesIntersection = (
      entry: IntersectionObserverEntry,
    ) => {
      if (slidingArenaRef.current) {
        requestAnimationFrame(() => {
          const parentCanvas: Element | null = getRelativeScrollingParent(
            slidingArenaRef.current,
          );

          if (parentCanvas && stickyCanvasRef.current) {
            repositionSliderCanvas(entry);
            rescaleSliderCanvas(entry);
          }
        });
      }
    };

    const observeSlider = () => {
      // This is to make sure the canvas observes and changes only when needed like when dragging or drw to select.
      if (shouldObserveIntersection) {
        interSectionObserver.current.disconnect();
        if (slidingArenaRef && slidingArenaRef.current) {
          interSectionObserver.current.observe(slidingArenaRef.current);
        }
      }
    };
    const observeSliderHoc = (slidingArena: Element) => () => {
      interSectionObserver.current.disconnect();
      interSectionObserver.current.observe(slidingArena);
    };

    useEffect(() => {
      if (slidingArenaRef.current) {
        observeSlider();
      }
    }, [
      showCanvas,
      snapRows,
      canExtend,
      snapColSpace,
      snapRowSpace,
      shouldObserveIntersection,
    ]);

    useEffect(() => {
      let parentCanvas: Element | null;
      const slidingArena = slidingArenaRef.current;
      const observerCallback = observeSliderHoc(slidingArena);
      if (slidingArena) {
        parentCanvas = getRelativeScrollingParent(slidingArena);
        parentCanvas?.addEventListener("scroll", observerCallback, false);
        parentCanvas?.addEventListener("mouseover", observerCallback, false);
      }
      resizeObserver.current.observe(slidingArena);
      return () => {
        parentCanvas?.removeEventListener("scroll", observerCallback);
        parentCanvas?.removeEventListener("mouseover", observerCallback);
        if (slidingArenaRef && slidingArenaRef.current) {
          resizeObserver.current.unobserve(slidingArena);
        }
      };
    }, [shouldObserveIntersection]);
    return (
      <>
        <canvas
          data-sl="canvas-mq" // attribute to enable canvas on smartlook
          data-testid={canvasId}
          id={canvasId}
          ref={stickyCanvasRef}
          style={{
            position: "absolute",
          }}
        />
        <StyledCanvasSlider
          data-testid={id}
          id={id}
          paddingBottom={canvasPadding}
          ref={slidingArenaRef}
        />
      </>
    );
  },
);
StickyCanvasArena.displayName = "StickyCanvasArena";
