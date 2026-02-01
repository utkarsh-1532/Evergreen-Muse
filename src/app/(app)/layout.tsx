'use client';

import { useUser, useAuth } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { BookOpen, Home, LogOut, PenSquare, Target, UserCircle, Users } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { signOut } from 'firebase/auth';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUserProfile } from '@/hooks/use-user-profile';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const { profile, isLoading: isProfileLoading } = useUserProfile();
  const auth = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace('/login');
    }
    if (!isUserLoading && user && !isProfileLoading && !profile && pathname !== '/profile') {
        router.replace('/profile');
    }
  }, [user, isUserLoading, router, profile, isProfileLoading, pathname]);

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/login');
  };
  
  if (isUserLoading || !user || (pathname !== '/profile' && isProfileLoading)) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const getInitials = (name?: string | null) => {
    if (!name) return 'U';
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold font-headline">Evergreen</h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <Link href="/feed">
                <SidebarMenuButton isActive={pathname.startsWith('/feed')}>
                  <Home />
                  Dashboard
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <Link href="/social">
                <SidebarMenuButton isActive={pathname.startsWith('/social')}>
                  <Users />
                  Social
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/profile">
                <SidebarMenuButton isActive={pathname.startsWith('/profile')}>
                  <UserCircle />
                  Profile
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
               <Link href="#">
                <SidebarMenuButton>
                  <PenSquare />
                  Journal
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
               <Link href="#">
                <SidebarMenuButton>
                  <Target />
                  Habits
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
               <Link href="#">
                <SidebarMenuButton>
                  <BookOpen />
                  Learning
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              {user.photoURL && <AvatarImage src={user.photoURL} alt={user.email || 'User'} />}
              <AvatarFallback>{getInitials(profile?.username || user.email)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col text-sm">
                <span className="font-medium text-foreground">{profile?.username || user.email}</span>
            </div>
          </div>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={handleSignOut}>
                <LogOut />
                Sign Out
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-12 items-center justify-between border-b px-4 lg:justify-end">
            <SidebarTrigger className="lg:hidden" />
            <div className="flex items-center gap-2">
                {/* Dark mode toggle can go here */}
            </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
