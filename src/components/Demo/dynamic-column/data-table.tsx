import { useTableContext } from './dynamic-table-app';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';

export function DataTable() {
  const { selectedColumns, data } = useTableContext();

  if (selectedColumns.length === 0) {
    return <div className="text-center text-muted-foreground">No columns selected</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Data Table</h2>
      <ScrollArea className="h-[400px] rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {selectedColumns.map((column) => (
                <TableHead key={column}>{column}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.id}>
                {selectedColumns.map((column) => (
                  <TableCell key={`${row.id}-${column}`}>
                    {row[column as keyof typeof row] !== undefined ? String(row[column as keyof typeof row]) : ''}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
}
