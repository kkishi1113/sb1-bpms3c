'use client';

import * as React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { ChevronRight, ChevronDown, Folder, File, Search } from 'lucide-react';
import { Label } from '@/components/ui/label';

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

// ツリー操作に関するユーティリティ関数
const treeUtils = {
  // ノードとその子ノードを処理する
  traverseNodes: (node: TreeNode, callback: (n: TreeNode) => void) => {
    callback(node);
    node.children?.forEach((child) => treeUtils.traverseNodes(child, callback));
  },

  // 検索クエリにマッチするノードを見つける
  findMatchingNodes: (node: TreeNode, query: string): string[] => {
    const matches: string[] = [];
    treeUtils.traverseNodes(node, (n) => {
      if (n.label.toLowerCase().includes(query.toLowerCase())) {
        matches.push(n.id);
      }
    });
    return matches;
  },

  // 親ノードを収集する
  collectParentNodes: (node: TreeNode, targetIds: Set<string>): string[] => {
    const parentIds = new Set<string>();

    const traverse = (n: TreeNode) => {
      if (n.children?.some((child) => targetIds.has(child.id) || parentIds.has(child.id))) {
        parentIds.add(n.id);
      }
      n.children?.forEach(traverse);
    };

    traverse(node);
    return Array.from(parentIds);
  },
};

// ノードコンポーネント
const TreeNode: React.FC<{
  node: TreeNode;
  level: number;
  expanded: string[];
  checked: string[];
  secondaryChecked: string[];
  searchQuery: string;
  onExpand: (nodeId: string) => void;
  onCheck: (nodeId: string, node: TreeNode) => void;
  onSecondaryCheck: (nodeId: string, node: TreeNode) => void;
}> = ({ node, level, expanded, checked, secondaryChecked, searchQuery, onExpand, onCheck, onSecondaryCheck }) => {
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = expanded.includes(node.id);
  const isChecked = checked.includes(node.id);
  const isMatching = searchQuery && node.label.toLowerCase().includes(searchQuery.toLowerCase());

  return (
    <div className="select-none">
      <div
        className={`
          flex items-center gap-2 py-1 px-2 hover:bg-secondary/50 rounded-sm
          ${isMatching ? 'bg-yellow-100 dark:bg-yellow-900/30' : ''}
        `}
        style={level > 0 ? { marginLeft: `${level * 24}px` } : undefined}
      >
        {hasChildren ? (
          <button
            onClick={() => onExpand(node.id)}
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
          <CheckboxWithLabel
            id={node.id}
            label="First:"
            checked={isChecked}
            onChange={() => onCheck(node.id, node)}
            aria-label={`${node.label}を選択`}
          />
          <CheckboxWithLabel
            id={`${node.id}-secondary`}
            label="Second:"
            checked={secondaryChecked.includes(node.id)}
            onChange={() => onSecondaryCheck(node.id, node)}
            aria-label={`${node.label}の追加オプションを選択`}
          />
        </div>
      </div>

      {hasChildren && isExpanded && (
        <div>
          {node.children?.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              level={level + 1}
              expanded={expanded}
              checked={checked}
              secondaryChecked={secondaryChecked}
              searchQuery={searchQuery}
              onExpand={onExpand}
              onCheck={onCheck}
              onSecondaryCheck={onSecondaryCheck}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// チェックボックスとラベルのコンポーネント
const CheckboxWithLabel: React.FC<{
  id: string;
  label: string;
  checked: boolean;
  onChange: () => void;
  'aria-label': string;
}> = ({ id, label, checked, onChange, 'aria-label': ariaLabel }) => (
  <div className="flex items-center space-x-2">
    <Label htmlFor={id} className="text-sm">
      {label}
    </Label>
    <Checkbox id={id} checked={checked} onCheckedChange={onChange} aria-label={ariaLabel} />
  </div>
);

// メインコンポーネント
export default function CheckboxSecondaryTreeComponent({ nodes = data }: CheckboxTreeProps) {
  const [expanded, setExpanded] = React.useState<string[]>([]);
  const [checked, setChecked] = React.useState<string[]>([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [secondaryChecked, setSecondaryChecked] = React.useState<string[]>([]);

  // 検索処理
  React.useEffect(() => {
    if (!searchQuery) return;

    const matchingIds = nodes.flatMap((node) => treeUtils.findMatchingNodes(node, searchQuery));
    const parentIds = nodes.flatMap((node) => treeUtils.collectParentNodes(node, new Set(matchingIds)));

    setExpanded([...new Set([...matchingIds, ...parentIds])]);
  }, [searchQuery, nodes]);

  // ノード操作のハンドラー
  const handleToggleExpand = (nodeId: string) => {
    setExpanded((prev) => (prev.includes(nodeId) ? prev.filter((id) => id !== nodeId) : [...prev, nodeId]));
  };

  const handleToggleCheck = (nodeId: string, node: TreeNode) => {
    setChecked((prev) => {
      const newChecked = [...prev];
      const isCurrentlyChecked = prev.includes(nodeId);

      treeUtils.traverseNodes(node, (n) => {
        if (isCurrentlyChecked) {
          const index = newChecked.indexOf(n.id);
          if (index !== -1) newChecked.splice(index, 1);
        } else if (!newChecked.includes(n.id)) {
          newChecked.push(n.id);
        }
      });

      return newChecked;
    });
  };

  const handleToggleSecondaryCheck = (nodeId: string, node: TreeNode) => {
    setSecondaryChecked((prev) => {
      const newChecked = [...prev];
      const isCurrentlyChecked = prev.includes(nodeId);

      treeUtils.traverseNodes(node, (n) => {
        if (isCurrentlyChecked) {
          const index = newChecked.indexOf(n.id);
          if (index !== -1) newChecked.splice(index, 1);
        } else if (!newChecked.includes(n.id)) {
          newChecked.push(n.id);
        }
      });

      return newChecked;
    });
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
      </div>
      {nodes.map((node) => (
        <TreeNode
          key={node.id}
          node={node}
          level={0}
          expanded={expanded}
          checked={checked}
          secondaryChecked={secondaryChecked}
          searchQuery={searchQuery}
          onExpand={handleToggleExpand}
          onCheck={handleToggleCheck}
          onSecondaryCheck={handleToggleSecondaryCheck}
        />
      ))}
    </div>
  );
}
