'use client';

import React, { useCallback, useMemo, useState, Fragment, useEffect } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface TreeNode {
  id: string;
  label: string;
  defaultChecked?: boolean;
  defaultSecondaryChecked?: boolean;
  defaultExpanded?: boolean;
  children?: TreeNode[];
}

function useCheckboxTree(initialTree: TreeNode) {
  const initialCheckedNodes = useMemo(() => {
    const checkedSet = new Set<string>();
    const initializeCheckedNodes = (node: TreeNode) => {
      if (node.defaultChecked) {
        checkedSet.add(node.id);
      }
      node.children?.forEach(initializeCheckedNodes);
    };
    initializeCheckedNodes(initialTree);
    return checkedSet;
  }, [initialTree]);

  const initialSecondaryCheckedNodes = useMemo(() => {
    const secondaryCheckedSet = new Set<string>();
    const initializeSecondaryCheckedNodes = (node: TreeNode) => {
      if (node.defaultSecondaryChecked) {
        secondaryCheckedSet.add(node.id);
      }
      node.children?.forEach(initializeSecondaryCheckedNodes);
    };
    initializeSecondaryCheckedNodes(initialTree);
    return secondaryCheckedSet;
  }, [initialTree]);

  const [checkedNodes, setCheckedNodes] = useState<Set<string>>(initialCheckedNodes);
  const [secondaryCheckedNodes, setSecondaryCheckedNodes] = useState<Set<string>>(initialSecondaryCheckedNodes);
  const [searchTerm, setSearchTerm] = useState('');

  const isChecked = useCallback(
    (node: TreeNode): boolean | 'indeterminate' => {
      if (!node.children) {
        return checkedNodes.has(node.id);
      }
      const childrenChecked = node.children.map((child) => isChecked(child));
      if (childrenChecked.every((status) => status === true)) {
        return true;
      }
      if (childrenChecked.some((status) => status === true || status === 'indeterminate')) {
        return 'indeterminate';
      }
      return false;
    },
    [checkedNodes]
  );

  const isSecondaryChecked = useCallback(
    (node: TreeNode): boolean | 'indeterminate' => {
      if (!node.children) {
        return secondaryCheckedNodes.has(node.id);
      }
      const childrenChecked = node.children.map((child) => isSecondaryChecked(child));
      if (childrenChecked.every((status) => status === true)) {
        return true;
      }
      if (childrenChecked.some((status) => status === true || status === 'indeterminate')) {
        return 'indeterminate';
      }
      return false;
    },
    [secondaryCheckedNodes]
  );

  const handleCheck = useCallback(
    (node: TreeNode) => {
      const newCheckedNodes = new Set(checkedNodes);
      const toggleNode = (n: TreeNode, check: boolean) => {
        if (check) {
          newCheckedNodes.add(n.id);
        } else {
          newCheckedNodes.delete(n.id);
        }
        n.children?.forEach((child) => toggleNode(child, check));
      };
      const currentStatus = isChecked(node);
      const newCheck = currentStatus !== true;
      toggleNode(node, newCheck);
      setCheckedNodes(newCheckedNodes);
    },
    [checkedNodes, isChecked]
  );

  const handleSecondaryCheck = useCallback(
    (node: TreeNode) => {
      const newSecondaryCheckedNodes = new Set(secondaryCheckedNodes);
      const toggleNode = (n: TreeNode, check: boolean) => {
        if (check) {
          newSecondaryCheckedNodes.add(n.id);
        } else {
          newSecondaryCheckedNodes.delete(n.id);
        }
        n.children?.forEach((child) => toggleNode(child, check));
      };
      const currentStatus = isSecondaryChecked(node);
      const newCheck = currentStatus !== true;
      toggleNode(node, newCheck);
      setSecondaryCheckedNodes(newSecondaryCheckedNodes);
    },
    [secondaryCheckedNodes, isSecondaryChecked]
  );

  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(() => {
    const expandedSet = new Set<string>();
    const initializeExpandedNodes = (node: TreeNode) => {
      if (node.defaultExpanded) {
        expandedSet.add(node.id);
      }
      node.children?.forEach(initializeExpandedNodes);
    };
    initializeExpandedNodes(initialTree);
    return expandedSet;
  });

  const isExpanded = useCallback((nodeId: string) => expandedNodes.has(nodeId), [expandedNodes]);

  const toggleExpanded = useCallback(
    (nodeId: string) => {
      const newExpandedNodes = new Set(expandedNodes);
      if (newExpandedNodes.has(nodeId)) {
        newExpandedNodes.delete(nodeId);
      } else {
        newExpandedNodes.add(nodeId);
      }
      setExpandedNodes(newExpandedNodes);
    },
    [expandedNodes]
  );

  const isNodeMatched = useCallback(
    (node: TreeNode): boolean => {
      if (!searchTerm) return false;
      return node.label.toLowerCase().includes(searchTerm.toLowerCase());
    },
    [searchTerm]
  );

  const hasMatchInSubtree = useCallback(
    (node: TreeNode): boolean => {
      if (isNodeMatched(node)) return true;
      return node.children?.some(hasMatchInSubtree) ?? false;
    },
    [isNodeMatched]
  );

  const expandMatchedNodes = useCallback(
    (node: TreeNode) => {
      const newExpandedNodes = new Set(expandedNodes);

      const processNode = (currentNode: TreeNode): boolean => {
        if (!currentNode.children) return isNodeMatched(currentNode);

        const shouldExpandThis = currentNode.children.some(processNode);
        if (shouldExpandThis) {
          newExpandedNodes.add(currentNode.id);
        }
        return shouldExpandThis || isNodeMatched(currentNode);
      };

      processNode(node);
      setExpandedNodes(newExpandedNodes);
    },
    [expandedNodes, isNodeMatched]
  );

  useEffect(() => {
    if (searchTerm) {
      expandMatchedNodes(initialTree);
    }
  }, [searchTerm, initialTree, expandMatchedNodes]);

  return {
    isChecked,
    handleCheck,
    isSecondaryChecked,
    handleSecondaryCheck,
    isExpanded,
    toggleExpanded,
    searchTerm,
    setSearchTerm,
    isNodeMatched,
    hasMatchInSubtree,
  };
}

