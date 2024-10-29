import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import DynamicTableApp from './dynamic-column/dynamic-table-app';
import VirtualDataTable from './virtual-table/virtual-table';
import DraggableColumnsComponent from './draggable-columns/draggable-columns';
const AccordionItemComponent = ({ title, children }: { title: string; children: React.ReactNode }) => {
  return (
    <AccordionItem value={title}>
      <AccordionTrigger>{title}</AccordionTrigger>
      <AccordionContent>
        <div className="border border-gray-200 rounded-lg p-4 mb-4">{children}</div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default function Demo() {
  return (
    <div className="container mx-auto p-20">
      <h1>Demo</h1>
      <Accordion type="single" collapsible>
        <AccordionItemComponent title="Dynamic Table">
          <DynamicTableApp />
        </AccordionItemComponent>
        <AccordionItemComponent title="Virtual Table">
          <VirtualDataTable />
        </AccordionItemComponent>
        <AccordionItemComponent title="Draggable Columns">
          <DraggableColumnsComponent />
        </AccordionItemComponent>
      </Accordion>
    </div>
  );
}
