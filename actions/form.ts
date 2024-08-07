"use server";
import { currentUser } from "@clerk/nextjs";
import prisma from "@/lib/prisma"
import { formSchema, formSchemaType } from "@/schemas/form";

class UserNotFountErr extends Error {};

export async function GetFormStats(){
    const user = await currentUser();
    if(!user) throw new UserNotFountErr();
    

    const stats = await prisma.form.aggregate({
        where: {
            userId: user.id
        },
        _sum: {
            visits: true,
            submisions: true
        }
    })

    const visits = stats._sum.visits || 0;
    const submissions = stats._sum.submisions || 0

    let submissionRate = 0;
    if(visits > 0){
        submissionRate = (submissions / visits) * 100
    }

    const bounceRate = 100 - submissionRate;

    return {
        visits, submissions, submissionRate, bounceRate
    }
}


export async function CreateForm(data: formSchemaType) {
    const validation = formSchema.safeParse(data);
    if(!validation.success){
        throw new Error ("Form not valid");
    }
    
    const user = await currentUser();
    if (!user) throw new UserNotFountErr();
    

    const {name, description} = data
    const form = await prisma.form.create({
        data: {
            userId: user.id,
            name,
            description
        }
    })
    if(!form) throw new Error("something went wrong")
    
    return form.id
}

export async function GetForms() {
    const user = await currentUser();
    if (!user) throw new UserNotFountErr();

    return await prisma.form.findMany({
        where: {
            userId: user.id
        },
        orderBy: {
            createdAt: "desc"
        }
    })
}

export async function GetFormById(id: number){
    const user = await currentUser();
    if (!user) throw new UserNotFountErr();

    return await prisma.form.findUnique({
        where: {
            userId: user.id,
            id
        }
    })
}

export async function UpdateFormContent (id: number, jsonContent: string){
    const user = await currentUser();
    if (!user) throw new UserNotFountErr();

    return await prisma.form.update({
        where: {
            userId: user.id,
            id,
        },
        data: {
            content: jsonContent
        }
    })
}

export async function PublishForm(id: number) {
    const user = await currentUser();
    if (!user) throw new UserNotFountErr();

    return await prisma.form.update({
        data: {
            published: true
        },
        where: {
            userId: user.id,
            id
        }
    })
}

export async function GetFormContentByUrl(formUrl: string){
    //update porque vamos a actualizar las visitas
    return await prisma.form.update({
        select: {
            content: true,
        },
        data: {
            visits: {
                increment: 1
            }
        },
        where: {
            shareURL: formUrl
        }
    })
}


export async function SubmitForm(formUrl: string, content: string){
    //Necesitamos update para actualizar el submissions count
    return await prisma.form.update({
        data: {
            submisions: {
                increment: 1
            },
            //Creamos nuevo
            FormSubmissions: {
                create: {
                    content
                }
            }
        },
        where: {
            shareURL: formUrl,
            published: true
        }
    })
}