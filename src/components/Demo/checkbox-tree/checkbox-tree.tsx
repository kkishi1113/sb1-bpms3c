'use client';

import * as React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { ChevronRight, ChevronDown, Folder, File, Search } from 'lucide-react';

interface TreeNode {
  id: string;
  label: string;
  children?: TreeNode[];
}

interface CheckboxTreeProps {
  nodes?: TreeNode[];
}

export default function CheckboxTreeComponent({
  nodes = [
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
            },
          ],
        },
      ],
    },
    {
      id: 'config',
      label: 'config',
    },
    {
      id: 'public',
      label: 'public',
      children: [
        {
          id: 'env',
          label: '.env',
        },
        {
          id: 'gitignore',
          label: '.gitignore',
        },
        {
          id: 'readme',
          label: 'README.md',
        },
      ],
    },
  ],
}: CheckboxTreeProps) {
  const [expanded, setExpanded] = React.useState<string[]>([]);
  const [checked, setChecked] = React.useState<string[]>([]);
  const [searchQuery, setSearchQuery] = React.useState('');

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
  }, [searchQuery, nodes, getMatchingNodeIds, expanded]); // expandedを依存配列に追加

  const toggleExpand = (nodeId: string) => {
    setExpanded((prev) => (prev.includes(nodeId) ? prev.filter((id) => id !== nodeId) : [...prev, nodeId]));
  };

  const toggleCheck = (nodeId: string, node: TreeNode) => {
    let newChecked = [...checked];

    if (checked.includes(nodeId)) {
      // ノードと子ノードのチェックを外す
      const removeNodes = (n: TreeNode) => {
        newChecked = newChecked.filter((id) => id !== n.id);
        n.children?.forEach(removeNodes);
      };
      removeNodes(node);
    } else {
      // ノードと子ノードをチェック
      const addNodes = (n: TreeNode) => {
        newChecked.push(n.id);
        n.children?.forEach(addNodes);
      };
      addNodes(node);
    }

    setChecked(newChecked);
  };

  const renderNode = (node: TreeNode, level: number = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expanded.includes(node.id);
    const isChecked = checked.includes(node.id);
    const isMatching = searchQuery && node.label.toLowerCase().includes(searchQuery.toLowerCase());

    return (
      <div key={node.id} className="select-none">
        <div
          className={`
            flex items-center gap-1 py-1 px-2 hover:bg-secondary/50 rounded-sm
            ${level > 0 ? 'ml-6' : ''}
            ${isMatching ? 'bg-yellow-100 dark:bg-yellow-900/30' : ''}
          `}
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

          <Checkbox
            checked={isChecked}
            onCheckedChange={() => toggleCheck(node.id, node)}
            aria-label={`${node.label}を選択`}
          />

          {hasChildren ? (
            <Folder className="h-4 w-4 text-muted-foreground" />
          ) : (
            <File className="h-4 w-4 text-muted-foreground" />
          )}

          <span className="text-sm">{node.label}</span>
        </div>

        {hasChildren && isExpanded && <div>{node.children?.map((child) => renderNode(child, level + 1))}</div>}
      </div>
    );
  };

  return (
    <div className="w-full max-w-sm border rounded-lg p-4 bg-background">
      <div className="relative mb-4">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="ノードを検索..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-8"
        />
      </div>
      {nodes.map((node) => renderNode(node))}
    </div>
  );
}
