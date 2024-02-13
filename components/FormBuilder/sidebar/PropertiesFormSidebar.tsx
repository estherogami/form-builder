import useDesigner from "@/components/hooks/useDesigner"
import { FormElements } from "../FormElements"
import { Button } from "@/components/ui/button";
import { AiOutlineClose } from "react-icons/ai";
import { Separator } from "@radix-ui/react-separator";

function FormElementsSidebar() {
  const { selectedElement, setSelectedElement } = useDesigner();
  if (!selectedElement) return null;

  //Esto viene del constructor. Tenemos un componente de properties, vamos a leerlas
  const PropertiesForm = FormElements[selectedElement?.type].propertiesComponent;

  return (
    <div className="flex flex-col p-2">
      <div className="flex justify-between items-center">
        <p className="text-sm text-foreground/70"> Element properties</p>
        <Button size={"icon"} variant={"ghost"} onClick={() => setSelectedElement(null)}>
          <AiOutlineClose />
        </Button>
      </div>
      <Separator className="mb-4" />
      <PropertiesForm elementInstance={selectedElement} />
    </div>
  );
}

export default FormElementsSidebar
