import { Calendar, Home, Inbox, Search, Settings } from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

// Menu items.
const items = [
  {
    title: 'Home',
    url: 'home',
    icon: Home,
  },
  {
    title: 'Inbox',
    url: 'inbox',
    icon: Inbox,
  },
  {
    title: 'Calendar',
    url: 'calendar',
    icon: Calendar,
  },
  {
    title: 'Search',
    url: 'search',
    icon: Search,
  },
  {
    title: 'Settings',
    url: 'settings',
    icon: Settings,
  },
];

interface AppSidebarProps {
  onMenuClick: (view: string) => void;
}

export function AppSidebar({ onMenuClick }: AppSidebarProps) {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild onClick={() => onMenuClick(item.url)}>
                    <button className="flex items-center gap-2 w-full">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
