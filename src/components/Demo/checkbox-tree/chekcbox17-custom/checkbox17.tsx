'use client';

import { CheckboxTree } from './checkbox-tree';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Fragment } from 'react';

interface TreeNode {
  id: string;
  label: string;
  defaultChecked?: boolean;
  defaultSecondaryChecked?: boolean;
  defaultExpanded?: boolean;
  children?: TreeNode[];
}

const initialTree: TreeNode = {
  id: 'natural-wonders',
  label: 'Natural Wonders',
  defaultExpanded: true, // 追加
  children: [
    { id: 'mountains', label: 'Mountains', defaultChecked: true, defaultSecondaryChecked: true },
    {
      id: 'waterfalls',
      label: 'Waterfalls',
      defaultExpanded: false, // 追加
      children: [
        { id: 'niagara', label: 'Niagara Falls' },
        { id: 'angel-falls', label: 'Angel Falls', defaultChecked: true, defaultSecondaryChecked: true },
      ],
    },
    { id: 'grand-canyon', label: 'Grand Canyon' },
  ],
};

export default function Checkbox17Custom() {
  return (
    <div className="space-y-3">
      <CheckboxTree
        tree={initialTree}
        renderNode={({
          node,
          isChecked,
          isSecondaryChecked,
          isExpanded,
          onCheckedChange,
          onSecondaryCheckedChange,
          onToggleExpanded,
          children,
        }) => (
          <Fragment key={node.id}>
            <div className="flex items-center gap-2">
              {node.children && (
                <button onClick={onToggleExpanded} className="w-4 h-4 flex items-center justify-center">
                  {isExpanded ? '▼' : '▶'}
                </button>
              )}
              {node.label}
              <Label htmlFor={`${node.id}-primary`}>First:</Label>
              <Checkbox id={`${node.id}-primary`} checked={isChecked} onCheckedChange={onCheckedChange} />
              <Label htmlFor={`${node.id}-secondary`}>Secondary:</Label>
              <Checkbox
                id={`${node.id}-secondary`}
                checked={isSecondaryChecked}
                onCheckedChange={onSecondaryCheckedChange}
              />
            </div>
            {isExpanded && children && <div className="ms-6 space-y-3">{children}</div>}
          </Fragment>
        )}
      />
    </div>
  );
}
