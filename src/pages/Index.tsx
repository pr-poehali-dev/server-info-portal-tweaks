import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <header className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 animate-fade-in">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Icon name="Gamepad2" size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  ServerHub
                </h1>
                <p className="text-xs text-muted-foreground">Информационный портал</p>
              </div>
            </div>

            <nav className="flex items-center gap-4">
              <Link to="/forum">
                <Button variant="ghost" className="hover:text-primary">
                  <Icon name="MessageSquare" size={18} className="mr-2" />
                  Форум
                </Button>
              </Link>
              <Link to="/forum">
                <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity">
                  Присоединиться
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <section className="text-center mb-20 animate-fade-in">
          <div className="max-w-3xl mx-auto">
            <Badge className="mb-4 bg-accent text-accent-foreground">
              <Icon name="Zap" size={14} className="mr-1" />
              Версия 2.0
            </Badge>
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">добро пожаловать в поддержку Russian Town</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Официальный портал игрового сервера. Присоединяйся к сообществу, участвуй в обсуждениях и следи за новостями!
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/forum">
                <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity">
                  <Icon name="MessageSquare" size={20} className="mr-2" />
                  Перейти на форум
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-primary/50 hover:border-primary">
                <Icon name="Info" size={20} className="mr-2" />
                О сервере
              </Button>
            </div>
          </div>
        </section>

        <section className="mb-20 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-primary/20 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center mb-4">
                  <Icon name="Users" size={24} className="text-white" />
                </div>
                <CardTitle className="text-2xl">1,234</CardTitle>
                <CardDescription>Активных игроков</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-secondary/20 hover:border-secondary/50 transition-all hover:shadow-lg hover:shadow-secondary/10">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-secondary to-secondary/50 flex items-center justify-center mb-4">
                  <Icon name="MessageSquare" size={24} className="text-white" />
                </div>
                <CardTitle className="text-2xl">15,678</CardTitle>
                <CardDescription>Сообщений на форуме</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-accent/20 hover:border-accent/50 transition-all hover:shadow-lg hover:shadow-accent/10">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-accent to-accent/50 flex items-center justify-center mb-4">
                  <Icon name="Trophy" size={24} className="text-white" />
                </div>
                <CardTitle className="text-2xl">50+</CardTitle>
                <CardDescription>Ивентов проведено</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-green-500/20 hover:border-green-500/50 transition-all hover:shadow-lg hover:shadow-green-500/10">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-green-500/50 flex items-center justify-center mb-4">
                  <Icon name="Activity" size={24} className="text-white" />
                </div>
                <CardTitle className="text-2xl">Online</CardTitle>
                <CardDescription>Статус сервера</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        <section className="mb-20 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">Возможности сервера</h3>
            <p className="text-muted-foreground">Что мы предлагаем нашим игрокам</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-primary/20 bg-card/50 backdrop-blur">
              <CardHeader>
                <Icon name="Shield" size={32} className="text-primary mb-4" />
                <CardTitle>Защита от читеров</CardTitle>
                <CardDescription>
                  Мощная античит система и активная модерация обеспечивают честную игру для всех
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-secondary/20 bg-card/50 backdrop-blur">
              <CardHeader>
                <Icon name="Rocket" size={32} className="text-secondary mb-4" />
                <CardTitle>Высокая производительность</CardTitle>
                <CardDescription>
                  Мощное оборудование и оптимизация гарантируют стабильный FPS и низкий пинг
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-accent/20 bg-card/50 backdrop-blur">
              <CardHeader>
                <Icon name="Heart" size={32} className="text-accent mb-4" />
                <CardTitle>Дружное сообщество</CardTitle>
                <CardDescription>
                  Тысячи активных игроков, регулярные ивенты и поддержка 24/7
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        <section className="text-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <Card className="border-primary/20 bg-gradient-to-br from-card to-card/50 backdrop-blur overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 opacity-50" />
            <CardContent className="relative py-16">
              <h3 className="text-3xl font-bold mb-4">Готов начать играть?</h3>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                Присоединяйся к нашему серверу прямо сейчас! Зарегистрируйся на форуме и получи бонусы для новичков
              </p>
              <div className="flex gap-4 justify-center">
                <Link to="/forum">
                  <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity">
                    <Icon name="Gamepad2" size={20} className="mr-2" />
                    Начать играть
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="border-primary/50 hover:border-primary">
                  <Icon name="Download" size={20} className="mr-2" />
                  Скачать клиент
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      <footer className="border-t border-border/50 mt-16 py-8 bg-card/30 backdrop-blur">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2024 ServerHub. Все права защищены.</p>
          <p className="mt-2">Создано с помощью poehali.dev 🚀</p>
        </div>
      </footer>
    </div>
  );
}