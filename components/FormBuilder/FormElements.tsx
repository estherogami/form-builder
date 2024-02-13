import { TextFieldFormElement } from "./fields/Textfield";

export type ElementsType = "TextField";

export type FormElement = {
    type: ElementsType;

    construct: (id:string) => FormElementInstance;

    designerBtnElement: {
        icon: React.ElementType,
        label: string;
    }
    //teniamos el problema de que no podiamos recibir propiedades del designercomponent (archivo textfield)
    designerComponent: React.FC<{
        elementInstance: FormElementInstance; 
    }>;
    formComponent: React.FC;
    propertiesComponent: React.FC<{
        elementInstance: FormElementInstance; 
    }>;
}

export type FormElementInstance = {
    id: string;
    type: ElementsType;
    //para el guardado de atributos extra con keys string y contienen cualquier cosa de valor
    extraAttributes?: Record<string, any>;
}

type FormElementsType ={
    [key in ElementsType]: FormElement;
}

//Renderizar los componentes asociados a un tipo
export const FormElements: FormElementsType = {
    TextField: TextFieldFormElement
}
