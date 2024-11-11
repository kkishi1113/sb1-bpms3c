'use client';

import * as React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { ChevronRight, ChevronDown, Folder, File, Search } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface TreeNode {
  id: string;
  label: string;
  children?: TreeNode[];
}

interface CheckboxTreeProps {
  nodes?: TreeNode[];
}

const data = [
  {
    id: 'app',
    label: 'app',
    children: [
      {
        id: 'http',
        label: 'Http',
        children: [
          {
            id: 'providers',
            label: 'Providers',
            children: [
              {
                id: 'core',
                label: 'Core-Providers',
              },
              {
                id: 'custom',
                label: 'Custom-Providers',
              },
            ],
          },
        ],
      },
      {
        id: 'services',
        label: 'Services',
        children: [
          {
            id: 'authentication',
            label: 'Authentication',
          },
          {
            id: 'database',
            label: 'Database',
          },
        ],
      },
    ],
  },
  {
    id: 'config',
    label: 'config',
    children: [
      {
        id: 'settings',
        label: 'Settings',
        children: [
          {
            id: 'development',
            label: 'Development-Settings',
          },
          {
            id: 'production',
            label: 'Production-Settings',
          },
        ],
      },
    ],
  },
  {
    id: 'public',
    label: 'public',
    children: [
      {
        id: 'env',
        label: '.env',
        children: [
          {
            id: '.env.staging',
            label: '.env.staging',
          },
          {
            id: '.env.production',
            label: '.env.production',
          },
        ],
      },
      {
        id: 'gitignore',
        label: '.gitignore',
      },
      {
        id: 'etc',
        label: 'etc',
        children: [
          {
            id: 'docs',
            label: 'Documentation',
          },
          {
            id: 'assets',
            label: 'Assets',
          },
        ],
      },
    ],
  },
];

