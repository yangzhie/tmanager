import { useMemo } from "react";
import { BaseChart } from "./BaseChart";

export type ChartProps = {
    data: number[];
    maxDataPoints: number;
}

export function Chart(props: ChartProps) {
    // Caches the result of a computation until its dependencies change
    // Transform props.data into list of object ({ value: point * 100 })
    const prepData = useMemo(() => {
        const points = props.data.map((point) => ({value: point * 100}));

        // Pad the array with { value: undefined }
        // Array.from({ length: N }) makes an array with N empty slots
        return [...points, ...Array.from({length: props.maxDataPoints - points.length}).map(() => ({value: undefined}))];
    }, [props.data, props.maxDataPoints]);

    return <BaseChart data={prepData} />
}