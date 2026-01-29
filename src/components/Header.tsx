// components/Header.tsx
import React from 'react';
import { LogOut } from 'lucide-react';
import { UtilService } from '../services/utilService';
import { Button } from './ui/Button';

interface HeaderProps {
    title?: string;
    subtitle?: string;
    children?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({
    title = "",
    subtitle,
    children
}) => {
    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
            <div className="px-4 md:px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center gap-4">
                        <img
                            src="https://lakesidecentre.org/assets/images/logo.svg?v=b3553521f6"
                            alt="Lakeside Study Centre Logo"
                            className="logo-image"
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <div>
                            <h1 className="text-xl md:text-2xl font-bold text-gray-900">{title}</h1>
                            {subtitle && (
                                <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {children}

                        <div className="flex items-center gap-2">
                            <Button variant='danger' icon={LogOut} onClick={UtilService.handleLogout} />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;