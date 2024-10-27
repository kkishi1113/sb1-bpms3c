import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import DynamicTableApp from './dynamic-column/dynamic-table-app';
import VirtualDataTable from './virtual-table/virtual-table';

export default function Demo() {
  return (
    <div className="container mx-auto p-20">
      <h1>Demo</h1>
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Dynamic Table</AccordionTrigger>
          <AccordionContent>
            <div className="border border-gray-200 rounded-lg p-4 mb-4">
              <DynamicTableApp />
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Virtual Table</AccordionTrigger>
          <AccordionContent>
            <div className="border border-gray-200 rounded-lg p-4">
              <VirtualDataTable />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
