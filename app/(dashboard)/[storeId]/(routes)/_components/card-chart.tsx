// components
import Overview from "@/components/overview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// types
import { CardChartProps } from "@/data/types";

const CardChart = ({ title, data, icon, className }: CardChartProps) => {
  return (
    <Card className={className}>
      <CardHeader className="flex items-center justify-between flex-row">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && icon}
      </CardHeader>
      <CardContent>
        <Overview data={data} />
      </CardContent>
    </Card>
  );
};

export default CardChart;
