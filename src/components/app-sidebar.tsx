import { Calendar, Home, Inbox, Search, Settings, AppWindowMac, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { logout } from '@/lib/firebase'; // logout関数をインポート

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

  const handleLogout = async () => {
    try {
      await logout();
      // ログアウト後の処理（例: リダイレクトなど）
    } catch (error) {
      console.error('ログアウトエラー:', error);
    }
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
                    <Button className="justify-start" variant="ghost">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild onClick={handleLogout}>
              <Button className="justify-start" variant="ghost">
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