export default function SmartCheckboxTreeComponent({ nodes = data }: CheckboxTreeProps) {
  const [expanded, setExpanded] = React.useState<string[]>([]);
  const [checked, setChecked] = React.useState<string[]>([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [secondaryChecked, setSecondaryChecked] = React.useState<string[]>([]);
  const [isAllExpanded, setIsAllExpanded] = React.useState<boolean>(false);

  // 検索クエリに一致するノードのIDを取得
  const getMatchingNodeIds = React.useCallback((node: TreeNode, query: string): string[] => {
    const matches: string[] = [];

    if (node.label.toLowerCase().includes(query.toLowerCase())) {
      matches.push(node.id);
    }

    if (node.children) {
      node.children.forEach((child) => {
        matches.push(...getMatchingNodeIds(child, query));
      });
    }

    return matches;
  }, []);

  // 検索結果に基づいて展開するノードを更新
  React.useEffect(() => {
    if (searchQuery) {
      const matchingIds: string[] = [];
      nodes.forEach((node) => {
        matchingIds.push(...getMatchingNodeIds(node, searchQuery));
      });

      // 一致するノードの親ノードも展開（既存の展開状態を維持）
      const expandIds = new Set<string>(expanded); // 既存の展開状態を維持
      const addParentNodes = (node: TreeNode, targetIds: string[]) => {
        if (node.children) {
          if (node.children.some((child) => targetIds.includes(child.id) || expandIds.has(child.id))) {
            expandIds.add(node.id);
          }
          node.children.forEach((child) => addParentNodes(child, targetIds));
        }
      };

      nodes.forEach((node) => addParentNodes(node, matchingIds));
      setExpanded([...expandIds]);
    }
  }, [searchQuery, nodes, getMatchingNodeIds]); // expandedを依存配列に追加

  const toggleExpand = (nodeId: string) => {
    setExpanded((prev) => (prev.includes(nodeId) ? prev.filter((id) => id !== nodeId) : [...prev, nodeId]));
  };

  const allToggleExpand = () => {
    const expand = (nodes: TreeNode[]) => {
      nodes.map((node) => {
        toggleExpand(node.id);
        if (node.children) expand(node.children);
      });
    };
    expand(nodes);
    setIsAllExpanded((prev) => !prev);
  };

  const isFullyChecked = (node: TreeNode): boolean => {
    if (!node.children) return checked.includes(node.id);
    return node.children.every(isFullyChecked);
  };

  const areAllSiblingsChecked = (node: TreeNode, parentNode: TreeNode): boolean => {
    return parentNode.children?.every((child) => isFullyChecked(child)) || false;
  };

  const findParentNode = (nodeId: string, tree: TreeNode[]): TreeNode | null => {
    for (const node of tree) {
      if (node.children?.some((child) => child.id === nodeId)) {
        return node;
      }
      if (node.children) {
        const parent = findParentNode(nodeId, node.children);
        if (parent) return parent;
      }
    }
    return null;
  };

  const toggleCheck = (nodeId: string, node: TreeNode) => {
    let newChecked = [...checked];
    const isCurrentlyChecked = newChecked.includes(nodeId);

    const updateNodeAndChildren = (n: TreeNode, shouldCheck: boolean) => {
      if (shouldCheck) {
        if (!newChecked.includes(n.id)) newChecked.push(n.id);
      } else {
        newChecked = newChecked.filter((id) => id !== n.id);
      }
      n.children?.forEach((child) => updateNodeAndChildren(child, shouldCheck));
    };

    updateNodeAndChildren(node, !isCurrentlyChecked);

    // 親ノードの状態を更新
    const updateParents = (currentNode: TreeNode) => {
      const parent = findParentNode(currentNode.id, nodes);
      if (parent) {
        if (areAllSiblingsChecked(currentNode, parent)) {
          if (!newChecked.includes(parent.id)) newChecked.push(parent.id);
        } else {
          newChecked = newChecked.filter((id) => id !== parent.id);
        }
        updateParents(parent);
      }
    };

    // updateParents(node);
    nodes.map((n) => {
      updateParents(n);
    });

    setChecked(newChecked);
  };

  // toggleSecondaryCheck関数を修正
  const toggleSecondaryCheck = (nodeId: string, node: TreeNode) => {
    let newSecondaryChecked = [...secondaryChecked]; // checkedではなくsecondaryCheckedを使用

    if (secondaryChecked.includes(nodeId)) {
      // checkedではなくsecondaryCheckedをチェック
      // ノードと子ノードのチェックを外す
      const removeNodes = (n: TreeNode) => {
        newSecondaryChecked = newSecondaryChecked.filter((id) => id !== n.id);
        n.children?.forEach(removeNodes);
      };
      removeNodes(node);
    } else {
      // ノードと子ノードをチェック
      const addNodes = (n: TreeNode) => {
        newSecondaryChecked.push(n.id);
        n.children?.forEach(addNodes);
      };
      addNodes(node);
    }

    setSecondaryChecked(newSecondaryChecked); // checkedではなくsecondaryCheckedを更新
  };

  const renderNode = (node: TreeNode, level: number = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expanded.includes(node.id);
    const isChecked = checked.includes(node.id);
    const isMatching = searchQuery && node.label.toLowerCase().includes(searchQuery.toLowerCase());

    return (
      <div key={node.id} className="select-none ">
        <div
          className={`
            flex items-center gap-2 py-1 px-2 hover:bg-secondary/50 rounded-sm
            ${isMatching ? 'bg-yellow-100 dark:bg-yellow-900/30' : ''}
          `}
          style={level > 0 ? { marginLeft: `${level * 24}px` } : undefined}
        >
          {hasChildren ? (
            <button
              onClick={() => toggleExpand(node.id)}
              className="h-4 w-4 flex items-center justify-center"
              aria-label={isExpanded ? 'フォルダを閉じる' : 'フォルダを開く'}
            >
              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>
          ) : (
            <div className="w-4" />
          )}

          {hasChildren ? (
            <Folder className="min-size-4 size-4 text-muted-foreground" />
          ) : (
            <File className="min-size-4 size-4 text-muted-foreground" />
          )}
          <span className="text-sm">{node.label}</span>

          <div className="flex items-center gap-4 ml-auto">
            {' '}
            {/* ml-autoを追加して右寄せに */}
            <div className="flex items-center space-x-2">
              <Label htmlFor={`${node.id}`} className="text-sm">
                First:
              </Label>
              <Checkbox
                id={node.id}
                checked={isChecked}
                onCheckedChange={() => toggleCheck(node.id, node)}
                aria-label={`${node.label}を選択`}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor={`${node.id}-secondary`} className="text-sm">
                Second:
              </Label>
              <Checkbox
                id={`${node.id}-secondary`}
                checked={secondaryChecked.includes(node.id)}
                onCheckedChange={() => toggleSecondaryCheck(node.id, node)}
                aria-label={`${node.label}の追加オプションを選択`}
              />
            </div>
          </div>
        </div>

        {hasChildren && isExpanded && <div>{node.children?.map((child) => renderNode(child, level + 1))}</div>}
      </div>
    );
  };
  return (
    <div className="w-full max-w-xl border rounded-lg p-4 bg-background">
      <div className="relative mb-4">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="ノードを検索..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-8"
        />
        <div>
          {isAllExpanded ? (
            <Button onClick={allToggleExpand} variant="ghost">
              -
            </Button>
          ) : (
            <Button onClick={allToggleExpand} variant="ghost">
              +
            </Button>
          )}
        </div>
      </div>
      {nodes.map((node) => renderNode(node))}
    </div>
  );
}
