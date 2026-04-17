'use client'

import { Grid3x3, LayoutGrid } from 'lucide-react'

interface LayoutToggleProps {
  layout: 'compact' | 'expanded'
  onLayoutChange: (layout: 'compact' | 'expanded') => void
}

export default function LayoutToggle({ layout, onLayoutChange }: LayoutToggleProps) {
  return (
    <div className="flex items-center gap-2 bg-slate-900/50 border border-amber-600/40 rounded-lg p-1">
      <button
        onClick={() => onLayoutChange('compact')}
        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-300 ${
          layout === 'compact'
            ? 'bg-amber-600 text-slate-900'
            : 'bg-transparent text-amber-400 hover:bg-amber-600/20'
        }`}
        title="Compact Layout"
      >
        <Grid3x3 className="w-4 h-4" />
        <span className="text-sm font-light">Compact</span>
      </button>
      <button
        onClick={() => onLayoutChange('expanded')}
        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-300 ${
          layout === 'expanded'
            ? 'bg-amber-600 text-slate-900'
            : 'bg-transparent text-amber-400 hover:bg-amber-600/20'
        }`}
        title="Expanded Layout"
      >
        <LayoutGrid className="w-4 h-4" />
        <span className="text-sm font-light">Expanded</span>
      </button>
    </div>
  )
}
