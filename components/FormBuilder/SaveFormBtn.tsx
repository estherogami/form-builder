import useDesigner from "../hooks/useDesigner";
import { Button } from "../ui/button";
import { HiSaveAs } from "react-icons/hi";

function SaveFormBtn() {
  const {elements} = useDesigner(); //2:43:35
  return (
    <Button variant={"outline"} className="gap-2">
      <HiSaveAs className="h-4 w-4" />
      Save
    </Button>
  )
}

export default SaveFormBtn
