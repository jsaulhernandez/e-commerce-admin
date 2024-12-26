// components
import SizeForm from "./_components/size-form";
// interfaces
import { ISize, ISizePlainText } from "@/data/interfaces/size.interface";
// types
import { SizePageProps } from "@/data/types";
// utils
import { documentReference, getDataFirebase } from "@/lib/firebase-functions";
import { map } from "@/lib/utils";

const SizePage = async ({ params }: SizePageProps) => {
  const { storeId, sizeId } = await params;

  const size = (
    await getDataFirebase<ISize>(
      documentReference("stores", storeId, "sizes", sizeId)
    )
  ).data();

  let initialData: ISizePlainText | undefined = undefined;

  if (size) {
    initialData = map<ISize, ISizePlainText>(size, ["id", "name", "value"]);
  }

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizeForm initialData={initialData} />
      </div>
    </div>
  );
};
export default SizePage;
