export interface Field {
  id: string;
  label: string;
  type: string;
  required?: boolean;
}

export interface Category {
  id: string;
  name: string;
  type: string;
  subcategories?: Category[];
}

export interface SkillNode {
  id?: string;
  name: string;
  subcategories?: SkillNode[];
}

export interface Step {
  id: string;
  title: string;
  basicInfo?: { fields: Field[] };
  categories?: { available: Category[] };
  skills?: { tree: SkillNode[]; freeformSkills?: { enabled: boolean; placeholder: string } };
  projects?: { fields: Field[]; allowMultiple: boolean };
  services?: { fields: Field[]; allowMultiple: boolean };
  media?: { fields: Field[]; maxSizeMB: number };
  note?: string;
}
