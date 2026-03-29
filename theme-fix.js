const fs = require('fs');
const path = require('path');

const replacements = {
  // Global text inversions
  'text-white': 'text-slate-900',
  'text-slate-200': 'text-slate-800',
  'text-slate-300': 'text-slate-700',
  'text-slate-400': 'text-slate-500',
  'text-slate-500': 'text-slate-500', 
  'text-slate-600': 'text-slate-400',
  
  // Specific accent text inversions
  'text-violet-300': 'text-violet-700',
  'text-violet-400': 'text-violet-600',
  'text-violet-500': 'text-violet-700',
  'text-cyan-300': 'text-cyan-700',
  'text-cyan-400': 'text-cyan-600',
  'text-emerald-400': 'text-emerald-600',
  'text-amber-400': 'text-amber-600',
  'text-red-400': 'text-red-600',

  // Background and border inversions
  'bg-white/3': 'bg-slate-50',
  'bg-white/4': 'bg-white',
  'bg-white/5': 'bg-slate-50',
  'bg-white/8': 'bg-slate-200',
  'bg-white/10': 'bg-slate-100',
  'hover:bg-white/5': 'hover:bg-slate-100',
  'hover:bg-white/10': 'hover:bg-slate-200',
  'bg-[#18181f]': 'bg-white',
  
  'border-white/5': 'border-slate-200',
  'border-white/8': 'border-slate-300',
  'border-white/10': 'border-slate-300',

  // Badge backgrounds
  'bg-violet-500/10': 'bg-violet-100',
  'bg-violet-500/15': 'bg-violet-100',
  'bg-violet-500/20': 'bg-violet-200',
  'bg-violet-500/25': 'bg-violet-200',
  'bg-violet-500/40': 'bg-violet-300',
  'hover:bg-violet-500/20': 'hover:bg-violet-200',
  'hover:bg-violet-500/25': 'hover:bg-violet-200',
  'hover:bg-violet-500/30': 'hover:bg-violet-300',
  'hover:bg-violet-500/40': 'hover:bg-violet-300',

  'bg-cyan-500/10': 'bg-cyan-100',
  'bg-cyan-500/15': 'bg-cyan-100',
  'bg-cyan-500/20': 'bg-cyan-200',
  'hover:bg-cyan-500/20': 'hover:bg-cyan-200',
};

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let modified = content;
      for (const [key, value] of Object.entries(replacements)) {
        const regex = new RegExp(`\\b${key.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&')}\\b`, 'g');
        modified = modified.replace(regex, value);
      }
      if (content !== modified) {
        fs.writeFileSync(fullPath, modified, 'utf8');
        console.log(`Updated: ${fullPath}`);
      }
    }
  }
}

const targetDirs = [
  path.join(__dirname, 'src/components'),
  path.join(__dirname, 'src/app')
];

targetDirs.forEach((dir) => {
  if (fs.existsSync(dir)) processDirectory(dir);
});

console.log('Complete');
