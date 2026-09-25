import CodeBlock from "@/features/knowledge/components/Builder/blocks/CodeBlock";
import StepsBlock from "@/features/knowledge/components/Builder/blocks/StepsBlock";
import TextBlock from "@/features/knowledge/components/Builder/blocks/TextBlock";
import WarningBlock from "@/features/knowledge/components/Builder/blocks/WarningBlock";
export function renderBlockComponent(block, colKey, isEditing, onDelete, onUpdate) {
  if (!block || !block.type) return null;

  switch (block.type) {
    case 'steps':
      return (
        <StepsBlock 
          key={block.id} 
          block={block} 
          colKey={colKey} 
          isEditing={isEditing} 
          onDelete={onDelete} 
          onUpdate={onUpdate} 
        />
      );
    case 'warning':
      return (
        <WarningBlock 
          key={block.id} 
          block={block} 
          colKey={colKey} 
          isEditing={isEditing} 
          onDelete={onDelete} 
          onUpdate={onUpdate} 
        />
      );
    case 'code':
      return (
        <CodeBlock 
          key={block.id} 
          block={block} 
          colKey={colKey} 
          isEditing={isEditing} 
          onDelete={onDelete} 
          onUpdate={onUpdate} 
        />
      );
    case 'text':
      return (
        <TextBlock 
          key={block.id} 
          block={block} 
          colKey={colKey} 
          isEditing={isEditing} 
          onDelete={onDelete} 
          onUpdate={onUpdate} 
        />
      );
    default:
      return (
        <div key={block.id} className="bg-card border border-border rounded-lg p-4 text-xs text-destructive">
          Bloque no reconocido: {block.type}
        </div>
      );
  }
}