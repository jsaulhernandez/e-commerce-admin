import { useParams } from "next/navigation";
// components
import ApiAlert from "@/components/ApiAlert";
// hooks
import { useOrigin } from "@/hooks/useOrigin";
// types
import { ApiListProps } from "@/data/types";

const ApiList = ({ entityName, entityNameId }: ApiListProps) => {
  const origin = useOrigin();
  const { storeId } = useParams<{ storeId: string }>();

  const baseUrl = `${origin}/api/${storeId}`;

  return (
    <>
      <ApiAlert
        title="GET"
        variant="public"
        description={`${baseUrl}/${entityName}`}
      />
      <ApiAlert
        title="GET"
        variant="public"
        description={`${baseUrl}/${entityName}/{${entityNameId}}`}
      />
      <ApiAlert
        title="POST"
        variant="admin"
        description={`${baseUrl}/${entityName}`}
      />
      <ApiAlert
        title="PATCH"
        variant="admin"
        description={`${baseUrl}/${entityName}/{${entityNameId}}`}
      />
      <ApiAlert
        title="DELETE"
        variant="admin"
        description={`${baseUrl}/${entityName}/{${entityNameId}}`}
      />
    </>
  );
};

export default ApiList;
