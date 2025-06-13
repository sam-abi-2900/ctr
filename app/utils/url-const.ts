

export const EVENTS = {
    //to fetch the predefined tasks - done
    FETCH_TASKS: '/tasks/predefined',

    //to create the event - done
    CREATE_EVENT: '/events/create',

    //to fetch un-assigned events
    UNASSIGNED_EVENTS: '/events/unassigned',

    //to delete un-assigned event
    DELETE_EVENT: '/events',

    //to get all the events assigned to an vendor - done
    ASSIGNED_EVENTS: '/events/assigned',

    //to get vendor details and event status
    VENDOR_DETAILS: '/event/detail',

    //to get few event details, on assign event screen - done
    EVENT_DETAILS: '/assign/event-info',

    //to assign the event to vendors - done
    ASSIGN_EVENT: '/event/vendors',

}

export const NOTIFICATION = {
    //to fetch all the pending requests by vendors
    PENDING_NOTIFICATION: '/requests/pending',

    //to approve / reject the requests
    ACTION: '/requests'
}

export const SUMMARY = {
    //to get all vendors work summary
    GET_ALL: '/vendor/admin/summary',

    //to get a specific vendors work summary
    GET_ONE: '/admin/vendor-summary'
}
export const URLs = {
    BASE_URL: 'http://localhost:3000',
    API_ADMIN_BASE_URL: 'http://localhost:3000/api'
}