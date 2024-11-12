'use client';

import React, { useCallback, useMemo, useState, Fragment, useEffect } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, ChevronDown, ChevronRight, File, FolderOpen, FolderClosedIcon } from 'lucide-react';

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

  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

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

  const hasMatchInTree = useCallback(
    (node: TreeNode): boolean => {
      if (isNodeMatched(node)) return true;
      return node.children?.some((child) => hasMatchInTree(child)) ?? false;
    },
    [isNodeMatched]
  );

  const updateExpandedNodes = useCallback(
    (node: TreeNode) => {
      const newExpandedNodes = new Set<string>();

      const traverse = (currentNode: TreeNode, parentIds: string[] = []) => {
        if (hasMatchInTree(currentNode)) {
          // 親ノードをすべて展開
          parentIds.forEach((id) => newExpandedNodes.add(id));

          // 子を持つノードなら展開
          if (currentNode.children) {
            newExpandedNodes.add(currentNode.id);
          }

          // 子ノードを処理
          currentNode.children?.forEach((child) => {
            traverse(child, [...parentIds, currentNode.id]);
          });
        }
      };

      traverse(node);
      setExpandedNodes(newExpandedNodes);
    },
    [hasMatchInTree]
  );

  useEffect(() => {
    if (searchTerm) {
      updateExpandedNodes(initialTree);
    } else {
      setExpandedNodes(new Set());
    }
  }, [searchTerm, updateExpandedNodes]);

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
    updateExpandedNodes,
  };
}

interface CheckboxTreeProps {
  tree: TreeNode;
  treeState: ReturnType<typeof useCheckboxTree>;
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

// const initialTree: TreeNode = {
//   id: 'natural-wonders',
//   label: 'Natural Wonders',
//   defaultExpanded: false,
//   children: [
//     { id: 'mountains', label: 'Mountains', defaultChecked: false, defaultSecondaryChecked: false },
//     {
//       id: 'waterfalls',
//       label: 'Waterfalls',
//       defaultExpanded: false,
//       children: [
//         { id: 'niagara', label: 'Niagara Falls' },
//         { id: 'angel-falls', label: 'Angel Falls', defaultChecked: false, defaultSecondaryChecked: false },
//       ],
//     },
//     { id: 'grand-canyon', label: 'Grand Canyon' },
//   ],
// };

export default function ImprovedCheckboxTree({ initialTree }: { initialTree: TreeNode }) {
  const treeState = useCheckboxTree(initialTree);
  const { searchTerm, setSearchTerm, isNodeMatched, updateExpandedNodes } = treeState;
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  // Debounce search term updates
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchTerm(searchTerm), 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Expand matched nodes when debounced search term changes
  useEffect(() => {
    if (debouncedSearchTerm) {
      updateExpandedNodes(initialTree);
    }
  }, [debouncedSearchTerm, updateExpandedNodes]);

  const handleSearchClear = () => {
    setSearchTerm('');
  };

  return (
    <div className="space-y-1">
      <div className="mb-4 relative">
        <Input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search..."
          className="px-10"
        />
        {searchTerm && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2"
            onClick={handleSearchClear}
          >
            ×
          </Button>
        )}
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
      </div>

      <CheckboxTree
        tree={initialTree}
        treeState={treeState}
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
            <div className={`flex items-center gap-2 p-2 rounded ${isNodeMatched(node) ? 'bg-yellow-100' : ''}`}>
              {node.children ? (
                <>
                  <Button variant="ghost" size="icon" onClick={onToggleExpanded} className="p-0 h-6 w-6">
                    {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </Button>
                  {isExpanded ? <FolderOpen className="size-4" /> : <FolderClosedIcon className="size-4" />}
                </>
              ) : (
                <>
                  <File className="ml-6 size-4" />
                </>
              )}
              <span className="flex-grow">{node.label}</span>
              <div className="flex items-center gap-2">
                <Label htmlFor={`${node.id}-primary`} className="text-sm">
                  First:
                </Label>
                <Checkbox id={`${node.id}-primary`} checked={isChecked} onCheckedChange={onCheckedChange} />
                <Label htmlFor={`${node.id}-secondary`} className="text-sm">
                  Secondary:
                </Label>
                <Checkbox
                  id={`${node.id}-secondary`}
                  checked={isSecondaryChecked}
                  onCheckedChange={onSecondaryCheckedChange}
                />
              </div>
            </div>
            {isExpanded && children && <div className="ml-6 space-y-1">{children}</div>}
          </Fragment>
        )}
      />
    </div>
  );
}
