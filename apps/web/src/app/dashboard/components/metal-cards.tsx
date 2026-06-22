import { SectionCards } from './section-cards';
import type { MetalType } from '../../../lib/types.ts';

type Props = {
    metals: readonly MetalType[];
    prices: any[];
    selectedMetal: MetalType | null;
    productsDescription: string;
    onSelectMetal: (metal: MetalType) => void;
    onSpotOverrideChange: (
        metal: MetalType,
        value: number
    ) => void;
};

export function MetalCards({
                               metals,
                               prices,
                               selectedMetal,
                               productsDescription,
                               onSelectMetal,
                               onSpotOverrideChange,
                           }: Props) {
    return (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {metals.map(metal => (
                <SectionCards
                    key={metal}
                    title={metal}
                    price={
                        prices.find(
                            p => p.metalType === metal,
                        )?.currentPrice ?? 0
                    }
                    description={productsDescription}
                    active={selectedMetal === metal}
                    onClick={() => onSelectMetal(metal)}
                    onValueChange={value =>
                        onSpotOverrideChange(
                            metal,
                            value,
                        )
                    }
                />
            ))}
        </div>
    );
}