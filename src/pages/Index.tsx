import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockCampaigns = [
  { id: 1, name: 'Акция весна 2026', status: 'active', sent: 1245, limit: 5000, communities: 12 },
  { id: 2, name: 'Летняя распродажа', status: 'paused', sent: 890, limit: 3000, communities: 8 },
  { id: 3, name: 'Новинки каталога', status: 'completed', sent: 5000, limit: 5000, communities: 15 },
];

const mockBots = [
  { id: 1, name: 'Bot Alpha', avatar: '🤖', status: 'online', messagesSent: 450 },
  { id: 2, name: 'Bot Beta', avatar: '🦾', status: 'online', messagesSent: 320 },
  { id: 3, name: 'Bot Gamma', avatar: '🎯', status: 'offline', messagesSent: 180 },
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
              {mockCampaigns.map((campaign) => (
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
                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Icon name="Users" size={16} />
                          {campaign.sent} / {campaign.limit} получателей
                        </span>
                        <span className="flex items-center gap-1">
                          <Icon name="Hash" size={16} />
                          {campaign.communities} сообществ
                        </span>
                      </div>
                      <div className="mt-3 bg-muted rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-primary h-full transition-all"
                          style={{ width: `${(campaign.sent / campaign.limit) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button variant="outline" size="icon">
                        <Icon name="Settings" size={18} />
                      </Button>
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
              <h2 className="text-3xl font-bold">Управление ботами</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Icon name="Plus" size={18} />
                    Добавить бота
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Добавить бота</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Токен бота (можно несколько через запятую)</Label>
                      <Textarea placeholder="TOKEN1, TOKEN2, TOKEN3..." rows={3} />
                    </div>
                    <Button className="w-full">Добавить</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockBots.map((bot) => (
                <Card key={bot.id} className="p-6 hover:bg-card/80 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{bot.avatar}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{bot.name}</h3>
                        <div className={`w-2 h-2 rounded-full ${bot.status === 'online' ? 'bg-green-500' : 'bg-gray-500'}`} />
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Отправлено: {bot.messagesSent} сообщений
                      </p>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="w-full gap-2">
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
                              <Label>Описание</Label>
                              <Textarea placeholder="Описание бота..." rows={3} />
                            </div>
                            <Button className="w-full">Сохранить</Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
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
                <Button variant="outline" size="sm" className="gap-2">
                  <Icon name="Filter" size={16} />
                  Фильтр
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Icon name="Download" size={16} />
                  Экспорт
                </Button>
              </div>
            </div>

            <Card className="divide-y divide-border">
              {mockLogs.map((log, idx) => (
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
