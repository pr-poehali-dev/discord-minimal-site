import { useState, useMemo } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type Campaign = {
  id: number;
  name: string;
  status: 'active' | 'paused' | 'completed';
  sent: number;
  limit: number;
  message: string;
  selectedCommunities: number[];
};

const availableCommunities = [
  { id: 1, name: 'Технологии и IT', members: 45230 },
  { id: 2, name: 'Маркетинг и реклама', members: 38420 },
  { id: 3, name: 'Бизнес и стартапы', members: 32100 },
  { id: 4, name: 'Дизайн и креатив', members: 28900 },
  { id: 5, name: 'Образование', members: 25400 },
  { id: 6, name: 'Путешествия', members: 21800 },
  { id: 7, name: 'Спорт и фитнес', members: 19200 },
  { id: 8, name: 'Кулинария', members: 16500 },
];

const initialCampaigns: Campaign[] = [
  { id: 1, name: 'Акция весна 2026', status: 'active', sent: 1245, limit: 5000, message: 'Весенняя распродажа! Скидки до 50%', selectedCommunities: [1, 2, 3] },
  { id: 2, name: 'Летняя распродажа', status: 'paused', sent: 890, limit: 3000, message: 'Летние скидки на всё!', selectedCommunities: [4, 5] },
  { id: 3, name: 'Новинки каталога', status: 'completed', sent: 5000, limit: 5000, message: 'Новая коллекция уже в продаже', selectedCommunities: [1, 2, 3, 4, 5] },
];

type Bot = {
  id: number;
  name: string;
  avatar: string;
  status: 'online' | 'offline' | 'error';
  messagesSent: number;
  dailyLimit: number;
  lastActive: string;
  token: string;
};

const initialBots: Bot[] = [
  { id: 1, name: 'Bot Alpha', avatar: '🤖', status: 'online', messagesSent: 450, dailyLimit: 1000, lastActive: '2 мин назад', token: 'xxx...xxx1' },
  { id: 2, name: 'Bot Beta', avatar: '🦾', status: 'online', messagesSent: 320, dailyLimit: 1000, lastActive: '5 мин назад', token: 'xxx...xxx2' },
  { id: 3, name: 'Bot Gamma', avatar: '🎯', status: 'offline', messagesSent: 180, dailyLimit: 1000, lastActive: '2 часа назад', token: 'xxx...xxx3' },
  { id: 4, name: 'Bot Delta', avatar: '⚡', status: 'online', messagesSent: 520, dailyLimit: 1500, lastActive: '1 мин назад', token: 'xxx...xxx4' },
  { id: 5, name: 'Bot Epsilon', avatar: '🚀', status: 'error', messagesSent: 95, dailyLimit: 1000, lastActive: '30 мин назад', token: 'xxx...xxx5' },
  { id: 6, name: 'Bot Zeta', avatar: '💎', status: 'online', messagesSent: 280, dailyLimit: 1000, lastActive: '3 мин назад', token: 'xxx...xxx6' },
];

const analyticsData = [
  { date: '05.02', sent: 120, delivered: 115, failed: 5 },
  { date: '06.02', sent: 150, delivered: 145, failed: 5 },
  { date: '07.02', sent: 180, delivered: 170, failed: 10 },
  { date: '08.02', sent: 210, delivered: 200, failed: 10 },
  { date: '09.02', sent: 190, delivered: 180, failed: 10 },
  { date: '10.02', sent: 240, delivered: 230, failed: 10 },
  { date: '11.02', sent: 220, delivered: 210, failed: 10 },
];

const communityData = [
  { name: 'Сообщество А', members: 12400 },
  { name: 'Сообщество Б', members: 8900 },
  { name: 'Сообщество В', members: 6700 },
  { name: 'Сообщество Г', members: 5200 },
  { name: 'Сообщество Д', members: 4100 },
];

const mockLogs = [
  { time: '11:42:15', type: 'success', message: 'Bot Alpha отправил 25 сообщений' },
  { time: '11:40:32', type: 'info', message: 'Запущена кампания "Акция весна 2026"' },
  { time: '11:38:54', type: 'warning', message: 'Bot Gamma превысил лимит запросов' },
  { time: '11:35:21', type: 'error', message: 'Ошибка подключения к сообществу #12345' },
  { time: '11:32:10', type: 'success', message: 'Bot Beta успешно настроен' },
];

