import Elysia from 'elysia';
export declare const registerRestaurant: Elysia<"", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: import("@sinclair/typebox").TModule<{}>;
    error: {};
}, {
    schema: {};
    macro: {};
    macroFn: {};
    parser: {};
}, {
    restaurants: {
        post: {
            body: {
                email: string;
                phone: string;
                restaurantName: string;
                managerName: string;
            };
            params: {};
            query: unknown;
            headers: unknown;
            response: {
                200: void;
                422: {
                    type: "validation";
                    on: string;
                    summary?: string;
                    message?: string;
                    found?: unknown;
                    property?: string;
                    expected?: string;
                };
            };
        };
    };
}, {
    derive: {};
    resolve: {};
    schema: {};
}, {
    derive: {};
    resolve: {};
    schema: {};
}>;
