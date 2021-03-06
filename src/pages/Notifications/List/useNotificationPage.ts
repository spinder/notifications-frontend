import { arrayValue, Filter, Operator, Page, Sort } from '@redhat-cloud-services/insights-common-typescript';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { NotificationFilterColumn, NotificationFilters } from '../../../components/Notifications/Filter';
import { Facet } from '../../../types/Notification';

export interface UseNotificationPageReturn {
    page: Page;
    changePage: (page: number) => void;
    changeItemsPerPage: (perPage: number) =>  void;
}

export const useNotificationPage = (
    filters: NotificationFilters,
    bundle: Facet,
    appFilterOptions: Array<Facet>,
    defaultPerPage: number,
    sort?: Sort): UseNotificationPageReturn => {
    const [ currentPage, setCurrentPage ] = useState<number>(1);
    const [ itemsPerPage, setItemsPerPage ] = useState<number>(defaultPerPage);

    useEffect(() => setCurrentPage(1), [ setCurrentPage, filters ]);

    const page = useMemo(() => {
        const filter = new Filter();

        const appFilter = filters[NotificationFilterColumn.APPLICATION];

        if (appFilter) {
            const appIds: Array<string> = [];
            for (const appName of arrayValue(appFilter)) {
                const filterOption = appFilterOptions.find(a => a.displayName === appName);
                if (filterOption) {
                    appIds.push(filterOption.id);
                }
            }

            filter.and('applicationId', Operator.EQUAL, appIds);
        }

        filter.and('bundleId', Operator.EQUAL, bundle.id);

        return Page.of(currentPage, itemsPerPage, filter, sort);
    }, [ currentPage, itemsPerPage, sort, filters, appFilterOptions, bundle ]);

    const changePage = useCallback((page: number) => setCurrentPage(page), [ setCurrentPage ]);
    const changeItemsPerPage = useCallback((perPage: number) => {
        setCurrentPage(1);
        setItemsPerPage(perPage);
    }, [ setCurrentPage ]);

    return {
        page,
        changePage,
        changeItemsPerPage
    };
};
