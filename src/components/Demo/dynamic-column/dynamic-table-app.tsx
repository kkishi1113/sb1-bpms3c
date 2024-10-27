'use client';

import React, { createContext, useState, useContext } from 'react';
import { ColumnSelector } from './column-selector';
import { DataTable } from './data-table';

// カラムの定義
const columnGroups = {
  'Basic Info': ['id', 'name', 'age'],
  Contact: ['email', 'phone'],
  Location: ['city', 'country'],
  Work: ['job', 'company'],
  Other: ['hobbies', 'education'],
};

// モックデータ
const mockData = [
  {
    id: 1,
    name: 'John Doe',
    age: 30,
    email: 'john@example.com',
    phone: '123-456-7890',
    city: 'New York',
    country: 'USA',
    job: 'Developer',
    company: 'Tech Co',
    hobbies: 'Reading',
    education: "Bachelor's",
  },
  {
    id: 2,
    name: 'Jane Smith',
    age: 28,
    email: 'jane@example.com',
    phone: '098-765-4321',
    city: 'London',
    country: 'UK',
    job: 'Designer',
    company: 'Creative Inc',
    hobbies: 'Painting',
    education: "Master's",
  },
  {
    id: 3,
    name: 'Bob Johnson',
    age: 35,
    email: 'bob@example.com',
    phone: '111-222-3333',
    city: 'Tokyo',
    country: 'Japan',
    job: 'Manager',
    company: 'Global Corp',
    hobbies: 'Traveling',
    education: 'PhD',
  },
  {
    id: 4,
    name: 'Alice Brown',
    age: 26,
    email: 'alice@example.com',
    phone: '444-555-6666',
    city: 'Sydney',
    country: 'Australia',
    job: 'Analyst',
    company: 'Data Firm',
    hobbies: 'Swimming',
    education: "Bachelor's",
  },
  {
    id: 5,
    name: 'Charlie Davis',
    age: 40,
    email: 'charlie@example.com',
    phone: '777-888-9999',
    city: 'Paris',
    country: 'France',
    job: 'Consultant',
    company: 'Advice LLC',
    hobbies: 'Cooking',
    education: "Master's",
  },
];

type TableContextType = {
  selectedColumns: string[];
  setSelectedColumns: React.Dispatch<React.SetStateAction<string[]>>;
  data: typeof mockData;
};

const TableContext = createContext<TableContextType | undefined>(undefined);

export const useTableContext = () => {
  const context = useContext(TableContext);
  if (context === undefined) {
    throw new Error('useTableContext must be used within a TableProvider');
  }
  return context;
};

export default function DynamicTableApp() {
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);

  return (
    <TableContext.Provider value={{ selectedColumns, setSelectedColumns, data: mockData }}>
      <div className="container mx-auto p-4 space-y-6">
        <h1 className="text-3xl font-bold mb-6">Dynamic Table Application</h1>
        <ColumnSelector columnGroups={columnGroups} />
        <DataTable />
      </div>
    </TableContext.Provider>
  );
}
