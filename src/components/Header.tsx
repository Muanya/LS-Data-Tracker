import React from 'react';
import { useNavigate } from 'react-router-dom';
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
    const navigate = useNavigate();

    const goToDashboard = () => {
        navigate('/dashboard');
    };

    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
            <div className="px-4 sm:px-5 md:px-6 py-3 sm:py-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                    {/* Logo and Title */}
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0 cursor-pointer" onClick={goToDashboard}>
                        <img
                            src="https://lakesidecentre.org/assets/images/logo.svg?v=b3553521f6"
                            alt="Lakeside Study Centre Logo"
                            className="logo-image h-10 w-10"
                        />
                        <div className="min-w-0">
                            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 truncate">{title}</h1>
                            {subtitle && (
                                <p className="text-xs sm:text-sm text-gray-600 mt-0.5 truncate">{subtitle}</p>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 sm:gap-3 ml-auto sm:ml-0 flex-wrap justify-end">
                        {children}
                        <Button variant='danger' icon={LogOut} onClick={UtilService.handleLogout} />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;