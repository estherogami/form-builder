"use client"
import { Form } from "@prisma/client"
import SaveFormBtn from "./SaveFormBtn"
import PublishFormBtn from "./PublishFormBtn"
import PreviewDialogBtn from "./PreviewDialogBtn"
import Designer from "./Designer"
import { DndContext, MouseSensor, useSensors, useSensor, TouchSensor } from "@dnd-kit/core"
import DragOverlayWrapper from "./DragOverlayWrapper"

function FormBuilder({ form }: { form: Form }) {
    const mouseSensor = useSensor(MouseSensor, {
        activationConstraint: {
            distance: 10, //solo activaremos el drag cuando se ha movido 10px porque sino no permite hacer click en delete
        }
    });
    //Ahora para que funcione correctamente en movil
    const touchSensor = useSensor(TouchSensor, {
        activationConstraint: {
            delay: 300,
            tolerance: 5
        }
    });

    const sensors = useSensors(mouseSensor, touchSensor);


    return (
        <DndContext sensors={sensors}>
            <main className="flex flex-col w-full">
                <nav className="flex justify-between border-b-2 p-4 gap-3 items-center">
                    <h2 className="truncate font-medium">
                        <span className="text-muted-foreground mr-2">Form: </span>
                        {form.name}
                    </h2>
                    <div className="flex items-center gap-2">
                        <PreviewDialogBtn />
                        {!form.published ? (
                            <>
                                <SaveFormBtn />
                                <PublishFormBtn />
                            </>) : null}
                    </div>
                </nav>
                <div className="flex w-full flex-grow items-center justify-center relative overflow-y-auto h-[200px] bg-accent bg-[url(/paper.svg)] dark:bg-[url(/paper-dark.svg)]">
                    <Designer />
                </div>
            </main>
            <DragOverlayWrapper />
        </DndContext>
    )
}

export default FormBuilder
