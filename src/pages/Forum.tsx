import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import Icon from "@/components/ui/icon";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

type UserRole = "founder" | "admin" | "moderator" | "member" | "banned";

interface User {
  username: string;
  nickname: string;
  avatar: string;
  role: UserRole;
  isBanned?: boolean;
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

interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
}

const DEFAULT_CATEGORIES: Category[] = [
  { id: "discussions", name: "Обсуждения", icon: "MessageSquare", description: "Общие обсуждения сервера" },
  { id: "announcements", name: "Объявления", icon: "Megaphone", description: "Важные объявления администрации" },
  { id: "news", name: "Новости", icon: "Newspaper", description: "Новости и обновления" },
  { id: "faq", name: "FAQ", icon: "HelpCircle", description: "Часто задаваемые вопросы" },
  { id: "support", name: "Помощь", icon: "LifeBuoy", description: "Техническая поддержка" }
];

const ROLE_LABELS: Record<UserRole, { label: string; color: string }> = {
  founder: { label: "Основатель", color: "text-yellow-400" },
  admin: { label: "Администратор", color: "text-red-400" },
  moderator: { label: "Модератор", color: "text-blue-400" },
  member: { label: "Участник", color: "text-gray-400" },
  banned: { label: "Заблокирован", color: "text-red-600" }
};