interface CheckboxTreeProps {
  tree: TreeNode;
  treeState: ReturnType<typeof useCheckboxTree>; // 修正: useCheckboxTree の戻り値の型を使用
  renderNode: (props: {
    node: TreeNode;
    isChecked: boolean | 'indeterminate';
    isSecondaryChecked: boolean | 'indeterminate';
    isExpanded: boolean;
    onCheckedChange: () => void;
    onSecondaryCheckedChange: () => void;
    onToggleExpanded: () => void;
    children: React.ReactNode;
  }) => React.ReactNode;
}

function CheckboxTree({ tree, treeState, renderNode }: CheckboxTreeProps) {
  // 修正: treeState を props として受け取る
  const { isChecked, handleCheck, isSecondaryChecked, handleSecondaryCheck, isExpanded, toggleExpanded } = treeState;

  const renderTreeNode = (node: TreeNode): React.ReactNode => {
    const children = node.children?.map(renderTreeNode);
    return renderNode({
      node,
      isChecked: isChecked(node),
      isSecondaryChecked: isSecondaryChecked(node),
      isExpanded: isExpanded(node.id),
      onCheckedChange: () => handleCheck(node),
      onSecondaryCheckedChange: () => handleSecondaryCheck(node),
      onToggleExpanded: () => toggleExpanded(node.id),
      children,
    });
  };

  return renderTreeNode(tree);
}
const initialTree: TreeNode = {
  id: 'natural-wonders',
  label: 'Natural Wonders',
  defaultExpanded: true,
  children: [
    { id: 'mountains', label: 'Mountains', defaultChecked: true, defaultSecondaryChecked: true },
    {
      id: 'waterfalls',
      label: 'Waterfalls',
      defaultExpanded: false,
      children: [
        { id: 'niagara', label: 'Niagara Falls' },
        { id: 'angel-falls', label: 'Angel Falls', defaultChecked: true, defaultSecondaryChecked: true },
      ],
    },
    { id: 'grand-canyon', label: 'Grand Canyon' },
  ],
};

export default function Checkbox17byClaude() {
  const treeState = useCheckboxTree(initialTree); // 一度だけ useCheckboxTree を使用
  const { searchTerm, setSearchTerm, isNodeMatched } = treeState;

  return (
    <div className="space-y-3">
      <div className="mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search..."
          className="w-full px-3 py-2 border rounded"
        />
      </div>

      <CheckboxTree
        tree={initialTree}
        treeState={treeState} // treeState を渡す
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
            <div className={`flex items-center gap-2 ${isNodeMatched(node) ? 'bg-yellow-100' : ''}`}>
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
