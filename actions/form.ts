"use server";
import { currentUser } from "@clerk/nextjs";
import prisma from "@/lib/prisma"

class UserNotFountErr extends Error {};

export async function GetFormStats(){
    const user = await currentUser();
    if(!user){
        throw new UserNotFountErr()
    }

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