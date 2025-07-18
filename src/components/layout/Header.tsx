'use client';

import { useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Button from '../ui/Button';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Templates', href: '#templates' },
    { name: 'Features', href: '#features' },
    { name: 'Pricing', href: '#pricing' },
  ];

  const handleSignIn = () => {
    signIn('github', { callbackUrl: '/dashboard' });
  };

  const handleLogoClick = () => {
    if (session) {
      router.push('/dashboard');
    } else {
      router.push('/');
    }
  };

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200/80 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 cursor-pointer" onClick={handleLogoClick}>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">M</span>
                </div>
                <h1 className="text-xl font-bold text-gray-900">
                  Modulux
                </h1>
              </div>
            </div>
          </div>

          {/* Desktop Navigation - Only show for unauthenticated users */}
          {!session && (
            <nav className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-1">
                {navItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </nav>
          )}

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {status === 'loading' ? (
              <div className="flex space-x-3">
                <div className="animate-pulse bg-gray-200 h-9 w-20 rounded-lg"></div>
                <div className="animate-pulse bg-gray-200 h-9 w-28 rounded-lg"></div>
              </div>
            ) : session ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-gray-50">
                  <img
                    src={session.user?.image || ''}
                    alt={session.user?.name || 'User'}
                    className="w-7 h-7 rounded-full ring-2 ring-white"
                  />
                  <span className="text-sm font-medium text-gray-700 hidden lg:block">
                    {session.user?.name?.split(' ')[0]}
                  </span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => signOut({ callbackUrl: '/' })}
                >
                  Sign Out
                </Button>
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={() => router.push('/dashboard')}
                >
                  Dashboard
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleSignIn}
                >
                  Sign In
                </Button>
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={handleSignIn}
                >
                  Get Started
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-600 p-2 rounded-md hover:bg-gray-100 transition-colors"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white">
              {!session && navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 block px-3 py-2 rounded-md text-base font-medium transition-colors"
                >
                  {item.name}
                </a>
              ))}
              <div className="pt-4 space-y-2">
                {session ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3 px-3 py-2">
                      <img
                        src={session.user?.image || ''}
                        alt={session.user?.name || 'User'}
                        className="w-8 h-8 rounded-full"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        {session.user?.name}
                      </span>
                    </div>
                    <Button 
                      variant="primary" 
                      size="md" 
                      className="w-full"
                      onClick={() => router.push('/dashboard')}
                    >
                      Dashboard
                    </Button>
                    <Button 
                      variant="outline" 
                      size="md" 
                      className="w-full"
                      onClick={() => signOut({ callbackUrl: '/' })}
                    >
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Button 
                      variant="ghost" 
                      size="md"
                      className="w-full"
                      onClick={handleSignIn}
                    >
                      Sign In
                    </Button>
                    <Button 
                      variant="primary" 
                      size="md"
                      className="w-full"
                      onClick={handleSignIn}
                    >
                      Get Started
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
