import React, { useMemo, useState, useEffect, useRef } from "react";
import { FormStep } from "../FormStep";
import { MultiSelect, FormInput } from "../FormInput";
import { StepProps } from "../../types/form";
import { Edit3, Trash2 } from "lucide-react";
import { FaPencilAlt } from "react-icons/fa";

// Enhanced EditModal with better design and functionality
const EditModal: React.FC<{
  title: string;
  items: string[];
  onClose: () => void;
  onSave: (newItems: string[]) => void;
  onLiveChange?: (newItems: string[]) => void;
  onOpenChild?: (selectedItem: string) => void;
  childLevelLabel?: string;
  initialSelected?: string | null;
  showBack?: boolean;
  onBack?: () => void;
  onDelete?: (index: number) => void;
  onEdit?: (index: number, newValue: string) => void;
  onCreate?: (name: string, parentIdFromModal?: string | null) => Promise<void> | void; // new: backend hook for add
  onDeleteBackend?: (name: string) => Promise<void> | void; // new: backend hook for delete
  onUpdateBackend?: (oldName: string, newName: string) => Promise<void> | void; // new: backend hook for update
  parentId?: string | null; // new: pass resolved parent id into modal
}> = ({
  title,
  items,
  onClose,
  onSave,
  onLiveChange,
  onOpenChild,
  childLevelLabel,
  initialSelected = null,
  showBack = false,
  onBack,
  onDelete,
  onEdit,
  onCreate,
  onDeleteBackend,
  onUpdateBackend,
  parentId,
}) => {
    const [localItems, setLocalItems] = useState<string[]>(items);
    const [inheritedParentId, setInheritedParentId] = useState<string | null | undefined>(parentId);
    const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
    const [editingIdx, setEditingIdx] = useState<number | null>(null);
    const [editValue, setEditValue] = useState<string>("");
    const activeEditRef = useRef<HTMLInputElement | null>(null);
    const listScrollRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      setLocalItems(items);
      if (initialSelected) {
        const idx = items.findIndex((x) => x === initialSelected);
        setSelectedIdx(idx >= 0 ? idx : null);
      } else {
        setSelectedIdx(null);
      }
    }, [items, initialSelected]);

    useEffect(() => {
      setInheritedParentId(parentId);
    }, [parentId]);

    const sanitize = (arr: string[]) =>
      Array.from(new Set(arr.map((s) => s.trim()).filter(Boolean)));

    // Add a new blank row inline and focus it (no prompt; backend called on Save)
    const addRow = async () => {
      setLocalItems((s) => {
        const newIndex = s.length;
        const next = [...s, ""];
        setSelectedIdx(newIndex);
        setEditingIdx(newIndex);
        setEditValue("");
        setTimeout(() => {
          if (activeEditRef.current) {
            activeEditRef.current.focus();
            if (typeof activeEditRef.current.scrollIntoView === "function") {
              activeEditRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
            }
          } else if (listScrollRef.current) {
            listScrollRef.current.scrollTop = listScrollRef.current.scrollHeight;
          }
        }, 0);
        return next;
      });
    };

    // Editing only allowed when pencil is clicked → handled by startEdit/saveEdit.

    const removeRow = async (idx: number) => {
      const nameToDelete = (localItems[idx] || "").trim();
      if (nameToDelete && onDeleteBackend) {
        try {
          await onDeleteBackend(nameToDelete);
        } catch (e) {
};

export default Step4BusinessCategories;
