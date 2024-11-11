'use client';

import * as React from 'react';
import { DndContext, useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

function DraggablePopover({ children, className }: { children: React.ReactNode; className?: string }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: 'draggable-popover',
  });

  const style = transform
    ? {
        transform: CSS.Translate.toString(transform),
      }
    : undefined;

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className={cn('cursor-move', className)}>
      {children}
    </div>
  );
}

export default function DraggablePopoverComponent() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });

  const handleDragEnd = (event: any) => {
    const { delta } = event;
    setPosition((prevPosition) => ({
      x: prevPosition.x + delta.x,
      y: prevPosition.y + delta.y,
    }));
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <Button variant="outline" onClick={() => setIsOpen(!isOpen)}>
        ドラッグ可能なポップオーバー
      </Button>
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            left: position.x,
            top: position.y,
            zIndex: 50,
          }}
        >
          <DraggablePopover className="bg-white rounded-md shadow-md border p-4 w-80">
            <h3 className="font-semibold mb-2">ドラッグ可能なポップオーバー</h3>
            <p>このポップオーバー全体をドラッグして移動できます。</p>
            <ul className="mt-2">
              <li>アイテム 1</li>
              <li>アイテム 2</li>
              <li>アイテム 3</li>
            </ul>
          </DraggablePopover>
        </div>
      )}
    </DndContext>
  );
}
