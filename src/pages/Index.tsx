import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import Icon from "@/components/ui/icon";
import { useToast } from "@/hooks/use-toast";

interface User {
  username: string;
  nickname: string;
  avatar: string;
}

interface Post {
  id: string;
  author: User;
  title: string;
  content: string;
  category: string;
  replies: number;
  views: number;
  timestamp: Date;
  isPinned?: boolean;
}

const CATEGORIES = [
  { id: "discussions", name: "Обсуждения", icon: "MessageSquare" },
  { id: "announcements", name: "Объявления", icon: "Megaphone" },
  { id: "news", name: "Новости", icon: "Newspaper" },
  { id: "faq", name: "FAQ", icon: "HelpCircle" },
  { id: "support", name: "Помощь", icon: "LifeBuoy" }
];

export default function Index() {
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("currentUser");
    return saved ? JSON.parse(saved) : null;
  });
  
  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem("forumPosts");
    if (saved) {
      return JSON.parse(saved).map((p: Post) => ({
        ...p,
        timestamp: new Date(p.timestamp)
      }));
    }
    return [
      {
        id: "1",
        author: { username: "admin", nickname: "Администратор", avatar: "A" },
        title: "Добро пожаловать на форум!",
        content: "Здесь вы можете обсуждать все, что связано с сервером.",
        category: "announcements",
        replies: 5,
        views: 120,
        timestamp: new Date(),
        isPinned: true
      }
    ];
  });

  const [selectedCategory, setSelectedCategory] = useState("discussions");
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [authForm, setAuthForm] = useState({ username: "", password: "", nickname: "" });
  const [newPost, setNewPost] = useState({ title: "", content: "", category: "discussions" });
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isNewPostOpen, setIsNewPostOpen] = useState(false);

  const saveToLocalStorage = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const handleAuth = () => {
    if (!authForm.username || !authForm.password) {
      toast({ title: "Ошибка", description: "Заполните все поля", variant: "destructive" });
      return;
    }

    if (authMode === "register" && !authForm.nickname) {
      toast({ title: "Ошибка", description: "Укажите никнейм", variant: "destructive" });
      return;
    }

    const user: User = {
      username: authForm.username,
      nickname: authMode === "register" ? authForm.nickname : authForm.username,
      avatar: authForm.username[0].toUpperCase()
    };

    setCurrentUser(user);
    saveToLocalStorage("currentUser", user);
    setIsAuthOpen(false);
    toast({
      title: authMode === "register" ? "Регистрация успешна!" : "Вход выполнен!",
      description: `Добро пожаловать, ${user.nickname}!`
    });
    setAuthForm({ username: "", password: "", nickname: "" });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
    toast({ title: "Выход выполнен", description: "До скорой встречи!" });
  };

  const handleCreatePost = () => {
    if (!currentUser) {
      toast({ title: "Ошибка", description: "Войдите в систему для создания постов", variant: "destructive" });
      return;
    }

    if (!newPost.title || !newPost.content) {
      toast({ title: "Ошибка", description: "Заполните заголовок и содержание", variant: "destructive" });
      return;
    }

    const post: Post = {
      id: Date.now().toString(),
      author: currentUser,
      title: newPost.title,
      content: newPost.content,
      category: newPost.category,
      replies: 0,
      views: 0,
      timestamp: new Date()
    };

    const updatedPosts = [post, ...posts];
    setPosts(updatedPosts);
    saveToLocalStorage("forumPosts", updatedPosts);
    setIsNewPostOpen(false);
    toast({ title: "Пост создан!", description: "Ваш пост опубликован на форуме" });
    setNewPost({ title: "", content: "", category: "discussions" });
  };

  const filteredPosts = posts.filter(p => p.category === selectedCategory);

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

            <div className="flex items-center gap-3">
              {currentUser ? (
                <>
                  <Dialog open={isNewPostOpen} onOpenChange={setIsNewPostOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity">
                        <Icon name="Plus" size={18} className="mr-2" />
                        Создать тему
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                      <DialogHeader>
                        <DialogTitle>Новая тема</DialogTitle>
                        <DialogDescription>Создайте новую тему для обсуждения</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="category">Раздел</Label>
                          <select
                            id="category"
                            value={newPost.category}
                            onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                            className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground"
                          >
                            {CATEGORIES.map(cat => (
                              <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="title">Заголовок</Label>
                          <Input
                            id="title"
                            placeholder="Введите заголовок темы"
                            value={newPost.title}
                            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="content">Содержание</Label>
                          <Textarea
                            id="content"
                            placeholder="Опишите вашу тему подробнее"
                            rows={6}
                            value={newPost.content}
                            onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                          />
                        </div>
                      </div>
                      <Button onClick={handleCreatePost} className="w-full bg-gradient-to-r from-primary to-secondary">
                        Опубликовать
                      </Button>
                    </DialogContent>
                  </Dialog>

                  <div className="flex items-center gap-2">
                    <Avatar className="border-2 border-primary">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {currentUser.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium hidden sm:inline">{currentUser.nickname}</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleLogout}>
                    <Icon name="LogOut" size={18} />
                  </Button>
                </>
              ) : (
                <Dialog open={isAuthOpen} onOpenChange={setIsAuthOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity">
                      <Icon name="LogIn" size={18} className="mr-2" />
                      Вход
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{authMode === "login" ? "Вход" : "Регистрация"}</DialogTitle>
                      <DialogDescription>
                        {authMode === "login" 
                          ? "Войдите в свой аккаунт" 
                          : "Создайте новый аккаунт для участия в форуме"}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="username">Логин</Label>
                        <Input
                          id="username"
                          placeholder="Введите логин"
                          value={authForm.username}
                          onChange={(e) => setAuthForm({ ...authForm, username: e.target.value })}
                        />
                      </div>
                      {authMode === "register" && (
                        <div className="space-y-2">
                          <Label htmlFor="nickname">Никнейм</Label>
                          <Input
                            id="nickname"
                            placeholder="Как вас называть на форуме"
                            value={authForm.nickname}
                            onChange={(e) => setAuthForm({ ...authForm, nickname: e.target.value })}
                          />
                        </div>
                      )}
                      <div className="space-y-2">
                        <Label htmlFor="password">Пароль</Label>
                        <Input
                          id="password"
                          type="password"
                          placeholder="Введите пароль"
                          value={authForm.password}
                          onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                        />
                      </div>
                    </div>
                    <Button onClick={handleAuth} className="w-full bg-gradient-to-r from-primary to-secondary">
                      {authMode === "login" ? "Войти" : "Зарегистрироваться"}
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => setAuthMode(authMode === "login" ? "register" : "login")}
                      className="w-full"
                    >
                      {authMode === "login" ? "Нет аккаунта? Регистрация" : "Уже есть аккаунт? Войти"}
                    </Button>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <section className="mb-12 animate-fade-in">
          <Card className="border-primary/20 bg-gradient-to-br from-card to-card/50 backdrop-blur overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 opacity-50" />
            <CardHeader className="relative">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-3xl mb-2">Добро пожаловать на ServerHub!</CardTitle>
                  <CardDescription className="text-base">
                    Официальный форум и информационный портал игрового сервера
                  </CardDescription>
                </div>
                <Badge className="bg-accent text-accent-foreground">
                  <Icon name="Users" size={14} className="mr-1" />
                  Онлайн: 247
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon name="MessageSquare" size={20} className="text-primary" />
                    <span className="text-2xl font-bold">{posts.length}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Тем на форуме</p>
                </div>
                <div className="p-4 rounded-lg bg-secondary/10 border border-secondary/20">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon name="Users" size={20} className="text-secondary" />
                    <span className="text-2xl font-bold">1,234</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Участников</p>
                </div>
                <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon name="TrendingUp" size={20} className="text-accent" />
                    <span className="text-2xl font-bold">15,678</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Сообщений</p>
                </div>
                <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon name="Activity" size={20} className="text-green-500" />
                    <span className="text-2xl font-bold">Online</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Статус сервера</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">Форум сообщества</h2>
            <p className="text-muted-foreground">Общайтесь, задавайте вопросы и делитесь опытом</p>
          </div>

          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="space-y-6">
            <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2 bg-transparent h-auto p-0">
              {CATEGORIES.map(cat => (
                <TabsTrigger
                  key={cat.id}
                  value={cat.id}
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white border border-border/50 hover:border-primary/50 transition-all"
                >
                  <Icon name={cat.icon as any} size={16} className="mr-2" />
                  <span className="hidden sm:inline">{cat.name}</span>
                  <span className="sm:hidden">{cat.name.slice(0, 3)}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {CATEGORIES.map(cat => (
              <TabsContent key={cat.id} value={cat.id} className="space-y-4">
                {filteredPosts.length === 0 ? (
                  <Card className="border-dashed">
                    <CardContent className="py-12 text-center">
                      <Icon name="MessageSquareOff" size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
                      <p className="text-muted-foreground">Пока нет тем в этом разделе</p>
                      <p className="text-sm text-muted-foreground mt-2">Будьте первым, кто создаст тему!</p>
                    </CardContent>
                  </Card>
                ) : (
                  filteredPosts.map(post => (
                    <Card
                      key={post.id}
                      className="hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 cursor-pointer group"
                    >
                      <CardContent className="p-6">
                        <div className="flex gap-4">
                          <Avatar className="border-2 border-border group-hover:border-primary transition-colors">
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {post.author.avatar}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4 mb-2">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                  {post.isPinned && (
                                    <Badge variant="outline" className="border-accent text-accent">
                                      <Icon name="Pin" size={12} className="mr-1" />
                                      Закреплено
                                    </Badge>
                                  )}
                                  <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                                    {post.title}
                                  </h3>
                                </div>
                                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                  {post.content}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="font-medium text-foreground">{post.author.nickname}</span>
                              <span className="flex items-center gap-1">
                                <Icon name="MessageCircle" size={14} />
                                {post.replies}
                              </span>
                              <span className="flex items-center gap-1">
                                <Icon name="Eye" size={14} />
                                {post.views}
                              </span>
                              <span className="flex items-center gap-1">
                                <Icon name="Clock" size={14} />
                                {new Date(post.timestamp).toLocaleDateString('ru-RU')}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>
            ))}
          </Tabs>
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
