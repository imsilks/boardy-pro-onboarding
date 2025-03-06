import React, { useState } from "react";
import { toast } from "sonner";
import { Edit, Check, Type, Palette, Bold, Italic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface HeaderSectionProps {
  subtitleStyle: {
    color: string;
    size: string;
    weight: string;
    italic: boolean;
  };
  subtitle: string;
  onSubtitleChange: (text: string) => void;
  onStyleChange: (property: string, value: string | boolean) => void;
  fadeInTitle: React.CSSProperties;
  fadeInSubtitle: React.CSSProperties;
}

const HeaderSection = ({
  subtitleStyle,
  subtitle,
  onSubtitleChange,
  onStyleChange,
  fadeInTitle,
  fadeInSubtitle
}: HeaderSectionProps) => {
  const [isEditingSubtitle, setIsEditingSubtitle] = useState(false);

  const handleEditSubtitle = () => {
    setIsEditingSubtitle(true);
  };

  const handleSaveSubtitle = () => {
    setIsEditingSubtitle(false);
    toast.success("Subtitle updated");
  };

  const handleSubtitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSubtitleChange(e.target.value);
  };

  const toggleWeight = () => {
    onStyleChange('weight', subtitleStyle.weight === "font-normal" ? "font-bold" : "font-normal");
  };
  
  const toggleItalic = () => {
    onStyleChange('italic', !subtitleStyle.italic);
  };

  const colorOptions = [
    { name: "Gray", class: "text-gray-600" },
    { name: "Blue", class: "text-blue-600" },
    { name: "Green", class: "text-green-600" },
    { name: "Purple", class: "text-purple-600" },
    { name: "Red", class: "text-red-600" }
  ];
  
  const sizeOptions = [
    { name: "Small", class: "text-base" },
    { name: "Medium", class: "text-lg" },
    { name: "Large", class: "text-xl" }
  ];

  return (
    <div className="text-center mb-12" style={fadeInTitle}>
      <div className="inline-flex items-center justify-center p-2 mb-4">
        <img 
          src="/lovable-uploads/2c9ac40a-e01b-418a-91b7-724008309d66.png" 
          alt="Boardy Pro Logo" 
          className="h-16 w-16 object-contain"
        />
      </div>
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-3">Welcome to Boardy Pro</h1>
      
      <div className="flex flex-col items-center justify-center" style={fadeInSubtitle}>
        {isEditingSubtitle ? (
          <div className="flex flex-col space-y-3 w-full max-w-sm">
            <div className="flex items-center space-x-2">
              <Input 
                value={subtitle} 
                onChange={handleSubtitleChange} 
                className={`text-center py-1 ${subtitleStyle.size} ${subtitleStyle.color} ${subtitleStyle.weight} ${subtitleStyle.italic ? 'italic' : ''}`}
                autoFocus
              />
              <Button 
                size="icon" 
                variant="ghost" 
                onClick={handleSaveSubtitle} 
                className="h-8 w-8 text-green-600"
              >
                <Check size={16} />
              </Button>
            </div>
            
            <div className="flex flex-col space-y-2 bg-white/80 backdrop-blur-sm p-3 rounded-lg border border-gray-200 shadow-sm animate-fade-in">
              <div className="flex items-center space-x-2">
                <Palette size={14} className="text-gray-500" />
                <span className="text-xs text-gray-500">Color:</span>
                <div className="flex space-x-1">
                  {colorOptions.map(color => (
                    <button
                      key={color.name}
                      onClick={() => onStyleChange('color', color.class)}
                      className={`w-5 h-5 rounded-full ${color.class.replace('text-', 'bg-')} 
                        ${subtitleStyle.color === color.class ? 'ring-2 ring-offset-1 ring-blue-400' : 'opacity-70 hover:opacity-100'}`}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Type size={14} className="text-gray-500" />
                <span className="text-xs text-gray-500">Size:</span>
                <div className="flex space-x-1">
                  {sizeOptions.map(size => (
                    <Button
                      key={size.name}
                      onClick={() => onStyleChange('size', size.class)}
                      variant="ghost"
                      size="sm"
                      className={`h-6 px-2 py-0 text-xs ${subtitleStyle.size === size.class ? 'bg-blue-100 text-blue-700' : ''}`}
                    >
                      {size.name}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500">Style:</span>
                <div className="flex space-x-1">
                  <Button
                    onClick={toggleWeight}
                    variant="ghost"
                    size="sm"
                    className={`h-6 w-6 p-0 ${subtitleStyle.weight === 'font-bold' ? 'bg-blue-100 text-blue-700' : ''}`}
                  >
                    <Bold size={14} />
                  </Button>
                  <Button
                    onClick={toggleItalic}
                    variant="ghost"
                    size="sm"
                    className={`h-6 w-6 p-0 ${subtitleStyle.italic ? 'bg-blue-100 text-blue-700' : ''}`}
                  >
                    <Italic size={14} />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center group relative">
            <p className={`${subtitleStyle.color} ${subtitleStyle.size} ${subtitleStyle.weight} ${subtitleStyle.italic ? 'italic' : ''}`}>
              {subtitle}
            </p>
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={handleEditSubtitle} 
              className="h-6 w-6 ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Edit size={12} />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeaderSection;
