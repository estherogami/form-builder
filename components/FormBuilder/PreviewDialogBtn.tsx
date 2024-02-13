import { Button } from "../ui/button";
import { MdPreview } from "react-icons/md";

function PreviewDialogBtn() {
  //2:38:29*
  return (
    <Button variant={"outline"} className="gap-2">
      <MdPreview className="h-6 w-6"/>
      Preview
    </Button>)
}

export default PreviewDialogBtn
