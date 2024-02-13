import { Active, DragOverlay, useDndMonitor } from "@dnd-kit/core"
import { useState } from "react";
import { SidebarBtnElementDragOverlay } from "./sidebar/SidebarBtnElement";
import { ElementsType, FormElements } from "./FormElements";
import useDesigner from "../hooks/useDesigner";

function DragOverlayWrapper() {
    const {elements} = useDesigner();
    const [draggedItem, setDraggedItem] = useState<Active | null>(null);
    useDndMonitor({
        onDragStart: (event) => {
            setDraggedItem(event.active);
        },
        onDragCancel: () => {
            setDraggedItem(null)
        },
        onDragEnd: () => {
            setDraggedItem(null);
        }
    })

    if(!draggedItem) return null;

    let node = <div>No drag overlay</div>
    const isSidebarBtnElement = draggedItem?.data?.current?.isDesignerBtnElement;

    if(isSidebarBtnElement) {
        const type = draggedItem.data?.current?.type as ElementsType; //para que coincida tipo abajo
        node = <SidebarBtnElementDragOverlay formElement={FormElements[type]} />
    }

    const isDesignerElement = draggedItem?.data?.current?.isDesignerElement;
    if(isDesignerElement){
        const elementId = draggedItem.data?.current?.elementId;
        //lo extraemos del contexto para obtener un drag overlay exactamente igual que el que tenemos en el designer (con sus labels y cosas puestas)
        const element = elements.find(el => el.id === elementId);
        if(!element) node = <div>Element not found!</div>;
        else {
            const DesignerElementComponent = FormElements[element.type].designerComponent;
            node = <div className="flex bg-accent border rounded-md h-[120] w-full py-2 px-4 opacity-80 pointer pointer-events-none">
                <DesignerElementComponent elementInstance={element}/>
            </div>
        }
    }

    return <DragOverlay>{node}</DragOverlay>
    
}

export default DragOverlayWrapper
