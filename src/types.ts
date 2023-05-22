export type ColumnDragItem = {
  id: string;
  columnName: string;
  type: "COLUMN";
};

export type CardDragItem = {
  id: string;
  listId: string;
  text: string;
  type: "CARD";
};

export type DragItem = ColumnDragItem | CardDragItem;

export type List = {
  id: string;
  columnName: string;
  tasks: Task[];
};

export type Task = {
  type?: string;
  id: string;
  listId: string;
  text: string;
};