export default function Forum() {
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("currentUser");
    return saved ? JSON.parse(saved) : null;
  });
  
  const [allUsers, setAllUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem("allUsers");
    return saved ? JSON.parse(saved) : [];
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem("forumCategories");
    return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
  });
  
  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem("forumPosts");
    if (saved) {
      return JSON.parse(saved).map((p: Post) => ({
        ...p,
        timestamp: new Date(p.timestamp)
      }));
    }
    return [];
  });

  const [selectedCategory, setSelectedCategory] = useState("discussions");
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [authForm, setAuthForm] = useState({ username: "", password: "", nickname: "" });
  const [newPost, setNewPost] = useState({ title: "", content: "", category: "discussions" });
  const [newCategory, setNewCategory] = useState({ name: "", icon: "Folder", description: "" });
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isNewPostOpen, setIsNewPostOpen] = useState(false);
  const [isNewCategoryOpen, setIsNewCategoryOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [selectedUserForEdit, setSelectedUserForEdit] = useState<User | null>(null);
  const [newRole, setNewRole] = useState<UserRole>("member");

  const saveToLocalStorage = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  useEffect(() => {
    saveToLocalStorage("allUsers", allUsers);
  }, [allUsers]);

  useEffect(() => {
    saveToLocalStorage("forumCategories", categories);
  }, [categories]);

  const isAdmin = currentUser?.role === "founder" || currentUser?.role === "admin";
  const canModerate = isAdmin || currentUser?.role === "moderator";

  const handleAuth = () => {
    if (!authForm.username || !authForm.password) {
      toast({ title: "Ошибка", description: "Заполните все поля", variant: "destructive" });
      return;
    }

    if (authMode === "register" && !authForm.nickname) {
      toast({ title: "Ошибка", description: "Укажите никнейм", variant: "destructive" });
      return;
    }

    if (authMode === "login") {
      const existingUser = allUsers.find(u => u.username === authForm.username);
      if (!existingUser) {
        toast({ title: "Ошибка", description: "Пользователь не найден", variant: "destructive" });
        return;
      }
      if (existingUser.isBanned) {
        toast({ title: "Доступ запрещен", description: "Ваш аккаунт заблокирован", variant: "destructive" });
        return;
      }
      setCurrentUser(existingUser);
      saveToLocalStorage("currentUser", existingUser);
      setIsAuthOpen(false);
      toast({ title: "Вход выполнен!", description: `Добро пожаловать, ${existingUser.nickname}!` });
    } else {
      const existingUser = allUsers.find(u => u.username === authForm.username);
      if (existingUser) {
        toast({ title: "Ошибка", description: "Такой пользователь уже существует", variant: "destructive" });
        return;
      }

      const user: User = {
        username: authForm.username,
        nickname: authForm.nickname,
        avatar: authForm.username[0].toUpperCase(),
        role: allUsers.length === 0 ? "founder" : "member"
      };

      const updatedUsers = [...allUsers, user];
      setAllUsers(updatedUsers);
      setCurrentUser(user);
      saveToLocalStorage("currentUser", user);
      setIsAuthOpen(false);
      toast({
        title: "Регистрация успешна!",
        description: `Добро пожаловать, ${user.nickname}!`
      });
    }
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

    if (currentUser.isBanned) {
      toast({ title: "Ошибка", description: "Вы не можете создавать посты", variant: "destructive" });
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

  const handleCreateCategory = () => {
    if (!isAdmin) {
      toast({ title: "Ошибка", description: "Недостаточно прав", variant: "destructive" });
      return;
    }

    if (!newCategory.name) {
      toast({ title: "Ошибка", description: "Укажите название сообщества", variant: "destructive" });
      return;
    }

    const category: Category = {
      id: newCategory.name.toLowerCase().replace(/\s+/g, '-'),
      name: newCategory.name,
      icon: newCategory.icon,
      description: newCategory.description
    };

    const updatedCategories = [...categories, category];
    setCategories(updatedCategories);
    setIsNewCategoryOpen(false);
    toast({ title: "Сообщество создано!", description: `${category.name} добавлено на форум` });
    setNewCategory({ name: "", icon: "Folder", description: "" });
  };

  const handleChangeUserRole = () => {
    if (!isAdmin || !selectedUserForEdit) return;

    const updatedUsers = allUsers.map(u =>
      u.username === selectedUserForEdit.username ? { ...u, role: newRole, isBanned: newRole === "banned" } : u
    );
    setAllUsers(updatedUsers);

    if (currentUser?.username === selectedUserForEdit.username) {
      const updatedCurrentUser = { ...currentUser, role: newRole, isBanned: newRole === "banned" };
      setCurrentUser(updatedCurrentUser);
      saveToLocalStorage("currentUser", updatedCurrentUser);
    }

    toast({
      title: "Роль изменена",
      description: `${selectedUserForEdit.nickname} теперь ${ROLE_LABELS[newRole].label}`
    });
    setSelectedUserForEdit(null);
  };

  const handleBanUser = (user: User) => {
    if (!canModerate) return;

    const updatedUsers = allUsers.map(u =>
      u.username === user.username ? { ...u, isBanned: !u.isBanned, role: u.isBanned ? "member" : "banned" } : u
    );
    setAllUsers(updatedUsers);

    toast({
      title: user.isBanned ? "Пользователь разблокирован" : "Пользователь заблокирован",
      description: `${user.nickname} ${user.isBanned ? "может снова участвовать в форуме" : "больше не может участвовать в форуме"}`
    });
  };

  const filteredPosts = posts.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <header className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <Icon name="Gamepad2" size={24} className="text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    ServerHub
                  </h1>
                  <p className="text-xs text-muted-foreground">Форум</p>
                </div>
              </Link>
            </div>

            <div className="flex items-center gap-3">
              {currentUser ? (
                <>
                  {!currentUser.isBanned && (
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
                            <Select value={newPost.category} onValueChange={(value) => setNewPost({ ...newPost, category: value })}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {categories.map(cat => (
                                  <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
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
                  )}

                  {isAdmin && (
                    <Sheet open={isAdminPanelOpen} onOpenChange={setIsAdminPanelOpen}>
                      <SheetTrigger asChild>
                        <Button variant="outline" className="border-accent">
                          <Icon name="Shield" size={18} className="mr-2" />
                          Админ-панель
                        </Button>
                      </SheetTrigger>
                      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
                        <SheetHeader>
                          <SheetTitle>Панель управления</SheetTitle>
                          <SheetDescription>Управление пользователями и сообществами</SheetDescription>
                        </SheetHeader>
                        
                        <div className="mt-6 space-y-6">
                          <div>
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="font-semibold">Сообщества</h3>
                              <Dialog open={isNewCategoryOpen} onOpenChange={setIsNewCategoryOpen}>
                                <DialogTrigger asChild>
                                  <Button size="sm" variant="outline">
                                    <Icon name="Plus" size={14} className="mr-1" />
                                    Создать
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Новое сообщество</DialogTitle>
                                    <DialogDescription>Создайте новый раздел форума</DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                      <Label>Название</Label>
                                      <Input
                                        placeholder="Например: Гайды"
                                        value={newCategory.name}
                                        onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label>Иконка</Label>
                                      <Input
                                        placeholder="Например: BookOpen"
                                        value={newCategory.icon}
                                        onChange={(e) => setNewCategory({ ...newCategory, icon: e.target.value })}
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label>Описание</Label>
                                      <Textarea
                                        placeholder="Краткое описание раздела"
                                        value={newCategory.description}
                                        onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                                      />
                                    </div>
                                  </div>
                                  <Button onClick={handleCreateCategory} className="w-full">Создать</Button>
                                </DialogContent>
                              </Dialog>
                            </div>
                            <div className="space-y-2">
                              {categories.map(cat => (
                                <div key={cat.id} className="p-3 border rounded-lg flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <Icon name={cat.icon as any} size={18} />
                                    <span className="font-medium">{cat.name}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h3 className="font-semibold mb-4">Пользователи ({allUsers.length})</h3>
                            <div className="space-y-2 max-h-96 overflow-y-auto">
                              {allUsers.map(user => (
                                <div key={user.username} className="p-3 border rounded-lg">
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                      <Avatar className="w-8 h-8">
                                        <AvatarFallback>{user.avatar}</AvatarFallback>
                                      </Avatar>
                                      <div>
                                        <div className="flex items-center gap-2">
                                          <span className="font-medium">{user.nickname}</span>
                                          {user.role === "founder" && <Icon name="Crown" size={14} className="text-yellow-400" />}
                                        </div>
                                        <span className={`text-xs ${ROLE_LABELS[user.role].color}`}>
                                          {ROLE_LABELS[user.role].label}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="flex gap-1">
                                      {user.username !== currentUser?.username && (
                                        <>
                                          <Dialog>
                                            <DialogTrigger asChild>
                                              <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => {
                                                  setSelectedUserForEdit(user);
                                                  setNewRole(user.role);
                                                }}
                                              >
                                                <Icon name="Edit" size={14} />
                                              </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                              <DialogHeader>
                                                <DialogTitle>Изменить роль</DialogTitle>
                                                <DialogDescription>
                                                  Изменение роли для {user.nickname}
                                                </DialogDescription>
                                              </DialogHeader>
                                              <div className="space-y-4 py-4">
                                                <Label>Роль</Label>
                                                <Select value={newRole} onValueChange={(value) => setNewRole(value as UserRole)}>
                                                  <SelectTrigger>
                                                    <SelectValue />
                                                  </SelectTrigger>
                                                  <SelectContent>
                                                    <SelectItem value="member">Участник</SelectItem>
                                                    <SelectItem value="moderator">Модератор</SelectItem>
                                                    <SelectItem value="admin">Администратор</SelectItem>
                                                  </SelectContent>
                                                </Select>
                                              </div>
                                              <DialogFooter>
                                                <Button onClick={handleChangeUserRole}>Сохранить</Button>
                                              </DialogFooter>
                                            </DialogContent>
                                          </Dialog>
                                          <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => handleBanUser(user)}
                                            className={user.isBanned ? "text-green-500" : "text-red-500"}
                                          >
                                            <Icon name={user.isBanned ? "UserCheck" : "Ban"} size={14} />
                                          </Button>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </SheetContent>
                    </Sheet>
                  )}

                  <div className="flex items-center gap-2">
                    <Avatar className="border-2 border-primary">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {currentUser.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden sm:block">
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-medium">{currentUser.nickname}</span>
                        {currentUser.role === "founder" && <Icon name="Crown" size={14} className="text-yellow-400" />}
                      </div>
                      <span className={`text-xs ${ROLE_LABELS[currentUser.role].color}`}>
                        {ROLE_LABELS[currentUser.role].label}
                      </span>
                    </div>
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
        <section className="animate-fade-in">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">Форум сообщества</h2>
            <p className="text-muted-foreground">Общайтесь, задавайте вопросы и делитесь опытом</p>
          </div>

          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="space-y-6">
            <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2 bg-transparent h-auto p-0 flex-wrap">
              {categories.map(cat => (
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

            {categories.map(cat => (
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
                              <div className="flex items-center gap-1">
                                <span className="font-medium text-foreground">{post.author.nickname}</span>
                                {post.author.role === "founder" && <Icon name="Crown" size={12} className="text-yellow-400" />}
                              </div>
                              <span className={`text-xs ${ROLE_LABELS[post.author.role].color}`}>
                                {ROLE_LABELS[post.author.role].label}
                              </span>
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
    </div>
  );
}
