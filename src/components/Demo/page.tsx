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
import {
  CheckboxTreeByClaude,
  sampleData,
  TreeNode,
} from './checkbox-tree/checkbox-tree-by-claude/checkbox-tree-component';
import Checkbox17byClaude from './checkbox-tree/chekcbox17-custom/checkbox-tree-17-by-claude';
import ChatApp from './chat/chat-app';
import ChatAndDataApp from './chat-and-datatable/v1/enhanced-chat-and-data-app';
import ChatAndDataAppV2 from './chat-and-datatable/v2/chat-and-data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import DataSearchChatTool from './tab2/data-search-chat-tool';
import DataSearchChatToolV2 from './tab2/v2/data-search-chat-tool';

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

// const data: TreeNode = {
//   id: 'node-1',
//   label: 'Node-1',
//   children: [
//     { id: 'node-1-1', label: 'Node-1-1' },
//     {
//       id: 'node-1-2',
//       label: 'Node-1-2',
//       children: [
//         { id: 'node-1-2-1', label: 'Id' },
//         { id: 'node-1-2-2', label: 'Name' },
//       ],
//     },
//     { id: 'node-1-3', label: 'age' },
//   ],
// };

const data: TreeNode = {
  id: 'node-1',
  label: 'Node-1',
  children: [
    {
      id: 'node-1-1',
      label: 'Node-1-1',
      children: [
        {
          id: 'node-1-1-1',
          label: 'Node-1-1-1',
          children: generateLeafNodes('node-1-1-1', 6),
        },
        {
          id: 'node-1-1-2',
          label: 'Node-1-1-2',
          children: generateLeafNodes('node-1-1-2', 6),
        },
      ],
    },
    {
      id: 'node-1-2',
      label: 'Node-1-2',
      children: [
        {
          id: 'node-1-2-1',
          label: 'Node-1-2-1',
          children: generateLeafNodes('node-1-2-1', 6),
        },
        {
          id: 'node-1-2-2',
          label: 'Node-1-2-2',
          children: generateLeafNodes('node-1-2-2', 6),
        },
      ],
    },
    {
      id: 'node-1-3',
      label: 'Node-1-3',
      children: [
        {
          id: 'node-1-3-1',
          label: 'Node-1-3-1',
          children: generateLeafNodes('node-1-3-1', 6),
        },
        {
          id: 'node-1-3-2',
          label: 'Node-1-3-2',
          children: generateLeafNodes('node-1-3-2', 6),
        },
      ],
    },
  ],
};

function generateLeafNodes(parentId: string, count: number): TreeNode[] {
  const leafNodes: TreeNode[] = [];
  for (let i = 1; i <= count; i++) {
    leafNodes.push({ id: `${parentId}-${i}`, label: `Leaf-${parentId}-${i}` });
  }
  return leafNodes;
}

export default function Demo() {
  return (
    <div className="container mx-auto p-20">
      <h1>Demo</h1>
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab1</TabsTrigger>
          <TabsTrigger value="tab2">Tab2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">
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
              <Checkbox17byClaude initialTree={data} />
            </AccordionItemComponent>
            <AccordionItemComponent title="Checkbox Tree by Claude">
              <CheckboxTreeByClaude
                nodes={sampleData}
                onStateChange={(states) => console.log('States updated:', states)}
              />
            </AccordionItemComponent>
            <AccordionItemComponent title="Draggable Popover">
              <DraggablePopoverComponent>
                <div>Children</div>
              </DraggablePopoverComponent>
            </AccordionItemComponent>
            <AccordionItemComponent title="Chat">
              <ChatApp />
            </AccordionItemComponent>
            <AccordionItemComponent title="Chat & Data">
              <ChatAndDataApp />
            </AccordionItemComponent>
            <AccordionItemComponent title="Chat & Data v2">
              <ChatAndDataAppV2 />
            </AccordionItemComponent>
          </Accordion>
        </TabsContent>
        <TabsContent value="tab2">
          <Accordion type="single" collapsible>
            <AccordionItemComponent title="Tool">
              <DataSearchChatTool />
            </AccordionItemComponent>
            <AccordionItemComponent title="Tool V2">
              <DataSearchChatToolV2 />
            </AccordionItemComponent>
          </Accordion>
        </TabsContent>
      </Tabs>
    </div>
  );
}
