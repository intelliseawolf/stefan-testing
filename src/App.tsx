import React, { createContext, useState } from "react";
import { nanoid } from "nanoid";
import { CustomDragLayer } from "./CustomDragLayer";

import { AppContainer } from "./styles";
import { Column } from "./Column";
import { AddNewItem } from "./AddNewItem";
import { DragItem, List } from "./types";

type AppState = {
  lists: List[];
  draggedItem: DragItem | null;
};

export const AppContext = createContext({
  appState: {
    lists: [],
    draggedItem: null,
  } as AppState,
  setAppState: (arg: AppState) => { },
});

export function App() {
  const [appState, setAppState] = useState<AppState>({
    lists: [],
    draggedItem: null,
  });

  const lists = appState.lists;

  const handleAddNewList = (list: List) => {
    setAppState({
      ...appState,
      lists: [...appState.lists, list],
    });
  };

  return (
    <AppContext.Provider value={{ appState, setAppState }}>
      <AppContainer>
        <CustomDragLayer />
        {lists &&
          lists.map(({ columnName, tasks, id }) => (
            <Column key={id} id={id} columnName={columnName} tasks={tasks} />
          ))}
        <AddNewItem
          listId={nanoid()}
          onAddNewList={handleAddNewList}
          toggleButtonText="+New Column"
        />
      </AppContainer>
    </AppContext.Provider>
  );
}
