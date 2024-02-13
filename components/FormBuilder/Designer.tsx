"use client"
import { cn } from "@/lib/utils";
import DesignerSideBar from "./sidebar/DesignerSideBar";
import { DragEndEvent, useDndMonitor, useDraggable, useDroppable } from "@dnd-kit/core";
import useDesigner from "../hooks/useDesigner";
import { ElementsType, FormElementInstance, FormElements } from "./FormElements";
import { idGenerator } from "@/lib/idGenerator";
import { useState } from "react";
import { Button } from "../ui/button";
import { BiSolidTrash } from "react-icons/bi";


function Designer() {
  const { elements, addElement, selectedElement, setSelectedElement, removeElement } = useDesigner();
  const droppable = useDroppable({
    id: "designer-drop-area",
    data: {
      isDesignerDropArea: true
    }
  })

  useDndMonitor({
    onDragEnd: (event: DragEndEvent) => {
      //console.log("Drag end", event)
      const { active, over } = event;
      if (!active || !over) return;

      const isDesignerBtnElement = active.data?.current?.isDesignerBtnElement;
      const isDroppingOverDesignerDropArea = over.data?.current?.isDesignerDropArea;

      //1st scenario
      const droppingSidebarBtnOverDesignerDropArea = isDesignerBtnElement && isDroppingOverDesignerDropArea;
      if (droppingSidebarBtnOverDesignerDropArea) {
        const type = active.data?.current?.type;
        const newElement = FormElements[type as ElementsType].construct(idGenerator());
        //console.log("New Element", newElement);
        addElement(elements.length, newElement);
        return;
      }

      //2nd scenario
      const isDroppingOverDesignerElementTopHalf = over.data?.current?.isTopHalfDesignerElement;
      const isDroppingOverDesignerElementBottomHalf = over.data?.current?.isBottomHalfDesignerElement;
      const isDroppingOverDesignerElement = isDroppingOverDesignerElementTopHalf || isDroppingOverDesignerElementBottomHalf
      const droppingSidebarBtnOverDesignerElement = isDesignerBtnElement && isDroppingOverDesignerElement;

      if(droppingSidebarBtnOverDesignerElement){
        const type = active.data?.current?.type;
        const newElement = FormElements[type as ElementsType].construct(idGenerator());

        const overId = over.data?.current?.elementId;

        const overElementIndex = elements.findIndex( el => el.id === overId);
        if(overElementIndex === -1) throw new Error("Element not found");

        let indexFormNewElement = overElementIndex; //I assume im on top half
        if(isDroppingOverDesignerElementBottomHalf){
          indexFormNewElement = overElementIndex + 1
        }
        addElement(indexFormNewElement, newElement);
        return;
      }


      //3rd scenario
      const isDraggingDesignerElement = active.data?.current?.isDesignerElement;
      const draggingDesignerElementOverAnotherDesignerElement = isDraggingDesignerElement && isDroppingOverDesignerElement;
      if(draggingDesignerElementOverAnotherDesignerElement) {
        const activeId = active.data?.current?.elementId;
        const overId = over.data?.current?.elementId;

        const activeElementIndex = elements.findIndex(el => el.id === activeId);
        const overElementIndex = elements.findIndex(el => el.id === overId);

        if(activeElementIndex === -1 || overElementIndex === -1) throw new Error ("Element not found");

        const activeElement = {...elements[activeElementIndex]};
        removeElement(activeId);

        let indexFormNewElement = overElementIndex; //I assume im on top half
        if(isDroppingOverDesignerElementBottomHalf){
          indexFormNewElement = overElementIndex + 1
        }
        addElement(indexFormNewElement, activeElement);
      }
    }
  });

  return (
    <div className="flex w-full h-full">
      <div className="p-4 w-full" onClick={() => selectedElement && setSelectedElement(null)}>
        <div
          ref={droppable.setNodeRef}
          className={cn("bg-background max-w-[920px] h-full m-auto rounded-xl flex flex-col flex-grow items-center justify-start flex-1 overflow-y-auto",
            droppable.isOver && "ring-2 ring-primary/20")}>

          {!droppable.isOver && elements.length !== 0 && (
            <p className="text-3xl text-muted-foreground flex flew-grow items-center font-bold">
              Drop here
            </p>
          )}
          {droppable.isOver && elements.length === 0 && <div className="p-4 w-full">
            <div className="h-[120px] rounded-md bg-primary/20"></div></div>
          }

          {elements.length > 0 && (
            <div className="flex flex-col w-full gap-2 p-4">
              {elements.map(element => (
                <DesignerElementWrapper key={element.id} element={element} />
              ))}
            </div>
          )}
        </div>
      </div>
      <DesignerSideBar />
    </div>
  )
}



