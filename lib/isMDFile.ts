


export const isMDFile = (path:string)=>{
    return path.split(".").slice(-1)[0] === "md"  || path.split(".").slice(-1)[0] === "mdx"

}