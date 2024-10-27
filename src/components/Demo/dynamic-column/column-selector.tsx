import { useState } from 'react';
import { useTableContext } from './dynamic-table-app';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

type ColumnSelectorProps = {
  columnGroups: Record<string, string[]>;
};

export function ColumnSelector({ columnGroups }: ColumnSelectorProps) {
  const { selectedColumns, setSelectedColumns } = useTableContext();
  const [searchTerm, setSearchTerm] = useState('');

  const allColumns = Object.values(columnGroups).flat();

  const handleColumnToggle = (column: string) => {
    setSelectedColumns((prev) => (prev.includes(column) ? prev.filter((col) => col !== column) : [...prev, column]));
  };

  const handleSelectAll = () => {
    setSelectedColumns(allColumns);
  };

  const handleDeselectAll = () => {
    setSelectedColumns([]);
  };

  const filteredGroups = Object.entries(columnGroups).reduce((acc, [group, columns]) => {
    const filteredColumns = columns.filter((column) => column.toLowerCase().includes(searchTerm.toLowerCase()));
    if (filteredColumns.length > 0) {
      acc[group] = filteredColumns;
    }
    return acc;
  }, {} as Record<string, string[]>);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Select Columns</h2>
      <div className="flex items-center space-x-2">
        <Input
          type="text"
          placeholder="Search columns..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={handleSelectAll}>Select All</Button>
        <Button onClick={handleDeselectAll} variant="outline">
          Deselect All
        </Button>
      </div>
      <div className="text-sm text-muted-foreground">
        Selected columns: {selectedColumns.length} / {allColumns.length}
      </div>
      <Accordion type="multiple" className="w-full">
        {Object.entries(filteredGroups).map(([group, columns]) => (
          <AccordionItem value={group} key={group}>
            <AccordionTrigger>{group}</AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-2 gap-4">
                {columns.map((column) => (
                  <div key={column} className="flex items-center space-x-2">
                    <Checkbox
                      id={column}
                      checked={selectedColumns.includes(column)}
                      onCheckedChange={() => handleColumnToggle(column)}
                    />
                    <Label htmlFor={column}>{column}</Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
