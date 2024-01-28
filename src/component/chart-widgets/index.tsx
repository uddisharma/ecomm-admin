import SimpleLineChart from '@/component/chart-widgets/simple-line-chart';
import CustomizedDotLineChart from '@/component/chart-widgets/customized-dot-line-chart';
import SimpleBarChart from '@/component/chart-widgets/simple-bar-chart';
import MixBarChart from '@/component/chart-widgets/mix-bar-chart';
import CustomShapeBarChart from '@/component/chart-widgets/custom-shape-bar-chart';
import BrushBarChart from '@/component/chart-widgets/brush-bar-chart';
import SimpleAreaChart from '@/component/chart-widgets/simple-area-chart';
import StackedAreaChart from '@/component/chart-widgets/stacked-area-chart';
import SimpleRadarChart from '@/component/chart-widgets/simple-radar-chart';
import RadialBarChart from '@/component/chart-widgets/radial-bar-chart';
import CustomizedMixChart from '@/component/chart-widgets/customized-mix-chart';

export default function ChartWidgets() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 3xl:gap-8">
      <SimpleLineChart />
      <CustomizedDotLineChart />
      <SimpleBarChart />
      <MixBarChart />
      <CustomShapeBarChart />
      <BrushBarChart />
      <SimpleAreaChart />
      <StackedAreaChart />
      <SimpleRadarChart />
      <RadialBarChart />
      <CustomizedMixChart className="lg:col-span-2" />
    </div>
  );
}
