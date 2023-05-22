import { useDrag } from "react-dnd";
import React, { useContext, useEffect } from "react";
import { getEmptyImage } from "react-dnd-html5-backend";
import { DragItem } from "../types";
import { AppContext } from "../App";

export const useDragItem = (item: DragItem) => {
  const appContext = useContext(AppContext);
  const [, drag, preview] = useDrag({
    type: item.type,
    item: () => {
      appContext.setAppState({
        ...appContext.appState,
        draggedItem: item,
      });

      return item;
    },
    end: () =>
      appContext.setAppState({
        ...appContext.appState,
        draggedItem: null,
      }),
  });
  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);
  return { drag };
};
