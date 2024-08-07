"use client"

import { useEffect, useState } from "react";
import { Button } from "./ui/button"

function VisitBtn({ shareUrl }: { shareUrl: string }) {

  //no podemos acceder al obj window porque el padre es server component asi que solo cargaremos el boton despues de hydrathion
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, [])
  if (!mounted) return null //Avoid window not defined error

  const shareLink = `${window.location.origin}/submit/${shareUrl}`;

  return <Button
    className="w-[200px]"
    onClick={() => {
      window.open(shareLink, "_blank"); //open in new tab
    }}>Visit</Button>
}

export default VisitBtn
