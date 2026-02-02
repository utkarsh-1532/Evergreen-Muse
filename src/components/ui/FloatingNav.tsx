'use client';

import {
  Home,
  Users,
  UserCircle,
  PenSquare,
  Target,
  BookOpen,
  LogOut,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { signOut } from 'firebase/auth';
import { useAuth } from '@/firebase';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import { ThemeToggle } from './theme-toggle';
import { useUserProfile } from '@/hooks/use-user-profile';
import { useUser } from '@/firebase';

const navItems = [
  { href: '/feed', icon: Home, label: 'Dashboard' },
  { href: '/social', icon: Users, label: 'Social' },
  { href: '/habits', icon: Target, label: 'Habits' },
  { href: '/learning', icon: BookOpen, label: 'Learning' },
  { href: '/journal', icon: PenSquare, label: 'Journal' },
  { href: '/profile', icon: UserCircle, label: 'Profile' },
];

const getInitials = (name?: string | null) => {
    if (!name) return 'U';
    return name.substring(0, 2).toUpperCase();
};

export function FloatingNav() {
  const pathname = usePathname();
  const auth = useAuth();
  const router = useRouter();
  const { user } = useUser();
  const { profile } = useUserProfile();

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/login');
  };

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 30, delay: 0.5 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
    >
      <div className="glass-panel flex items-center justify-around w-[90vw] max-w-md rounded-full p-2 shadow-2xl">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} passHref>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  'rounded-full h-12 w-12',
                  pathname.startsWith(item.href) && 'bg-primary/10 text-primary'
                )}
              >
                <item.icon className="h-6 w-6" />
                <span className="sr-only">{item.label}</span>
              </Button>
            </motion.div>
          </Link>
        ))}

        <div className="h-8 w-px bg-border" />
        
        <div className="flex items-center gap-1">
            <Avatar className="h-10 w-10 border-2 border-transparent hover:border-primary transition-colors">
              {user?.photoURL && <AvatarImage src={user.photoURL} alt={user.email || 'User'} />}
              <AvatarFallback>{getInitials(profile?.username || user?.email)}</AvatarFallback>
            </Avatar>
            <ThemeToggle />
             <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleSignOut}
                    className="rounded-full h-12 w-12"
                >
                    <LogOut className="h-6 w-6" />
                    <span className="sr-only">Sign Out</span>
                </Button>
            </motion.div>
        </div>

      </div>
    </motion.div>
  );
}
