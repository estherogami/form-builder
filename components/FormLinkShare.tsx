"use client"

import { useEffect, useState } from "react";
import { Button } from "./ui/button"
import { Input } from "./ui/input";
import { ImShare } from "react-icons/im";
import { toast } from "./ui/use-toast";

function FormLinkShare({ shareUrl }: { shareUrl: string }) {

  //no podemos acceder al obj window porque el padre es server component asi que solo cargaremos el boton despues de hydrathion
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, [])
  if (!mounted) return null //Avoid window not defined error

  const shareLink = `${window.location.origin}/submit/${shareUrl}`;

  return <div className="flex flex-grow gap-4 items-center">
    <Input value={shareLink} readOnly />
    <Button className="w-[230px]" onClick={()=> {
        navigator.clipboard.writeText(shareLink);
        toast({
            title: "Copied!",
            description: "Link copied to clipboard",
        })}}>
        <ImShare className="mr-2 h-4 w-4" />
        Share Link
    </Button>
  </div>
}

export default FormLinkShare
