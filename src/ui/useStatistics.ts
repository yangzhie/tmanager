import { useEffect, useState } from "react";

export function useStatistics(dataPointCount: number): Statistics[] {
    // Stores incoming stats
    const [value, setValue] = useState<Statistics[]>([]);

    useEffect(() => {
        const unsubscribe = window.electron.subStatistics((stats) => 
            // State updates are asynchronous, functional updater form is used
            // prev is guaranteed to be the latest value of value
            setValue(prev => {
                // All previous values + new stats into array
                const newData = [...prev, stats];

                // Remove first element of array if length exceeds
                if(newData.length > dataPointCount) {
                    newData.shift();
                }

                return newData;
            })
        );

        return unsubscribe; // Cleanup
    }, []);

    return value; // Returns data point array
}