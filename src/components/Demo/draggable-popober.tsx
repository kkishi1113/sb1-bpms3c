'use client';

import * as React from 'react';
import { DndContext, DragEndEvent, useDraggable } from '@dnd-kit/core';
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
    <div ref={setNodeRef} style={style} className={cn('bg-white rounded-md shadow-md border w-80', className)}>
      <div {...attributes} {...listeners} className="p-4 border-b cursor-move bg-muted/50">
        <h3 className="font-semibold">ドラッグ可能なポップオーバー</h3>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

export default function DraggablePopoverComponent({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });

  const handleDragEnd = (event: DragEndEvent) => {
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
          <DraggablePopover className="bg-white rounded-md shadow-md border p-4 w-80">{children}</DraggablePopover>
        </div>
      )}
    </DndContext>
  );
}
