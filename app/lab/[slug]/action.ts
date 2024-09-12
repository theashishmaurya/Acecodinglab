'use server'

import { readFromFolder } from "@/lib/readFromFolder";


export async function getHelloWorld() {
    return await readFromFolder(`${"hello-world"}`);
}
