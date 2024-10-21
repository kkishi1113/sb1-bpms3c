import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { PlusCircle, Search, Moon, Sun } from 'lucide-react'
import { useTheme } from '@/components/theme-provider'

interface Shortcut {
  id: string
  url: string
  favicon: string
  text: string
  category: string
}

const Dashboard: React.FC = () => {
  const { theme, setTheme } = useTheme()
  const [shortcuts, setShortcuts] = useState<Shortcut[]>([])
  const [newShortcut, setNewShortcut] = useState<Omit<Shortcut, 'id'>>({
    url: '',
    favicon: '',
    text: '',
    category: '',
  })

  const handleAddShortcut = () => {
    const id = Date.now().toString()
    setShortcuts([...shortcuts, { ...newShortcut, id }])
    setNewShortcut({ url: '', favicon: '', text: '', category: '' })
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <div className="relative w-2/3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-10"
            type="text"
            placeholder="検索..."
          />
        </div>
        <div className="flex items-center space-x-4">
          <Button onClick={toggleTheme} variant="outline" size="icon">
            {theme === 'dark' ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button><PlusCircle className="mr-2" /> ショートカットを追加</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>新しいショートカットを追加</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Input
                  placeholder="URL"
                  value={newShortcut.url}
                  onChange={(e) => setNewShortcut({ ...newShortcut, url: e.target.value })}
                />
                <Input
                  placeholder="Favicon URL"
                  value={newShortcut.favicon}
                  onChange={(e) => setNewShortcut({ ...newShortcut, favicon: e.target.value })}
                />
                <Input
                  placeholder="テキスト"
                  value={newShortcut.text}
                  onChange={(e) => setNewShortcut({ ...newShortcut, text: e.target.value })}
                />
                <Input
                  placeholder="カテゴリ"
                  value={newShortcut.category}
                  onChange={(e) => setNewShortcut({ ...newShortcut, category: e.target.value })}
                />
              </div>
              <Button onClick={handleAddShortcut}>追加</Button>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="grid grid-cols-6 gap-4">
        {shortcuts.map((shortcut) => (
          <a
            key={shortcut.id}
            href={shortcut.url}
            className="flex flex-col items-center p-4 bg-card hover:bg-accent rounded-lg transition-colors"
          >
            <img src={shortcut.favicon} alt={shortcut.text} className="w-12 h-12 mb-2" />
            <span className="text-sm text-center">{shortcut.text}</span>
          </a>
        ))}
      </div>
    </div>
  )
}

export default Dashboard