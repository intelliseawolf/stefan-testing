import React, { useContext, useRef } from "react";
import { useDrop } from "react-dnd";
import { throttle } from "throttle-debounce-ts";
import { isHidden } from "./utils/isHidden";
import { useDragItem } from "./utils/useDragItem";
import { CardContainer } from "./styles";
import { AppContext } from "./App";
import { findItemIndexById } from "./utils/arrayUtils";

type CardProps = {
  id: string;
  listId: string;
  text: string;
  isPreview?: boolean;
};

export function Card({ text, listId, isPreview, id }: CardProps) {
  const appContext = useContext(AppContext);
  const draggedItem = appContext.appState.draggedItem;
  const { drag } = useDragItem({ type: "CARD", id, text, listId });
  const ref = useRef<HTMLDivElement>(null);
  const [, drop] = useDrop({
    accept: "CARD",
    hover: throttle(200, () => {
      if (!draggedItem) return;
      if (draggedItem.type !== "CARD") return;
      if (draggedItem.id === id) return;

      const sourceListIndex = findItemIndexById(
        appContext.appState.lists,
        draggedItem.listId
      );
      const targetListIndex = findItemIndexById(
        appContext.appState.lists,
        listId
      );

      const dragIndex = findItemIndexById(
        appContext.appState.lists[sourceListIndex].tasks,
        draggedItem.id
      );
      const hoverIndex = findItemIndexById(
        appContext.appState.lists[targetListIndex].tasks,
        id
      );

      let tempLists = appContext.appState.lists;

      tempLists[sourceListIndex].tasks.splice(dragIndex, 1);
      tempLists[targetListIndex].tasks.splice(hoverIndex, 0, {
        ...draggedItem,
        listId,
      });

      appContext.setAppState({
        ...appContext.appState,
        lists: tempLists,
      });

      appContext.setAppState({
        ...appContext.appState,
        draggedItem: {
          ...draggedItem,
          listId,
        },
      });
    }),
  });

  drag(drop(ref));

  return (
    <CardContainer
      ref={ref}
      isPreview={isPreview}
      isHidden={isHidden(draggedItem, "CARD", id, isPreview)}
    >
      {text}
    </CardContainer>
  );
}
