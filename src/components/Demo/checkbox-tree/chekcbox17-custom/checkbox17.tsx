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
  children?: TreeNode[];
}

const initialTree: TreeNode = {
  id: 'natural-wonders',
  label: 'Natural Wonders',
  children: [
    { id: 'mountains', label: 'Mountains', defaultChecked: true, defaultSecondaryChecked: true },
    {
      id: 'waterfalls',
      label: 'Waterfalls',
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
        renderNode={({ node, isChecked, isSecondaryChecked, onCheckedChange, onSecondaryCheckedChange, children }) => (
          <Fragment key={node.id}>
            <div className="flex items-center gap-2">
              <Checkbox id={`${node.id}-primary`} checked={isChecked} onCheckedChange={onCheckedChange} />
              <Label htmlFor={`${node.id}-primary`}>{node.label}</Label>
              <Checkbox
                id={`${node.id}-secondary`}
                checked={isSecondaryChecked}
                onCheckedChange={onSecondaryCheckedChange}
              />
              <Label htmlFor={`${node.id}-secondary`}>Secondary</Label>
            </div>
            {children && <div className="ms-6 space-y-3">{children}</div>}
          </Fragment>
        )}
      />
    </div>
  );
}
