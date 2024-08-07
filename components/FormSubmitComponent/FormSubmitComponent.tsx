"use client";

import { HiCursorClick } from "react-icons/hi";
import { FormElementInstance, FormElements } from "../FormBuilder/FormElements";
import { Button } from "../ui/button";
import { useCallback, useRef, useState, useTransition } from "react";
import { toast } from "../ui/use-toast";
import { ImSpinner2 } from "react-icons/im";
import { SubmitForm } from "@/actions/form";

function FormSubmitComponent({ formUrl, content }: { content: FormElementInstance[], formUrl: string }) {
    const formValues = useRef<{ [key: string]: string }>({}); //objeto con key tipo string and value string
    const formErrors = useRef<{ [key: string]: boolean }>({});
    const [renderKey, setRenderKey] = useState(new Date().getTime());

    const [submitted, setSubmitted] = useState(false);

    const [pending, startTransition] = useTransition();

    const validateForm: () => boolean = useCallback(() => {
        for (const field of content) {  //Por cada campo de contenido
            const actualValue = formValues.current[field.id] || "";
            const valid = FormElements[field.type].validate(field, actualValue);

            if (!valid) {
                formErrors.current[field.id] = true;
            }
        }

        if (Object.keys(formErrors.current).length > 0)
            return false
        else return true;

    }, [content]);




    const submitValue = useCallback((key: string, value: string) => { //no hace falta el usecallback
        formValues.current[key] = value;
    }, []);

    const submitForm = async () => {
        formErrors.current = {};
        const validForm = validateForm();

        if (!validForm) {
            setRenderKey(new Date().getTime());
            toast({
                title: "Error",
                description: "Please check the form for errors",
                variant: "destructive"
            })
            return;
        }
        try {
            const jsonContent = JSON.stringify(formValues.current);
            await SubmitForm(formUrl, jsonContent);
            setSubmitted(true)
        } catch (error) {
            toast({
                title: "Error",
                description: "Something went wrong",
                variant: "destructive"
            })
        }
        console.log("Form values", formValues.current);
    };

    //ui para submitted
    if(submitted){
        return (
            <div className="flex justify-center w-full items-center p-8">
                <div className="max-w-[620px] flex flex-col gap-4 flex-grow bg-background  w-full p-8 overflow-y-auto border shadow-xl shadow-blu-700 rounded">
                    <h1 className="text-2xl font-bold">Form Submitted</h1>
                    <p className="text-muted-foreground">Thank you for submitting the form, you can close this page now.</p>
                </div>
            </div>
        )
    }


    return (
        <div className="flex justify-center w-full h-full items-center p-8">
            <div key={renderKey} className="max-w-[620px] flex flex-col gap-4 flex-grow bg-background  w-full p-8 overflow-y-auto border shadow-xl shadow-blu-700 rounded">
                {
                    content.map(element => {
                        const FormElement = FormElements[element.type].formComponent;
                        return <FormElement
                            key={element.id}
                            elementInstance={element}
                            submitValue={submitValue}
                            isInvalid={formErrors.current[element.id]}
                            defaultValue={formValues.current[element.id]} />;
                    })
                }
                <Button
                    className="mt-8"
                    onClick={() => startTransition(submitForm)}
                    disabled={pending}>
                    {!pending ? <>
                        <HiCursorClick className="mr-2" /> Submit
                    </> : <ImSpinner2 className="animate-spin" />}
                </Button>
            </div>
        </div>
    )
}

export default FormSubmitComponent
