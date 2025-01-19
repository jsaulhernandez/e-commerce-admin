// components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// types
import { CardItemProps } from "@/data/types";

const CardItem = ({ title, value, icon }: CardItemProps) => {
  return (
    <Card className="col-span-1">
      <CardHeader className="flex items-center justify-between flex-row">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
};

export default CardItem;
