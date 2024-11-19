import { useState } from 'react';
import { UserSelection } from './user-selection';
import { DataTable } from './data-table';
import { ChatComponent } from './chat';
// import { UserSelection } from './components/UserSelection/UserSelection';
// import { DataTable } from './components/DataTable/data-table';
// import { ChatComponent } from './components/Chat/Chat';

export default function ChatAndDataAppV2() {
  // 初期データやステート管理コードを記述
  return (
    <div className="h-screen">
      <UserSelection /* 必要なプロパティを渡す */ />
      <DataTable /* 必要なプロパティを渡す */ />
      <ChatComponent /* 必要なプロパティを渡す */ />
    </div>
  );
}
