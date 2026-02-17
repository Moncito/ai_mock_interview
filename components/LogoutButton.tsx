'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { signOut } from '@/lib/actions/auth.action';
import { toast } from 'sonner';

interface LogoutButtonProps {
    variant?: 'default' | 'outline' | 'ghost' | 'secondary' | 'destructive' | 'link';
    size?: 'default' | 'sm' | 'lg' | 'icon';
    showIcon?: boolean;
    showText?: boolean;
    className?: string;
}

export function LogoutButton({
    variant = 'outline',
    size = 'default',
    showIcon = true,
    showText = true,
    className
}: LogoutButtonProps) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleLogout = async () => {
        try {
            setIsLoading(true);
            const result = await signOut();

            if (result.success) {
                toast.success('Logged out successfully');
                router.push('/sign-in');
                router.refresh();
            } else {
                toast.error(result.message || 'Failed to logout');
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Logout error:', error);
            toast.error('An unexpected error occurred');
            setIsLoading(false);
        }
    };

    return (
        <Button
            variant={variant}
            size={size}
            onClick={handleLogout}
            disabled={isLoading}
            className={className}
            aria-label="Logout"
            aria-busy={isLoading}
        >
            {showIcon && <LogOut className="h-4 w-4" />}
            {showText && <span>{isLoading ? 'Logging out...' : 'Logout'}</span>}
        </Button>
    );
}
