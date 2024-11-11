import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import DynamicTableApp from './dynamic-column/dynamic-table-app';
import VirtualDataTable from './virtual-table/virtual-table';
import DraggableColumnsComponent from './draggable-columns/draggable-columns';
import DialogWithCarouselComponent from './dialog-with-carousel/dialog-with-carousel';
import CheckboxTreeComponent from './checkbox-tree/checkbox-tree';
import CheckboxSecondaryTreeComponent from './checkbox-tree/checkbox-secondary-tree';
import SmartCheckboxTreeComponent from './checkbox-tree/smart-checkbox-tree';
import Checkbox17 from './checkbox-tree/others/checkbox-17/checkbox-17';
import Checkbox17Custom from './checkbox-tree/chekcbox17-custom/checkbox17';
import DraggablePopoverComponent from './draggable-popober';
import { CheckboxTreeByClaude, sampleData } from './checkbox-tree/checkbox-tree-by-claude/checkbox-tree-component';
import Checkbox17byClaude from './checkbox-tree/chekcbox17-custom/checkbox-tree-17-by-claude';
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
        <AccordionItemComponent title="Dialog with Carousel">
          <DialogWithCarouselComponent />
        </AccordionItemComponent>
        <AccordionItemComponent title="Checkbox Tree">
          <CheckboxTreeComponent />
        </AccordionItemComponent>
        <AccordionItemComponent title="Checkbox Secondary Tree">
          <CheckboxSecondaryTreeComponent />
        </AccordionItemComponent>
        <AccordionItemComponent title="Smart Checkbox Tree">
          <SmartCheckboxTreeComponent />
        </AccordionItemComponent>
        <AccordionItemComponent title="Checkbox Tree 17">
          <Checkbox17 />
        </AccordionItemComponent>
        <AccordionItemComponent title="Checkbox Tree 17 Custom">
          <Checkbox17Custom />
        </AccordionItemComponent>
        <AccordionItemComponent title="Checkbox17 by Claude">
          <Checkbox17byClaude />
        </AccordionItemComponent>
        <AccordionItemComponent title="Checkbox Tree by Claude">
          <CheckboxTreeByClaude nodes={sampleData} onStateChange={(states) => console.log('States updated:', states)} />
        </AccordionItemComponent>
        <AccordionItemComponent title="Draggable Popover">
          <DraggablePopoverComponent>
            <div>Children</div>
          </DraggablePopoverComponent>
        </AccordionItemComponent>
      </Accordion>
    </div>
  );
}
