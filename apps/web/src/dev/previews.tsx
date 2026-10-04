import {ComponentPreview, Previews} from "@react-buddy/ide-toolbox";
import {PaletteTree} from "./palette";
import {DotPattern} from "@/components/dot-pattern.tsx";
import {ChartAreaInteractive} from "@/app/dashboard/components/chart-area-interactive.tsx";
import {PricingPlans} from "@/components/pricing-plans.tsx";
import {TradeTab} from "@/app/dashboard/components/pricing-tools/trade-tab.tsx";

const ComponentPreviews = () => {
    return (
        <Previews palette={<PaletteTree/>}>
            <ComponentPreview path="/DotPattern">
                <DotPattern/>
            </ComponentPreview>
            <ComponentPreview path="/ChartAreaInteractive">
                <ChartAreaInteractive data={[]} selectedMetal={null}/>
            </ComponentPreview>
            <ComponentPreview path="/PricingPlans">
                <PricingPlans/>
            </ComponentPreview>
            <ComponentPreview path="/TradeTab">
                <TradeTab/>
            </ComponentPreview>
        </Previews>
    );
};

export default ComponentPreviews;