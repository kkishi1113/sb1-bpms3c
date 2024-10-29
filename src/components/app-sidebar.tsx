import { Calendar, Home, Inbox, Search, Settings, AppWindowMac } from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

// Menu items.
const items = [
  {
    title: 'Home',
    url: 'home',
    icon: Home,
  },
  {
    title: 'Demo',
    url: 'demo',
    icon: AppWindowMac,
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
  const { toggleSidebar, isMobile } = useSidebar();

  const handleClick = (url: string) => {
    if (isMobile) {
      toggleSidebar();
    }
    onMenuClick(url);
  };

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild onClick={() => handleClick(item.url)}>
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
