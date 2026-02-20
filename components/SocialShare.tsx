"use client"
import { useState } from 'react';
import { 
  Share2, 
  Twitter, 
  Facebook, 
  Linkedin, 
  Link2, 
  Check,
  Mail
} from 'lucide-react';

interface SocialShareProps {
  url?: string;
  title?: string;
  className?: string;
}

export default function SocialShare({ 
  url = typeof window !== 'undefined' ? window.location.href : '', 
  title = 'Check out this article',
  className = '' 
}: SocialShareProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareLinks = [
    {
      name: 'Twitter',
      icon: Twitter,
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      color: 'hover:bg-sky-50 hover:text-sky-500',
    },
    {
      name: 'Facebook',
      icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      color: 'hover:bg-blue-50 hover:text-blue-600',
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      color: 'hover:bg-blue-50 hover:text-blue-700',
    },
    {
      name: 'Email',
      icon: Mail,
      href: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`,
      color: 'hover:bg-gray-50 hover:text-gray-700',
    },
  ];

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Share Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium text-gray-700 transition-colors"
      >
        <Share2 className="w-4 h-4" />
        Share
      </button>

      {/* Share Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu */}
          <div className="absolute top-full left-0 mt-2 z-50 w-56 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-2">
              {/* Copy Link */}
              <button
                onClick={copyToClipboard}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className={`p-2 rounded-lg ${copied ? 'bg-green-100' : 'bg-gray-100'}`}>
                  {copied ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Link2 className="w-4 h-4 text-gray-600" />
                  )}
                </div>
                <span className={`text-sm font-medium ${copied ? 'text-green-600' : 'text-gray-700'}`}>
                  {copied ? 'Copied!' : 'Copy link'}
                </span>
              </button>

              <div className="my-2 border-t border-gray-100" />

              {/* Social Links */}
              {shareLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${link.color}`}
                  onClick={() => setIsOpen(false)}
                >
                  <div className="p-2 rounded-lg bg-gray-100">
                    <link.icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium">{link.name}</span>
                </a>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
