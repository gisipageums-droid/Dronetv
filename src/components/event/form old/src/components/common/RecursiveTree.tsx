import { useState } from "react";

interface NodeProps {
  node: any;
  selected: string[];
  onToggle: (name: string) => void;
}

export const RecursiveTree = ({ node, selected, onToggle }: NodeProps) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="pl-4 border-l border-gray-200 my-1">
      <div className="flex items-center space-x-2">
        {node.subcategories && (
          <button type="button" onClick={() => setOpen(!open)}>
            {open ? '-' : '+'}
          </button>
        )}
        <input
          type="checkbox"
          checked={selected.includes(node.name)}
          onChange={() => onToggle(node.name)}
        />
        <span>{node.name}</span>
      </div>
      {open && node.subcategories?.map((child: any) => (
        <RecursiveTree key={child.id || child.name} node={child} selected={selected} onToggle={onToggle} />
      ))}
    </div>
  );
};
