import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import React, { type SVGProps, useEffect, useState } from "react";
import { Input } from "@/components/ui/input.tsx";
import { PauseIcon } from "lucide-react";

interface StatsCardProps {
    title: string;
    price: number;
    description: string;
    icon?: React.ComponentType<SVGProps<SVGSVGElement>>;
    active?: boolean;
    onClick: () => void;
    onValueChange?: (newValue: number) => void;
}

export function SectionCards({
                                 title,
                                 price,
                                 description,
                                 icon: Icon = PauseIcon,
                                 active = false,
                                 onClick,
                                 onValueChange,
                             }: StatsCardProps) {

    const [isEditingValue, setIsEditingValue] = useState(false);
    const [localValue, setLocalValue] = useState<number>(price);

    useEffect(() => {
        setLocalValue(price);
    }, [price]);

    const handleEditStart = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsEditingValue(true);
    };

    const handleBlur = () => {
        setIsEditingValue(false);

        if (Math.abs(localValue - price) > 0.0001) {
            onValueChange?.(localValue);
        }
    };

    return (
        <Card
            onClick={onClick}
            className={`cursor-pointer group hover:shadow-lg transition-all duration-200 ${
                active ? "border-2 border-primary" : ""
            }`}
        >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    {title}
                </CardTitle>

                <div
                    className="p-2 rounded-lg bg-muted group-hover:bg-primary/10 transition-colors cursor-pointer"
                    onClick={handleEditStart}
                >
                    <Icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
            </CardHeader>

            <CardContent className="pt-0">
                <div
                    className="text-3xl font-bold mb-2 cursor-text"
                    onClick={handleEditStart}
                >
                    {isEditingValue ? (
                        <Input
                            value={localValue}
                            type="number"
                            onChange={(e) =>
                                setLocalValue(Number(e.target.value))
                            }
                            onBlur={handleBlur}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") e.currentTarget.blur();
                            }}
                            autoFocus
                            className="w-28"
                        />
                    ) : (
                        localValue.toLocaleString("en-IE", {
                            style: "currency",
                            currency: "EUR",
                        })
                    )}
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed">
                    {description}
                </p>
            </CardContent>
        </Card>
    );
}