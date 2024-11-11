'use client';

import React, { useCallback, useMemo, useState } from 'react';

interface TreeNode {
  id: string;
  label: string;
  defaultChecked?: boolean;
  defaultSecondaryChecked?: boolean;
  defaultExpanded?: boolean; // 追加
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

  // 開閉状態を管理するstate追加
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

  // 開閉状態の判定関数
  const isExpanded = useCallback((nodeId: string) => expandedNodes.has(nodeId), [expandedNodes]);

  // 開閉状態の切り替え関数
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

  return {
    isChecked,
    handleCheck,
    isSecondaryChecked,
    handleSecondaryCheck,
    isExpanded,
    toggleExpanded,
  };
}

interface CheckboxTreeProps {
  tree: TreeNode;
  renderNode: (props: {
    node: TreeNode;
    isChecked: boolean | 'indeterminate';
    isSecondaryChecked: boolean | 'indeterminate';
    isExpanded: boolean; // 追加
    onCheckedChange: () => void;
    onSecondaryCheckedChange: () => void;
    onToggleExpanded: () => void; // 追加
    children: React.ReactNode;
  }) => React.ReactNode;
}

export function CheckboxTree({ tree, renderNode }: CheckboxTreeProps) {
  const { isChecked, handleCheck, isSecondaryChecked, handleSecondaryCheck, isExpanded, toggleExpanded } =
    useCheckboxTree(tree);

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
