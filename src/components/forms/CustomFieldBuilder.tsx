"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Plus, GripVertical } from "lucide-react";
import { CustomField } from "@/types";

interface CustomFieldBuilderProps {
  fields: CustomField[];
  onChange: (fields: CustomField[]) => void;
}

export function CustomFieldBuilder({ fields, onChange }: CustomFieldBuilderProps) {
  const addField = () => {
    const newField: CustomField = {
      id: `field-${Date.now()}`,
      label: "",
      type: "text",
      required: false
    };
    onChange([...fields, newField]);
  };

  const updateField = (index: number, updates: Partial<CustomField>) => {
    const newFields = [...fields];
    newFields[index] = { ...newFields[index], ...updates };
    onChange(newFields);
  };

  const removeField = (index: number) => {
    const newFields = [...fields];
    newFields.splice(index, 1);
    onChange(newFields);
  };

  return (
    <div className="space-y-4">
      {fields.length === 0 ? (
        <div className="text-center py-6 border-2 border-dashed rounded-lg bg-muted/20">
          <p className="text-sm text-muted-foreground mb-4">No custom fields added yet.</p>
          <Button type="button" variant="outline" onClick={addField}>
            <Plus className="w-4 h-4 mr-2" /> Add Custom Field
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="relative flex gap-4 p-4 border rounded-xl bg-card shadow-sm group">
              <div className="mt-2 text-muted-foreground/40 cursor-grab">
                <GripVertical className="w-5 h-5" />
              </div>
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div className="md:col-span-7 space-y-2">
                    <Label>Question / Label</Label>
                    <Input 
                      placeholder="E.g. What is your organization?" 
                      value={field.label}
                      onChange={(e) => updateField(index, { label: e.target.value })}
                      required
                    />
                  </div>
                  <div className="md:col-span-5 space-y-2">
                    <Label>Answer Type</Label>
                    <Select 
                      value={field.type} 
                      onValueChange={(val: "text" | "number" | "select" | null) => {
                        if (!val) return;
                        updateField(index, { type: val, options: val === 'select' ? [] : undefined });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Short Answer (Text)</SelectItem>
                        <SelectItem value="number">Number</SelectItem>
                        <SelectItem value="select">Dropdown (Select)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {field.type === 'select' && (
                  <div className="space-y-2">
                    <Label>Dropdown Options (comma separated)</Label>
                    <Input 
                      placeholder="E.g. Option 1, Option 2, Option 3" 
                      value={field.options?.join(", ") || ""}
                      onChange={(e) => updateField(index, { options: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })}
                    />
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-dashed">
                  <div className="flex items-center gap-2">
                     <input 
                        type="checkbox"
                        id={`req-${field.id}`} 
                        checked={field.required}
                        onChange={(e) => updateField(index, { required: e.target.checked })}
                        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                     />
                     <Label htmlFor={`req-${field.id}`} className="cursor-pointer text-sm font-normal">Required</Label>
                  </div>
                </div>
              </div>
              <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                className="absolute top-2 right-2 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeField(index)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={addField} className="w-full border-dashed">
            <Plus className="w-4 h-4 mr-2" /> Add Another Field
          </Button>
        </div>
      )}
    </div>
  );
}
