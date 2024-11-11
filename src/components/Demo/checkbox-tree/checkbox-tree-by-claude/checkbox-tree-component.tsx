// types.ts
export interface TreeNode {
  id: string;
  label: string;
  children?: TreeNode[];
}

export const sampleData: TreeNode[] = [
  {
    id: '1',
    label: 'Parent 1',
    children: [
      {
        id: '1-1',
        label: 'Child 1-1',
        children: [{ id: '1-1-1', label: 'Grandchild 1-1-1' }],
      },
      { id: '1-2', label: 'Child 1-2' },
    ],
  },
  {
    id: '2',
    label: 'Parent 2',
    children: [{ id: '2-1', label: 'Child 2-1' }],
  },
];

// CheckboxTreeComponent.tsx
import { useEffect, useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';

interface CheckboxState {
  checked: boolean;
  indeterminate: boolean;
}

interface CheckboxTreeProps {
  nodes: TreeNode[];
  onStateChange?: (states: Map<string, CheckboxState>) => void;
}

export const CheckboxTreeByClaude = ({ nodes = sampleData, onStateChange }: CheckboxTreeProps) => {
  const [checkboxStates, setCheckboxStates] = useState<Map<string, CheckboxState>>(new Map());

  // 初期状態の設定
  useEffect(() => {
    const initialStates = new Map<string, CheckboxState>();
    nodes.forEach((node) => initializeStates(node, initialStates));
    setCheckboxStates(initialStates);
  }, [nodes]);

  // 再帰的に状態を初期化
  const initializeStates = (node: TreeNode, states: Map<string, CheckboxState>) => {
    states.set(node.id, { checked: false, indeterminate: false });
    node.children?.forEach((child) => initializeStates(child, states));
  };

  // ノードの状態を更新
  const updateNodeState = (nodeId: string, checked: boolean) => {
    const newStates = new Map(checkboxStates);

    // 子ノードの更新
    const updateChildren = (node: TreeNode) => {
      newStates.set(node.id, { checked, indeterminate: false });
      node.children?.forEach((child) => updateChildren(child));
    };

    // 親ノードの状態を更新
    const updateParentStates = (nodes: TreeNode[]) => {
      nodes.forEach((node) => {
        if (node.children?.some((child) => child.id === nodeId)) {
          const childStates = node.children.map(
            (child) => newStates.get(child.id) || { checked: false, indeterminate: false }
          );

          const allChecked = childStates.every((state) => state.checked);
          const allUnchecked = childStates.every((state) => !state.checked && !state.indeterminate);

          newStates.set(node.id, {
            checked: allChecked,
            indeterminate: !allChecked && !allUnchecked,
          });

          // 再帰的に親の状態を更新
          updateParentStates(nodes);
        }
      });
    };

    // ノードを検索して更新を開始
    const findAndUpdateNode = (searchNodes: TreeNode[]): boolean => {
      for (const node of searchNodes) {
        if (node.id === nodeId) {
          updateChildren(node);
          return true;
        }
        if (node.children && findAndUpdateNode(node.children)) {
          return true;
        }
      }
      return false;
    };

    findAndUpdateNode(nodes);
    updateParentStates(nodes);

    setCheckboxStates(newStates);
    onStateChange?.(newStates);
  };

  const renderNode = (node: TreeNode) => {
    const state = checkboxStates.get(node.id);

    return (
      <div key={node.id} className="pl-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id={node.id}
            checked={state?.checked}
            data-state={state?.indeterminate ? 'indeterminate' : state?.checked ? 'checked' : 'unchecked'}
            onCheckedChange={(checked: boolean) => updateNodeState(node.id, checked)}
          />
          <label htmlFor={node.id} className="text-sm font-medium leading-none">
            {node.label}
          </label>
        </div>
        {node.children && <div className="ml-4 mt-2">{node.children.map((child) => renderNode(child))}</div>}
      </div>
    );
  };

  return <div className="p-4">{nodes.map((node) => renderNode(node))}</div>;
};
