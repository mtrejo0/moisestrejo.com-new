"use client";

import React, { useState, useRef, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";


const StrictModeDroppable = ({ children, ...props }) => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));
    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);

  if (!enabled) {
    return null;
  }

  return <Droppable {...props}>{children}</Droppable>;
};

const defaultTiers = [
  { id: "tier-s", name: "S", color: "bg-yellow-500", items: [] },
  { id: "tier-a", name: "A", color: "bg-green-500", items: [] },
  { id: "tier-b", name: "B", color: "bg-orange-500", items: [] },
  { id: "tier-c", name: "C", color: "bg-blue-500", items: [] },
];

const TierApp = () => {
  const [tiers, setTiers] = useState(defaultTiers);
  const [images, setImages] = useState([]);
  const [unassigned, setUnassigned] = useState([]);
  const fileInputRef = useRef();

  // Clean up any undefined items
  useEffect(() => {
    setTiers(prev => prev.map(tier => ({
      ...tier,
      items: tier.items.filter(item => item && item.id)
    })));
    setUnassigned(prev => prev.filter(item => item && item.id));
  }, []);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const readers = files.map(
      (file) =>
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (ev) => 
            resolve({ 
              id: `img-${Math.random().toString(36).substr(2, 9)}`,
              src: ev.target.result,
              name: file.name 
            });
          reader.readAsDataURL(file);
        })
    );

    Promise.all(readers).then((newImages) => {
      setImages((prev) => [...prev, ...newImages]);
      setUnassigned((prev) => [...prev, ...newImages]);
    });
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;

    // Handle dragging from unassigned pool
    if (source.droppableId === "unassigned") {
      const draggedItem = unassigned[source.index];
      if (!draggedItem) return;
      
      // Remove from unassigned
      setUnassigned(prev => 
        prev.filter((_, index) => index !== source.index)
      );

      // Add to destination tier
      setTiers(prev => 
        prev.map(tier => {
          if (tier.id === destination.droppableId) {
            const newItems = [...tier.items];
            newItems.splice(destination.index, 0, draggedItem);
            return { ...tier, items: newItems };
          }
          return tier;
        })
      );
    }
    // Handle dragging to unassigned pool
    else if (destination.droppableId === "unassigned") {
      const sourceTier = tiers.find(t => t.id === source.droppableId);
      if (!sourceTier) return;

      const draggedItem = sourceTier.items[source.index];
      if (!draggedItem) return;
      
      // Remove from source tier
      setTiers(prev => 
        prev.map(tier => {
          if (tier.id === source.droppableId) {
            return {
              ...tier,
              items: tier.items.filter((_, idx) => idx !== source.index)
            };
          }
          return tier;
        })
      );

      // Add to unassigned
      setUnassigned(prev => {
        const newUnassigned = [...prev];
        newUnassigned.splice(destination.index, 0, draggedItem);
        return newUnassigned;
      });
    }
    // Handle dragging between tiers
    else {
      setTiers(prev => {
        const newTiers = prev.map(tier => ({ ...tier, items: [...tier.items] }));
        const sourceTier = newTiers.find(t => t.id === source.droppableId);
        const destTier = newTiers.find(t => t.id === destination.droppableId);
        
        if (!sourceTier || !destTier) return prev;

        const draggedItem = sourceTier.items[source.index];
        if (!draggedItem) return prev;

        // Remove from source tier
        sourceTier.items = sourceTier.items.filter((_, idx) => idx !== source.index);
        
        // Add to destination tier
        destTier.items = [
          ...destTier.items.slice(0, destination.index),
          draggedItem,
          ...destTier.items.slice(destination.index)
        ];

        return newTiers;
      });
    }
  };

  const renameTier = (tierId, newName) => {
    setTiers(prev =>
      prev.map(tier =>
        tier.id === tierId ? { ...tier, name: newName } : tier
      )
    );
  };

  return (
    <div className="min-w-screen mx-auto p-16 bg-black text-white">
      <DragDropContext onDragEnd={onDragEnd}>
        {/* Two-column layout */}
        <div className="flex">
          {/* Labels Column */}
          <div className="flex flex-col space-y-4">
            {tiers.map((tier) => (
              <div 
                key={tier.id} 
                className={`h-[140px] w-[140px] ${tier.color} flex items-center justify-center rounded-l-lg`}
              >
                <input
                  type="text"
                  value={tier.name}
                  onChange={(e) => renameTier(tier.id, e.target.value)}
                  className="w-full text-center bg-transparent font-bold text-black focus:outline-none [font-size:clamp(1rem,5vw,3rem)]"
                  style={{
                    fontSize: `min(2rem, ${140/1.2 / Math.max(tier.name.length, 1)}px)`
                  }}
                />
              </div>
            ))}
          </div>

          {/* Droppable Areas Column */}
          <div className="flex-1 flex flex-col space-y-4">
            {tiers.map((tier) => (
              <StrictModeDroppable key={tier.id} droppableId={tier.id} direction="horizontal">
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`min-h-[140px] p-2 flex gap-2 flex-wrap rounded-r-lg ${
                      snapshot.isDraggingOver ? "bg-gray-800" : "bg-gray-900"
                    }`}
                  >
                    {tier.items.map((item, index) => (
                      <Draggable key={item.id} draggableId={item.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="relative group flex items-center"
                          >
                            <div className="w-28 h-28 rounded overflow-hidden border-2 border-gray-700 hover:border-gray-500 transition-colors">
                              <img
                                src={item.src}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </StrictModeDroppable>
            ))}
          </div>
        </div>

        {/* Unassigned Images Pool */}
        <StrictModeDroppable droppableId="unassigned" direction="horizontal">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`mt-8 p-4 rounded-lg min-h-32 ${
                snapshot.isDraggingOver ? "bg-gray-800" : "bg-gray-900"
              }`}
            >
              <div className="flex flex-wrap gap-2">
                {unassigned.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="w-28 h-28 rounded overflow-hidden border-2 border-gray-700 hover:border-gray-500 transition-colors"
                      >
                        <img
                          src={item.src}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            </div>
          )}
        </StrictModeDroppable>

        {/* Image Upload */}
        <div className="mt-6">
          <input
            ref={fileInputRef}
            type="file"
            accept=".png,.jpg,.jpeg"
            multiple
            onChange={handleImageUpload}
            className="block w-full text-sm text-gray-300
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-gray-800 file:text-white
              hover:file:bg-gray-700
              cursor-pointer"
          />
        </div>
      </DragDropContext>
    </div>
  );
};

export default TierApp;
