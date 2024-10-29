// 'use client';

// import React, { useState } from 'react';
// import {
//   DndContext,
//   closestCenter,
//   KeyboardSensor,
//   PointerSensor,
//   useSensor,
//   useSensors,
//   DragEndEvent,
// } from '@dnd-kit/core';
// import {
//   arrayMove,
//   SortableContext,
//   sortableKeyboardCoordinates,
//   verticalListSortingStrategy,
//   useSortable,
// } from '@dnd-kit/sortable';
// import { CSS } from '@dnd-kit/utilities';

// interface Column {
//   id: string;
//   title: string;
// }

// interface SortableItemProps {
//   id: string;
//   title: string;
// }

// const SortableItem: React.FC<SortableItemProps> = ({ id, title }) => {
//   const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

//   const style = {
//     transform: CSS.Transform.toString(transform),
//     transition,
//   };

//   return (
//     <div
//       ref={setNodeRef}
//       style={style}
//       {...attributes}
//       {...listeners}
//       className="bg-white border border-gray-200 rounded-lg p-4 mb-2 cursor-move shadow-sm hover:shadow-md transition-shadow"
//     >
//       {title}
//     </div>
//   );
// };

// export default function DrggableColumnsComponent() {
//   const [columns, setColumns] = useState<Column[]>([
//     { id: '1', title: 'To Do' },
//     { id: '2', title: 'In Progress' },
//     { id: '3', title: 'Review' },
//     { id: '4', title: 'Done' },
//   ]);

//   const sensors = useSensors(
//     useSensor(PointerSensor),
//     useSensor(KeyboardSensor, {
//       coordinateGetter: sortableKeyboardCoordinates,
//     })
//   );

//   const handleDragEnd = (event: DragEndEvent) => {
//     const { active, over } = event;

//     if (active.id !== over?.id) {
//       setColumns((items) => {
//         const oldIndex = items.findIndex((item) => item.id === active.id);
//         const newIndex = items.findIndex((item) => item.id === over?.id);

//         return arrayMove(items, oldIndex, newIndex);
//       });
//     }
//   };

//   return (
//     <div className="p-8 max-w-md mx-auto">
//       <h1 className="text-2xl font-bold mb-4">Draggable Columns</h1>
//       <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
//         <SortableContext items={columns.map((col) => col.id)} strategy={verticalListSortingStrategy}>
//           {columns.map((column) => (
//             <SortableItem key={column.id} id={column.id} title={column.title} />
//           ))}
//         </SortableContext>
//       </DndContext>
//     </div>
//   );
// }

'use client';

import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Column {
  id: string;
  title: string;
}

interface SortableItemProps {
  id: string;
  title: string;
}

const SortableItem: React.FC<SortableItemProps> = ({ id, title }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  // x方向の移動を固定し、y方向のみのドラッグを有効化
  const adjustedTransform = transform ? { ...transform, x: 0 } : null;

  const style = {
    transform: CSS.Transform.toString(adjustedTransform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white border border-gray-200 rounded-lg p-4 mb-2 cursor-move shadow-sm hover:shadow-md transition-shadow"
    >
      {title}
    </div>
  );
};

export default function DraggableColumnsComponent() {
  const [columns, setColumns] = useState<Column[]>([
    { id: '1', title: 'To Do' },
    { id: '2', title: 'In Progress' },
    { id: '3', title: 'Review' },
    { id: '4', title: 'Done' },
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setColumns((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Draggable Columns</h1>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={columns.map((col) => col.id)} strategy={verticalListSortingStrategy}>
          {columns.map((column) => (
            <SortableItem key={column.id} id={column.id} title={column.title} />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}