function DesignerElementWrapper({ element }: { element: FormElementInstance }) {
  
  const [mouseIsOver, setMouseIsOver] = useState<boolean>(false);
  const DesignerElement = FormElements[element.type].designerComponent;
  const { removeElement, selectedElement, setSelectedElement } = useDesigner();

  //Para que aparezca el borde superior o inferior e inserte arriba o abajo segun posicion del div que hacemos el drop
  const topHalf = useDroppable({
    id: element.id + "-top",
    data: {
      type: element.type,
      elementId: element.id,
      isTopHalfDesignerElement: true
    }
  });

  const bottomHalf = useDroppable({
    id: element.id + "-bottom",
    data: {
      type: element.type,
      elementId: element.id,
      isBottomHalfDesignerElement: true
    }
  });

  const draggable = useDraggable({
    id: element.id + "-drag-handler",
    data: {
      type: element.type,
      elementId: element.id,
      isDesignerElement: true
    }
  });

  //Para que no muestre el objeto en el designer mientras se arrastra
  if(draggable.isDragging) return null;

  //console.log("Selected El", selectedElement)
  return (
    <div
      ref={draggable.setNodeRef}
      {...draggable.listeners}
      {...draggable.attributes}
      className="relative h-[120px] flex flex-col text-foreground hover:cursor-pointer rounded-md ring-1 ring-accent ring-inset"
      onMouseEnter={() => setMouseIsOver(true)}
      onMouseLeave={() => setMouseIsOver(false)}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedElement(element)}}>
      <div
        ref={topHalf.setNodeRef}
        className="absolute w-full h-1/2 rounded-t-md"
      ></div>
      <div
        ref={bottomHalf.setNodeRef}
        className="absolute w-full h-1/2 bottom-0 rounded-b-md"></div>

      {mouseIsOver && (
        <>
          <div className="absolute right-0 h-full">
            <Button
              className="flex justify-center h-full border rounded-md rounded-l-none bg-red-400 hover:bg-red-500 "
              variant={"outline"}
              onClick={(e) => {
                e.stopPropagation();
                removeElement(element.id);
              }}>
              <BiSolidTrash className="h-6 w-6" />
            </Button>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse">
            <p className="text-muted-foreground text-sm">Click for properties or drag to move </p>
          </div>
        </>
      )}
      {
        //El borde de donde vamos a arrastrar
        topHalf.isOver && <div className="absolute top-0 w-full rounded-md rounded-b-none h-[7px] bg-primary rounded-b-none"></div>
      }
      <div className={cn("flex w-full h-[120px] items-center rounded-md bg-accent/40 px-4 py-2 pointer-events-none opacity-100",
        mouseIsOver && "opacity-30")}>
        <DesignerElement elementInstance={element} />
      </div>
      {
        //El borde de donde vamos a arrastrar
        bottomHalf.isOver && <div className="absolute bottom-0 w-full rounded-md rounded-t-none h-[7px] bg-primary rounded-b-none"></div>
      }
    </div>
  );
}

export default Designer
