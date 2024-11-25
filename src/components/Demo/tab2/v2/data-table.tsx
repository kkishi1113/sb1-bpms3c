import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
};

type DataTableProps = {
  data: Product[];
  selectedProducts: string[];
  onSelectProduct: (productId: string, isSelected: boolean) => void;
};

export function DataTable({ data, selectedProducts, onSelectProduct }: DataTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">選択</TableHead>
          <TableHead>ID</TableHead>
          <TableHead>商品名</TableHead>
          <TableHead>カテゴリ</TableHead>
          <TableHead>価格</TableHead>
          <TableHead>在庫</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((product) => (
          <TableRow key={product.id}>
            <TableCell>
              <Checkbox
                checked={selectedProducts.includes(product.id)}
                onCheckedChange={(checked) => onSelectProduct(product.id, checked as boolean)}
              />
            </TableCell>
            <TableCell>{product.id}</TableCell>
            <TableCell>{product.name}</TableCell>
            <TableCell>{product.category}</TableCell>
            <TableCell>{product.price.toLocaleString()}円</TableCell>
            <TableCell>{product.stock}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

