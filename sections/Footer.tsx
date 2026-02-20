"use client"
import { Cpu } from 'lucide-react';
import Link from 'next/link';

const footerLinks = {
  models: ['OpenAI / GPT', 'Anthropic / Claude', 'Google / Gemini', 'xAI / Grok', 'DeepSeek', 'Moonshot / Kimi', 'Meta / Llama', 'Mistral AI'],
  agents: ['Multi-Agent Systems', 'Agent Swarm', 'Enterprise Agents', 'Autonomous Workflows', 'AI Assistants', 'Human-in-the-Loop'],
  industry: ['Healthcare', 'Finance', 'Legal', 'Education', 'Manufacturing', 'Marketing'],
  coding: ['GPT-5.3-Codex', 'Claude Code', 'Cursor', 'Windsurf', 'Agentic Coding', 'Tutorials'],
  regulation: ['EU AI Act', 'US Policy', 'China AI Policy', 'Compliance Guides'],
  science: ['Quantum Computing', 'Robotics', 'Edge AI', 'Research Papers'],
};

export default function Footer() {
  return (
    <footer className="bg-ai-space text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-8">
          {/* Logo & Description */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 ai-gradient-bg rounded-lg flex items-center justify-center">
                <Cpu className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-xl font-black uppercase font-heading">
                <span className="ai-gradient-text">AI</span> Fresh Daily
              </h2>
            </Link>
            <p className="text-sm text-gray-400 mb-4">
              Your trusted source for AI technology news, analysis, and education. Covering every model, every breakthrough, every day.
            </p>
          </div>

          {/* Models Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 ai-gradient-text font-heading">Models</h3>
            <ul className="space-y-2">
              {footerLinks.models.map((link) => (
                <li key={link}>
                  <Link href="/category/models" className="text-sm text-gray-400 hover:text-ai-cyan transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Agents Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 ai-gradient-text font-heading">Agents</h3>
            <ul className="space-y-2">
              {footerLinks.agents.map((link) => (
                <li key={link}>
                  <Link href="/category/agents" className="text-sm text-gray-400 hover:text-ai-cyan transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Industry Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 ai-gradient-text font-heading">Industry</h3>
            <ul className="space-y-2">
              {footerLinks.industry.map((link) => (
                <li key={link}>
                  <Link href="/category/industry" className="text-sm text-gray-400 hover:text-ai-cyan transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* AI Coding Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 ai-gradient-text font-heading">Coding</h3>
            <ul className="space-y-2">
              {footerLinks.coding.map((link) => (
                <li key={link}>
                  <Link href="/category/coding" className="text-sm text-gray-400 hover:text-ai-cyan transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* More Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 ai-gradient-text font-heading">More</h3>
            <ul className="space-y-2">
              {footerLinks.regulation.map((link) => (
                <li key={link}>
                  <Link href={`/category/${link.toLowerCase().replace(/\s+/g, '-')}`} className="text-sm text-gray-400 hover:text-ai-cyan transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
              {footerLinks.science.map((link) => (
                <li key={link}>
                  <Link href={`/category/${link.toLowerCase().replace(/\s+/g, '-')}`} className="text-sm text-gray-400 hover:text-ai-cyan transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-ai-space-medium">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-400">
              <Link href="/privacy" className="hover:text-ai-cyan transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-ai-cyan transition-colors">Terms of Service</Link>
              <Link href="/cookies" className="hover:text-ai-cyan transition-colors">Cookie Policy</Link>
              <Link href="/accessibility" className="hover:text-ai-cyan transition-colors">Accessibility</Link>
              <Link href="/sitemap" className="hover:text-ai-cyan transition-colors">Sitemap</Link>
            </div>
            <p className="text-sm text-gray-500 font-mono-ai">
              © {new Date().getFullYear()} AI Fresh Daily. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
