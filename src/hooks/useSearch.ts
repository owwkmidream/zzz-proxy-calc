import { useState, useEffect } from 'react';
import type { RawDataItem } from '../types';
import { rawData } from '../constants';

export const useSearch = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredData, setFilteredData] = useState<RawDataItem[]>(rawData);

    useEffect(() => {
        const query = searchQuery.toLowerCase().trim();
        if (!query) {
            setFilteredData(rawData);
            return;
        }
        const results = rawData.filter(item =>
            item.name.toLowerCase().includes(query) ||
            item.py.includes(query) ||
            item.abbr.includes(query)
        );
        setFilteredData(results);
    }, [searchQuery]);

    return {
        searchQuery,
        setSearchQuery,
        filteredData,
    };
};
