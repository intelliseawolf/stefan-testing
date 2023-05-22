import React, { useContext, useRef } from "react";
import { useDrop } from "react-dnd";
import { throttle } from "throttle-debounce-ts";
import { isHidden } from "./utils/isHidden";
import { useDragItem } from "./utils/useDragItem";
import { ColumnContainer, ColumnTitle } from "./styles";
import { Card } from "./Card";
import { AddNewItem } from "./AddNewItem";
import { AppContext } from "./App";
import { findItemIndexById, moveItem } from "./utils/arrayUtils";
import { Task } from "./types";

type ColumnProps = {
  id: string;
  columnName: string;
  isPreview?: boolean;
  tasks?: Task[];
};

export function Column({ columnName, id, isPreview, tasks }: ColumnProps) {
  const appContext = useContext(AppContext);
  const draggedItem = appContext.appState.draggedItem;
  const ref = useRef<HTMLDivElement>(null);

  const [, drop] = useDrop({
    accept: ["COLUMN", "CARD"],
    hover: throttle(200, () => {
      if (!draggedItem) return;
      if (draggedItem.type === "COLUMN") {
        if (draggedItem.id === id) return;

        const draggedIndex = findItemIndexById(
          appContext.appState.lists,
          draggedItem.id
        );
        const hoverIndex = findItemIndexById(appContext.appState.lists, id);

        appContext.setAppState({
          ...appContext.appState,
          lists: moveItem(appContext.appState.lists, draggedIndex, hoverIndex),
        });
      } else {
        if (draggedItem.listId === id) return;
        if (tasks && tasks.length) return;

        const sourceListIndex = findItemIndexById(
          appContext.appState.lists,
          draggedItem.listId
        );
        const targetListIndex = findItemIndexById(
          appContext.appState.lists,
          id
        );

        const dragIndex = findItemIndexById(
          appContext.appState.lists[sourceListIndex].tasks,
          draggedItem.id
        );
        const hoverIndex = findItemIndexById(
          appContext.appState.lists[targetListIndex].tasks,
          null
        );

        let tempLists = appContext.appState.lists;

        tempLists[sourceListIndex].tasks.splice(dragIndex, 1);
        tempLists[targetListIndex].tasks.splice(hoverIndex, 0, {
          ...draggedItem,
          listId: id,
        });

        appContext.setAppState({
          ...appContext.appState,
          lists: tempLists,
        });

        appContext.setAppState({
          ...appContext.appState,
          draggedItem: {
            ...draggedItem,
            listId: id,
          },
        });
      }
    }),
  });

  const { drag } = useDragItem({ type: "COLUMN", id, columnName });

  const handleAddNewTask = (task: Task) => {
    appContext.setAppState({
      ...appContext.appState,
      lists: appContext.appState.lists.map((list) => {
        if (list.id === task.listId) {
          list.tasks.push(task);
        }
        return list;
      }),
    });
  };

  drag(drop(ref));

  return (
    <ColumnContainer
      isPreview={isPreview}
      ref={ref}
      isHidden={isHidden(draggedItem, "COLUMN", id, isPreview)}
    >
      <ColumnTitle>{columnName}</ColumnTitle>
      {tasks &&
        tasks.map((task) => (
          <Card
            key={task.id}
            text={task.text}
            listId={task.listId}
            id={task.id}
          />
        ))}
      <AddNewItem
        toggleButtonText="+New Task"
        listId={id}
        onAddNewTask={handleAddNewTask}
        dark
      />
    </ColumnContainer>
  );
}
