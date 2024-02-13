"use client"
import { MdTextFields } from "react-icons/md";
import { ElementsType, FormElement, FormElementInstance } from "../FormElements";
import { Label } from "@radix-ui/react-label";
import { Input } from "../../ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import useDesigner from "@/components/hooks/useDesigner";

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "../../ui/form";
import { Switch } from "@/components/ui/switch";

const type: ElementsType = "TextField";
const extraAttributes = {
    label: "Text field",
    helperText: "Helper text",
    required: false,
    placeHolder: "Value here..."
}

//Validacion schema zod
const propertiesSchema = z.object({
    label: z.string().min(2).max(50),
    helperText: z.string().max(200),
    required: z.boolean().default(false),
    placeHolder: z.string().max(50),
});

export const TextFieldFormElement: FormElement = {
    type,
    construct: (id: string) => ({
        id,
        type,
        extraAttributes,
    }),
    designerBtnElement: {
        icon: MdTextFields,
        label: "Text Field",
    },
    designerComponent: DesignerComponent,
    formComponent: () => <div>Form component</div>,
    propertiesComponent: PropertiesComponent,
}

//Extendemos el tipo FormElementsInstance para que extra attributes reconozca los valores personalizados del text field que definimos en linea 6
type CustomInstance = FormElementInstance & {
    extraAttributes: typeof extraAttributes;
}

//Tipo del form
type propertiesFormSchemaType = z.infer<typeof propertiesSchema>
//Componente que cargara en el sidebar para editar propiedades
function PropertiesComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
    const { updateElement } = useDesigner();
    const element = elementInstance as CustomInstance;
    const { label, helperText, required, placeHolder } = element.extraAttributes;
    const form = useForm<propertiesFormSchemaType>({
        resolver: zodResolver(propertiesSchema),
        mode: "onBlur", //Para no tener que pulsar continuamente el boton guardar y que persistan los cambios
        defaultValues: {
            label,
            helperText,
            required,
            placeHolder
        }
    });

    useEffect(() => {
        form.reset(element.extraAttributes)
    }, [element, form]);

    function applyChanges(values: propertiesFormSchemaType) {
        updateElement(element.id, {
            ...element,
            extraAttributes: {
                ...values
            }
        })
    }


    return (
        <Form {...form}>
            <form
                onBlur={form.handleSubmit(applyChanges)}
                onSubmit={(e) => e.preventDefault()}
                className="space-y-3">
                <FormField
                    control={form.control}
                    name="label"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Label</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    onKeyDown={e => e.key === "Enter" && e.currentTarget.blur()} />
                            </FormControl>
                            <FormDescription>
                                The label of the field. <br />
                                It will be displayed above the field.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )} />

                <FormField
                    control={form.control}
                    name="placeHolder"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>PlaceHolder</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    onKeyDown={e => e.key === "Enter" && e.currentTarget.blur()} />
                            </FormControl>
                            <FormDescription>
                                Placeholder of the field.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )} />

                <FormField
                    control={form.control}
                    name="helperText"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Helper text</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    onKeyDown={e => e.key === "Enter" && e.currentTarget.blur()} />
                            </FormControl>
                            <FormDescription>
                                The helper text of the field. <br />
                                It will be displayed below the field.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )} />

                <FormField
                    control={form.control}
                    name="required"
                    render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                            <FormLabel>Required</FormLabel>
                            <FormDescription>
                                The helper text of the field. <br />
                                It will be displayed below the field.
                            </FormDescription>
                            </div>
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
            </form>
        </Form>
    );
}

//Componente que cargara en el designer
function DesignerComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
    const element = elementInstance as CustomInstance; //instance con campos personalizadaos
    const { label, required, placeHolder, helperText } = element.extraAttributes
    return (
        <div className="flex flex-col gap-2 w-full">
            <Label>
                {label}
                {required && "*"}
            </Label>
            <Input readOnly disabled placeholder={placeHolder} />
            {helperText && <p className="text-muted-foreground text-[0.8rem]">{helperText}</p>}
        </div>
    );
}