export default function Index() {
  const [activeTab, setActiveTab] = useState('campaigns');
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [editFormData, setEditFormData] = useState({ name: '', message: '', limit: 0, selectedCommunities: [] as number[] });
  const [logFilter, setLogFilter] = useState<'all' | 'success' | 'error' | 'warning' | 'info'>('all');
  const [bots, setBots] = useState<Bot[]>(initialBots);
  const [botStatusFilter, setBotStatusFilter] = useState<'all' | 'online' | 'offline' | 'error'>('all');
  const [selectedBots, setSelectedBots] = useState<number[]>([]);
  const [bulkEditData, setBulkEditData] = useState({ avatar: '', name: '', description: '' });
  const [showBulkEdit, setShowBulkEdit] = useState(false);

  const filteredLogs = useMemo(() => {
    if (logFilter === 'all') return mockLogs;
    return mockLogs.filter(log => log.type === logFilter);
  }, [logFilter]);

  const filteredBots = useMemo(() => {
    if (botStatusFilter === 'all') return bots;
    return bots.filter(bot => bot.status === botStatusFilter);
  }, [bots, botStatusFilter]);

  const botStats = useMemo(() => {
    const online = bots.filter(b => b.status === 'online').length;
    const offline = bots.filter(b => b.status === 'offline').length;
    const error = bots.filter(b => b.status === 'error').length;
    const totalSent = bots.reduce((sum, b) => sum + b.messagesSent, 0);
    return { online, offline, error, total: bots.length, totalSent };
  }, [bots]);

  const toggleBotSelection = (id: number) => {
    setSelectedBots(prev => 
      prev.includes(id) ? prev.filter(bid => bid !== id) : [...prev, id]
    );
  };

  const toggleAllBots = () => {
    if (selectedBots.length === filteredBots.length) {
      setSelectedBots([]);
    } else {
      setSelectedBots(filteredBots.map(b => b.id));
    }
  };

  const handleBulkAction = (action: 'start' | 'stop' | 'delete') => {
    if (action === 'delete') {
      setBots(bots.filter(b => !selectedBots.includes(b.id)));
      setSelectedBots([]);
    } else if (action === 'start') {
      setBots(bots.map(b => selectedBots.includes(b.id) ? { ...b, status: 'online' as const } : b));
    } else if (action === 'stop') {
      setBots(bots.map(b => selectedBots.includes(b.id) ? { ...b, status: 'offline' as const } : b));
    }
  };

  const handleBulkEdit = () => {
    setBots(bots.map(b => {
      if (!selectedBots.includes(b.id)) return b;
      return {
        ...b,
        ...(bulkEditData.avatar && { avatar: bulkEditData.avatar }),
        ...(bulkEditData.name && { name: bulkEditData.name }),
      };
    }));
    setShowBulkEdit(false);
    setBulkEditData({ avatar: '', name: '', description: '' });
  };

  return (
    <div className="flex h-screen bg-background text-foreground">
      <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
        <div className="p-4 border-b border-sidebar-border">
          <h1 className="text-xl font-bold text-sidebar-foreground flex items-center gap-2">
            <Icon name="Send" size={24} className="text-primary" />
            Рассылки
          </h1>
        </div>
        
        <nav className="flex-1 p-3 space-y-1">
          <button
            onClick={() => setActiveTab('campaigns')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'campaigns' 
                ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
                : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
            }`}
          >
            <Icon name="Megaphone" size={20} />
            Рекламы
          </button>
          
          <button
            onClick={() => setActiveTab('bots')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'bots' 
                ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
                : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
            }`}
          >
            <Icon name="Bot" size={20} />
            Боты
          </button>
          
          <button
            onClick={() => setActiveTab('analytics')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'analytics' 
                ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
                : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
            }`}
          >
            <Icon name="TrendingUp" size={20} />
            Аналитика
          </button>
          
          <button
            onClick={() => setActiveTab('logs')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'logs' 
                ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
                : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
            }`}
          >
            <Icon name="ScrollText" size={20} />
            Логи
          </button>
        </nav>

        <div className="p-3 border-t border-sidebar-border">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <Icon name="User" size={18} className="text-primary" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium">Администратор</div>
              <div className="text-xs text-muted-foreground">admin@mail.ru</div>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        {activeTab === 'campaigns' && (
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold">Рекламные кампании</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Icon name="Plus" size={18} />
                    Создать кампанию
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Новая рекламная кампания</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Название кампании</Label>
                      <Input placeholder="Введите название..." />
                    </div>
                    <div className="space-y-2">
                      <Label>Текст сообщения</Label>
                      <Textarea placeholder="Введите текст рассылки..." rows={4} />
                    </div>
                    <div className="space-y-2">
                      <Label>Лимит получателей</Label>
                      <Input type="number" placeholder="5000" />
                    </div>
                    <div className="space-y-2">
                      <Label>Сообщества (выберите ID через запятую)</Label>
                      <Input placeholder="12345, 67890, 11223" />
                    </div>
                    <Button className="w-full">Создать кампанию</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {campaigns.map((campaign) => (
                <Card key={campaign.id} className="p-6 hover:bg-card/80 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold">{campaign.name}</h3>
                        <Badge 
                          variant={campaign.status === 'active' ? 'default' : campaign.status === 'paused' ? 'secondary' : 'outline'}
                        >
                          {campaign.status === 'active' ? 'Активна' : campaign.status === 'paused' ? 'Приостановлена' : 'Завершена'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-6 text-sm text-muted-foreground mb-2">
                        <span className="flex items-center gap-1">
                          <Icon name="Users" size={16} />
                          {campaign.sent} / {campaign.limit} получателей
                        </span>
                        <span className="flex items-center gap-1">
                          <Icon name="Hash" size={16} />
                          {campaign.selectedCommunities.length} сообществ
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{campaign.message}</p>
                      <div className="mt-3 bg-muted rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-primary h-full transition-all"
                          style={{ width: `${(campaign.sent / campaign.limit) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="icon" onClick={() => {
                            setEditingCampaign(campaign);
                            setEditFormData({
                              name: campaign.name,
                              message: campaign.message,
                              limit: campaign.limit,
                              selectedCommunities: campaign.selectedCommunities
                            });
                          }}>
                            <Icon name="Settings" size={18} />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px]">
                          <DialogHeader>
                            <DialogTitle>Настройка кампании</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label>Название кампании</Label>
                              <Input 
                                value={editFormData.name}
                                onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Текст сообщения</Label>
                              <Textarea 
                                value={editFormData.message}
                                onChange={(e) => setEditFormData({ ...editFormData, message: e.target.value })}
                                rows={4} 
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Лимит получателей</Label>
                              <Input 
                                type="number" 
                                value={editFormData.limit}
                                onChange={(e) => setEditFormData({ ...editFormData, limit: parseInt(e.target.value) || 0 })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Выберите сообщества</Label>
                              <ScrollArea className="h-[200px] border rounded-md p-4">
                                <div className="space-y-3">
                                  {availableCommunities.map((community) => (
                                    <div key={community.id} className="flex items-start space-x-3">
                                      <Checkbox
                                        id={`community-${community.id}`}
                                        checked={editFormData.selectedCommunities.includes(community.id)}
                                        onCheckedChange={(checked) => {
                                          if (checked) {
                                            setEditFormData({
                                              ...editFormData,
                                              selectedCommunities: [...editFormData.selectedCommunities, community.id]
                                            });
                                          } else {
                                            setEditFormData({
                                              ...editFormData,
                                              selectedCommunities: editFormData.selectedCommunities.filter(id => id !== community.id)
                                            });
                                          }
                                        }}
                                      />
                                      <label
                                        htmlFor={`community-${community.id}`}
                                        className="flex-1 text-sm cursor-pointer"
                                      >
                                        <div className="font-medium">{community.name}</div>
                                        <div className="text-xs text-muted-foreground">{community.members.toLocaleString()} участников</div>
                                      </label>
                                    </div>
                                  ))}
                                </div>
                              </ScrollArea>
                            </div>
                            <Button 
                              className="w-full"
                              onClick={() => {
                                if (editingCampaign) {
                                  setCampaigns(campaigns.map(c => 
                                    c.id === editingCampaign.id 
                                      ? { ...c, ...editFormData }
                                      : c
                                  ));
                                  setEditingCampaign(null);
                                }
                              }}
                            >
                              Сохранить изменения
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button variant="outline" size="icon">
                        <Icon name="Play" size={18} />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'bots' && (
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold">Сеть ботов</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Icon name="Plus" size={18} />
                    Добавить ботов
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Добавить ботов в сеть</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Токены ботов (каждый с новой строки)</Label>
                      <Textarea placeholder="TOKEN1\nTOKEN2\nTOKEN3..." rows={6} />
                    </div>
                    <div className="space-y-2">
                      <Label>Лимит сообщений в день (для каждого)</Label>
                      <Input type="number" defaultValue={1000} />
                    </div>
                    <Button className="w-full">Добавить в сеть</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Всего ботов</span>
                  <Icon name="Bot" size={20} className="text-primary" />
                </div>
                <div className="text-2xl font-bold">{botStats.total}</div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Онлайн</span>
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                </div>
                <div className="text-2xl font-bold text-green-500">{botStats.online}</div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Офлайн</span>
                  <div className="w-2 h-2 rounded-full bg-gray-500" />
                </div>
                <div className="text-2xl font-bold text-muted-foreground">{botStats.offline}</div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Ошибки</span>
                  <Icon name="AlertCircle" size={20} className="text-destructive" />
                </div>
                <div className="text-2xl font-bold text-destructive">{botStats.error}</div>
              </Card>
            </div>

            <Card className="mb-6">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Checkbox
                    checked={selectedBots.length === filteredBots.length && filteredBots.length > 0}
                    onCheckedChange={toggleAllBots}
                  />
                  <Select value={botStatusFilter} onValueChange={(value) => setBotStatusFilter(value as typeof botStatusFilter)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Статус" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Все боты</SelectItem>
                      <SelectItem value="online">Онлайн</SelectItem>
                      <SelectItem value="offline">Офлайн</SelectItem>
                      <SelectItem value="error">С ошибками</SelectItem>
                    </SelectContent>
                  </Select>
                  {selectedBots.length > 0 && (
                    <Badge variant="secondary">{selectedBots.length} выбрано</Badge>
                  )}
                </div>
                {selectedBots.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    <Dialog open={showBulkEdit} onOpenChange={setShowBulkEdit}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Icon name="Edit" size={16} />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Редактировать {selectedBots.length} ботов</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label>Аватарка (эмодзи)</Label>
                            <Input 
                              placeholder="Оставьте пустым чтобы не менять"
                              value={bulkEditData.avatar}
                              onChange={(e) => setBulkEditData({ ...bulkEditData, avatar: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Никнейм</Label>
                            <Input 
                              placeholder="Оставьте пустым чтобы не менять"
                              value={bulkEditData.name}
                              onChange={(e) => setBulkEditData({ ...bulkEditData, name: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Описание</Label>
                            <Textarea 
                              placeholder="Оставьте пустым чтобы не менять"
                              value={bulkEditData.description}
                              onChange={(e) => setBulkEditData({ ...bulkEditData, description: e.target.value })}
                              rows={3}
                            />
                          </div>
                          <Button className="w-full" onClick={handleBulkEdit}>
                            Применить к {selectedBots.length} ботам
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button variant="outline" size="sm" onClick={() => handleBulkAction('start')}>
                      <Icon name="Play" size={16} />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleBulkAction('stop')}>
                      <Icon name="Pause" size={16} />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleBulkAction('delete')}>
                      <Icon name="Trash2" size={16} />
                    </Button>
                  </div>
                )}
              </div>
              <div className="divide-y divide-border">
                {filteredBots.map((bot) => (
                  <div key={bot.id} className="p-4">
                    <div className="flex items-center gap-4">
                      <Checkbox
                        checked={selectedBots.includes(bot.id)}
                        onCheckedChange={() => toggleBotSelection(bot.id)}
                      />
                      <div className="text-3xl">{bot.avatar}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-semibold">{bot.name}</h3>
                          <div className={`w-2 h-2 rounded-full ${
                            bot.status === 'online' ? 'bg-green-500' : 
                            bot.status === 'error' ? 'bg-destructive' : 
                            'bg-gray-500'
                          }`} />
                          <Badge variant="outline" className="text-xs">{bot.token}</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Отправлено: {bot.messagesSent} / {bot.dailyLimit}</span>
                          <span>•</span>
                          <span>Активность: {bot.lastActive}</span>
                        </div>
                        <div className="mt-2 bg-muted rounded-full h-1.5 overflow-hidden">
                          <div 
                            className="bg-primary h-full transition-all"
                            style={{ width: `${(bot.messagesSent / bot.dailyLimit) * 100}%` }}
                          />
                        </div>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="gap-2">
                            <Icon name="Settings" size={14} />
                            Настроить
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Настройка {bot.name}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label>Никнейм</Label>
                              <Input defaultValue={bot.name} />
                            </div>
                            <div className="space-y-2">
                              <Label>Эмодзи аватара</Label>
                              <Input defaultValue={bot.avatar} />
                            </div>
                            <div className="space-y-2">
                              <Label>Лимит сообщений в день</Label>
                              <Input type="number" defaultValue={bot.dailyLimit} />
                            </div>
                            <div className="space-y-2">
                              <Label>Токен</Label>
                              <Input defaultValue={bot.token} disabled className="font-mono text-xs" />
                            </div>
                            <Button className="w-full">Сохранить</Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="p-8">
            <h2 className="text-3xl font-bold mb-6">Аналитика</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Всего отправлено</span>
                  <Icon name="Send" size={20} className="text-primary" />
                </div>
                <div className="text-3xl font-bold">1,310</div>
                <p className="text-xs text-green-500 mt-1">+12% за неделю</p>
              </Card>
              
              <Card className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Доставлено</span>
                  <Icon name="CheckCheck" size={20} className="text-green-500" />
                </div>
                <div className="text-3xl font-bold">1,250</div>
                <p className="text-xs text-green-500 mt-1">95.4% успех</p>
              </Card>
              
              <Card className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Ошибок</span>
                  <Icon name="AlertCircle" size={20} className="text-destructive" />
                </div>
                <div className="text-3xl font-bold">60</div>
                <p className="text-xs text-muted-foreground mt-1">4.6% от общего</p>
              </Card>
            </div>

            <Card className="p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Динамика рассылок за неделю</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analyticsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px'
                    }}
                  />
                  <Line type="monotone" dataKey="sent" stroke="hsl(var(--primary))" strokeWidth={2} />
                  <Line type="monotone" dataKey="delivered" stroke="hsl(var(--chart-2))" strokeWidth={2} />
                  <Line type="monotone" dataKey="failed" stroke="hsl(var(--destructive))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Топ сообществ по охвату</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={communityData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                  <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" width={120} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px'
                    }}
                  />
                  <Bar dataKey="members" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        )}

        {activeTab === 'logs' && (
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold">Логи системы</h2>
              <div className="flex gap-2">
                <Select value={logFilter} onValueChange={(value) => setLogFilter(value as typeof logFilter)}>
                  <SelectTrigger className="w-[180px]">
                    <div className="flex items-center gap-2">
                      <Icon name="Filter" size={16} />
                      <SelectValue placeholder="Фильтр" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все логи</SelectItem>
                    <SelectItem value="success">Успешные</SelectItem>
                    <SelectItem value="error">Ошибки</SelectItem>
                    <SelectItem value="warning">Предупреждения</SelectItem>
                    <SelectItem value="info">Информация</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Card className="divide-y divide-border">
              {filteredLogs.map((log, idx) => (
                <div key={idx} className="p-4 hover:bg-card/80 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="text-xs text-muted-foreground font-mono w-20">{log.time}</div>
                    <div className="flex-1 flex items-start gap-3">
                      <Icon 
                        name={
                          log.type === 'success' ? 'CheckCircle' :
                          log.type === 'error' ? 'XCircle' :
                          log.type === 'warning' ? 'AlertTriangle' :
                          'Info'
                        }
                        size={18}
                        className={
                          log.type === 'success' ? 'text-green-500' :
                          log.type === 'error' ? 'text-destructive' :
                          log.type === 'warning' ? 'text-yellow-500' :
                          'text-primary'
                        }
                      />
                      <span className="text-sm">{log.message}</span>
                    </div>
                  </div>
                </div>
              ))}
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}